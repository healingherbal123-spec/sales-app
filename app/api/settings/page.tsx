"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

type Staff = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  department: string | null;
  job_title: string | null;
  employee_number: string | null;
  status: string | null;
  joined_at: string | null;
  last_login_at: string | null;
};

const ROLES = [
  "Company Owner",
  "Admin",
  "Manager",
  "Sales",
  "Inventory",
  "Dispatcher",
  "Delivery",
  "Accountant",
  "HR",
];

const DEPARTMENTS = [
  "Sales",
  "Operations",
  "Logistics",
  "Finance",
  "Human Resources",
  "Inventory",
  "Management",
];

const STATUS_OPTIONS = [
  "active",
  "inactive",
  "suspended",
];

export default function StaffSettingsPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] =
    useState("");

  const [showInvite, setShowInvite] =
    useState(false);

  const [editingStaff, setEditingStaff] =
    useState<Staff | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [inviteUrl, setInviteUrl] =
    useState("");

  async function loadStaff() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/settings/staff",
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to load staff."
        );
      }

      setStaff(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load staff."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    if (!query) return staff;

    return staff.filter((person) => {
      return [
        person.full_name,
        person.email,
        person.phone,
        person.role,
        person.department,
        person.job_title,
        person.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [staff, search]);

  const activeCount = staff.filter(
    (person) =>
      person.status === "active" ||
      !person.status
  ).length;

  const inactiveCount = staff.filter(
    (person) =>
      person.status === "inactive"
  ).length;

  async function updateStaff(
    data: Record<string, unknown>
  ) {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/settings/staff",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to update staff."
        );
      }

      setSuccess(
        "Staff member updated successfully."
      );

      setEditingStaff(null);

      await loadStaff();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update staff."
      );
    }
  }

  async function createInvitation(
    data: {
      email: string;
      full_name: string;
      role: string;
      department: string;
    }
  ) {
    try {
      setError("");
      setSuccess("");
      setInviteUrl("");

      const response = await fetch(
        "/api/settings/staff",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to create invitation."
        );
      }

      setSuccess(
        "Staff invitation created successfully."
      );

      if (result.invite_url) {
        setInviteUrl(
          result.invite_url
        );
      }

      setShowInvite(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create invitation."
      );
    }
  }

  function getInitials(
    name: string | null
  ) {
    if (!name) return "?";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/settings"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Users size={24} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    Staff Settings
                  </h1>

                  <p className="text-sm text-slate-400">
                    Manage your AI SalesOS team.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setShowInvite(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <UserPlus size={18} />
              Invite Staff
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <X size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {inviteUrl && (
          <div className="mb-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="mb-2 text-sm font-semibold text-blue-300">
              Invitation Link
            </div>

            <div className="break-all rounded-lg bg-black/20 p-3 text-sm text-slate-300">
              {inviteUrl}
            </div>

            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  inviteUrl
                )
              }
              className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Copy Invitation Link
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users size={20} />}
            label="Total Staff"
            value={staff.length}
          />

          <StatCard
            icon={
              <CheckCircle2 size={20} />
            }
            label="Active"
            value={activeCount}
          />

          <StatCard
            icon={<ShieldCheck size={20} />}
            label="Inactive"
            value={inactiveCount}
          />
        </div>

        {/* SEARCH */}

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by name, email, role or department..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>

        {/* STAFF TABLE */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2
                size={30}
                className="animate-spin text-blue-500"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">
                      Staff
                    </th>

                    <th className="px-5 py-4">
                      Role
                    </th>

                    <th className="px-5 py-4">
                      Department
                    </th>

                    <th className="px-5 py-4">
                      Job Title
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map(
                    (person) => (
                      <tr
                        key={person.id}
                        className="border-t border-white/10 transition hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-300">
                              {getInitials(
                                person.full_name
                              )}
                            </div>

                            <div>
                              <div className="font-medium text-white">
                                {person.full_name ||
                                  "Unnamed Staff"}
                              </div>

                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <Mail
                                  size={12}
                                />
                                {person.email ||
                                  "No email"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                            {person.role ||
                              "Not assigned"}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-300">
                          {person.department ||
                            "Not assigned"}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-300">
                          {person.job_title ||
                            "—"}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge
                            status={
                              person.status ||
                              "active"
                            }
                          />
                        </td>

                        <td className="px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setEditingStaff(
                                person
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil
                              size={15}
                            />
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {filteredStaff.length ===
                0 && (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <Users
                    size={40}
                    className="mb-4 text-slate-700"
                  />

                  <h3 className="font-semibold text-white">
                    No staff found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Invite your first employee
                    to start building your
                    AI SalesOS team.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INVITE MODAL */}

      {showInvite && (
        <InviteModal
          onClose={() =>
            setShowInvite(false)
          }
          onSubmit={createInvitation}
        />
      )}

      {/* EDIT MODAL */}

      {editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          onClose={() =>
            setEditingStaff(null)
          }
          onSave={updateStaff}
        />
      )}
    </main>
  );
}


/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {label}
      </div>
    </div>
  );
}


/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "active"
      ? "bg-emerald-500/10 text-emerald-400"
      : status === "suspended"
      ? "bg-red-500/10 text-red-400"
      : "bg-slate-500/10 text-slate-400";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}


