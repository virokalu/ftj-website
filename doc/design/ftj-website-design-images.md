# FTJ website design images (index)

Version 1.0 · 25 Oct 2026. Companion to `design/ftj-website-brief.md` and `design/design-screens-index.md`.

Images cannot be stored as project docs. Upload them from the folder with Project, then Add files. This index says what each image shows and what to build from it.

## A. Client design PDF, rendered page by page (new)

Source: `FTJWebsite_compressed.pdf` (24 pages, 1920 px wide desktop screens, dark theme, red accent). The odd-numbered pages in the PDF are section title cards, so only the real screens were exported. Each file is the full page at 1920 px wide, so tall pages are tall images. The number after `p` is the PDF page number.

| File | PDF page | Shows |
|---|---|---|
| `ftj-client-design-p02-home-landing.png` | 2 | Home |
| `ftj-client-design-p04-menu-overlay.png` | 4 | Menu overlay |
| `ftj-client-design-p06-inventory.png` | 6 | Inventory |
| `ftj-client-design-p08-car-detail.png` | 8 | Car detail |
| `ftj-client-design-p10-contact.png` | 10 | Contact |
| `ftj-client-design-p12-request-a-call.png` | 12 | Request a call panel |
| `ftj-client-design-p14-about-us.png` | 14 | About us |
| `ftj-client-design-p16-faq.png` | 16 | FAQ, all closed |
| `ftj-client-design-p17-faq-expanded.png` | 17 | FAQ, one item open |
| `ftj-client-design-p19-login.png` | 19 | Log in |
| `ftj-client-design-p21-sign-up.png` | 21 | Sign up |
| `ftj-client-design-p23-account.png` | 23 | Account (profile, inbox, wishlist) |
| `ftj-client-design-p24-account-inbox.png` | 24 | Account inbox thread |

### Home (`p02`)

Top to bottom:

1. **Hero:** full-bleed photo, MENU at left, FTJ wordmark centred, LOGIN at right, the line "Shifting dreams into reality" and a Read more link. Vertical dots at the left edge (a slider or section indicator).
2. **Two large tiles:** **JDM** and **Premium**, each with Read more. These look like entry points into the inventory by segment.
3. **Text and image block** on a white background with a Read more link.
4. **Featured fleet:** a carousel of cards (third card clipped, three pagination dots). Each card has a photo, name, a short blurb, year, model, engine, displacement, transmission, fuel type and Inquire.
5. **Footer:** FTJ logo with the tagline "Shifting dreams into reality", links (Language, FAQ, Site map, Contact, Legal, News letter, Complaints, Sustainability) and five social icons.

### Menu overlay (`p04`)

Items: Home, Inventory, Contact us, About us, FAQ, Login, with a Close control. The v3 mockup replaces this with inline header links.

### Inventory (`p06`)

- **Left filter column** with Clear all and collapsible groups: Price range ($0 - $1000, $1000 - $5000, $5000 - $10,000, $10,000+), Vehicle category (SUV, Coupe, Convertible, Hatch back, Van, Limousine, Electric), Brand, Transmission, Fuel type.
- **Main area:** "Choose your vehicle", a count ("30 available"), Sort by, and a three-column grid of cards.
- **Card:** photo, name, blurb, YOM, model, engine, total displacement, transmission, fuel type, Inquire.
- **Build changes:** remove the price-range group (decision in design-v3). Keep everything else. Keep filters and sort in the URL.

### Car detail (`p08`)

- **Gallery:** one large photo and two stacked thumbnails at the right.
- **Below:** car name, a short description, a Performance section with text, then six specs (YOM, model, engine, total displacement, transmission, fuel type).
- **Colours:** three colour swatches (not in the v3 data model, see open question 11 in the brief).
- **Inquire** button with an arrow, then the footer.

### Contact (`p10`) and Request a call (`p12`)

- **Contact:** headquarters banner (Yokohama, Kanagawa, Japan), telephone, email, an opening-hours paragraph and a Get in touch link.
- **Request a call:** a side panel with Close, name, email, telephone number, country, message and a Request button. This maps to the enquiry input in the brief, with no car attached.

### About us (`p14`) and FAQ (`p16`, `p17`)

- **About:** hero image with the title, an intro paragraph, an Our values block with an image, a full-width banner image with text, and a split section with a Read more link. All text is placeholder.
- **FAQ:** an accordion of question and answer pairs; `p17` shows one item open. Use an accessible accordion (a button with `aria-expanded`).

### Login (`p19`), Sign up (`p21`), Account (`p23`), Account inbox (`p24`)

- **Login:** email, password, "Password help?", a Log in button and "Don't have an account? Create one".
- **Sign up:** first name, last name, email, confirm email, password, confirm password, a checkbox to receive emails about new products, sales and store events, and Create account.
- **Account:** Profile (name, email, masked password, Edit, Logout), Inbox (recent enquiry replies, View all) and Wishlist (saved cars with Inquire, View all).
- **Account inbox:** left menu (Inbox, Sent, Draft, Trash), a list of threads and a conversation with a Reply button and a "You" message. This is two-way messaging, so it would need a customer-facing conversation API.

### Fix before launch (placeholder content to avoid copying)

- Fuel type reads "Patrol" (should be Petrol).
- "400cc" displacement shown with a V12 engine, and a 2026 year on a used car.
- "FTJ Headquarters Japann" has a typo.
- Opening hours are in CET for a Japan-based company.
- The line about customer care "reserved for Ferrari clients and official dealers" is Ferrari's wording.
- Photos show Ferrari, Lamborghini, Nissan GT-R and others, and a visible Audi Sport sign on the About hero. Confirm FTJ owns or licenses them.
- Sample reply on the account inbox says the car is "available but on hold for a customer" and offers to order a vehicle.

## B. v3 mockups (ours)

| File | In the project? | Shows |
|---|---|---|
| `13-site-home.png` | Yes | Home: hero, Browse inventory and Contact us buttons, Featured fleet of four cards. The red tag "Only cars marked Featured in CargoDev" is a developer note, not site copy. |
| `14-site-inventory.png` | **No, upload** | Filters (category, brand, transmission, fuel) and cards with Inquire. No price filter. |
| `15-site-car-detail.png` | **No, upload** | Gallery, specs and the inquiry form that lands in the Inbox. |
| `11-staff-website-cars.png` | Yes | CargoDev Website cars list: tabs (All, Published, Drafts, Featured), category, status, Featured switch, Enquiries count. |
| `12-staff-website-car-editor.png` | **No, upload** | Website car form, photos, publishing, site preview. No price field. |
| `6-staff-inbox.png` | Yes | Shared Inbox for app, website and email, with internal notes. The "Amina Hassan (no account)" entry shows a website enquiry with Website, Enquiry and Lead tags. |
