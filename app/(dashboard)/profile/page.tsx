"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Save,
  Camera,
  ArrowLeft,
  CheckCircle2,
  Lock,
  LogOut,
  Trash2,
} from "lucide-react";

type UserData = {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  created_at?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("viewer");

  const [avatar, setAvatar] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // ============================================================
  // LOAD USER
  // ============================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("dashboard_user");

    if (!storedUser) return;

    try {
      const parsed: UserData = JSON.parse(storedUser);

      setUser(parsed);

      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setPhone(parsed.phone || "");
      setRole(parsed.role || "viewer");

      if (parsed.avatar) {
        setAvatar(parsed.avatar);
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  // ============================================================
  // INITIALS
  // ============================================================

  const getInitials = () => {
    if (!name.trim()) return "U";

    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ============================================================
  // FORMAT ROLE
  // ============================================================

  const formatRole = (value: string) => {
    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ============================================================
  // OPEN PHOTO PICKER
  // ============================================================

  const openPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // ============================================================
  // PHOTO UPLOAD
  // ============================================================

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    setUploadingPhoto(true);

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result as string;

      setAvatar(imageData);

      // Save immediately to localStorage
      try {
        const currentUser = user || {};

        const updatedUser = {
          ...currentUser,
          name,
          email,
          phone,
          role,
          avatar: imageData,
        };

        localStorage.setItem(
          "dashboard_user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
      } catch (error) {
        console.error("Unable to save profile photo:", error);

        alert(
          "The image could not be saved. Please try a smaller image."
        );
      }

      setUploadingPhoto(false);
    };

    reader.onerror = () => {
      setUploadingPhoto(false);

      alert("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same file again later
    event.target.value = "";
  };

  // ============================================================
  // REMOVE PHOTO
  // ============================================================

  const removePhoto = () => {
    const confirmed = window.confirm(
      "Remove your profile photo?"
    );

    if (!confirmed) return;

    setAvatar(null);

    try {
      const currentUser = user || {};

      const updatedUser = {
        ...currentUser,
        name,
        email,
        phone,
        role,
        avatar: "",
      };

      localStorage.setItem(
        "dashboard_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
    } catch (error) {
      console.error("Unable to remove profile photo:", error);
    }
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const updatedUser = {
        ...(user || {}),
        name,
        email,
        phone,
        role,
        avatar: avatar || "",
      };

      localStorage.setItem(
        "dashboard_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);

      alert("Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    localStorage.removeItem("dashboard_user");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Continue logout
    }

    router.push("/");
    router.refresh();
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/dashboard")}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold">
                My Profile
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your personal information and account
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================================================= */}
          {/* PROFILE CARD */}
          {/* ================================================= */}

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}
              <div className="relative">

                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white dark:border-slate-800"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
                    {getInitials()}
                  </div>
                )}

                {/* CAMERA BUTTON */}
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  disabled={uploadingPhoto}
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center transition disabled:opacity-50"
                  title="Change profile photo"
                >
                  {uploadingPhoto ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>

              </div>

              {/* PHOTO CONTROLS */}

              <div className="mt-4 flex items-center gap-2">

                <button
                  type="button"
                  onClick={openPhotoPicker}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {avatar ? "Change photo" : "Upload photo"}
                </button>

                {avatar && (
                  <>
                    <span className="text-slate-300">
                      •
                    </span>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </>
                )}

              </div>

              <h2 className="mt-4 text-xl font-bold">
                {name || "User"}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {email || "No email available"}
              </p>

              {/* ROLE */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Shield className="w-4 h-4" />
                {formatRole(role)}
              </div>

            </div>

            {/* ACCOUNT INFO */}

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Email
                  </p>

                  <p className="text-sm font-medium break-all">
                    {email || "Not provided"}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium">
                    {phone || "Not provided"}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Role
                  </p>

                  <p className="text-sm font-medium">
                    {formatRole(role)}
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* RIGHT SIDE */}
          {/* ================================================= */}

          <section className="lg:col-span-2 space-y-6">

            {/* PERSONAL INFORMATION */}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">

              <div className="p-6 border-b border-slate-200 dark:border-slate-800">

                <h2 className="font-semibold text-lg">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update your account information.
                </p>

              </div>

              <div className="p-6 space-y-5">

                {/* NAME */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>

                  <div className="relative">

                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="+234..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>

                {/* ROLE */}

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Account Role
                  </label>

                  <div className="relative">

                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                      type="text"
                      value={formatRole(role)}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                    />

                  </div>

                  <p className="text-xs text-slate-500 mt-1.5">
                    Your role is controlled by your administrator.
                  </p>

                </div>

              </div>

              {/* SAVE */}

              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">

                {saved ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile saved successfully
                  </div>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />

                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </div>

            {/* SECURITY */}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">

              <div className="p-6 border-b border-slate-200 dark:border-slate-800">

                <h2 className="font-semibold text-lg">
                  Security
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Manage your account security.
                </p>

              </div>

              <div className="p-6">

                <button
                  onClick={() =>
                    router.push("/settings")
                  }
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>

                    <div className="text-left">

                      <p className="font-medium text-sm">
                        Password & Security
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage your password and security settings
                      </p>

                    </div>

                  </div>

                  <span className="text-blue-600 dark:text-blue-400 text-sm">
                    Manage
                  </span>

                </button>

              </div>

            </div>

            {/* LOGOUT */}

            <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>

                  <h2 className="font-semibold text-red-600">
                    Sign out
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign out of your BizHub account on this device.
                  </p>

                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}