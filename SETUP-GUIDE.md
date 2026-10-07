# PHANTOM AWARDS 2026 – Setup Guide

You will upload 2 website files to GitHub and run 1 SQL file in Supabase.

Files:
- `index.html` – the voting website (public)
- `admin.html` – your private dashboard
- `supabase-setup.sql` – the database setup (run in Supabase, NOT uploaded to GitHub)

---

## PART A – Supabase (database)

**1. Create the project**
1. Go to https://supabase.com and sign in (GitHub login is fine).
2. Click **New project**. Pick your organization, name it `phantom-awards`, set a database password (save it somewhere), choose the region closest to your fans (e.g. Singapore), and click **Create new project**. Wait about 2 minutes.

**2. Turn on anonymous voting**
1. Left menu → **Authentication**.
2. Open **Sign In / Providers** (called "Providers" in some versions).
3. Find **Allow anonymous sign-ins** and switch it **ON**. Save.

**3. Create your admin account**
1. Left menu → **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter your email and a strong password. Tick **Auto Confirm User**. Click **Create user**.

**4. Run the database setup**
1. Open `supabase-setup.sql` in any text editor (Notepad is fine).
2. Find `YOUR_ADMIN_EMAIL` (near the bottom) and replace it with the exact email from step 3. Keep the quotes.
3. Optional: change the two dates near the top (`voting_ends` and `reveal_at`). You can also change them later from the admin page.
4. In Supabase, left menu → **SQL Editor → New query**. Paste the whole file. Click **Run**.
5. You should see "Success. No rows returned". If you see an error, copy the message and send it to me.

**5. Copy your two keys**
1. Left menu → **Project Settings → API** (or **API Keys**).
2. Copy the **Project URL** (looks like `https://abcdxyz.supabase.co`).
3. Copy the **anon public** key (or the **publishable** key, starts with `sb_publishable_`). Never copy the `service_role` / secret key.

---

## PART B – Put your keys in the files

Open **both** `index.html` and `admin.html` in a text editor and change the top lines:

```js
const SUPABASE_URL="https://abcdxyz.supabase.co";
const SUPABASE_ANON_KEY="your-anon-or-publishable-key";
```

In `index.html` only, also set:

```js
const DISCORD_URL="https://discord.gg/yourinvite";   // or leave as is to hide the link
```

Optional: your personal "Phantom's Pick" badges in `index.html`:

```js
const PICKS={
 "Game of the Year":"Crimson Desert",
 "Best Soulslike":"Nioh 3",
};
```
(The name must match a nominee exactly.)

**Edit nominees:** the list sits in `index.html` under `NOMINEES`. Replace every "Nominee A/B/C/D" and check the real games. Then **copy the same list into `admin.html`** (same place, marked with a comment). Do this BEFORE voting starts, and never rename a category after votes exist.

---

## PART C – GitHub Pages (website hosting)

1. Go to https://github.com and sign in.
2. Click **+ → New repository**. Name it e.g. `phantom-awards`. Set it to **Public**. Click **Create repository**.
3. Click **uploading an existing file**. Drag in `index.html` and `admin.html` only. Click **Commit changes**.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Click **Save**.
6. Wait 1–2 minutes. Your site is at:
   - Voting: `https://YOUR-USERNAME.github.io/phantom-awards/`
   - Admin: `https://YOUR-USERNAME.github.io/phantom-awards/admin.html`

(To update later: open the file on GitHub → pencil icon → edit → Commit, or upload the file again.)

---

## PART D – Test before you share

1. Open the voting site. You should see the purple logo page, a countdown and 46 tiles (no "Preview mode" message).
2. Open a category, pick a nominee, press **Vote**. You should see confetti and "Vote saved!".
3. Open `admin.html`, sign in with your admin email and password. You should see 1 voter, 1 vote and the charts.
4. In Supabase → **Table Editor → votes** you will see the row.
5. Test the reveal: on the admin page click **Reveal results now**, then open the voting site. A **Live reveal** button appears. When done, set the real reveal date again and click **Save dates**.
6. Delete your test votes: Supabase → **SQL Editor** → run `delete from votes;`

---

## PART E – Run the event

1. Share your voting link in your video description, community post and Discord.
2. Watch the numbers in `admin.html` (auto-refresh every 30 seconds). Use **Download CSV** any time.
3. At the reveal time, results unlock automatically. On stream, open the site and click **Live reveal** (press Space or click for the next winner, Esc to exit).

---

## Good to know
- **Free Supabase projects pause after 1 week with no activity.** Open the project dashboard before the event to wake it up.
- **Anonymous sign-ins are rate-limited per IP address.** If many people on one network (school, office) try at once, some may see an error. Ask them to retry later, or use Google/Discord login (ask me to add it).
- **One vote per browser, not per person.** Clearing browser data or using a private window allows another vote.
- The `anon` key is meant to be public. Security comes from the database rules in the SQL file.
- Never put the `service_role` key in any file.
- Keep `admin.html` private: do not share its link. Only your admin account can read data from it.

## Troubleshooting
| Problem | Fix |
|---|---|
| Page says "Preview mode" | Keys not pasted correctly in `index.html` (check quotes, no spaces) |
| "Could not connect to Supabase" | Anonymous sign-ins not enabled (Part A step 2) |
| Vote does nothing / error | SQL not run completely; run it again |
| Admin: "This account is not an admin" | The email in the SQL differs from your login email; fix it and run the SQL again |
| Admin: "Error … did you run the SQL" | Run the full SQL file again |
| Site shows old version | Hard refresh (Ctrl+Shift+R), wait 1–2 minutes after upload |
