import * as openApi from "@/lib/openApi";

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

const api = new openApi.Api({
  baseUrl: "",
});

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

  try {
    const response = await api.api.queueApiV1SyncQueuePost({
      items: queue.map((item) => ({
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        operation: item.operation,
        payload: item.payload,
        idempotency_key: item.idempotency_key,
      })),
    });

    if (response.status !== 200) {
      return;
    }

    const resultByKey = new Map(
      response.data.results.map((result) => [result.idempotency_key, result]),
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
        if (typeof result.entity_id === "number") {
          ackIds.push(result.entity_id);
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
      await api.api.ackApiV1SyncAckPost({ ids: ackIds });
    }
  } catch {
    return;
  }
}
