# Content decision log — /beatrix/ demo (internal, 2026-09-13)

Sources, in priority order: brand guide (`Elementa Expériences — Guide de marque.docx`, dated September 2026 corrections win), the two September briefs, then the old-site copy (`Elementa - Copywriting ancien site web.docx`, historical). Nothing in this file is guest-facing.

## Used as-is (confirmed in the guide)

| Fact | Source | Where |
|---|---|---|
| Sainte-Béatrix, Lanaudière | guide, chiffres clés | hero, facts, location, FAQ, footer, JSON-LD |
| Signature « Loin du bruit, près de soi. » / EN "Far from the noise, close to yourself." (2026-09-08 wording) | guide | hero, footer |
| Four mountain cabins available now (2026-09-03 / 2026-09-08) | guide | facts, cabin section, FAQ, JSON-LD `numberOfRooms` |
| Phase 1: 16 cabins total + welcome pavilion, reception space, bistro, care & leisure pavilion — planned | guide (2026-09-08) | histoire.html `#projet`, labelled "en développement" |
| Long-term vision: up to 60 homes + larger spa, no date | guide | histoire.html, labelled "vision à long terme" |
| Private thermal circuit: steam bath + outdoor shower, in every cabin, from launch | guide | everywhere |
| Open year-round / four seasons | guide (2026-09-01) | facts, seasons band, FAQ |
| Stilts "plus de 10 pieds" (replaces 12 ft) | guide (2026-09-08) | cabin list, cabines.html, histoire.html |
| Instagram @elementa.experiences, facebook.com/elementa.experiences | guide (2026-09-02) | footer, gallery, JSON-LD `sameAs` |
| Media contact Hamza Majdi — hamza@hamzamajdi.com, media only | guide | footer, FAQ q8 |
| Roles: Hamza Majdi, fondateur; Ali Diouri, partenaire d'affaires et cocréateur | guide + brief | histoire.html |
| Site search > 1.5 years, ecosystem analysis (wind, sun, privacy) | old copy (narrative, non-numeric except the duration) | histoire.html |
| Vouvoiement, français canadien, no inclusive writing, "cabines de montagne" | guide | all copy |

## Adapted

- Old "Une seule pièce, pour deux" → describes the layout of one cabin only ("Une seule pièce à vivre, pour deux : … à l'étage"), never the property.
- Mentalité Elementa: kept to breathing, movement, personal rhythm, nature; no wellness-expert claim, no "365 minutes", no anxiety/exhaustion/health outcomes, no scheduled classes (yoga/massage belong to phase 1 and are not mentioned as current).
- "Less than an hour from Montréal" (guide) → not published as a travel-time promise; copy says "au nord de Montréal" and that the address/route come with the confirmation. Reinstate once the final address and a departure point are verified.
- Old equipment list: kept the items the briefs enumerate plus the generic kitchen/comfort items from the old copy (oven, small fridge, dishwasher, microwave, coffee machine, Wi-Fi, Bluetooth speakers, A/C, air purifier, diffuser). Brand names (Stûv 360, Nespresso) and the retractable TV were dropped as unverified.
- Seasons: no season tabs — only summer photography exists (the AI-generated autumn/night images in `site/assets/gen` are not used). Seasonal message lives in the copy.
- Occasions (retreats, residencies, weddings): presented as what the place is designed to host "à terme", with an enquiry route; reception facilities marked as in development.

## Withheld

- Rawdon, Dorwin Falls, coordinates, Highway 25/125 directions, 75 min claim, @elementa.rawdon, hello@elementa.ca, same-day / one-week response promises.
- Area figures (860 pi² total = 400 + 72 indoor, 60 + 328 terraces), 62 % glazing, 25 ft terrace height — legacy specs not confirmed against a current property sheet. If confirmed, publish only as « 860 pi² au total, terrasses comprises ».
- Reception capacity (150 vs 300 conflict), "more than 40 cabins", any completion date/year, investment figures, audience income profile.
- 2024 pre-launch dates, $500/$550/$600 rates, minimum nights, first-come allocation, cancellation rules.
- Partner names (Robert Sainte-Marie, Habitation Nueva, Homme des bois, Altar construction, Geniflex, L'ardoisière) and founder achievement numbers — pending current verification and permission.
- Check-in times, pets, accessibility, guest capacity per cabin beyond "pour deux", minimum stay — not in the FAQ; the copy says the team confirms these directly.
- Separate "Elementa Sainte-Béatrix" Instagram handle (not yet created).
- info@elementaexperiences.com (old copy) — not used anywhere.
- English signature variants "Far from the noise, closer to yourself" / "Away from the noise, closer to yourself" (older guide lines) — superseded by the 2026-09-08 checklist wording used on the page.

## Release dependencies

1. **Enquiry endpoint / CRM** — `#enquiry` has `data-endpoint=""`; the deployed page shows a transparent "not yet enabled" state and never pretends to send. Set the endpoint (expects `POST` JSON `{arrival, departure, guests, name, email, note, consent, lang}`, 2xx = accepted) or connect a booking engine and switch the CTA to « Réserver votre séjour ».
2. **Reservations / general contact address** — none verified; the media address is deliberately not reused.
3. **Privacy contact** — the policy points to the form; add a named data-protection contact and jurisdiction wording before launch.
4. **Exact map destination** — no pin published; municipality only.
5. **Cabin specifications** — area, glazing, terrace height, exact equipment (brands), guest limits.
6. **Operational policies** — check-in, minimum nights, cancellation, pets, accessibility.
7. **Production domain** — canonical + `hreflang` alternates and absolute `og:image` URLs are not set (only the demo host exists). EN currently lives in the same URL via the toggle; a production build should publish real `/en/` pages for SEO.
8. **Partners** — names, roles, links, logo permission.
9. **Field performance** — only lab numbers exist (see the delivery note); collect CrUX/RUM once the domain is live.
