# Chaotic Sunshine

An illustrated faith journal and a little free digital library by Amy Grace.

The maintained website source is in `source/`. The public build preserves 90 devotions, 11 guides with 21 PDF editions, the original teaching illustrations, interactive library doors, saved readings, and the nine reader paths. The November 13 refresh integrates the approved jewel-tone editorial collage and dimensional Sunshine Mail envelope.

Build with Node.js 22 or newer:

```
npm run build
```

For Cloudflare Pages, use `npm run build` as the build command and `source/site-kit` as the output directory. Only that generated directory is the public website. Keep the source, QA results, original manuscript extracts, working catalog exports, and setup notes outside the deployment directory.

The build has no npm runtime dependencies. Artwork, fonts, search data, share cards, and downloadable PDFs are local files. The current source catalog contains the file paths and fingerprints for the actual distributed editions.

`settings.json` contains public configuration only. Sunshine Mail uses the existing Kit form 10182939. Its server-side opt-in and success redirect remain settings in Kit. No API key is needed for the standard form action. Configure the successful-submission redirect to `/welcome` on the final public domain only after that page is deployed and verified. Never treat a button click as proof of subscription.

Free guide files currently use direct downloads. Gumroad is optional and unconfigured; its setup notes are included separately. No store account was created by this refresh.

`qa/check-refresh.cjs` includes the local browser checks used for this review. It uses the provisioned Codex Playwright, Chrome, WebKit, and axe installations. `qa/refresh-results.json` records the actual tested cases. These checks emulate Android and iPhone browsers; they do not constitute testing on physical phones or with a screen-reader user.

The known live-domain and account checks are in `RELEASE-REVIEW.md`. Do not treat the design branch as a declaration that every P0 is resolved. Preview first, then promote the tested build through the normal GitHub/Cloudflare workflow.

Soul Snacks is the journal cover: choose short, medium, or long, then open a matching reading. Page turns retain that length. Topic browsing lives at `/start`, and the original teaching sheets remain on `/teaching-shelf`. `/side-quests` contains 24 missions imported from Amy’s existing Side Quest Society prototype. Optional mission cards are interleaved into 24 journal pages; the broader category and future offering strategy remain outside this repository.

Every devotion keeps its original teaching/Scripture card and adds a painted object scene. Six creative prompt types rotate through the readings, including verse-based word hunts. These remain optional. Reflections are private, not public comments.

For a local preview that runs independently of an interactive chat command, use `qa/start-preview.ps1 -SiteDirectory <absolute path to site-kit>`. It starts a hidden process on localhost port 8813 and avoids starting a second listener. `qa/check-journal-studio.cjs` verifies the current journal flow, individual artwork, mission downloads, and search metadata.

The Side Quest curiosity cabinet shows one of the 24 missions at a time, with five themed drawers, previous/next, surprise selection, searchable text, and direct mission links. Its 24 dedicated illustrations are stored in four optimized atlas files in `source/assets/31-side-quest-art/`. `source/side-quest-cabinet.cjs` keeps each mission paired with its exact illustration on the cabinet and journal interludes. With JavaScript disabled, all missions remain readable. Run `qa/check-quest-cabinet.cjs` against the local preview for the focused regression checks.

Journal printing uses a separate paper layout with the actual featured Scripture, full reflection, and prompts. Representative US Letter and A4 proofs are recorded in `qa/journal-print-results.json`. The remaining 90-reading illustration-meaning review is still open; day 2 was corrected to identity artwork.
