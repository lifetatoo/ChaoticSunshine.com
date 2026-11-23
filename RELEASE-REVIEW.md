# Chaotic Sunshine — release review

November 13, 2026. This is a review candidate, not a completed public launch.

The maintained source now includes the approved reader-centered homepage, a larger transparent PNG wordmark directly on the paper banner, a cohesive teal/blue/cream design, tactile guide covers, the original library and teaching artwork, the full dimensional Sunshine Mail envelope, and the illustrated welcome experience. All 90 devotions and 11 guides remain. The nine reader paths have crawlable collection pages and descriptive sharing cards.

The follow-up refinement replaces the compact plain footer form with a dimensional gold-envelope signup on every page. The complete illustrated Sunday-letter example preserves Amy’s supplied text, appears in the expandable sample, and has a dedicated reading page. `qa/sunshine-letter-detail-results.json` checks the controls and letter in four layouts, including a 320px phone.

The front-door revision makes the reader’s benefit explicit, puts a simple numbered plan immediately after the welcome, and exposes devotions, free guides, and original teaching illustrations before the main signup invitation. The former “Start Here” navigation is now “Find Your Page,” with a warmer card-picker introduction. Shared paper, jewel colors, typography, spacing, and tactile details now continue through the content. See `HOMEPAGE-STORYBRAND-REVIEW.md` for the framework mapping and conversion strategy.

The subsequent reader-workflow review replaces that menu wording with **Browse Topics** and gives Soul Snacks one entry action after a short/medium/long choice. The current build has 140 HTML pages including 404, 90 preserved devotional cards, nine new painted scenes, six creative exercise types, and 24 existing Side Quest missions. Side Quest cards are also woven into 24 readings. The original 21 guide PDFs remain direct downloads. Public comments remain closed; reflections are private.

`qa/journal-studio-layouts.json` records 39 page-family/browser cases. `qa/journal-studio-interactions.json` verifies all 90 preview routes, distinct original card references, artwork, three length subsets, forward/back navigation, creative prompts, mission downloads, and four layouts including 320px. Its search audit reports 139 unique titles and descriptions, 90 article entries, 17 collections, and 20 learning resources. The corrected internal method graphic is excluded from the public build, as is the broader category strategy.

The 90 individual devotional teaching cards were present but automatically folded away on narrow screens. They now remain visible by default at every width, with a manual fold and a return-to-art link. Page turns remain. `qa/front-door-interactions.json` verifies all 90 distinct artwork references and four responsive interaction profiles; `qa/front-door-brand-results.json` records 63 rendered page-family cases with no findings in the configured checks. The compact envelope was also constrained to its available width on a 320px screen.

Free downloads use direct file links. The 21 distributed PDF editions have been corrected to the monthly Sunshine Mail cadence. Their original page counts and untouched content pages were checked against the original copies. Original source files in Drive have not been overwritten.

Internal strategy and future offerings are outside this repository and the public build. No store, paid program, membership, or submission service has been launched.

## Evidence

- `qa/refresh-results.json` records the full browser review and its findings.
- `qa/final-polish-results.json` records the focused checks after final corrections.
- `qa/final-results.json` consolidates an earlier review; the newer journal and cabinet reports below cover the current revisions.
- `qa/pdf-cadence-results.json` lists the corrected PDF editions and affected pages.
- The automated checks cover local references, valid schema JSON, 90 reading routes, library door states, Advent search, useful empty results, reading controls, private reflections, real PDF download behavior, the welcome reveal, and the actual Kit form destination.
- Desktop Chrome, Android Chrome emulation, and iPhone WebKit emulation were used. These are not physical-phone or screen-reader-user tests.

## Live checks still required

1. **Domain routing.** The November 13 check returned HTTP 522 from `https://chaoticsunshine.com/`. The `www` address returned HTTP 200 with `X-Robots-Tag: noindex, nofollow`. These were observations of the existing deployment. This candidate has not changed DNS, Cloudflare routing, or the live deployment.
2. **Kit acceptance and redirect.** The review build uses the existing Sunshine Mail form 10182939. No test subscriber was sent. Verify a controlled real signup, its opt-in behavior, the successful-submission redirect to the deployed `/welcome`, receipt and unsubscribe. Existing account settings and email work have been preserved.
3. **Measurement.** The project configuration still has analytics disabled and no GA4 measurement ID. The consent-aware tracking component is retained. A click is not proof of download completion or subscriber confirmation. Connect the actual property and verify events before reporting conversion figures.
4. **Support contact.** A public support address or monitored submission endpoint is not confirmed in the project configuration. The unconnected feedback envelope is hidden, and private reflection fields explicitly do not send messages. Existing subscribers can reply to Sunshine Mail.
5. **Search launch.** After the production domain works, verify the live responses, canonical redirects, robots headers, sitemap and representative share images. Confirm ownership in Search Console and Bing using the actual account-provided verification values; none have been invented.

