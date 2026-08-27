"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  HardDrive,
  Loader2,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

type Tab =
  | "overview"
  | "activity"
  | "backup"
  | "maintenance";

type ActivityLog = {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
  user_id?: string | null;
  company_id?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  ip_address?: string | null;
};

type BackupRecord = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  size?: string | null;
};

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [logs, setLogs] =
    useState<ActivityLog[]>([]);

  const [backups, setBackups] =
    useState<BackupRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [maintenanceMode, setMaintenanceMode] =
    useState(false);

  const [backupLoading, setBackupLoading] =
    useState(false);

  useEffect(() => {
    loadSystem();
  }, []);

  async function loadSystem() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        loadActivityLogs(),
        loadBackups(),
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load system information."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadActivityLogs() {
    try {
      const response = await fetch(
        "/api/settings/system/activity-logs",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      let result: any = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Activity Logs API returned an invalid response."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to load activity logs."
        );
      }

      setLogs(result.data || []);
    } catch (error) {
      console.error(
        "[SYSTEM] Activity logs:",
        error
      );

      throw error;
    }
  }

  async function loadBackups() {
    try {
      const response = await fetch(
        "/api/settings/system/backups",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const text = await response.text();

      let result: any = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Backup API returned an invalid response."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to load backups."
        );
      }

      setBackups(result.data || []);
    } catch (error) {
      console.error(
        "[SYSTEM] Backups:",
        error
      );

      throw error;
    }
  }

  async function refreshSystem() {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      await loadSystem();

      setSuccess(
        "System information refreshed."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to refresh system."
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function createBackup() {
    try {
      setBackupLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/settings/system/backups",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: `AI SalesOS Backup ${new Date().toLocaleString()}`,
          }),
        }
      );

      const text = await response.text();

      let result: any = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Backup API returned an invalid response."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to create backup."
        );
      }

      setSuccess(
        "Backup request created successfully."
      );

      await loadBackups();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create backup."
      );
    } finally {
      setBackupLoading(false);
    }
  }

  async function clearLogs() {
    const confirmed =
      window.confirm(
        "Are you sure you want to clear activity logs? This action cannot be undone."
      );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/settings/system/activity-logs",
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      let result: any = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          "Activity Logs API returned an invalid response."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            "Unable to clear logs."
        );
      }

      setLogs([]);

      setSuccess(
        "Activity logs cleared successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to clear logs."
      );
    }
  }

  function exportLogs() {
    if (!logs.length) {
      setError(
        "There are no activity logs to export."
      );
      return;
    }

    const headers = [
      "Action",
      "Description",
      "Entity Type",
      "Entity ID",
      "Created At",
      "IP Address",
    ];

    const rows = logs.map((log) => [
      log.action,
      log.description || "",
      log.entity_type || "",
      log.entity_id || "",
      log.created_at,
      log.ip_address || "",
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      `ai-salesos-activity-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const filteredLogs = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    if (!query) return logs;

    return logs.filter((log) =>
      [
        log.action,
        log.description,
        log.entity_type,
        log.entity_id,
        log.ip_address,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [logs, search]);

  const successfulBackups =
    backups.filter(
      (backup) =>
        backup.status === "completed" ||
        backup.status === "success"
    ).length;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-8">
          <Link
            href="/settings"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Settings2 size={24} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    System
                  </h1>

                  <p className="text-sm text-slate-400">
                    Monitor AI SalesOS activity, backups and maintenance.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={refreshSystem}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh System
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-2">

            <SystemTab
              active={activeTab === "overview"}
              icon={<Server size={18} />}
              label="System Overview"
              onClick={() =>
                setActiveTab("overview")
              }
            />

            <SystemTab
              active={activeTab === "activity"}
              icon={<Activity size={18} />}
              label="Activity Logs"
              onClick={() =>
                setActiveTab("activity")
              }
            />

            <SystemTab
              active={activeTab === "backup"}
              icon={<HardDrive size={18} />}
              label="Backup & Maintenance"
              onClick={() =>
                setActiveTab("backup")
              }
            />

            <SystemTab
              active={
                activeTab === "maintenance"
              }
              icon={<Wrench size={18} />}
              label="Maintenance"
              onClick={() =>
                setActiveTab("maintenance")
              }
            />

          </aside>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

            {loading ? (
              <div className="flex min-h-[450px] items-center justify-center">
                <Loader2
                  size={32}
                  className="animate-spin text-blue-500"
                />
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <Overview
                    logs={logs}
                    backups={backups}
                    successfulBackups={
                      successfulBackups
                    }
                  />
                )}

                {activeTab === "activity" && (
                  <ActivityLogs
                    logs={filteredLogs}
                    search={search}
                    setSearch={setSearch}
                    onExport={exportLogs}
                    onClear={clearLogs}
                  />
                )}

                {activeTab === "backup" && (
                  <BackupMaintenance
                    backups={backups}
                    backupLoading={
                      backupLoading
                    }
                    onCreateBackup={
                      createBackup
                    }
                    onRefresh={
                      loadBackups
                    }
                  />
                )}

                {activeTab === "maintenance" && (
                  <Maintenance
                    maintenanceMode={
                      maintenanceMode
                    }
                    setMaintenanceMode={
                      setMaintenanceMode
                    }
                  />
                )}
              </>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}


/* =========================================================
   SYSTEM TAB
========================================================= */

function SystemTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}


/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
  logs,
  backups,
  successfulBackups,
}: {
  logs: ActivityLog[];
  backups: BackupRecord[];
  successfulBackups: number;
}) {
  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-xl font-semibold">
          System Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Monitor the health and operational activity of AI SalesOS.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SystemCard
          icon={<Server size={20} />}
          title="Application"
          value="Online"
          status="Operational"
        />

        <SystemCard
          icon={<Database size={20} />}
          title="Database"
          value="Connected"
          status="Operational"
        />

        <SystemCard
          icon={<Activity size={20} />}
          title="Activity Logs"
          value={logs.length.toString()}
          status="Recorded"
        />

        <SystemCard
          icon={<HardDrive size={20} />}
          title="Backups"
          value={successfulBackups.toString()}
          status="Completed"
        />

      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck
              size={20}
              className="text-emerald-400"
            />

            <div>
              <h3 className="font-semibold">
                Security Status
              </h3>

              <p className="text-xs text-slate-500">
                Current system security state
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <StatusRow
              label="Authentication"
              status="Operational"
            />

            <StatusRow
              label="Database Access"
              status="Protected"
            />

            <StatusRow
              label="Company Isolation"
              status="Enabled"
            />

            <StatusRow
              label="Activity Logging"
              status="Enabled"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3
              size={20}
              className="text-blue-400"
            />

            <div>
              <h3 className="font-semibold">
                System Activity
              </h3>

              <p className="text-xs text-slate-500">
                Latest recorded events
              </p>
            </div>
          </div>

          {logs.slice(0, 5).map(
            (log) => (
              <div
                key={log.id}
                className="border-b border-white/5 py-3 last:border-0"
              >
                <div className="text-sm text-white">
                  {log.action}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {log.description ||
                    "System activity"}
                </div>
              </div>
            )
          )}

          {!logs.length && (
            <div className="py-8 text-center text-sm text-slate-500">
              No activity recorded.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   ACTIVITY LOGS
========================================================= */

function ActivityLogs({
  logs,
  search,
  setSearch,
  onExport,
  onClear,
}: {
  logs: ActivityLog[];
  search: string;
  setSearch: (value: string) => void;
  onExport: () => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Activity Logs
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Track important actions performed inside AI SalesOS.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20"
          >
            <Trash2 size={16} />
            Clear
          </button>

        </div>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search activity..."
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-white/5">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                <th className="px-5 py-4">
                  Action
                </th>

                <th className="px-5 py-4">
                  Description
                </th>

                <th className="px-5 py-4">
                  Entity
                </th>

                <th className="px-5 py-4">
                  Time
                </th>

              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-white/10"
                >
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-300">
                    {log.description ||
                      "No description"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-400">
                    {log.entity_type
                      ? `${log.entity_type}${
                          log.entity_id
                            ? `: ${log.entity_id}`
                            : ""
                        }`
                      : "System"}
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    {formatDate(
                      log.created_at
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {!logs.length && (
            <div className="flex min-h-[250px] items-center justify-center text-sm text-slate-500">
              No activity logs found.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


/* =========================================================
   BACKUP
========================================================= */

function BackupMaintenance({
  backups,
  backupLoading,
  onCreateBackup,
  onRefresh,
}: {
  backups: BackupRecord[];
  backupLoading: boolean;
  onCreateBackup: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Backup & Maintenance
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage backup records and system maintenance.
          </p>
        </div>

        <button
          onClick={onCreateBackup}
          disabled={backupLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {backupLoading ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <HardDrive size={17} />
          )}

          Create Backup
        </button>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <div className="flex gap-3">
          <AlertCircle
            size={20}
            className="shrink-0 text-amber-400"
          />

          <div>
            <h3 className="font-semibold text-amber-300">
              Backup information
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-200/70">
              This page records backup operations. Actual database backup storage should be handled by your Supabase infrastructure or a dedicated backup provider.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10">

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="font-semibold">
              Backup History
            </h3>

            <p className="text-xs text-slate-500">
              Recent backup operations
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        {backups.map((backup) => (
          <div
            key={backup.id}
            className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-medium text-white">
                {backup.name}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatDate(
                  backup.created_at
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">

              {backup.size && (
                <span className="text-xs text-slate-500">
                  {backup.size}
                </span>
              )}

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs capitalize text-emerald-400">
                {backup.status}
              </span>

            </div>
          </div>
        ))}

        {!backups.length && (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-500">
            No backup records found.
          </div>
        )}

      </div>
    </div>
  );
}


/* =========================================================
   MAINTENANCE
========================================================= */

function Maintenance({
  maintenanceMode,
  setMaintenanceMode,
}: {
  maintenanceMode: boolean;
  setMaintenanceMode: (
    value: boolean
  ) => void;
}) {
  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-xl font-semibold">
          System Maintenance
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Control maintenance-related system settings.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/10 p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Wrench size={20} />
            </div>

            <div>
              <h3 className="font-semibold">
                Maintenance Mode
              </h3>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Use this switch to prepare the application for maintenance. The current switch is local UI state; connect it to your company system settings before using it to restrict customer access.
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setMaintenanceMode(
                !maintenanceMode
              )
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              maintenanceMode
                ? "bg-blue-600"
                : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                maintenanceMode
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <MaintenanceCard
          icon={<Database size={20} />}
          title="Database"
          description="Monitor database connectivity and availability."
        />

        <MaintenanceCard
          icon={<Server size={20} />}
          title="Application"
          description="Monitor application availability and services."
        />

        <MaintenanceCard
          icon={<Activity size={20} />}
          title="Monitoring"
          description="Review system activity and operational events."
        />

      </div>

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function SystemCard({
  icon,
  title,
  value,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div className="text-xl font-bold">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {status}
      </div>

    </div>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">

      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="inline-flex items-center gap-2 text-xs text-emerald-400">
        <CheckCircle2 size={14} />
        {status}
      </span>

    </div>
  );
}

function MaintenanceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   DATE
========================================================= */

function formatDate(
  value: string
) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString(
      "en-NG",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  } catch {
    return value;
  }
}