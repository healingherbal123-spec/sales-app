const handleLogout = async () => {
  try {
    const supabase = createClient();

    setIsProfileOpen(false);

    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    // Remove any old local login data
    localStorage.removeItem("dashboard_user");

    // Go to login
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};