# CargoDev API integration (FTJ website)

Status: planning document. No application code exists for this yet.
Audience: developers building the FTJ website.

## 1. Purpose, scope and what the website must never do

The website shows FTJ's published vehicle stock and lets visitors send an enquiry. It does this through the **public** CargoDev API only, under `/api/public`, with no login.

**Source of truth:** the API owner's contract, copied into this repo at [doc/website-integration.md](../doc/website-integration.md). Note the folder is `doc/`, not `docs/`; this document lives in `docs/`. Consider moving the contract next to this file so there is one folder.
**Contract version this document was written against:** 1.0.0 (2026-10-29). If the contract changes, re-read it and update this file. Breaking changes are announced 30 days ahead; new response keys can appear at any time (minor version), so **ignore unknown keys**.

Where this document says "per the contract" the detail comes from that file. Anything not in the contract is marked `TO CONFIRM (API contract)`.

The website must never:

- call `/api/v1` (staff API) or `/api/customer/v1` (customer API);
- send credentials: no `Authorization` header, cookies or `credentials: "include"`;
- keep or log enquiry personal data (name, email, phone, message) anywhere;
- put any secret in website code (only the public Turnstile site key is allowed in the browser);
- render `description`, `alt` or any API text as HTML;
- show a price without its currency, or show `0` for a `null` price;
- branch on error message text (branch on status and `code`);
- retry a 429 or failed Turnstile check in a tight loop.

Note on error codes: the brief lists VALIDATION, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, CONFLICT, INTERNAL. For `/api/public` the contract only produces `VALIDATION` (400), `NOT_FOUND` (404), `RATE_LIMITED` (429) and `INTERNAL` (500). There is no 401, 403, 409, 413 or 415 on these routes. Handle unknown codes generically anyway.

## 2. Environments and configuration

Variable names are the website's own choice (the contract only says "keep it in one setting"). Suggested names:

| Variable | Exposed to browser? | Purpose |
|---|---|---|
| `CARGODEV_API_BASE_URL` | Yes (needed for browser enquiry POST), so name it `NEXT_PUBLIC_CARGODEV_API_BASE_URL` or equivalent | API origin; paths are appended as `/api/public/...` |
| `CARGODEV_IMAGE_HOST` | Build/config only | Image host, for the image allow-list and CSP |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes (public by design) | Turnstile widget key |
| `NEXT_PUBLIC_SITE_ORIGIN` | Yes | The website's own origin, for canonical URLs, sitemap and Open Graph. This must also be listed by the API owner in `PUBLIC_ALLOWED_ORIGINS` |

Rules:

- Placeholders only in this repo: `https://api.example.test`, `https://img.example.test`, `https://www.example.test`. Real hostnames come from the operator and live in the hosting provider's settings, not in git.
- **Staging vs production:** each has its own API base URL, image host, Turnstile site key and allowed origin. Staging must never point at production data, and the staging website origin must be in the staging API's allow-list. Every origin variant used (with/without `www`, preview URLs) must be listed exactly by the API owner; a preview-deploy URL that is not listed cannot post enquiries.
- Commit an `.env.example` with names and placeholder values only.
- API-side settings the website depends on (not set by the website): `PUBLIC_STOCK_ENABLED` (must be `true`, else every route returns 404), `PUBLIC_ALLOWED_ORIGINS`, `PUBLIC_STOCK_IMAGE_BASE_URL`, `TURNSTILE_SECRET`, `CLIENT_IP_SOURCE`.

## 3. Endpoints

All responses are JSON: `{ "data": ... }` on success, `{ "error": { "code", "message", "fieldErrors?" } }` on failure. Only these three routes exist under `/api/public`.

### 3.1 Stock list: `GET /api/public/stock`

**Query parameters** (all optional; unknown parameters are a 400; never send a parameter with an empty value, leave it out; do not repeat a parameter):

