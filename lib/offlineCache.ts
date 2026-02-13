type CacheEnvelope<T> = {
  updatedAt: string;
  data: T;
};

export const offlineCacheKeys = {
  studentProfileMe: "wahy:cache:students:me:v1",
  studentsList: "wahy:cache:students:list:v1",
  schedulesListAdmin: "wahy:cache:schedules:list:admin:v1",
  schedulesListMe: "wahy:cache:schedules:list:me:v1",
  lessonsListAdmin: "wahy:cache:lessons:list:admin:v1",
  lessonsListMe: "wahy:cache:lessons:list:me:v1",
  invoicesListAdmin: "wahy:cache:invoices:list:admin:v1",
  invoicesListMe: "wahy:cache:invoices:list:me:v1",
  libraryListAdmin: "wahy:cache:library:list:admin:v1",
  libraryListMe: "wahy:cache:library:list:me:v1",
  lessonsListByStudent: (studentId: number) =>
    `wahy:cache:lessons:list:student:${studentId}:v1`,
} as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function setCachedData<T>(key: string, data: T): void {
  if (!canUseStorage()) {
    return;
  }

  const envelope: CacheEnvelope<T> = {
    updatedAt: new Date().toISOString(),
    data,
  };

  window.localStorage.setItem(key, JSON.stringify(envelope));
}

export function getCachedData<T>(key: string): T | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (!parsed || typeof parsed !== "object" || !("data" in parsed)) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}
