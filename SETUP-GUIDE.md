# Phantom Awards 2026: Setup Guide

The website runs on GitHub Pages. Votes are stored in Supabase. Fans sign in with Google.

## Files

| File | What it is |
|---|---|
| `index.html` | Public voting site |
| `admin.html` | Your private dashboard (2-step verification required) |
| `overlay.html` | OBS browser source for revealing winners on stream |
| `privacy.html`, `terms.html` | Legal pages (English + Bahasa Malaysia) |
| `config.js` | **The only file you edit:** Supabase keys, channel links, Phantom's Picks |
| `css/`, `js/`, `assets/` | Styles, scripts, logo and share image (no need to edit) |
| `supabase-setup.sql` | Database setup. Run it in Supabase. Safe to run again. |

---

## 1. Supabase

1. Create a project at https://supabase.com (region close to your fans, e.g. Singapore).
2. **Authentication → Sign In / Providers:** turn **Google** on (Client ID and Secret from Google Cloud), turn **Allow anonymous sign-ins** off.
3. **Authentication → Multi-Factor:** make sure **TOTP (authenticator app)** is enabled. It is on by default.
4. **Authentication → Users → Add user:** create your admin account (your email and a strong password, tick **Auto Confirm User**).
5. Put that same email in `supabase-setup.sql` (`insert into public.admins …`), then paste the whole file into **SQL Editor** and press **Run**.
6. **Authentication → URL Configuration:** add `https://jvn1604.github.io/Phantom-Awards/**` as a redirect URL.

## 2. Keys

Open `config.js` and paste your **Project URL** and **Publishable key** (`sb_publishable_…`), from **Project Settings → API Keys**:

```js
SUPABASE_URL: "https://xxxxxxxx.supabase.co",
SUPABASE_PUBLISHABLE_KEY: "sb_publishable_xxxxxxxx",
```

The publishable key is meant to be public. **Never** paste the secret key (`sb_secret_…`) or the `service_role` key. The pages refuse to run if you do.

Also in `config.js`: `DISCORD_URL`, `PICKS` (your Phantom's Pick per category, names must match exactly) and `ADMIN_IDLE_MINUTES`.

## 3. GitHub Pages

Settings → Pages → Deploy from branch `main`, folder `/ (root)`. Upload/commit every file except the `.sql` and guides if you prefer to keep those private.

## 4. First admin sign-in (2-step verification)

1. Open `admin.html` and sign in with your admin email and password.
2. The first time, a QR code appears. Scan it with an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy…) and type the 6-digit code.
3. From then on, every admin sign-in asks for the code from that app.
4. **Lost your phone?** In Supabase: **Authentication → Users →** your user **→ Multi-factor → delete the factor**, then sign in again to set up a new one.

The admin page signs you out after 30 minutes without activity (change `ADMIN_IDLE_MINUTES` in `config.js`).

## 5. Test before you share

1. Preview without Supabase: `index.html?demo=open` (voting) and `index.html?demo` (results + live reveal).
2. Sign in with Google on the real site, accept the policy, vote in one category.
3. In the admin page: Overview → **Import default list** (first time only), then check that your vote appears.
4. Settings → **Reveal results now**, check the live reveal, then set the real dates again.
5. Moderation → delete all test votes before you share the link.

## Security notes

- Database rules (row-level security) protect the data, not the website code. Nobody can read other people's votes or emails from the public site.
- Admin rights need **both** your admin account **and** a 2-step verified session. This is enforced in the database (`is_admin()`), so it cannot be bypassed from the browser.
- Each page has a Content Security Policy that only allows scripts from this site and the pinned Supabase/Chart.js versions.
- If you move to a different Supabase project, nothing else changes: the policy already allows any `*.supabase.co` project.
- Turn on 2-step verification for your Google, GitHub and Supabase accounts too.

## Troubleshooting

| You see | Do this |
|---|---|
| "Paste your Supabase … into config.js" | Keys missing or still `YOUR_…` in `config.js` |
| "Something went wrong" page | Supabase unreachable or paused (free projects pause after a week idle: open the dashboard) |
| Admin: "Database not set up yet" | Run the latest `supabase-setup.sql` again |
| Admin: "This account is not an admin" | Email in the SQL must equal your admin login email |
| Admin: "Could not start set-up" | Enable TOTP in Authentication → Multi-Factor |
| Vote rejected | Sign out and in again with Google, accept the policy |
| Old version showing | Hard refresh (Ctrl+Shift+R), wait 1–2 minutes after pushing |
