# FTJ public website: build brief

Version 1.0 draft · 25 Oct 2026 · For: Viro
Related: `design/cargodev-final-system-design.md` (v1.2), `design/design-v3-existing-data.md`, `design/design-screens-index.md`, `design/ftj-website-design-images.md` (image index for this brief).

## 1. Summary

The FTJ website is a lead-generation site, not a shop. Visitors browse a small showroom of luxury cars and press **Inquire**. Every enquiry lands in the CargoDev shared Inbox, linked to the car. The site never shows prices. Staff control what appears from a separate **Website cars** area in CargoDev.

This brief collects the decisions already made, the pages, the differences between the client's design and our v3 mockups, a proposed data contract, a build order and the questions still open for FTJ. The images are listed in `design/ftj-website-design-images.md`; figure names below (for example `ftj-client-design-p06-inventory.png`) are the file names in the project.

Mockups 14 (inventory) and 15 (car detail) have not been uploaded to the project, so those pages are described from the client PDF and the notes only.

## 2. Decisions that apply to the website

| Topic | Decision | Source |
|---|---|---|
| Purpose | Lead generation and SEO. No e-commerce. Main action is Inquire. | Project instructions |
| Car data | A separate **Website cars** module, not the shipment vehicles. Flags: Published and Featured. | design-v3; design doc v1.2 section 7 |
| Price | Not shown anywhere and not stored for website cars. It is absent from the API, not just hidden. | design-v3 |
| Filters | Category, brand, transmission, fuel type. The price-range filter is removed. | design-v3 |
| Enquiries | Inquire creates a lead in the shared Inbox (channel Website, type Enquiry), linked to the website car. | Design doc v1.2 section 7, decision D10 |
| Backend | The Node backend owns the schema and the public API. The website (Next.js on Vercel) calls it server to server. | Decisions D1 and D12, section 3 |
| Abuse control | Rate limit and spam protection on the enquiry form. Cloudflare Turnstile is available. | Design doc sections 6 and 14 |
| Accounts | The customer app is sign-in only. Customers who need an account are sent to the website to create one. | Decided 19 Oct 2026. **Not yet in design doc v1.2: update it.** |
| Privacy page | Required for the App Store. Must cover presence tracking. | Design doc section 15 |
| App links | Links to download the customer app. | Project instructions, section G |

## 3. Pages and routes

| Page | Route | Client design image | v3 mockup | Data and API (proposed) |
|---|---|---|---|---|
| Home | `/` | `ftj-client-design-p02-home-landing.png` | `13-site-home.png` | Featured website cars |
| Menu | overlay | `ftj-client-design-p04-menu-overlay.png` | none | Static links |
| Inventory | `/inventory` | `ftj-client-design-p06-inventory.png` | 14 (not uploaded) | Published cars with filters and sort, filters kept in the URL |
| Car detail | `/inventory/[slug]` | `ftj-client-design-p08-car-detail.png` | 15 (not uploaded) | One car with photos, specs, Inquire form |
| Contact | `/contact` | `p10-contact`, `p12-request-a-call` | none | Contact details, Request a call form posts an enquiry |
| About | `/about` | `ftj-client-design-p14-about-us.png` | none | Static copy from FTJ |
| FAQ | `/faq` | `p16-faq`, `p17-faq-expanded` | none | Static copy, or reuse the app FAQ table (open) |
| Privacy | `/privacy` | none | none | Static legal copy, still to be written |
| Login, sign up, account | `/login`, `/signup`, `/account` | `p19`, `p21`, `p23`, `p24` | none | Open scope, needs customer auth in the backend |

Endpoint names such as `GET /public/website-cars` and `POST /public/enquiries` are proposals. The design doc only fixes the `/public` prefix.

## 4. Client design vs v3 mockups

The client PDF is the client's own dark, photo-led direction (red FTJ wordmark, MENU overlay, desktop only). Our v3 mockups restate the structure with simple illustrations and the decisions from section 2. Until FTJ confirms otherwise, treat the client PDF as the **visual direction** and the v3 mockups as the **structure and data reference**.

| Topic | Client PDF | v3 mockups and decisions | What to do |
|---|---|---|---|
| Navigation | MENU overlay, LOGIN at right | Inline links (Home, Inventory, Contact Us, About Us, FAQ) and a Login button | Decide with FTJ |
| Home | Hero, two tiles (**JDM** and **Premium**), text and image block, Featured fleet carousel, footer | Hero, four Featured fleet cards | Decide whether the JDM and Premium tiles stay |
| Inventory filters | Price range, vehicle category (SUV, Coupe, Convertible, Hatchback, Van, Limousine, Electric), brand, transmission, fuel type | Category, brand, transmission, fuel type | **Remove price range only** |
| Category meaning | Body type in the filter, but JDM / Premium on the home tiles | Premium / JDM in the CargoDev Website cars list | Open question 2 |
| Car detail | Gallery (one large and two small photos), description, Performance text, six specs, **Colours** swatches, Inquire | Mockup 15 not uploaded | Is colour a field? (open question 11) |
| Accounts | Login, sign up, account with Profile, Inbox, Wishlist | None | Open question 1 |
| Imagery | Real photos of Ferrari, Lamborghini, Nissan GT-R and others; FTJ red wordmark | Flat illustrated cars; "FTJ Exports" lettering | Open questions 3 and 4 |
| Mobile | None | None | Open question 5 |

## 5. Data contract (proposed)

The pages never call `fetch` directly. They call small functions such as `getWebsiteCars(filters)` and `getWebsiteCar(slug)`. Today those return mock data. When the backend is ready, only their insides change. This is the **Repository (adapter) pattern**, and the zod schemas are the contract the backend developers can build to.

