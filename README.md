# PipsAngel web app

Next.js 16 app for pipsangel.com: the public marketing site, the customer dashboard and the staff admin. Data comes from the Django API in `pipsangel-landing-backend`.

## Run locally

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at your API
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Unit tests in `app/lib/*.test.ts` |

## Where things live

| Area | Location |
| --- | --- |
| Marketing pages | `app/(site)/` |
| Shared marketing sections | `app/components/site/` |
| Header, footer, support widget | `app/components/` |
| FAQ answers | `app/lib/faqContent.ts` |
| Plans, comparison, billing answers | `app/lib/pricing.ts` (prices and periods come from the API) |
| Terms and privacy defaults | `app/lib/legal.ts` |
| Palette and type tokens | `app/globals.css` (`@theme`) and `app/layout.tsx` |
| Customer dashboard | `app/(dashboard)/` |
| Staff admin | `app/(management)/admin/` |

## Content the site reads from the CMS

Edit these in the admin under **Site Config**. Blank fields are hidden on the site, never shown as placeholders.

- Support email, support hours, usual reply time, WhatsApp and Telegram links
- Legal company name, registration number, registered address, governing law
- Team members (shown on About)
- Verified track record URL and provider (shown on Results and the home page)
- IC Markets account link and referral disclosure

Performance figures only appear after staff tick **Publish** under **Public track record**. They are always calculated from published trades.

Legacy CMS values (the old "PipAngel" spelling, the pipangel.com domain and mailbox, signals-era copy) are repaired at render time by `app/lib/brand.ts` and `app/lib/defaultSiteConfig.ts`. Run `python manage.py fix_landing_content` on the API to fix them at the source.

## Analytics

GA4 loads with Consent Mode v2 defaults set to denied; CookieHub callbacks grant analytics or marketing storage. Events sent from the app (`app/lib/analytics.ts`):

| Event | When |
| --- | --- |
| `cta_click` | A "Start free trial" link is clicked (with `location`) |
| `sign_up` | An account is created (with `plan`) |
| `generate_lead` | A message is sent from the contact page or support widget |
| `support_open`, `contact_channel` | The support widget opens, or a chat channel is clicked |
| `broker_submitted`, `broker_connected` | MT5 details are submitted, and the account first verifies |
| `begin_checkout`, `purchase` | PayPal checkout starts and completes (with value) |

Campaign parameters (`utm_*`, `gclid`, `fbclid` and others), the landing page and the referrer are captured on arrival and sent with signups and messages.

## Browser check against a deployment

```bash
E2E_BASE_URL=https://pipsangel.com \
E2E_EMAIL=... E2E_PASSWORD=... \
E2E_EXPECT_BUILD=1.1.0+2026.10.06-news-index \
node scripts/browser-dashboard-test.mjs
```

Use a dedicated test account. The expected build label is reported by `/api/version`.
