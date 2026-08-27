"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Loader2,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Truck,
  CreditCard,
  Receipt,
  Bot,
  MessageSquare,
  ClipboardList,
  Activity,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  Trophy,
  TrendingUp,
  Crown,
  UserPlus,
  Building2,
  FileText,
  AlertCircle,
  Clock,
  Plus,
  CheckCircle,
  Route,
  Link2,
  Shield,
  User,
  BarChart,
  HelpCircle,
  Download,
  RefreshCw,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* =========================================================
   AI SalesOS — MAIN SIDEBAR
   Only ONE Dashboard exists:
   
   /dashboard
   
   All other functionality is handled as modules.
   ========================================================= */

const navigation = [
  /* =======================================================
     1. MAIN
     ======================================================= */
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },

  /* =======================================================
     2. BUSINESS
     ======================================================= */
  {
    title: "Business",
    items: [
      {
        name: "Sales",
        href: "/sales",
        icon: ShoppingBag,
      },
      {
        name: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        name: "Orders",
        href: "/orders",
        icon: Package,
      },
      {
        name: "Products",
        href: "/products",
        icon: Package,
      },
      {
        name: "Inventory",
        href: "/inventory",
        icon: Layers,
      },
      {
        name: "Deliveries",
        href: "/deliveries",
        icon: Truck,
      },
      {
        name: "Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        name: "Expenses",
        href: "/expenses",
        icon: Receipt,
      },
    ],
  },

  /* =======================================================
     3. TEAM
     ======================================================= */
  {
    title: "Team",
    items: [
      {
        name: "Team",
        href: "/team",
        icon: Trophy,
      },
      {
        name: "Performance",
        href: "/team/performance",
        icon: TrendingUp,
      },
    ],
  },

  /* =======================================================
     4. SALES MANAGEMENT
     ======================================================= */
  {
    title: "Sales Management",
    items: [
      {
        name: "Sales Overview",
        href: "/sales",
        icon: ShoppingBag,
      },
      {
        name: "All Customers",
        href: "/customers",
        icon: Users,
      },
      {
        name: "Add Customer",
        href: "/customers/new",
        icon: UserPlus,
      },
      {
        name: "All Orders",
        href: "/orders",
        icon: Package,
      },
      {
        name: "Create Order",
        href: "/orders/new",
        icon: Plus,
      },
      {
        name: "Sales Payments",
        href: "/sales/payments",
        icon: CreditCard,
      },
      {
        name: "Follow-ups",
        href: "/sales/followups",
        icon: Activity,
      },
      {
        name: "My Performance",
        href: "/sales/performance",
        icon: TrendingUp,
      },
    ],
  },

  /* =======================================================
     5. INVENTORY
     ======================================================= */
  {
    title: "Inventory",
    items: [
      {
        name: "All Products",
        href: "/products",
        icon: Package,
      },
      {
        name: "Add Product",
        href: "/products/new",
        icon: Plus,
      },
      {
        name: "Stock Movements",
        href: "/inventory/movements",
        icon: Activity,
      },
      {
        name: "Low Stock",
        href: "/inventory/low-stock",
        icon: AlertCircle,
      },
      {
        name: "Warehouses",
        href: "/inventory/warehouses",
        icon: Building2,
      },
    ],
  },

  /* =======================================================
     6. DELIVERY & DISPATCH
     ======================================================= */
  {
    title: "Delivery & Dispatch",
    items: [
      {
        name: "All Deliveries",
        href: "/deliveries",
        icon: Truck,
      },
      {
        name: "Assign Delivery",
        href: "/deliveries/assign",
        icon: UserPlus,
      },
      {
        name: "Drivers",
        href: "/deliveries/drivers",
        icon: Users,
      },
      {
        name: "Active Deliveries",
        href: "/delivery/active",
        icon: Activity,
      },
      {
        name: "Delivery History",
        href: "/delivery/history",
        icon: ClipboardList,
      },
      {
        name: "Route Optimizer",
        href: "/delivery/route",
        icon: Route,
      },
    ],
  },

  /* =======================================================
     7. FINANCE
     ======================================================= */
  {
    title: "Finance",
    items: [
      {
        name: "All Payments",
        href: "/payments",
        icon: CreditCard,
      },
      {
        name: "Verify Payments",
        href: "/accountant/verify",
        icon: CheckCircle,
      },
      {
        name: "Transactions",
        href: "/accountant/transactions",
        icon: Receipt,
      },
      {
        name: "Financial Reports",
        href: "/accountant/reports",
        icon: FileText,
      },
      {
        name: "Outstanding",
        href: "/accountant/outstanding",
        icon: DollarSign,
      },
      {
        name: "Revenue",
        href: "/accountant/revenue",
        icon: TrendingUp,
      },
      {
        name: "Invoices",
        href: "/accountant/invoices",
        icon: Receipt,
      },
    ],
  },

  /* =======================================================
     8. HUMAN RESOURCES
     ======================================================= */
  {
    title: "Human Resources",
    items: [
      {
        name: "Staff Directory",
        href: "/hr/staff",
        icon: Users,
      },
      {
        name: "Add Staff",
        href: "/hr/staff/new",
        icon: UserPlus,
      },
      {
        name: "Attendance",
        href: "/hr/attendance",
        icon: Clock,
      },
      {
        name: "Leave Requests",
        href: "/hr/leaves",
        icon: Calendar,
      },
      {
        name: "Performance Reviews",
        href: "/hr/performance",
        icon: TrendingUp,
      },
    ],
  },

  /* =======================================================
     9. AI WORKFORCE
     ======================================================= */
  {
    title: "AI Workforce",
    items: [
      {
        name: "AI Overview",
        href: "/ai/workforce",
        icon: Bot,
      },
      {
        name: "AI Agents",
        href: "/ai/agents",
        icon: Bot,
      },
      {
        name: "AI Tasks",
        href: "/ai/tasks",
        icon: ClipboardList,
      },
      {
        name: "AI Activity",
        href: "/ai/activity",
        icon: Activity,
      },
      {
        name: "AI Insights",
        href: "/ai/insights",
        icon: Brain,
      },
      {
        name: "AI Training",
        href: "/ai/training",
        icon: BookOpen,
      },
      {
        name: "AI Contact",
        href: "/ai/contact",
        icon: MessageSquare,
      },
    ],
  },

  /* =======================================================
     10. KNOWLEDGE
     ======================================================= */
  {
    title: "Knowledge",
    items: [
      {
        name: "Knowledge Hub",
        href: "/knowledge",
        icon: BookOpen,
      },
      {
        name: "Teach AI",
        href: "/knowledge/teach",
        icon: Brain,
      },
      {
        name: "Documentation",
        href: "/knowledge/docs",
        icon: FileText,
      },
      {
        name: "FAQs",
        href: "/knowledge/faqs",
        icon: HelpCircle,
      },
    ],
  },

  /* =======================================================
     11. SERVICES
     ======================================================= */
  {
    title: "Services",
    items: [
      {
        name: "Services",
        href: "/services",
        icon: Briefcase,
      },
      {
        name: "Service Bookings",
        href: "/service-bookings",
        icon: Calendar,
      },
      {
        name: "Revenue",
        href: "/revenue",
        icon: DollarSign,
      },
    ],
  },

  /* =======================================================
     12. REPORTS
     ======================================================= */
  {
    title: "Reports",
    items: [
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
      },
      {
        name: "Sales Reports",
        href: "/reports/sales",
        icon: TrendingUp,
      },
      {
        name: "Financial Reports",
        href: "/reports/financial",
        icon: DollarSign,
      },
      {
        name: "Inventory Reports",
        href: "/reports/inventory",
        icon: Package,
      },
      {
        name: "Staff Reports",
        href: "/reports/staff",
        icon: Users,
      },
      {
        name: "Export Data",
        href: "/reports/export",
        icon: Download,
      },
    ],
  },

  /* =======================================================
     13. ACTIVITY & SYSTEM
     ======================================================= */
  {
    title: "System",
    items: [
      {
        name: "Activity Logs",
        href: "/activity",
        icon: Activity,
      },
      {
        name: "Backup",
        href: "/system/backup",
        icon: RefreshCw,
      },
      {
        name: "Maintenance",
        href: "/system/maintenance",
        icon: Shield,
      },
    ],
  },

  /* =======================================================
     14. SETTINGS
     ======================================================= */
  {
    title: "Settings",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        name: "Profile",
        href: "/settings/profile",
        icon: User,
      },
      {
        name: "Company Settings",
        href: "/settings/company",
        icon: Building2,
      },
      {
        name: "Staff Settings",
        href: "/settings/staff",
        icon: Users,
      },
      {
        name: "Security",
        href: "/settings/security",
        icon: Shield,
      },
      {
        name: "Notifications",
        href: "/settings/notifications",
        icon: Bell,
      },
      {
        name: "Integrations",
        href: "/settings/integrations",
        icon: Link2,
      },
      {
        name: "Billing",
        href: "/settings/billing",
        icon: CreditCard,
      },
    ],
  },
];