/* =========================================================
   INVITE MODAL
   ========================================================= */

function InviteModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    full_name: string;
    role: string;
    department: string;
  }) => Promise<void>;
}) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("Sales");

  const [department, setDepartment] =
    useState("Sales");

  const [saving, setSaving] =
    useState(false);

  async function submit() {
    if (!email.trim()) return;

    try {
      setSaving(true);

      await onSubmit({
        email,
        full_name: name,
        role,
        department,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Invite Staff
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a new employee to your company.
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <Field
          label="Full Name"
          icon={<Users size={16} />}
          value={name}
          onChange={setName}
          placeholder="Employee name"
        />

        <Field
          label="Email"
          icon={<Mail size={16} />}
          value={email}
          onChange={setEmail}
          placeholder="employee@example.com"
          type="email"
        />

        <SelectField
          label="Role"
          value={role}
          onChange={setRole}
          options={ROLES.filter(
            (item) =>
              item !== "Company Owner"
          )}
        />

        <SelectField
          label="Department"
          value={department}
          onChange={setDepartment}
          options={DEPARTMENTS}
        />
      </div>

      <div className="mt-7 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={
            saving ||
            !email.trim()
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {saving && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          Create Invitation
        </button>
      </div>
    </Modal>
  );
}


/* =========================================================
   EDIT STAFF MODAL
   ========================================================= */

function EditStaffModal({
  staff,
  onClose,
  onSave,
}: {
  staff: Staff;
  onClose: () => void;
  onSave: (
    data: Record<string, unknown>
  ) => Promise<void>;
}) {
  const [name, setName] =
    useState(staff.full_name || "");

  const [phone, setPhone] =
    useState(staff.phone || "");

  const [role, setRole] =
    useState(
      staff.role || "Sales"
    );

  const [department, setDepartment] =
    useState(
      staff.department || "Sales"
    );

  const [jobTitle, setJobTitle] =
    useState(
      staff.job_title || ""
    );

  const [status, setStatus] =
    useState(
      staff.status || "active"
    );

  const [saving, setSaving] =
    useState(false);

  async function save() {
    try {
      setSaving(true);

      await onSave({
        id: staff.id,
        full_name: name,
        phone,
        role,
        department,
        job_title: jobTitle,
        status,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Edit Staff
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update employee information and access.
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <Field
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Full name"
        />

        <Field
          label="Phone"
          icon={<Phone size={16} />}
          value={phone}
          onChange={setPhone}
          placeholder="+234..."
        />

        <Field
          label="Job Title"
          icon={
            <BriefcaseBusiness
              size={16}
            />
          }
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="Sales Representative"
        />

        <SelectField
          label="Role"
          value={role}
          onChange={setRole}
          options={ROLES}
        />

        <SelectField
          label="Department"
          value={department}
          onChange={setDepartment}
          options={DEPARTMENTS}
        />

        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="mt-7 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {saving && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          Save Changes
        </button>
      </div>
    </Modal>
  );
}


/* =========================================================
   FIELD
   ========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-black/20 py-3 ${
            icon
              ? "pl-10"
              : "px-4"
          } pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500`}
        />
      </div>
    </label>
  );
}


/* =========================================================
   SELECT
   ========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-blue-500"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-slate-900"
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </label>
  );
}


/* =========================================================
   MODAL
   ========================================================= */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1728] p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}