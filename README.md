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
3. Set credentials in `dashboard/.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Production

```bash
cd dashboard
npm run build
```

Copy everything from `dashboard/dist/` into your site **web root** (e.g. XAMPP htdocs for `sales.deltarentalsdubai.com`).

The build includes `.htaccess` for Apache SPA routing so routes like `/daily-report` work on refresh.

App URL: **`https://your-domain.com/`** (root, not `/dashboard`).
