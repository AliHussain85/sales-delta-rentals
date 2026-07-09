# sales-delta-rentals

Sales dashboard for Delta Rentals Dubai — React, Tailwind, and Supabase Auth.

## Run locally

```bash
cd dashboard
npm install
npm run dev
```

Open **http://localhost:5173**

## Pages (native React)

| Route | Component | Description |
|-------|-----------|-------------|
| `/daily-report` | `DailyReportPage.tsx` | Inquiry report, date filter, CSV & PNG export |
| `/close-deal` | `CloseDealPage.tsx` | WhatsApp lead matching and deal closing |

## Supabase Auth

1. Create a user under **Authentication → Users** in Supabase
2. Enable the **Email** provider
3. In Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://sales.deltarentalsdubai.com`
   - Redirect URLs: `https://sales.deltarentalsdubai.com/**`

Supabase credentials are configured in `dashboard/src/lib/supabase.ts`.

## Deploy on Netlify

Connect the GitHub repo — Netlify reads `netlify.toml` automatically. No environment variables required.

App URL: **`https://sales.deltarentalsdubai.com/`**
