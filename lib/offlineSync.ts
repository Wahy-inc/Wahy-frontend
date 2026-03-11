import * as openApi from "@/lib/openApi";
import { getApi } from "@/lib/apiClient";

type PendingSyncItem = openApi.SyncItemRequest & {
  created_at: string;
  attempts: number;
  last_error?: string;
};

export type SyncIssue = {
  idempotency_key: string;
  entity_type: string;
  entity_id?: number | null;
  status: openApi.SyncStatus;
  message: string;
  conflict?: Record<string, unknown> | null;
  updated_at: string;
};

const STORAGE_KEY = "wahy:offline:sync-queue:v1";
const ISSUES_KEY = "wahy:offline:sync-issues:v1";

const api = getApi();

type SyncQueueResult = {
  sync_id?: number;
  idempotency_key: string;
  status: openApi.SyncStatus;
  entity_id?: number | null;
  error_message?: string | null;
  conflict?: Record<string, unknown> | null;
};

function extractSyncResults(error: unknown): SyncQueueResult[] | null {
  if (!error || typeof error !== "object") {
    return null;
  }
  const status = (error as { status?: number }).status;
  const payload = (error as { error?: { results?: SyncQueueResult[] } }).error;
  if (status === 409 && payload && Array.isArray(payload.results)) {
    return payload.results;
  }
  return null;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readQueue(): PendingSyncItem[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as PendingSyncItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function writeQueue(items: PendingSyncItem[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown network error";
}

function readIssues(): SyncIssue[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(ISSUES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SyncIssue[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function writeIssues(issues: SyncIssue[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
}

function upsertIssues(incoming: SyncIssue[]): void {
  if (incoming.length === 0) {
    return;
  }

  const existing = readIssues();
  const byKey = new Map(existing.map((item) => [item.idempotency_key, item]));

  for (const issue of incoming) {
    byKey.set(issue.idempotency_key, issue);
  }

  writeIssues(Array.from(byKey.values()));
}

function removeIssuesByKeys(keys: string[]): void {
  if (keys.length === 0) {
    return;
  }

  const keySet = new Set(keys);
  const existing = readIssues();
  writeIssues(existing.filter((item) => !keySet.has(item.idempotency_key)));
}

export function isClientOnline(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }
  return navigator.onLine;
}

export function shouldQueueMutation(error: unknown): boolean {
  if (!isClientOnline()) {
    return true;
  }

  if (error instanceof TypeError) {
    return true;
  }

  const message = errorMessage(error).toLowerCase();
  return message.includes("network") || message.includes("fetch");
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function enqueueOfflineMutation(item: openApi.SyncItemRequest): void {
  const queue = readQueue();

  queue.push({
    ...item,
    created_at: new Date().toISOString(),
    attempts: 0,
  });

  writeQueue(queue);
}

export function getOfflineQueueSize(): number {
  return readQueue().length;
}

export function getSyncIssues(): SyncIssue[] {
  return readIssues();
}

export function clearSyncIssues(): void {
  writeIssues([]);
}

export async function flushOfflineMutations(): Promise<void> {
  if (!isBrowser() || !isClientOnline()) {
    return;
  }

  const queue = readQueue();
  if (queue.length === 0) {
    return;
  }

  let results: SyncQueueResult[] | null = null;
  try {
    const response = await api.api.queueApiV1SyncQueuePost({
      items: queue.map((item) => ({
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        operation: item.operation,
        payload: item.payload,
        idempotency_key: item.idempotency_key,
      })),
    }, { secure: true });
    if (response.status === 200) {
      results = response.data.results;
    }
  } catch (error) {
    results = extractSyncResults(error);
    if (!results) {
      return;
    }
  }

  if (!results) {
    return;
  }

  try {
    const resultByKey = new Map(
      results.map((result) => [result.idempotency_key, result]),
    );

    const remaining: PendingSyncItem[] = [];
    const ackIds: number[] = [];
    const resolvedKeys: string[] = [];
    const issues: SyncIssue[] = [];

    for (const item of queue) {
      const result = resultByKey.get(item.idempotency_key);

      if (!result) {
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
          last_error: "Missing sync response for queued item",
        });
        continue;
      }

      if (result.status === "applied") {
        resolvedKeys.push(item.idempotency_key);
        if (typeof result.sync_id === "number") {
          ackIds.push(result.sync_id);
        }
        continue;
      }

      issues.push({
        idempotency_key: item.idempotency_key,
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        status: result.status,
        message: result.error_message ?? "Sync conflict or error",
        conflict: (result.conflict ?? null) as Record<string, unknown> | null,
        updated_at: new Date().toISOString(),
      });

      remaining.push({
        ...item,
        attempts: item.attempts + 1,
        last_error: result.error_message ?? "Sync conflict or error",
      });
    }

    writeQueue(remaining);
    removeIssuesByKeys(resolvedKeys);
    upsertIssues(issues);

    if (ackIds.length > 0) {
      await api.api.ackApiV1SyncAckPost({ ids: ackIds }, { secure: true });
    }
  } catch {
    return;
  }
}
