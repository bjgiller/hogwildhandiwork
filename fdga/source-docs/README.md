# FDGA proposal: research sources

Evidence behind section 02 ("In the Plan") and the Kessler section of the FDGA proposal at
https://www.hogwildhandiwork.com/fdga/. Everything here comes from the City of Fayetteville's
own **Fayetteville Parks System Master Plan and Appendices (February 2023)**:
https://www.fayetteville-ar.gov/DocumentCenter/View/28916/Fayetteville-Parks-System-Master-Plan-and-Appendices-February-2023

## Files

| File | What it is |
|---|---|
| `fayetteville-parks-master-plan-2023.pdf` | The master plan, as downloaded from the City (about 440 pages) |
| `plan-text.txt` | `pdftotext -layout` of the PDF. Pages are separated by form feeds (`\f`), so page N is `split('\f')[N-1]` |
| `extract-disc-golf-mentions.js` | Finds every "disc golf" mention with page numbers; writes `disc-golf-mentions.json` |
| `disc-golf-mentions.json` / `mentions-output.txt` | All **82 mentions across 39 pages** (raw list) |
| `table-context.txt` | Full page text behind the stats cards (PDF pp. 44, 99, 211, 280, 314, 358) |
| `quote-context.txt` | Full page text behind the resident quotes and Kessler citations (pp. 234–235, 320–322, 330–331, 336, 345) |
| `kessler-cip-context.txt`, `kessler-remaining-context.txt`, `kessler-north-check.txt` | Every page mentioning Kessler, checked for capital plans and for the north side of the park |

To rebuild after a new PDF: `pdftotext -layout fayetteville-parks-master-plan-2023.pdf plan-text.txt`,
then `node extract-disc-golf-mentions.js > mentions-output.txt`.

## What the site claims (all verified and page-cited)

Every citation on the proposal page links to the City's PDF with a `#page=N` fragment (the City
serves the PDF inline, so page jumps work). To add one, append `#page=<N>` to the URL above and
open it in a new tab.

- **Count:** 82 mentions of "disc golf" across 39 pages. (Not "300+"; the City can fact-check this.)
- **Table 9 (p. 44) / Table 14 (p. 99):** 2 disc golf courses citywide, level of service 1 per
  46,975 residents; the Plan's own 2040 gap analysis says 3 are needed, a documented shortfall.
- **Table 48 (p. 358):** in the open-participation survey (N=461), disc golf was the top
  open-ended comment topic at 18%. Table 25 (p. 314), the address-sample survey (N=281), has disc
  golf at only 1%. The site only claims the 18% / "most mentioned" framing for the
  open-participation survey; don't mix up the two samples.
- **FDGA listed as a community partner:** pp. 42 and 203.
- **Kessler Mountain Regional Park turf investment 2019/2020:** p. 203.
- **Kessler-specific demand:** 14 responses naming disc golf for Kessler Mountain Regional Park,
  p. 235 (Community Engagement Summary).
- **Non-floodplain siting quote** used in the Kessler section: p. 321.
- **4 verbatim resident quotes:** pp. 322, 331, 336, 345. Quoted exactly as written, including
  the source's own typos (marked `[sic]`). Don't clean them up; they're primary-source citations.

## Proposal facts confirmed with FDGA (2026-08-21/22)

- Capital campaign total **$18,538.94**, a multi-member campaign. Don't name an individual donor
  on the public site.
  - 19 MVP Black Hole Portal baskets at $799.95 = $15,199.05
  - 11 galvanized ground sleeves at $39.99 = $439.89
  - $2,000 toward tee-pad concrete
  - 18 tee signs at $50 = $900
- **Ask 1:** a firm 10-year waiver of the $150/reservation fee (minimum 3 per year).
- **Ask 2:** a small new course at Kessler Park using the retired Walker Park baskets.
- **Ask 3:** in-kind city equipment and concrete help.

Still placeholders on the page: the Kessler course design map, and the community support list.
Don't make either up; wait for FDGA to provide them.