/* =========================================================
   SIDEBAR
   ========================================================= */

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  /* =======================================================
     FIND ACTIVE GROUP
     ======================================================= */

  const activeGroup = useMemo(() => {
    return navigation.find((group) =>
      group.items.some(
        (item) =>
          pathname === item.href ||
          pathname?.startsWith(
            item.href + "/"
          )
      )
    )?.title;
  }, [pathname]);

  /* =======================================================
     EXPANDED GROUPS
     ======================================================= */

  const [expandedGroups, setExpandedGroups] =
    useState<string[]>(
      activeGroup
        ? [activeGroup]
        : ["Main"]
    );

  /* =======================================================
     KEEP ACTIVE GROUP OPEN
     ======================================================= */

  useEffect(() => {
    if (!activeGroup) return;

    setExpandedGroups((previous) => {
      if (
        previous.includes(activeGroup)
      ) {
        return previous;
      }

      return [
        ...previous,
        activeGroup,
      ];
    });
  }, [activeGroup]);

  /* =======================================================
     CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
     ======================================================= */

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  /* =======================================================
     TOGGLE GROUP
     ======================================================= */

  const toggleGroup = (
    title: string
  ) => {
    setExpandedGroups((previous) =>
      previous.includes(title)
        ? previous.filter(
            (item) => item !== title
          )
        : [...previous, title]
    );
  };

  /* =======================================================
     SIGN OUT
     ======================================================= */

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      const supabase =
        createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Sign out error:",
          error
        );

        setIsSigningOut(false);

        return;
      }

      setIsMobileOpen(false);

      router.replace("/login");

      router.refresh();
    } catch (error) {
      console.error(
        "Unexpected sign out error:",
        error
      );

      setIsSigningOut(false);
    }
  };

  /* =======================================================
     ACTIVE ITEM
     ======================================================= */

  const isItemActive = (
    href: string
  ) => {
    if (!pathname) return false;

    /*
     * Dashboard must ONLY be active on:
     *
     * /dashboard
     *
     * It should not become active for:
     *
     * /dashboard/anything
     */

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  };

  return (
    <>
      {/* ===================================================
          MOBILE MENU BUTTON
      =================================================== */}

      <button
        type="button"
        aria-label={
          isMobileOpen
            ? "Close menu"
            : "Open menu"
        }
        aria-expanded={
          isMobileOpen
        }
        onClick={() =>
          setIsMobileOpen(
            (previous) =>
              !previous
          )
        }
        className="
          fixed
          top-4
          left-4
          z-[60]
          md:hidden
          flex
          items-center
          justify-center
          w-10
          h-10
          rounded-lg
          bg-slate-900
          text-white
          shadow-lg
        "
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
            cursor-default
          "
          onClick={() =>
            setIsMobileOpen(false)
          }
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={cn(
          `
            w-64
            bg-slate-900
            text-slate-300
            border-r
            border-slate-800
            flex
            flex-col
            flex-shrink-0
            h-screen
            z-50
            transition-transform
            duration-300
          `,
          isMobileOpen
            ? `
              fixed
              left-0
              top-0
              translate-x-0
            `
            : `
              fixed
              -translate-x-full
              md:relative
              md:translate-x-0
              md:flex
            `
        )}
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <div className="p-4 border-b border-slate-800 flex-shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() =>
              setIsMobileOpen(false)
            }
          >
            <div className="bg-blue-600 p-2 rounded-lg text-white font-black text-xl">
              OS
            </div>

            <div>
              <h1 className="font-bold text-white text-sm">
                AI SalesOS
              </h1>

              <p className="text-[10px] text-slate-400">
                Enterprise
              </p>
            </div>
          </Link>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-4
            scrollbar-thin
            scrollbar-thumb-slate-700
          "
        >
          {navigation.map(
            (group) => {
              const isExpanded =
                expandedGroups.includes(
                  group.title
                );

              const groupHasActiveItem =
                group.items.some(
                  (item) =>
                    isItemActive(
                      item.href
                    )
                );

              return (
                <div
                  key={group.title}
                >
                  {/* GROUP HEADER */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(
                        group.title
                      )
                    }
                    aria-expanded={
                      isExpanded
                    }
                    className={cn(
                      `
                        w-full
                        flex
                        items-center
                        justify-between
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        px-2
                        py-1
                        transition-colors
                      `,
                      groupHasActiveItem
                        ? "text-blue-400"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span>
                      {
                        group.title
                      }
                    </span>

                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {/* GROUP ITEMS */}

                  <div
                    className={cn(
                      "space-y-1 mt-1 overflow-hidden transition-all duration-200",
                      isExpanded
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {group.items.map(
                      (
                        item,
                        index
                      ) => {
                        const isActive =
                          isItemActive(
                            item.href
                          );

                        const Icon =
                          item.icon;

                        const itemKey =
                          `${group.title}-${item.href}-${index}`;

                        return (
                          <Link
                            key={
                              itemKey
                            }
                            href={
                              item.href
                            }
                            onClick={() =>
                              setIsMobileOpen(
                                false
                              )
                            }
                            className={cn(
                              `
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                transition-all
                              `,
                              isActive
                                ? `
                                  bg-blue-600
                                  text-white
                                  shadow-sm
                                `
                                : `
                                  text-slate-300
                                  hover:text-white
                                  hover:bg-slate-800
                                `
                            )}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />

                            <span className="truncate">
                              {
                                item.name
                              }
                            </span>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </nav>

        {/* =================================================
            USER PROFILE
        ================================================== */}

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="
                w-9
                h-9
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                text-white
                text-sm
                font-bold
              "
            >
              JD
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Boss
              </p>

              <p className="text-xs text-slate-400 truncate">
                Administrator
              </p>
            </div>
          </div>

          {/* SIGN OUT */}

          <button
            type="button"
            disabled={
              isSigningOut
            }
            onClick={
              handleSignOut
            }
            className="
              w-full
              flex
              items-center
              gap-2
              px-3
              py-2
              mt-2
              text-sm
              text-slate-400
              hover:text-white
              hover:bg-slate-800
              rounded-lg
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}

            {isSigningOut
              ? "Signing Out..."
              : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;