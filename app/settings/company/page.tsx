"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  Save,
  Loader2,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Percent,
} from "lucide-react";

type Company = {
  id?: string;
  name: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  legal_name: string;
  website: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  tax_rate: number;
  subscription_plan?: string;
};

const EMPTY_COMPANY: Company = {
  name: "",
  logo_url: "",
  address: "",
  phone: "",
  email: "",
  legal_name: "",
  website: "",
  city: "",
  state: "",
  country: "Nigeria",
  timezone: "Africa/Lagos",
  currency: "NGN",
  tax_rate: 0,
};

export default function CompanySettingsPage() {
  const [company, setCompany] =
    useState<Company>(
      EMPTY_COMPANY
    );

  const [originalCompany, setOriginalCompany] =
    useState<Company>(
      EMPTY_COMPANY
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  /* =======================================================
     LOAD COMPANY
     ======================================================= */

  async function loadCompany() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/settings/company",
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
            cache: "no-store",
          }
        );

      const rawText =
        await response.text();

      console.log(
        "GET COMPANY STATUS:",
        response.status
      );

      console.log(
        "GET COMPANY RESPONSE:",
        rawText
      );

      let result: any;

      try {
        result = rawText
          ? JSON.parse(rawText)
          : null;
      } catch {
        throw new Error(
          `The company API returned invalid JSON. HTTP ${response.status}.`
        );
      }

      if (!result) {
        throw new Error(
          "The company API returned an empty response."
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Unable to load company information."
        );
      }

      const data =
        result.data || {};

      const loadedCompany: Company =
        {
          id: data.id,

          name:
            data.name ?? "",

          logo_url:
            data.logo_url ?? "",

          address:
            data.address ?? "",

          phone:
            data.phone ?? "",

          email:
            data.email ?? "",

          legal_name:
            data.legal_name ?? "",

          website:
            data.website ?? "",

          city:
            data.city ?? "",

          state:
            data.state ?? "",

          country:
            data.country ??
            "Nigeria",

          timezone:
            data.timezone ??
            "Africa/Lagos",

          currency:
            data.currency ??
            "NGN",

          tax_rate:
            Number(
              data.tax_rate ?? 0
            ),

          subscription_plan:
            data.subscription_plan ??
            "free",
        };

      setCompany(
        loadedCompany
      );

      setOriginalCompany(
        loadedCompany
      );
    } catch (error) {
      console.error(
        "LOAD COMPANY ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load company information."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     SAVE COMPANY
     ======================================================= */

  async function saveCompany() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !company.name.trim()
      ) {
        setError(
          "Company name is required."
        );

        setSaving(false);

        return;
      }

      const payload = {
        name:
          company.name.trim(),

        logo_url:
          company.logo_url.trim() ||
          null,

        address:
          company.address.trim() ||
          null,

        phone:
          company.phone.trim() ||
          null,

        email:
          company.email.trim() ||
          null,

        legal_name:
          company.legal_name.trim() ||
          null,

        website:
          company.website.trim() ||
          null,

        city:
          company.city.trim() ||
          null,

        state:
          company.state.trim() ||
          null,

        country:
          company.country.trim(),

        timezone:
          company.timezone,

        currency:
          company.currency,

        tax_rate:
          Number(
            company.tax_rate || 0
          ),
      };

      const response =
        await fetch(
          "/api/settings/company",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const rawText =
        await response.text();

      console.log(
        "PUT COMPANY STATUS:",
        response.status
      );

      console.log(
        "PUT COMPANY RESPONSE:",
        rawText
      );

      let result: any;

      try {
        result = rawText
          ? JSON.parse(rawText)
          : null;
      } catch {
        throw new Error(
          `The company API returned invalid JSON. HTTP ${response.status}.`
        );
      }

      if (!result) {
        throw new Error(
          `The company API returned an empty response. HTTP ${response.status}.`
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Unable to save company information."
        );
      }

      const data =
        result.data || {};

      const savedCompany: Company =
        {
          id: data.id,

          name:
            data.name ??
            company.name,

          logo_url:
            data.logo_url ??
            company.logo_url,

          address:
            data.address ??
            company.address,

          phone:
            data.phone ??
            company.phone,

          email:
            data.email ??
            company.email,

          legal_name:
            data.legal_name ??
            company.legal_name,

          website:
            data.website ??
            company.website,

          city:
            data.city ??
            company.city,

          state:
            data.state ??
            company.state,

          country:
            data.country ??
            company.country,

          timezone:
            data.timezone ??
            company.timezone,

          currency:
            data.currency ??
            company.currency,

          tax_rate:
            Number(
              data.tax_rate ??
                company.tax_rate ??
                0
            ),

          subscription_plan:
            data.subscription_plan ??
            company.subscription_plan ??
            "free",
        };

      setCompany(
        savedCompany
      );

      setOriginalCompany(
        savedCompany
      );

      setSuccess(
        "Company information saved successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (error) {
      console.error(
        "SAVE COMPANY ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save company information."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     RESET
     ======================================================= */

  function resetChanges() {
    setCompany(
      originalCompany
    );

    setError("");
    setSuccess("");
  }

  /* =======================================================
     UPDATE FIELD
     ======================================================= */

  function updateField<
    K extends keyof Company
  >(
    field: K,
    value: Company[K]
  ) {
    setCompany(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

    setSuccess("");
    setError("");
  }

  /* =======================================================
     COPY COMPANY ID
     ======================================================= */

  async function copyCompanyId() {
    if (!company.id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        company.id
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy company ID."
      );
    }
  }

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={24}
              className="animate-spin text-blue-500"
            />

            Loading company information...
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Building2 size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Company Information
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Manage the information and business
                configuration for your AI SalesOS company.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>
              <p className="font-medium text-red-300">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2
              size={20}
              className="text-emerald-400"
            />

            <p className="text-sm text-emerald-300">
              {success}
            </p>
          </div>
        )}

        {/* COMPANY PROFILE */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Business Profile
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Basic information about your company.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <Input
              label="Company Name *"
              icon={
                <Building2 size={17} />
              }
              value={company.name}
              placeholder="AI SalesOS"
              onChange={(value) =>
                updateField(
                  "name",
                  value
                )
              }
            />

            <Input
              label="Legal Name"
              icon={
                <FileText size={17} />
              }
              value={
                company.legal_name
              }
              placeholder="Registered company name"
              onChange={(value) =>
                updateField(
                  "legal_name",
                  value
                )
              }
            />

            <Input
              label="Phone"
              icon={
                <Phone size={17} />
              }
              value={
                company.phone
              }
              placeholder="+234..."
              onChange={(value) =>
                updateField(
                  "phone",
                  value
                )
              }
            />

            <Input
              label="Email"
              icon={
                <Mail size={17} />
              }
              type="email"
              value={
                company.email
              }
              placeholder="company@example.com"
              onChange={(value) =>
                updateField(
                  "email",
                  value
                )
              }
            />

            <Input
              label="Website"
              icon={
                <Globe size={17} />
              }
              value={
                company.website
              }
              placeholder="https://example.com"
              onChange={(value) =>
                updateField(
                  "website",
                  value
                )
              }
            />

            <Input
              label="Logo URL"
              value={
                company.logo_url
              }
              placeholder="https://..."
              onChange={(value) =>
                updateField(
                  "logo_url",
                  value
                )
              }
            />

          </div>
        </section>

        {/* ADDRESS */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Business Address
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Location information for your company.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="md:col-span-2">
              <Input
                label="Street Address"
                icon={
                  <MapPin size={17} />
                }
                value={
                  company.address
                }
                placeholder="Company street address"
                onChange={(value) =>
                  updateField(
                    "address",
                    value
                  )
                }
              />
            </div>

            <Input
              label="City"
              value={
                company.city
              }
              placeholder="Lagos"
              onChange={(value) =>
                updateField(
                  "city",
                  value
                )
              }
            />

            <Input
              label="State"
              value={
                company.state
              }
              placeholder="Lagos State"
              onChange={(value) =>
                updateField(
                  "state",
                  value
                )
              }
            />

            <Select
              label="Country"
              value={
                company.country
              }
              options={[
                "Nigeria",
                "Ghana",
                "Kenya",
                "South Africa",
                "United States",
                "United Kingdom",
              ]}
              onChange={(value) =>
                updateField(
                  "country",
                  value
                )
              }
            />

          </div>
        </section>

        {/* BUSINESS CONFIGURATION */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Business Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Configure currency, timezone and tax settings.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <Select
              label="Currency"
              value={
                company.currency
              }
              options={[
                "NGN",
                "USD",
                "GBP",
                "EUR",
                "GHS",
                "ZAR",
                "KES",
              ]}
              onChange={(value) =>
                updateField(
                  "currency",
                  value
                )
              }
            />

            <Select
              label="Timezone"
              value={
                company.timezone
              }
              options={[
                "Africa/Lagos",
                "Africa/Accra",
                "Africa/Nairobi",
                "Africa/Johannesburg",
                "UTC",
                "Europe/London",
                "America/New_York",
              ]}
              onChange={(value) =>
                updateField(
                  "timezone",
                  value
                )
              }
            />

            <Input
              label="Default Tax Rate (%)"
              icon={
                <Percent size={17} />
              }
              type="number"
              value={String(
                company.tax_rate
              )}
              placeholder="0"
              onChange={(value) =>
                updateField(
                  "tax_rate",
                  Number(value) || 0
                )
              }
            />

          </div>
        </section>

        {/* COMPANY ID */}

        {company.id && (
          <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-semibold">
                  Company ID
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Unique identifier for this AI SalesOS workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  copyCompanyId
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check
                      size={16}
                    />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy
                      size={16}
                    />
                    Copy ID
                  </>
                )}
              </button>

            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <code className="break-all text-xs text-slate-400">
                {company.id}
              </code>
            </div>
          </section>
        )}

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={
              resetChanges
            }
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RotateCcw
              size={17}
            />

            Reset Changes
          </button>

          <button
            type="button"
            onClick={
              saveCompany
            }
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save
                  size={17}
                />

                Save Changes
              </>
            )}
          </button>

        </div>
      </div>
    </main>
  );
}

/* =========================================================
   INPUT COMPONENT
   ========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={`w-full rounded-xl border border-white/10 bg-black/20 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 ${
            icon
              ? "pl-10 pr-4"
              : "px-4"
          }`}
        />

      </div>
    </label>
  );
}

/* =========================================================
   SELECT COMPONENT
   ========================================================= */

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
              className="bg-slate-900"
            >
              {option}
            </option>
          )
        )}
      </select>

    </label>
  );
}