# Vape Ave & Smoke Shop — Website Concept

A custom-designed demo website for **Vape Ave & Smoke Shop** (7470 W State St, Garden City, Idaho), built as a design pitch. Static site, no build step, deploys straight to GitHub Pages.

> **Demo notice:** This is a design concept, not the live storefront. Review copy is representative placeholder text, and the "Vape Ave Rewards" loyalty program is a **proposed feature**, not an active program.

## Highlights

- **Dual-tone neon identity** — layered CSS glow (green × red) with a framed storefront-sign wordmark and subtle flicker animation
- **Dark theme** throughout, tuned for contrast and readability
- **Age gate (21+)** with session persistence and FDA-style nicotine warning bar
- **Vape Ave Rewards** — dedicated page pitching a points-based loyalty program (earn / redeem / tiers / win-back texts), with a simulated sign-up flow that sends and stores nothing
- **Order Pickup** — full simulated order-ahead flow: filterable product menu with flavor pickers, slide-in cart drawer with quantity controls, rewards-points preview, and a mock checkout that issues a demo order number (pay at pickup, 21+ ID required — nothing is sent or stored)
- **Ambient animation system** — neon power-on stutter and independent green/red tube flickers with random JS "jolts", drifting clouds and rising vapor puffs in every hero, button exhale puffs, floating loyalty card (all disabled under `prefers-reduced-motion`)
- **Live "open now" badge** computed from store hours (8 AM–midnight, America/Boise)
- Scroll-reveal animations, animated stat counters, flavor ticker, responsive layout with mobile nav — all vanilla HTML/CSS/JS, zero dependencies

## Structure

```
├── index.html      # Homepage: hero, categories, pickup + rewards teasers, about, reviews, visit
├── order.html      # Order Pickup — simulated order-ahead flow with cart
├── rewards.html    # Vape Ave Rewards — loyalty program concept
├── css/
│   └── style.css   # All styles (design tokens in :root)
├── js/
│   ├── main.js     # Age gate, nav, scroll reveal, counters, open badge, neon jolts, mock signup
│   └── order.js    # Demo catalog, cart drawer, simulated checkout
├── fonts/          # Self-hosted variable fonts (Space Grotesk, Inter)
└── README.md
```

## Run locally

No tooling required — open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to GitHub
2. Repo **Settings → Pages → Source**: deploy from branch, root (`/`)
3. Site publishes at `https://<user>.github.io/<repo>/`

All asset paths are relative, so it works from a project subpath out of the box.

## Business details used

| | |
|---|---|
| Address | 7470 W State St, Garden City, ID 83714 |
| Phone | (208) 853-7630 |
| Hours | Daily, 8:00 AM – 12:00 AM |
| Rating | 4.8 ★ (211 Google reviews) |