```ts
import { z } from "zod";

export const WebsiteCarSchema = z.object({
  id: z.string(),
  slug: z.string(),              // proposed: stable URL part, e.g. "2022-ferrari-roma"
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  category: z.string(),          // OPEN: body type, segment (Premium / JDM), or both?
  engine: z.string().nullable(),
  displacementCc: z.number().int().nullable(),
  transmission: z.string(),
  fuelType: z.string(),
  description: z.string().nullable(),
  photos: z.array(z.object({ url: z.string().url(), alt: z.string() })),
  featured: z.boolean(),
});
// No price field, on purpose. The public API returns only published cars,
// so "published" is not part of the public shape.

export const EnquiryInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  country: z.string().trim().min(2).max(60),
  message: z.string().trim().min(10).max(2000),
  websiteCarId: z.string().optional(),   // set when sent from a car page
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
  turnstileToken: z.string(),
});
```

Field names follow `design/design-v3-existing-data.md` (brand, model, year, category, engine, displacementCc, transmission, fuelType, description, photos, published, featured). The slug, the nullability and the form fields are proposals. The backend must validate again on the server, because client-side checks can be bypassed.

## 6. Build order

| Step | Work | Needs the backend? |
|---|---|---|
| 1 | Scaffold, design tokens (dark theme, red accent), layout, next-intl from day one | No |
| 2 | Data contract and mock repository (section 5) | No |
| 3 | Inventory page with filters and sort kept in the URL | No, uses mock data |
| 4 | Car detail page, server rendered, with `generateMetadata` and a sitemap | No, uses mock data |
| 5 | Inquire form: validation, honeypot, Turnstile, rate limit | UI now; submit needs the enquiry endpoint |
| 6 | Home, contact, about, FAQ, privacy page, app download links | No |
| 7 | Replace the mock repository with real API calls | Yes: website cars and enquiry endpoints |
| 8 | Account pages (login, sign up, account) | Yes: customer auth, only if in scope |

Make every page responsive from step 1. The client PDF has no mobile screens.

**Why filters live in the URL:** `/inventory?brand=ferrari&fuel=petrol` makes a filtered view shareable and bookmarkable, and the back button behaves. It is the trickiest part of the site, so build it early.

## 7. Quality checklist

- **SEO:** server-render list and detail pages; unique title and description per car; `sitemap.xml`; canonical tag on filtered listing URLs.
- **Images:** `next/image` with a thumbnail and a full size, so cards stay light and the gallery stays sharp.
- **Accessibility:** check contrast of grey text and the red accent on the dark background; keyboard-operable filters, menu overlay and accordion; alt text on every car photo.
- **Security:** no price or internal field in any public response; rate limit, honeypot and Turnstile on forms; server-side validation; no secrets in the browser.
- **Privacy:** privacy policy live before the App Store submission, covering presence tracking. The client's sign-up form has a marketing-emails checkbox: keep it unticked by default and store the choice with a timestamp.
- **Languages:** all visible text goes through next-intl, even if launch has one language.

## 8. Open questions

| # | Question | Why it matters | Ask |
|---|---|---|---|
| 1 | Do accounts, wishlist and the account inbox stay in v1? | The app has no sign-up, so website sign-up may be a launch dependency even if wishlist and inbox are cut | FTJ |
| 2 | Is category a body type (SUV, Coupe...), a segment (JDM, Premium), or both? | The client home uses JDM and Premium tiles, the inventory filter uses body types, CargoDev uses Premium and JDM. Decides the filter, the staff form and the schema | FTJ |
| 3 | When the client PDF and our v3 mockups differ (header, logo, imagery), which wins? | Avoids building twice | FTJ, Viro |
| 4 | Ferrari wording and branded imagery in the PDF: placeholders to replace? Does FTJ own or license the photos? | Trademark and copyright risk. FTJ's own cars and copy are needed | FTJ |
| 5 | Are mobile designs coming? | None exist; we would be inventing the layouts | FTJ |
| 6 | Which languages at launch? | Sets up next-intl and the copy workload | FTJ |
| 7 | Are the phone number and email real? Should opening hours be in Japan time? | Shown publicly; hours are currently in CET | FTJ |
| 8 | Which header and footer pages are real (Complaints, Legal, Sustainability, Site map, News letter, Language switch) and which social links? | Scope and legal copy | FTJ |
| 9 | Website car photos are public marketing images, while documents move to a private bucket. Which public path serves them (public bucket or CDN)? | The private-bucket plan does not fit public photos | Viro, team |
| 10 | Do cars need On hold or Sold states on the public site? Is there an "order you a vehicle" (sourcing request) flow? | The client's sample reply says a car is "available but on hold for a customer" and offers to order a vehicle; v3 has only Published and Draft | FTJ |
| 11 | Is **colour** a car field (the client detail page shows colour swatches)? | Adds a field to WebsiteCar and the staff editor | FTJ |
| 12 | Is the account inbox two-way (the client page has a Reply button and a "You" message)? | Needs a customer-facing conversation API on the web | FTJ, Viro |

## 9. Housekeeping

- **Project instructions field** still describes v1.0 (no separate backend, public stock with prices, a milestone table). Replace it with the content of `project-instructions.md`.
- **Design doc v1.2:** record the accounts-on-the-website decision, the page list in section 3 and the open questions in section 8.
- **Upload the missing mockups:** 5, 8, 9, 10, 12, 14 and 15. For the website, 14 (inventory), 15 (car detail) and 12 (car editor) matter most.
- **Upload the client design images** listed in `design/ftj-website-design-images.md` (Project, then Add files). Images cannot be stored as project docs.
