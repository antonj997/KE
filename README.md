# Kragsta Elektriska – first app concept

Six Swedish phone mockups, a clickable prototype, and a user-flow view for Kragsta Elektriska. All customers, prices, addresses, jobs, and invoices are illustrative.

Open `index.html` directly in a browser, or run `node design/serve.cjs` and visit `http://127.0.0.1:4173`.

## Review the concept

- **Skärmöversikt:** Idag, Kunder, Planering, Jobb, Tid & material, Faktura.
- **Prova appen:** Add a customer, create a job, log time and materials, review the calculated invoice, optionally preview ROT, and simulate sending and payment.
- **Användarflöde:** Main journey, payment follow-up, ROT after customer payment, and common exceptions.

The visual direction uses off-white surfaces, charcoal primary actions, and restrained lemon/sage accents. The home screen leads with the next visit and urgent tasks. Information follows the customer and job into the invoice instead of being entered repeatedly.

The app header and app icon use the selected Skylt K/lightning symbol: orange fill, dark green outline, stem serifs, and a clean upper right arm without a serif. It renders at 36px in the app header and 40px in the review header. The full wordmark is retained for invoices. The scalable assets are in `assets/`; they do not depend on installed fonts. `design/build-brand.ps1` records the wordmark construction and copies the selected icon source.

The approved large logo uses tall, tightly spaced slab-serif letters and the arched ELEKTRISKA contour, with the K/lightning integrated into KRAGSTA. The user selected this version over the broad-letter alternative. `assets/kragsta-elektriska-full.svg` includes the supplied telephone number; `assets/kragsta-elektriska.svg` is the matching telephone-free invoice version. Both are transparent scalable SVGs. `design/build-brand.ps1` rebuilds them through `design/build-tight-logo.ps1`. The selected preview is `design/previews/kragsta-full-logo-board.png`.

Start the timer on a job to reveal its inline lemon timer. On other screens, including Idag, a compact 44px running-job status element with pill-shaped corners sits at the top right, alongside the K logo. Its header reserves space above the scrolling content. The counter continues updating as you navigate; tap the row to return to the job or stop to save that work session. The next visit stays compact on the home screen while work is running. The invoice paper places Faktura on the left and the logo at the top right of the same header row.

## Prototype boundaries

The demo uses in-memory data and resets on reload. It is an exploration of screens and workflow, not a production accounting or invoicing system. Sending, reminders, and payment registration are simulations. Company details, a real invoice number sequence, secure storage, and actual payment/delivery integrations are not configured. The invoice layout is explicitly marked as a draft/example. ROT is a preliminary demonstration and does not establish customer eligibility.

## Before building the real app

Keep advanced settings out of everyday screens, but provide dedicated setup and review flows for:

1. Company identity, F-tax information, VAT registration, invoice number series, payment information, terms, credit invoices, and locked issued-invoice records.
2. Private and company customers, separate site and invoice addresses, contact persons, and tax-specific information only when needed.
3. ROT eligibility, property and applicant details, allocation, customer payment, application and payout tracking. Green-technology deductions need their own reviewed rules; do not treat them as ROT.
4. Ordinary VAT and, where applicable, reverse-charge construction VAT with the correct customer/transaction checks.
5. Hour rates, material purchase/sale prices, travel, service vehicle charges, expenses, and invoice attachments.
6. Quotes, repeat site visits, job notes, photos, and relevant electrical-work checks/documentation.
7. Offline capture, sync recovery, backups, secure access, personal-data retention, and accounting export or an accounting-service integration.

These are proposed follow-on requirements, not implemented features or a claim of regulatory completeness.

## Swedish guidance used for this concept

Checked 3 November 2026. The concept separates work, materials, and travel. The optional ROT example uses 30% of labor including VAT; materials and travel are excluded. The flow places a ROT application after the customer's payment.

- [Skatteverket: Momslagens regler om fakturering](https://www.skatteverket.se/foretag/moms/saljavarorochtjanster/fakturering.4.58d555751259e4d66168000403.html)
- [Skatteverket: Så fungerar rotavdraget för företag](https://www.skatteverket.se/foretagorganisationer/skatter/rotrutarbete/vemharratttillrotavdrag.4.2ef18e6a125660db8b080002709.html)

## Verification

Browser checks in `design/preview-check.cjs` cover the linked customer → job → time/material → invoice journey, totals, optional ROT calculation, simulated sending/payment, timer start/stop, customer search empty state, and horizontal overflow at 390px and 320px. Screenshots are in `design/previews/`. The check script expects Playwright available through Node's module resolution and optionally accepts `PREVIEW_BROWSER` (browser executable) and `PREVIEW_URL` (defaults to the local HTML file).

`design/timer-brand-check.cjs` advances the browser clock to verify timer continuity through navigation, the exact elapsed display, stopping/saving once, branding, and indicator placement at 390px and 320px.
