"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Briefcase,
  Users,
  Sparkles,
  HelpCircle,
  Moon,
  Sun,
  Plus,
  X,
  Check,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
/* =========================================================
   TYPES
========================================================= */
interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}
interface DashboardUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}
interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "order" | "success" | "warning";
  unread: boolean;
}
/* =========================================================
   NAVIGATION
========================================================= */
const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: ShoppingBag,
    label: "Orders",
    href: "/orders",
  },
  {
    icon: Package,
    label: "Products",
    href: "/products",
  },
  {
    icon: Briefcase,
    label: "Services",
    href: "/services",
  },
  {
    icon: Users,
    label: "Customers",
    href: "/customers",
  },
];
/* =========================================================
   QUICK ACTIONS
========================================================= */
const quickActions = [
  {
    icon: Plus,
    label: "New Sale",
    description: "Create a new sale",
    href: "/unified-orders",
  },
  {
    icon: Package,
    label: "Products",
    description: "Manage your products",
    href: "/products",
  },
  {
    icon: Briefcase,
    label: "Services",
    description: "Manage your services",
    href: "/services",
  },
  {
    icon: Users,
    label: "Customers",
    description: "Manage your customers",
    href: "/customers",
  },
];

// Mock user data (NO AUTH)
const MOCK_USER: DashboardUser = {
  id: "mock-user-id",
  name: "Boss",
  email: "boss@aisalesos.com",
  role: "boss",
};

