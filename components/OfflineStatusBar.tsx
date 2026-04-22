"use client";

import { useEffect, useState } from "react";
import { clearSyncIssues, getOfflineQueueSize, getSyncIssues, isClientOnline, type SyncIssue } from "@/lib/offlineSync";
import { useLocalization } from "@/lib/localization-context";

export function OfflineStatusBar() {
  const { t } = useLocalization();
  const [online, setOnline] = useState(true);
  const [queueSize, setQueueSize] = useState(0);
  const [issuesCount, setIssuesCount] = useState(0);
  const [issues, setIssues] = useState<SyncIssue[]>([]);

  useEffect(() => {
    const refresh = () => {
      setOnline(isClientOnline());
      setQueueSize(getOfflineQueueSize());
      const fetchedIssues = getSyncIssues();
      setIssuesCount(fetchedIssues.length);
      setIssues(fetchedIssues);
    };

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    const interval = window.setInterval(refresh, 3000);

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.clearInterval(interval);
    };
  }, []);

  if (online && queueSize === 0 && issuesCount === 0) {
    return null;
  }

  const statusText = issuesCount > 0
    ? t('sync_status.sync_needs_attention').replace('{count}', issuesCount.toString()).replace('{s}', issuesCount === 1 ? "" : "s")
    : !online
      ? t('sync_status.offline_mode_queued').replace('{count}', queueSize.toString()).replace('{s}', queueSize === 1 ? "" : "s")
      : t('sync_status.back_online_syncing').replace('{count}', queueSize.toString()).replace('{s}', queueSize === 1 ? "" : "s");

  const statusClasses = issuesCount > 0
    ? "bg-red-100 text-red-800 border border-red-200"
    : online
      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
      : "bg-amber-100 text-amber-800 border border-amber-200";

  return (
    <div className={`w-full rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-between gap-3 ${statusClasses}`}>
      <div className="flex-1 flex flex-col gap-2">
        <span>{statusText}</span>
        {issuesCount > 0 ? (
          <details className="rounded-md border border-red-200 bg-red-50/60 px-2 py-1">
            <summary className="cursor-pointer text-xs font-semibold text-red-700">
              {t('sync_status.view_sync_details')}
            </summary>
            <div className="mt-2 space-y-2">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.idempotency_key} className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-800">
                  <div className="font-semibold">
                    {issue.entity_type}
                    {typeof issue.entity_id === "number" ? ` #${issue.entity_id}` : ""} - {issue.status}
                  </div>
                  <div>{issue.message}</div>
                </div>
              ))}
              {issues.length > 5 ? (
                <div className="text-xs text-red-700">{t('sync_status.showing_issues').replace('{count}', '5').replace('{total}', issues.length.toString())}</div>
              ) : null}
            </div>
          </details>
        ) : null}
      </div>
      {issuesCount > 0 ? (
        <button
          type="button"
          className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
          onClick={() => {
            clearSyncIssues();
            setIssuesCount(0);
            setIssues([]);
          }}
        >
          {t('sync_status.clear_button')}
        </button>
      ) : null}
    </div>
  );
}