The generated production directory contains no mockup toolbar, setup reports, manuscript extracts, working catalog dashboard, or sitewide noindex rule. The welcome page and standalone PDFs have intentional noindex rules. The sitemap excludes the welcome page and 404 page.

## Deploy and rollback

Cloudflare Pages build command: `npm run build`. Output directory: `source/site-kit`.

Preview the GitHub branch first. After the live checks above pass, promote the reviewed commit through the usual GitHub/Cloudflare flow. Retain the preceding successful Cloudflare deployment for rollback. Roll back if primary navigation fails, a guide delivers the wrong file, the form rejects valid input, or the public pages unexpectedly become non-indexable.

No production deployment or Kit-account change was made by this design pass.

## Latest cabinet, print, and visual-fit status

The Side Quest page now reveals one mission at a time in a teal curiosity cabinet. Twenty-four new illustrations replace repeated lesson motifs, with matching art on journal mission interludes. Drawer filters, next/previous, surprise selection, direct links, search fallback, and private field-note downloads work across the four emulated layouts. No-JavaScript reading remains available.

`qa/quest-cabinet-results.json` records all 24 mission turns in each browser profile; `qa/cabinet-layout-results.json` records 12 rendered revised-page cases, and `qa/cabinet-final-layout-results.json` checks the final cabinet spacing in three browsers. All recorded findings are empty. The whole-build reference scan covers 140 HTML files and 14,205 references.

The journal print layout includes its featured Scripture and naturally paginated reflection. `qa/journal-print-results.json` records eight Letter/A4 proofs with zero missing source paragraphs and zero text outside the safe area. These representative proofs are one page each; the stylesheet permits longer content to flow onto another page.

**Production readiness remains open.** Day 2 now uses identity artwork; the other devotional assignments still require an explicit content-to-illustration audit. The cabinet and new artwork also need Amy’s visual review. The live-domain, Kit, measurement, contact, and search checks above still apply. No new production deployment was made.

## November 15, 2026 — controlled quality pass (review branch only)

This change introduces the shared semantic jewel-tone token registry, routes existing base and final CSS variables through it, explicitly describes Sunshine Mail as a free *digital email* letter, and removes the retired “Mail Club” from its HTML alt text. It adds portable build-level source/asset regression checks and a 90-reading illustration review queue. No Cloudflare or Kit settings are changed.

**Do not declare production ready on the basis of these source changes.** Before promotion, the following are still required: a versioned Cloudflare preview of this exact SHA; owner visual approval on phone and desktop; human meaning/Scripture review of all 90 illustrations; real subscribed-recipient confirmation, welcome and unsubscribe test through Kit; live verification of all 21 PDF URLs; domain redirects, apex/www status, robots and canonical checks; an owner-provided GA4/Search Console setup; confirmed public support contact; and rollback drills. The PR intentionally remains draft.

The basic static checker is `node qa/check-launch-static.cjs` after `npm run build`. Its successful result covers only the source and local generated files, not external services, product decisions or real-device usability.

### Subsequent QA and navigation follow-up

The shared navigation has been moved outside the header's height-limited paper banner so it can remain a sticky horizontal bar while the reader scrolls. Narrow phones can horizontally scroll all destinations; links are never replaced by an opaque drawer. The portable CI check is `npm run test:static`; a separate GitHub Actions workflow builds the exact committed candidate before running that check. CI passing does not establish the hosted domain, email-provider path, user consent configuration, actual mobile ergonomics, or theological and art-direction approval.


### Cross-browser rendered review pass (added November 15)

`qa/check-browser-ci.cjs` runs actual Chrome at desktop 1440px and phone 390px/320px widths against the generated site, checking loaded page status, document overflow, broken images, persistent navigation after scroll, JavaScript exceptions, and WCAG 2/2.1 A/AA automated accessibility findings. Screenshot artifacts include the homepage, journal, free library, Side Quests, and Sunshine Mail; the CI run also embeds compact screenshot previews in its job log. These checks do not substitute for in-person mobile tests, real account integrations, manual alt-text / semantics review, or deployment QA.


### November 15 evidence register

See qa/LAUNCH-STATUS.md for objective QA evidence and remaining launch-blocking owner/account/device checks. The CI workflow now observes public domain headers as informational only and retains screenshots. Neither CI nor static source verification authorizes production promotion.


### November 15 latest domain/artwork evidence

The CI screenshot exposed the old **SUNSHINE MAIL CLUB** label embedded in the desktop hero image, despite updated alt text and HTML. The CI domain probe reported apex HTTP 522 and www HTTP 200 with an X-Robots-Tag noindex/nofollow. **Neither issue is closed.** See qa/LAUNCH-STATUS.md.
