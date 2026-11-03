// ===== PHANTOM AWARDS SETTINGS =====
// This is the ONLY file you need to edit. index.html, admin.html and overlay.html all read it.
//
// SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY: Supabase > Project Settings > API Keys.
// The publishable key (sb_publishable_...) is meant to be public.
// NEVER paste the secret key (sb_secret_...) or the old service_role key here. The pages refuse to run if you do.
window.PA_CONFIG = {
  SUPABASE_URL: "https://bgklmhlffnhstxogvnln.supabase.co/rest/v1/",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_bQYbN_cq18A5FacHNGg7KA_Lwhj7z2J",



  CHANNEL_URL: "https://www.youtube.com/@ImDePhantom",
  DISCORD_URL: "YOUR_DISCORD_INVITE_URL",        // leave as is to hide the Discord link

  // Your personal picks, shown as a "Phantom's Pick" badge once results are revealed.
  // Example: "Game of the Year": "Crimson Desert",
  PICKS: {
  },

  // Admin page: sign out automatically after this many minutes without activity.
  ADMIN_IDLE_MINUTES: 30
};
