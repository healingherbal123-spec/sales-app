"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Shield,
  Bell,
  Plug,
  CreditCard,
  ChevronRight,
  Settings,
} from "lucide-react";

const settings = [
  {
    title: "Company Information",
    description:
      "Manage your company name, contact information, address, currency and business details.",
    href: "/settings/company",
    icon: Building2,
  },
  {
    title: "Staff Settings",
    description:
      "Manage employees, roles, departments, job titles and staff access.",
    href: "/settings/staff",
    icon: Users,
  },
  {
    title: "Security",
    description:
      "Manage account security, password, authentication and sessions.",
    href: "/settings/security",
    icon: Shield,
  },
  {
    title: "Notifications",
    description:
      "Control alerts for orders, payments, deliveries, sales and AI activity.",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Integrations",
    description:
      "Connect WhatsApp, payment providers, AI providers, email and other services.",
    href: "/settings/integrations",
    icon: Plug,
  },
  {
    title: "Billing",
    description:
      "Manage your AI SalesOS subscription, plan and billing information.",
    href: "/settings/billing",
    icon: CreditCard,
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Settings size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage your AI SalesOS workspace, company,
            staff, security, notifications, integrations
            and billing.
          </p>
        </div>

        {/* Settings cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {settings.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-semibold text-white">
                        {item.title}
                      </h2>

                      <ChevronRight
                        size={18}
                        className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                      />
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Workspace information */}
        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-6">
          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Building2 size={21} />
            </div>

            <div>
              <h3 className="font-semibold">
                AI SalesOS Workspace
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Settings are applied to your company
                workspace and can affect sales, customers,
                orders, payments, staff and AI workforce
                operations.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}