| Parameter | Type | Default | Limits |
|---|---|---|---|
| `page` | integer | 1 | 1 to 10000 |
| `pageSize` | integer | 12 | 1 to **24** (larger is a 400) |
| `make`, `model` | text | none | 1 to 60 chars, exact match, case-insensitive |
| `bodyType`, `fuel`, `transmission` | text | none | 1 to 40 chars, exact match, case-insensitive |
| `yearMin`, `yearMax` | integer | none | 1950 to 2100 |
| `priceMin`, `priceMax` | integer (whole LKR) | none | 0 to 2000000000 |
| `mileageMax` | integer (km) | none | 0 to 5000000 |
| `q` | text | none | cut to 100 chars; matches `make` or `model` only; `%` `_` `\` are literal; blank means no search |
| `sort` | `newest` \| `priceAsc` \| `priceDesc` \| `yearDesc` \| `yearAsc` \| `mileageAsc` | `newest` | other values are a 400 |

Filters combine with AND. Unpriced listings never match price filters.

**Response 200** (copied from the contract; fake values):

```json
{
  "data": {
    "rows": [
      {
        "slug": "example-make-example-model-2020-a1b2c3",
        "make": "Example Make",
        "model": "Example Model",
        "year": 2020,
        "price": { "amount": 8500000, "currency": "LKR" },
        "mileageKm": 42000,
        "bodyType": "Sedan",
        "fuel": "Petrol",
        "transmission": "Automatic",
        "colour": "White",
        "publishedAt": "2026-01-15T09:30:00.000Z",
        "image": { "url": "https://img.example.test/stock/aaaaaaaaaaaaaaaa/11111111-1111-1111-1111-111111111111.jpg", "alt": "Front view" }
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 12
  }
}
```

- Card keys (always present, missing value is `null`): `slug`, `make`, `model` (never null), `year`, `price`, `mileageKm`, `bodyType`, `fuel`, `transmission`, `colour`, `publishedAt`, `image`.
- Pagination: more pages exist when `page * pageSize < total`; page count is `ceil(total / pageSize)`. A page past the end is 200 with `rows: []`.
- **Errors:** 400 `VALIDATION` with `fieldErrors` keyed by query parameter; 404 if the feature flag is off; 429; 500.
- No endpoint lists the filter values (makes, fuels, ...). Build filter lists from loaded stock, or ask FTJ for an agreed vocabulary (open question 11.8).

### 3.2 Stock detail: `GET /api/public/stock/:slug`

No query parameters. Response 200 has the 12 card keys plus:

- `description`: string or `null`, plain text up to 5000 chars, line breaks are `\n`.
- `images`: array of `{ url, alt }` in display order, possibly empty. `image` equals `images[0]` or `null`.

Example (abridged to the added keys; the card keys are as in 3.1):

```json
{
  "data": {
    "slug": "example-make-example-model-2020-a1b2c3",
    "description": "A clean example with a full service history.",
    "images": [
      { "url": "https://img.example.test/stock/aaaaaaaaaaaaaaaa/11111111-1111-1111-1111-111111111111.jpg", "alt": "Front view" },
      { "url": "https://img.example.test/stock/aaaaaaaaaaaaaaaa/22222222-2222-2222-2222-222222222222.jpg", "alt": null }
    ]
  }
}
```

**Errors:** 404 `NOT_FOUND` (`"Stock vehicle not found."`) for an unknown, malformed, draft, sold or deleted slug (all identical); 429; 500. A malformed slug is a 404, not a 400.

### 3.3 Enquiry: `POST /api/public/enquiries`

`Content-Type: application/json`, body at most 8192 bytes. The body is strict: an unknown field is a 400. **Omit optional fields that are blank; `""` is a 400.**

| Field | Required | Rules |
|---|---|---|
| `name` | yes | trimmed, 1 to 100 |
| `email` | yes | trimmed, valid address, max 150 |
| `phone` | no | 5 to 40 chars, digits, spaces and `+ ( ) - .` only |
| `message` | yes | plain text, trimmed, 1 to 2000; control characters other than line breaks and tabs rejected |
| `stockSlug` | no | max 120, slug format; if not a currently published listing it is silently dropped |
| `website` | no | the honeypot, max 300 |
| `turnstileToken` | see section 7 | 1 to 2048 |

**Response: always `202`** for a valid request:

```json
{ "data": { "accepted": true } }
```

202 is returned when the enquiry is stored, when it is dropped as a bot, and when the `stockSlug` was dropped. The UI cannot and must not tell these apart.

**Errors:**

- 400 `VALIDATION` with `fieldErrors` keyed by body field (show each message beside its field).
- 400 with an **empty** `fieldErrors: {}` for an unknown field. The form must not assume it names a field.
- 400 `"Invalid request."` (no `fieldErrors`) for malformed JSON, wrong content type or body over 8 KB.
- 400 `"Verification failed. Please try again."` (no `fieldErrors`) for a failed Turnstile check.
- 429 `RATE_LIMITED`, with `Retry-After` (seconds), `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- 500 `INTERNAL`.

Rate limits: per IP 5 per minute and 10 per hour; per email 3 per hour. Honeypot hits and rejected requests count too.

Staff see the enquiry in their inbox and get a notification. **The API sends the visitor no confirmation email**, and the website cannot look an enquiry up afterwards, so the success text must not promise an email.

## 4. Data fetching strategy

Stock is read **server-side** so pages are real HTML for search engines.

- **Revalidation:** use about 60 seconds (`revalidate: 60` or the framework equivalent) to match the API's `public, max-age=60`. Do not go longer: sold and unpublished vehicles are not announced, they simply vanish from API answers. Check the installed Next.js docs in `node_modules/next/dist/docs/` for the current caching API before coding; this repo's AGENTS.md warns that conventions differ from older versions.
- **Rate-limit budget:** server-side reads share one limit for the whole server (120 per minute per route). Caching is therefore required, not optional. Never fetch uncached on every request.
- **Timeouts:** abort each API call after about 5 seconds (suggested default, not from the contract).
- **Retry:** at most one retry for network errors, timeouts and 500s, after a short delay (about 300 ms). No retry for 400 or 404. For 429, do not retry immediately; use stale data or the fallback.
- **API down:** serve the last cached (stale) copy if the framework cache has one. Otherwise render the page shell with a friendly message ("Our stock list is temporarily unavailable. Please try again shortly, or contact us.") plus the contact details. Never a blank page or a raw error. The home page and static pages must not depend on the API being up.
- **Vanished vehicle:** a 404 on detail renders a "no longer available" page with HTTP status 404 and a link to the list. The cache can keep the vehicle for up to about a minute after it is removed; that is accepted.
- **Sitemap:** generated from the list (paging through all pages with `pageSize=24`), refreshed on the same revalidation window or a longer one (for example hourly). If the API is down, serve the previous sitemap rather than an empty one. `TO CONFIRM (API contract)`: there is no "all slugs" endpoint, so the sitemap needs one request per 24 vehicles; confirm this is acceptable against the 120-per-minute read limit for the stock size FTJ expects.
- Validate responses defensively: read only the keys needed, tolerate unknown keys, treat any `null` as "not provided".

## 5. Price display rules

- One function, one file (for example `formatPrice(price)`), used everywhere: cards, detail, structured data labels, Open Graph text.
- Input is `{ amount, currency } | null`. `amount` is a whole-number JSON number in rupees; never multiply, divide or round it.
- With a price: show the **currency label always**, for example `Rs. 8,500,000` or `LKR 8,500,000` (the exact style is a design choice, but "LKR" must be visible somewhere on the same line or in an adjacent label).
- `null`: show **"Ask for price"** (the contract's own example wording is "Contact us"; FTJ decides) and link to the enquiry form. Never `0`, never blank.
- No currency conversion, no exchange rates, no currency parameter.
- **Open question:** FTJ's buyers are mainly in Kenya, so LKR may confuse visitors. Because the API only provides LKR, any change (an extra "approx." conversion, or a different label) must happen inside the one formatting function. Do not scatter currency strings through components.
- Structured data price (section 8) is emitted only when `price` is not null.
- The price filter parameters are in LKR as well; label the filter inputs accordingly.

## 6. Images

- Image `url` is absolute `https` on the public image host: `<image host>/stock/<hash>/<id>.<jpg|png|webp>`. It is served from storage, not the API: no CORS, rate limit or cookies.
- Use `images[]` in the given order. `images[0]` is the cover and equals `image`.
- `alt` is staff-typed or `null`. Fall back to a generated text such as `"{year} {make} {model}"`, plus the position for galleries ("photo 2 of 5"). Alt text is plain text.
- **Allow-list the image host** in two places: the website's image configuration (the Next.js remote-image allow-list; check the installed docs for the current setting name) and the Content-Security-Policy `img-src`. Use the host from `CARGODEV_IMAGE_HOST`, not a hard-coded value.
- There are no thumbnails or size variants: one original per image, up to 8 MB. Therefore either use the framework image optimiser (if the host plan allows) with proper `sizes`, or rely on CSS sizing and accept large downloads. Always give explicit width/height or an aspect-ratio box to avoid layout shift. `TO CONFIRM (API contract)`: image pixel dimensions are not provided; confirm whether the API can add width/height, or whether an image CDN will sit in front.
- Lazy-load everything except the first visible image on a page (the detail page cover and the first row of cards should load eagerly with priority).
- Placeholder when `image` is `null` or `images` is `[]` (this happens for every vehicle if the API has no image host configured): show a neutral branded placeholder with text alt. Also fall back to the placeholder if an image fails to load.
- Immutable URLs: an image address never changes and its file is never replaced, so long browser caching is safe.

## 7. Enquiry form

**Fields and client-side validation** (mirror the server, but the server stays the authority):

| Field | Client rule |
|---|---|
| Name | required, 1 to 100 after trimming |
| Email | required, valid format, max 150 |
| Phone | optional; if filled, 5 to 40, only digits, spaces and `+ ( ) - .` |
| Message | required, 1 to 2000, plain text |
| Vehicle | optional hidden value `stockSlug`, set when the form is opened from a vehicle page |
| Honeypot | see below |
| Turnstile | see below |

Before sending: trim, **drop blank optional fields entirely** (never send `""`), keep the total body well under 8 KB.

**Where it is submitted from (important design point).** The API rate-limits by client IP.

- Submit enquiries **from the visitor's browser straight to the API** (CORS allow-list), so each visitor gets their own limits. This depends on the API owner's `CLIENT_IP_SOURCE` matching the hosting in front of the API.
- If the website's server made the call, the API would see the website server's IP: **all visitors would share 5 enquiries per minute and 10 per hour in total**, and one bad actor could block everyone. The contract says forwarding headers added by the website are ignored or untrusted, and not to try forwarding addresses.
- Reading stock stays server-side (cached).
- **Open question for the API owner:** is there a supported trusted client-IP forwarding mechanism for server-side calls? Until confirmed, use browser-direct. The consequence is that the API base URL and website origin are public, and the browser fetch must send only `Content-Type: application/json`: no extra headers, no credentials.

**Honeypot.** A field named exactly `website`. Hide it with CSS (off-screen, not `display:none` alone and not `type="hidden"`), `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"` on its wrapper, and a label that screen-reader users never meet. Omit it or send `""` when empty. If a bot fills it, the API still returns 202, so no special UI.

**Turnstile.** Render the widget with the public site key and send its token as `turnstileToken`. A token works once: after a failed submit, reset the widget and get a new token. If `TURNSTILE_SECRET` is set on the API the token is required; if unset it is ignored. The website cannot detect the mode, so always render the widget. `TO CONFIRM (API contract)`: which mode production uses (ask the operator). Keep the Turnstile script load tied to the form (not on every page) and see section 9.

**States**

- Idle, submitting (button disabled, `aria-busy`), success, field errors, general error, rate limited.
- **Success (202):** one generic message, for example "Thank you. We have received your enquiry and will be in touch." Same text always. Clear the form from memory.
- **400 with `fieldErrors`:** show each message beside its field and move focus to the first invalid field. Messages partly come from a library, so prefer your own friendly text keyed by field, and fall back to the API message.
- **400 with empty or missing `fieldErrors`, or "Verification failed":** general message ("Something went wrong with that submission. Please try again."), reset Turnstile.
- **429:** read `Retry-After`, disable submit for that time, say "Too many attempts. Please try again in N minutes." Do not auto-retry.
- **500 / network failure / timeout:** "We could not send your enquiry. Please try again, or contact us at <contact details>." Keep the typed text so the visitor does not lose it. No automatic retry that could double-send.
- Prevent double submit (disable while pending).

**Accessibility:** visible labels tied to inputs, required marked in text, error summary with `role="alert"` or `aria-live`, `aria-invalid` and `aria-describedby` on invalid fields, keyboard operable including the Turnstile widget, sufficient contrast, success message announced politely.

**Privacy:** a short notice beside the form saying what is collected (name, email, phone, message), why (to answer the enquiry), and a link to the privacy policy page. The policy text must come from FTJ (open question 11.5). Do not store, log or send to analytics any form value; no form values in URLs; do not log request or response bodies of this call; error reporting must scrub them.

## 8. SEO

- Listing and detail pages are server-rendered with the data in the HTML.
- Canonical URL for a vehicle is built from the slug only, for example `<site origin>/inventory/<slug>` (final path is a design/routing decision). Slugs are stable and unique but treat them as opaque. Listing pages with filters: canonical to the unfiltered listing, or to the page itself for pagination; decide and keep consistent. Filtered or sorted combinations should not be indexed.
- `sitemap.xml` lists the static pages plus all vehicle URLs, refreshed per section 4. `robots.txt` allows crawling, points to the sitemap and must not block the image host.
- Structured data (JSON-LD) on the detail page, built from the API data: schema.org `Vehicle` (or `Car`) with `name`, `brand`/`manufacturer`, `model`, `vehicleModelDate` (year), `mileageFromOdometer` (km), `bodyType`, `fuelType`, `vehicleTransmission`, `color`, `image`, `description`, and an `Offer` with `price` and `priceCurrency: "LKR"`, **only when `price` is not null**. Omit any property whose value is `null`; never emit empty strings or `0`. The website path to the `Offer` `url` is the canonical URL. Offer `availability` can be `InStock` since only published vehicles appear. Escape the JSON properly when embedding it in the page (it is data, not HTML).
- Meta title: `"{year} {make} {model} for sale | FTJ"`; description: first ~155 characters of the plain-text `description`, or a generated sentence from the key fields when it is `null`. Titles for the listing are static or derived from active filters.
- Open Graph and Twitter: `og:title`, `og:description`, `og:url` (canonical), `og:type`, `og:image` = the cover image URL (absolute, from the image host).
- `description` is rendered as plain text: split on `\n` into paragraphs, let the framework escape it. Never `dangerouslySetInnerHTML` for API fields.
- Sold or removed vehicles return a real 404 status, so search engines drop them.

## 9. Security and privacy

- **No secrets in the website.** The only key in the browser is the Turnstile **site** key (public by design). `TURNSTILE_SECRET` lives only on the API.
- **CSP entries needed** (names, not real hosts): `connect-src` the API origin; `img-src` the image host; Turnstile needs `script-src` and `frame-src` for Cloudflare's challenge origin (`https://challenges.cloudflare.com`; verify against Cloudflare's current documentation when implementing) and `connect-src` for it if its docs require it. Keep the policy as tight as the framework allows and test it in staging.
- **CORS:** the API echoes only listed origins and never uses `*`. Only `GET, POST, OPTIONS` and the `Content-Type` header are allowed. Do not add custom headers.
- **No cookies** are needed for browsing stock or sending enquiries. The website should set none for these features; Turnstile may set its own, which the privacy text should acknowledge (`TO CONFIRM` with FTJ and Cloudflare terms).
- **Personal data:** held in memory only while the form is open; never in browser storage, cookies, URLs, analytics, error reports or server logs; the API is the system of record.
- **Third-party scripts:** only Turnstile is planned. Anything else (analytics, chat widgets, maps, tag managers) needs explicit approval first and must not receive form data.
- Server-side fetches use only the public base URL; no auth headers; never log full response bodies.
- Respect HTTPS only; never mix http image URLs (the contract guarantees https).

## 10. Testing

Contract tests run against **fake JSON fixtures** stored in this repo (derived from the examples in the contract, with fake values). Tests never call the real API. Use a mocked `fetch` or a local fake server.

Fixtures and cases:

| Case | Expectation |
|---|---|
| Empty list (`rows: []`, `total: 0`) | "No vehicles match" message, no error page |
| Full page of 24 items | all rendered, pagination from `total` / `pageSize` correct |
| Page past the end | empty state, not a crash |
| `price: null` | "Ask for price", no `Offer` in JSON-LD |
| `price` present | LKR label visible, `Offer.priceCurrency` is `LKR` |
| `image: null` / `images: []` | placeholder shown |
| `alt: null` | generated alt text |
| Unknown extra key in a row | ignored |
| `description: null` | page renders, meta description falls back |
| `description` with `<script>` text | shown as text, escaped |
| Detail 404 | 404 page with status 404 |
| 400 with `fieldErrors` (enquiry) | errors beside the right fields, focus on the first |
| 400 with `fieldErrors: {}` | general error |
| 400 `Verification failed` | general error, Turnstile reset |
| 429 with `Retry-After` | submit disabled for that time, message shown |
| 500 / network failure on enquiry | error shown, typed text kept |
| API timeout on list | one retry, then stale or friendly message |
| API down with no cache | friendly page, not blank |
| Honeypot filled (test of the form markup) | field is hidden and not focusable; body omits or empties it |
| Blank optional fields | not present in the request body |
| Body does not contain forbidden headers / credentials | assert request options |
| Formatting function | integer amounts, large amounts, `null` |

Also test: the fixture keys equal the key sets listed in the contract (so a contract change shows up), and that no code path references `/api/v1` or `/api/customer/v1` (a simple text search test).

## 11. Open questions

| # | Question | Who | Suggested default |
|---|---|---|---|
| 1 | Currency: LKR only, or show an approximate KES figure? | FTJ | Show LKR only, label always visible; one formatting function so it can change |
| 2 | Sold vehicles: vanish (404) or show "Sold" for a while? The API gives only 404/gone | FTJ, API owner | Accept 404 plus a link to similar vehicles |
| 3 | Languages: English only? | FTJ | English only, structured so text can be extracted later |
| 4 | Contact details (phone, WhatsApp, email, address, hours) | FTJ | Placeholders until provided; used on the fallback pages too |
| 5 | Privacy policy text and page URL | FTJ | A page must exist before launch; link from the form |
| 6 | Who maintains listings (staff inbox, publishing, photos)? | FTJ | FTJ staff via the CargoDev staff app |
| 7 | Client-IP forwarding: is there a trusted way to pass the visitor IP for server-side calls? | API owner | None assumed; browser-direct enquiries |
| 8 | Agreed vocabulary for make, body type, fuel, transmission (no list endpoint) | FTJ, API owner | Build filter lists from loaded stock |
| 9 | Turnstile mode in production (required or ignored) | API owner | Assume required; always render the widget |
| 10 | Does the API add image dimensions, or does an image CDN sit in front? | API owner | Use aspect-ratio boxes with CSS sizing |
| 11 | Is `www` and apex both used, and what are the preview/staging origins? | FTJ, operator | One canonical origin, others redirect to it; all listed in the allow-list |
| 12 | Expected stock size (sitemap request count vs read limit) | FTJ | Under a few hundred vehicles |

## 12. Launch readiness checklist

- [ ] Contract version re-checked against the API owner's latest.
- [ ] `PUBLIC_STOCK_ENABLED=true` on production; production website origin(s) in `PUBLIC_ALLOWED_ORIGINS`.
- [ ] Production env values set in the host (API URL, image host, site key, site origin); no secrets in git; `.env.example` committed.
- [ ] Stock list, detail, filters, sorting and pagination checked against staging data.
- [ ] Revalidation about 60 seconds confirmed; API-down fallback and 404 page checked.
- [ ] Price function covers `null`; LKR visible; currency decision recorded.
- [ ] Image host allowed in the image config and CSP; placeholder works; lazy loading and sizes set.
- [ ] Enquiry form: honeypot hidden and unfocusable, Turnstile works in production, all error states checked, 429 tested, success text generic, accessibility checked by keyboard and screen reader.
- [ ] Enquiry sent from the browser; CORS preflight verified from the real origin; confirmed `CLIENT_IP_SOURCE` with the API owner.
- [ ] A test enquiry arrived in the staff inbox (fake data), with and without a vehicle.
- [ ] Privacy policy page live and linked; no personal data logged or stored.
- [ ] CSP in place and no console errors; no unapproved third-party scripts.
- [ ] Sitemap, robots, canonical URLs, titles, descriptions, Open Graph and JSON-LD verified (validator run).
- [ ] Contract tests with fake fixtures pass in CI.
- [ ] No reference to `/api/v1` or `/api/customer/v1` anywhere.
- [ ] Contact details and FTJ-supplied copy replaced the placeholders.
- [ ] Monitoring or error reporting in place, with personal data scrubbed.

## Items marked `TO CONFIRM (API contract)`

1. Sitemap cost: no "all slugs" endpoint, one request per 24 vehicles; confirm this fits the 120-per-minute read limit (section 4).
2. Image pixel dimensions are not provided; confirm whether the API can add them or an image CDN will be used (section 6).
3. Turnstile mode in production: `TURNSTILE_SECRET` set or not (section 7).
4. Turnstile cookies and privacy wording; confirm with FTJ and Cloudflare's terms (section 9).

Other points to resolve with the API owner (from the open questions, not contract gaps): trusted client-IP forwarding for server-side calls, `CLIENT_IP_SOURCE` matching the hosting, and the filter-value vocabulary.