/* =========================================================
   HEADER
========================================================= */
export function Header({
  onMenuToggle,
  isMenuOpen = false,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<DashboardUser>(MOCK_USER);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [quickActionsOpen, setQuickActionsOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  /* =======================================================
     NOTIFICATIONS
  ======================================================= */
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([
      {
        id: 1,
        title: "New order received",
        description:
          "A new customer order has been received.",
        time: "2 min ago",
        type: "order",
        unread: true,
      },
      {
        id: 2,
        title: "Service booking confirmed",
        description:
          "A service booking has been confirmed.",
        time: "15 min ago",
        type: "success",
        unread: true,
      },
      {
        id: 3,
        title: "Inventory running low",
        description:
          "Some products are below their stock level.",
        time: "1 hour ago",
        type: "warning",
        unread: true,
      },
    ]);
  /* =======================================================
     DARK MODE
  ======================================================= */
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("bizhub-theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      const prefersDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      document.documentElement.classList.toggle(
        "dark",
        prefersDark
      );
      setDarkMode(prefersDark);
    }
  }, []);
  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newDarkMode =
      !html.classList.contains("dark");
    html.classList.toggle(
      "dark",
      newDarkMode
    );
    localStorage.setItem(
      "bizhub-theme",
      newDarkMode ? "dark" : "light"
    );
    setDarkMode(newDarkMode);
  };
  /* =======================================================
     OUTSIDE CLICK
  ======================================================= */
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target = event.target as Node;
      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (
        quickActionsRef.current &&
        !quickActionsRef.current.contains(target)
      ) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);
  /* =======================================================
     ESCAPE
  ======================================================= */
  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setQuickActionsOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener(
      "keydown",
      handleEscape
    );
    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);
  /* =======================================================
     CLOSE MENUS
  ======================================================= */
  const closeAllMenus = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setQuickActionsOpen(false);
  };
  /* =======================================================
     NAVIGATION
  ======================================================= */
  const navigateTo = (href: string) => {
    closeAllMenus();
    setSearchOpen(false);
    router.push(href);
  };
  /* =======================================================
     INITIALS
  ======================================================= */
  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }
    return user.name
      .trim()
      .split(/\s+/)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  /* =======================================================
     ROLE
  ======================================================= */
  const getRoleName = () => {
    if (!user?.role) {
      return "Viewer";
    }
    return user.role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };
  const getRoleEmoji = () => {
    const roles: Record<string, string> = {
      boss: "👑",
      owner: "👑",
      admin: "👔",
      manager: "📊",
      sales_rep: "💰",
      inventory: "📦",
      finance: "💳",
      delivery: "🚚",
      hr: "👥",
      viewer: "👤",
    };
    return (
      roles[user?.role || "viewer"] || "👤"
    );
  };
  /* =======================================================
     PERMISSIONS
  ======================================================= */
  const canCreate =
    !user?.role ||
    user.role === "boss" ||
    user.role === "owner" ||
    user.role === "admin" ||
    user.role === "manager" ||
    user.role === "sales_rep";
  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };
  /* =======================================================
     SEARCH
  ======================================================= */
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      return;
    }
    setSearchQuery("");
    setSearchOpen(false);
    closeAllMenus();
    router.push(
      `/search?q=${encodeURIComponent(query)}`
    );
  };
  /* =======================================================
     LOGOUT (Just redirects to home)
  ======================================================= */
  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }
    setLoggingOut(true);
    closeAllMenus();
    // Just redirect to home page (no Supabase)
    window.location.href = "/";
    setLoggingOut(false);
  };
  /* =======================================================
     NOTIFICATIONS
  ======================================================= */
  const unreadCount = notifications.filter(
    (notification) =>
      notification.unread
  ).length;
  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };
  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-16
        w-full
        border-b
        border-slate-200
        bg-white
        text-slate-900
        shadow-sm
        transition-colors
        duration-200
        dark:border-slate-800
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          items-center
          gap-2
          px-3
          sm:px-4
          lg:px-6
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          {/* MOBILE MENU */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="
              h-9
              w-9
              shrink-0
              md:hidden
              text-slate-600
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label={
              isMenuOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          {/* LOGO */}
          <button
            type="button"
            onClick={() =>
              navigateTo("/dashboard")
            }
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-lg
              px-1
              transition-opacity
              hover:opacity-80
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                shadow-md
                shadow-blue-500/25
              "
            >
              <Sparkles
                className="
                  h-4
                  w-4
                  text-white
                "
              />
            </div>
            <span
              className="
                hidden
                text-lg
                font-bold
                sm:block
              "
            >
              BizHub
            </span>
          </button>
          {/* DESKTOP NAV */}
          <nav
            className="
              ml-2
              hidden
              items-center
              gap-0.5
              xl:flex
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAllMenus}
                >
                  <Button
                    type="button"
                    variant={
                      active
                        ? "default"
                        : "ghost"
                    }
                    size="sm"
                    className={`
                      h-9
                      whitespace-nowrap
                      ${
                        active
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }
                    `}
                  >
                    <Icon className="mr-1.5 h-3.5 w-3.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        {/* =================================================
            SEARCH
        ================================================= */}
        <div
          className="
            hidden
            min-w-0
            flex-1
            justify-center
            px-2
            lg:flex
          "
        >
          <form
            onSubmit={handleSearch}
            className="
              relative
              w-full
              max-w-md
            "
          >
            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
              "
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search..."
              className="
                h-9
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                py-2
                pl-9
                pr-4
                text-sm
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />
          </form>
        </div>
        {/* =================================================
            RIGHT CONTROLS
        ================================================= */}
        <div
          className="
            ml-auto
            flex
            shrink-0
            items-center
            gap-1
          "
        >
          {/* MOBILE SEARCH */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setSearchOpen(
                (current) => !current
              )
            }
            className="
              h-9
              w-9
              lg:hidden
              text-slate-600
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label="Search"
          >
            {searchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
          {/* DARK MODE */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="
              h-9
              w-9
              shrink-0
              text-slate-600
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {/* NEW */}
          {canCreate && (
            <div
              ref={quickActionsRef}
              className="
                relative
                hidden
                sm:block
              "
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuickActionsOpen(
                    (current) => !current
                  );
                  setProfileOpen(false);
                  setNotificationsOpen(false);
                }}
                className="
                  h-9
                  gap-1
                  whitespace-nowrap
                  bg-blue-50
                  px-3
                  text-blue-700
                  hover:bg-blue-100
                  dark:bg-blue-950/50
                  dark:text-blue-300
                  dark:hover:bg-blue-900/50
                "
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">
                  New
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
              {quickActionsOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-[60]
                    mt-2
                    w-64
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                    dark:border-slate-700
                    dark:bg-slate-900
                  "
                >
                  <div
                    className="
                      border-b
                      border-slate-200
                      p-3
                      dark:border-slate-700
                    "
                  >
                    <p className="text-sm font-semibold">
                      Quick Actions
                    </p>
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Start something new
                    </p>
                  </div>
                  <div className="p-2">
                    {quickActions.map(
                      (action) => {
                        const Icon =
                          action.icon;
                        return (
                          <Link
                            key={action.href}
                            href={action.href}
                            onClick={
                              closeAllMenus
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-lg
                              p-3
                              hover:bg-slate-50
                              dark:hover:bg-slate-800
                            "
                          >
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-950
                                dark:text-blue-400
                              "
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {action.label}
                              </p>
                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                  dark:text-slate-400
                                "
                              >
                                {
                                  action.description
                                }
                              </p>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* NOTIFICATIONS */}
          <div
            ref={notificationRef}
            className="relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setNotificationsOpen(
                  (current) => !current
                );
                setProfileOpen(false);
                setQuickActionsOpen(false);
              }}
              className="
                relative
                h-9
                w-9
                shrink-0
                text-slate-600
                hover:bg-slate-100
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[9px]
                    font-bold
                    text-white
                  "
                >
                  {unreadCount}
                </span>
              )}
            </Button>
            {notificationsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-[60]
                  mt-2
                  w-80
                  max-w-[calc(100vw-24px)]
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    p-4
                    dark:border-slate-700
                  "
                >
                  <div>
                    <p className="text-sm font-semibold">
                      Notifications
                    </p>
                    <p
                      className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Recent activity
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="
                        text-xs
                        font-medium
                        text-blue-600
                        hover:underline
                        dark:text-blue-400
                      "
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div
                  className="
                    max-h-80
                    overflow-y-auto
                    p-2
                  "
                >
                  {notifications.map(
                    (notification) => {
                      const Icon =
                        notification.type ===
                        "warning"
                          ? AlertCircle
                          : notification.type ===
                            "success"
                          ? Check
                          : Clock;
                      return (
                        <button
                          key={
                            notification.id
                          }
                          type="button"
                          className="
                            flex
                            w-full
                            gap-3
                            rounded-lg
                            p-3
                            text-left
                            hover:bg-slate-50
                            dark:hover:bg-slate-800
                          "
                        >
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-blue-50
                              text-blue-600
                              dark:bg-blue-950
                              dark:text-blue-400
                            "
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                              {
                                notification.title
                              }
                            </p>
                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {
                                notification.description
                              }
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                              {
                                notification.time
                              }
                            </p>
                          </div>
                          {notification.unread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
                <div
                  className="
                    border-t
                    border-slate-200
                    p-2
                    dark:border-slate-700
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        "/notifications"
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      p-2
                      text-center
                      text-xs
                      font-medium
                      text-blue-600
                      hover:bg-blue-50
                      dark:text-blue-400
                      dark:hover:bg-blue-950/40
                    "
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* PROFILE */}
          <div
            ref={profileRef}
            className="relative"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setProfileOpen(
                  (current) => !current
                );
                setNotificationsOpen(false);
                setQuickActionsOpen(false);
              }}
              className="
                h-9
                gap-2
                px-1.5
                hover:bg-slate-100
                dark:hover:bg-slate-800
                sm:px-2
                md:px-3
              "
              aria-label="Open profile"
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-blue-600
                  to-indigo-600
                  text-sm
                  font-medium
                  text-white
                  shadow-md
                "
              >
                {getInitials()}
              </div>
              <div className="hidden text-left xl:block">
                <p className="max-w-[100px] truncate text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p
                  className="
                    mt-1
                    flex
                    items-center
                    gap-1
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {getRoleEmoji()}
                  {getRoleName()}
                </p>
              </div>
              <ChevronDown
                className="
                  hidden
                  h-4
                  w-4
                  text-slate-400
                  xl:block
                "
              />
            </Button>
            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-[60]
                  mt-2
                  w-64
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    border-b
                    border-slate-200
                    p-4
                    dark:border-slate-700
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-lg
                        font-medium
                        text-white
                      "
                    >
                      {getInitials()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {user?.name || "User"}
                      </p>
                      <p
                        className="
                          truncate
                          text-xs
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {user?.email ||
                          "user@example.com"}
                      </p>
                      <span
                        className="
                          mt-1
                          inline-flex
                          items-center
                          rounded-full
                          bg-slate-100
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium
                          text-slate-700
                          dark:bg-slate-800
                          dark:text-slate-300
                        "
                      >
                        {getRoleEmoji()}{" "}
                        {getRoleName()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo("/profile")
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      p-2.5
                      text-left
                      text-sm
                      text-slate-700
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo("/settings")
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      p-2.5
                      text-left
                      text-sm
                      text-slate-700
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo("/help")
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      p-2.5
                      text-left
                      text-sm
                      text-slate-700
                      hover:bg-slate-50
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>
                  <div
                    className="
                      my-2
                      border-t
                      border-slate-200
                      dark:border-slate-700
                    "
                  />
                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      p-2.5
                      text-left
                      text-sm
                      text-red-600
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      dark:text-red-400
                      dark:hover:bg-red-950/30
                    "
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {loggingOut
                      ? "Signing out..."
                      : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* =====================================================
          MOBILE SEARCH PANEL
      ===================================================== */}
      {searchOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-16
            z-40
            border-b
            border-slate-200
            bg-white
            p-3
            shadow-lg
            dark:border-slate-800
            dark:bg-slate-950
            lg:hidden
          "
        >
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search orders, products, customers..."
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  py-2
                  pl-9
                  pr-3
                  text-sm
                  text-slate-900
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              />
            </div>
            <Button
              type="submit"
              className="
                h-10
                bg-blue-600
                text-white
                hover:bg-blue-700
              "
            >
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
export default Header;