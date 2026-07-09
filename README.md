# sales-delta-rentals

Sales dashboard for Delta Rentals Dubai — React, Tailwind, and Supabase Auth.

## Run locally

```bash
cd dashboard
cp .env.example .env   # if needed
npm install
npm run dev
```

Open **http://localhost:5173**

## Pages (native React)

| Route | Component | Description |
|-------|-----------|-------------|
| `/daily-report` | `DailyReportPage.tsx` | Inquiry report, date filter, CSV & PNG export |
| `/close-deal` | `CloseDealPage.tsx` | WhatsApp lead matching and deal closing |

Both pages talk to Supabase directly from React — no iframes, no HTML/PHP files.

## Add a new page

1. Create `dashboard/src/pages/YourPage.tsx`
2. Add a route in `dashboard/src/App.tsx`
3. Register it in `dashboard/src/config/navigation.ts`

## Supabase Auth

1. Create a user under **Authentication → Users** in Supabase
2. Enable the **Email** provider
3. Set credentials in `dashboard/.env` (local) or Netlify env vars (production):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. In Supabase → **Authentication → URL Configuration**, add your Netlify site URL:
   - Site URL: `https://your-site.netlify.app` (or custom domain)
   - Redirect URLs: `https://your-site.netlify.app/**`

## Deploy on Netlify

Connect the GitHub repo — Netlify reads `netlify.toml` at the repo root automatically:

| Setting | Value |
|---------|-------|
| Base directory | `dashboard` |
| Build command | `npm run build` |
| Publish directory | `dashboard/dist` |

**Environment variables** (Netlify → Site settings → Environment variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then trigger a deploy. Your app lives at **`https://your-domain.com/`** (root).

## Manual build

```bash
cd dashboard
npm run build
```

Output is in `dashboard/dist/`.
