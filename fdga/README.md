# FDGA proposal to the City of Fayetteville

Partnership proposal from the Fayetteville Disc Golf Association to Fayetteville Parks &
Recreation: accept FDGA's $18,538.94 capital campaign gift for Walker Park (Waxhaws DGC), and
give **permission to build** a Gold-level course at Kessler Park using the baskets that upgrade
replaces. Live at https://www.hogwildhandiwork.com/fdga/ (noindex). Finished and reviewed
2026-11-02; Brady emailed it to the City's Parks contact to set up a meeting.

The FDGA club website is a separate project: `C:\Programming\fayettevillediscgolf`.

## Files

| Path | What |
|---|---|
| `index.html`, `css/style.css` (`?v=9`), `js/main.js` | The web version |
| `pdf/proposal.html` | Source of the 8-page PDF. **A separate copy of the text**: every wording change must be made in both `index.html` and here |
| `pdf/build.sh` | `sh fdga/pdf/build.sh [out.pdf]` from the repo root renders the PDF with headless Chrome (default `fdga/FDGA-Proposal.pdf`) |
| `FDGA-Proposal.pdf` | The built PDF, committed; the website's "Download PDF" button links `FDGA-Proposal.pdf?v=2` |
| `images/` | Logo, basket/sleeve photos, Kessler aerial map (`map/kessler-areas.jpg`), Master Plan table screenshots (`plan/`) |
| `source-docs/` | Parks Master Plan PDF, extracted text, and research. **Read its README before changing any number or quote** |

## Gotchas

- **Acrobat locks the PDF.** If `FDGA-Proposal.pdf` is open in Acrobat, the rebuild fails; ask
  Brady to close it. Chrome doesn't lock it.
- **Cloudflare caches the PDF for 4 hours.** After a rebuild, bump the `?v=` on the Download PDF
  link and send people the `?v=` URL, or the old copy keeps being served.
- **Don't check new image URLs before the deploy finishes**; Cloudflare once cached a 404. Use new
  filenames or `?v=`.
- Quotes from residents must match the Master Plan text (`source-docs/plan-text.txt`). Claims
  about Tables 9/14/48 and page 235 were reworded on 2026-11-02 to match the Plan exactly (2040
  gap framing; 461 open-ended comments; Kessler as a top-5 commented park).

## Decisions already made (don't reintroduce)

- No equipment, insurance, or 10-year reservation-fee language; no named City staff.
- "Permission to build," not "land."
- Kessler tee pad/sign costs intentionally left out; questions about conservation easements are
  for the meeting, not the document.
- Basket is the royal blue MVP Black Hole Portal; contact is Brady Gilleran, FDGA Vice President.
- Ice Bowl stats in the proposal say "100+ players" and "$6,000+ each of the last 5 years." The
  2026 numbers (152 pre-registered, $7,800+) are higher if Brady ever wants them in.
