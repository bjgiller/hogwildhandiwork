# hogwildhandiwork.com

Brady Gilleran's disc golf trophy and apparel business, plus a few side sites hosted as folders.
Static files on **GitHub Pages** (repo `bjgiller/hogwildhandiwork`, `main` branch root).
`CNAME` = `www.hogwildhandiwork.com`; Cloudflare redirects the bare domain to `www`.

**No build step.** Edit HTML/CSS/JS, commit, push, and it's live in about a minute. `.nojekyll` means
every file is served as-is, **so never commit secrets here.** (See `C:\Programming\CLAUDE.md` for the
full map of hosting, DNS, the tunnel, and the forms Worker.)

## Layout

| Path | What |
|---|---|
| `index.html` | Home: hero, "recently made for", how it works, player packs, pack items, hat builder (swatches + leatherette patches), awards & signs, why, Discord, order form |
| `business.html` (`/business`) | Same products re-worded for schools/businesses; awards + merchandise + quote form |
| `hats.html` (`/hats`) | Full Durra-Bull hat catalog (5/6-panel photos) + leatherette patches |
| `404.html` | Not-found page. It **also forwards old `/pickleball/...` links** to `https://pickleball.hogwildhandiwork.com` |
| `northshore20.html`, `northshore20.pdf` | 20th Annual Northshore Invitational players-meeting page (old design, uses `css/style.css`) |
| `northshore.html`, `northshore.pdf` | Redirect to `/northshore20` / older PDF copy (links already sent out) |
| `fdga/` | FDGA proposal for the City of Fayetteville (`/fdga/`). `fdga/source-docs/` holds the Parks Master Plan research behind it; read its README before editing numbers or quotes |
| `friends-in-christ/` | Friends in Christ Lutheran Church site (`/friends-in-christ/`); contact form posts to the Worker `/fic` |
| `alta/` | Alta Supply & Packaging preview (`/alta/`); the working folder is `C:\Programming\alta-supply` |

## Design (2026-09 refresh)

- `css/site.css`: the whole design system for index/business/hats/404. Tokens at the top: ink `#0b1a2e`,
  navy `#11305a`, ice blue `#7fcdf0`, disc red `#e5392c` (from the logo), warm paper `#f6f2ea`.
  Fonts: Bricolage Grotesque (headings), Instrument Sans (body), JetBrains Mono (labels/prices).
- `js/site.js`: header/mobile nav, scroll reveal, product photo carousels, lightbox (`data-zoom` on any
  element), hat style tabs, the **Add to order** system, and order-form submit.
- `css/style.css` is the **old** design, kept only because `northshore20.html` uses it.
- Script/stylesheet links carry `?v=N` (currently 3). **Bump it on every page when you change
  `site.css` or `site.js`** so browsers don't keep an old copy (GitHub lets them cache for 10 min).

### Header and footer

They're copied into `index.html`, `business.html`, `hats.html`, and `404.html`. Change all four together.

## Products and photos

- Product photos live in `images/<product-key>/`. The carousels read **`images/manifest.json`**, which
  lists each folder's files. **After adding or removing a photo, regenerate it:**
  ```bash
  node -e 'const fs=require("fs"),p=require("path");const E=new Set([".jpg",".jpeg",".png",".webp",".avif",".gif"]);const K=Object.keys(require("./images/manifest.json"));const o={};for(const k of K){try{o[k]=fs.readdirSync("images/"+k).filter(f=>E.has(p.extname(f).toLowerCase())).sort()}catch{o[k]=[]}}fs.writeFileSync("images/manifest.json",JSON.stringify(o,null,1))'
  ```
  Keys: `3-stage-acrylic sublimation-trophies nightlight-trophies wooden-full-color wooden-offset-acrylic
  custom-hats custom-tshirts bag-tags custom-minis 3d-printed custom-medals custom-signs`.
  A product with no photos shows a "Photos coming soon" tile (currently night-light and wooden offset).
- Each product card is an `<article class="product">` with a `.carousel[data-product=KEY]` and an
  **Add to order** button `data-add=KEY`. The button toggles the matching `name="products" value=KEY`
  checkbox chip in the order form. Cards, chips, and the floating "Review order request" pill stay in sync.
  **To add a product:** add a card, add a chip to the form, create `images/KEY/`, add KEY to the manifest,
  and add KEY + display name to `PRODUCT_NAMES` in `C:\Programming\hogwild-forms\src\index.js`
  (then `npx wrangler deploy` there), or the order email shows the raw key.
- A link like `/?add=custom-hats#order` pre-selects a product (the hat catalog uses it).
- Hat colors/patches point at Lonestar's CDN images (`lonestaradhesive.com`, `cdn.shopify.com`) with a
  `width=` param; the lightbox swaps in `width=1400`. Sold-out items have class `out`.

## Forms

The order/quote form (index + business) POSTs JSON to
`https://hogwild-forms.bandicoot3111.workers.dev/order`, and the church form posts to `/fic`. The Worker emails
Brady (and pings Discord #orders for orders). Source and secrets: `C:\Programming\hogwild-forms` (its README).
The hidden `website` field is a honeypot; filling it makes the Worker return success without sending.
That's handy for testing the page without emailing anyone.

## Previewing locally

Pages use root-relative links, so don't open the files directly. Serve the folder with any static server
that maps `/x` to `x.html` and folders to `index.html`, e.g. `npx serve . -l 8099` (it cleans URLs by
default), then open http://localhost:8099. Use port 8099: it's the only local origin the forms Worker accepts.
