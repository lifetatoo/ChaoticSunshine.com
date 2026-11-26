# Chaotic Sunshine Studio — Master Playbook V4 Release Control
**As of:** 2026-11-25 · **Source branch:** `release/v4-preserve-integrate-review-2026-11-25`

## Controlling instructions and approval order

1. **Master Playbook V4 (November 25, 2026), pages 1–6** wins over prior instructions. V3 and the original master inspiration are preserved where not superseded.
2. The most recent explicit user approval for an individual artwork takes precedence over vague styling requests.
3. An art-direction reference, collage board, generated image and initial code test do **not** constitute a production-approved binary or physical-print proof.
4. Do not regenerate, recolor, transform or replace protected assets to solve CSS issues. Changes to originals require explicit user permission and new reference/version records.
5. Human/editorial approval and legal/technical release are independent. Only tests actually run at the release SHA may be marked verified.

## Approved assets — protected baseline

- Original purple brush-script Chaotic Sunshine logo, gold sun and underline. Do not use poster-style substitute.
- **All 11 free Little Free Library guides, existing cover family and product-card imagery:** solid jewel-tone framing, cream/white field, washi tape, expressive serif/italic title and original symbols. Existing motifs are grandfathered.
- Approved jewel-tone library doors, established book spines and associated files.
- Approved Sunshine Mail composition: oversized intact golden envelope, centered V-flap, original separate illustrated letter; no hands, tearing or deformed envelope. Kit form ID **10182939** unchanged. The monthly illustrated sample can be opened without subscribing.
- The 90 Soul Snacks, 24 original Side Quests, nine teaching selections, existing public URLs and free access.
- Binary fingerprints are recorded in [V4-PROTECTED-ASSETS.json](V4-PROTECTED-ASSETS.json) and checked automatically; a layout fix must not modify them.
- The original Table Talks product card exists in `source/assets/01-guide-product-cards/table-talks-guide-product-1200.png`; the **exact full cover** remains a recovery/identity check, not permission to generate a substitute.

## Artwork accepted as *direction*, not commercial-ready

- Latest **Seven I Am** labeled study art supersedes the unlabeled proof, but truly transparent vellum and physical legibility are unverified.
- Lamb of God, Noah's Ark and Let There Be Light have approved compositions; physical-print/rights/format checks remain.
- Face of Jesus concept is not final; distinctiveness and imagery need review.
- Purple/teal/sapphire/violet/oxblood/gold and cream remain a varied palette. Retro accents are optional, not universal.
- Candidate new Side Quest leather books, Daily Cabinet jar components and 220 card instances are **review candidates**, not automatically approved art assets.

## Rejected directions / prohibited default treatments

- Halos, crowns, repeat sunbursts, generic Christianese pictures, fake baked-in Scripture, predictable stock illustrations.
- Soft pastel/sweet/craft/juvenile, botanical stationery, generic corporate blue diagrams, uniform quote-card/poster treatment.
- Site-wide emerald wash or cropping/distorting existing wordmark, covers or letter artwork.
- Regenerated legacy library covers and replacement logo; multi-product collages as final products.
- Disguising digital/AI-made work as physical hand-rendered art; claims of metallic ink or vellum transparency without proofs.
- Privacy-invasive, mixed-user gratitude jars or surprise public sharing of private journals.

## Current review candidate (NOT public production)

- Source integrates PR #6: fixed-width banner CSS, individual leather-style Side Quest selections, **72 new original Side Quest pocket prompts**, reusable double-sided card styles; Daily Cabinet includes 110 Scripture reading invitations and 110 studio-card entries, **partly repurposing the existing 90 Soul Snacks** rather than falsely claiming 220 fully independent manuscripts; private browser-local notes under original storage key.
- Forward-port of PR #5 Teaching Shelf leather CSS and PR #4 interaction QA.
- Full-width header and consistent navigation; restored sample letter using **existing art files**, separate from Kit form.
- Five-viewport, 16-route visual/WCAG checks and user-journey QA are now required in release CI. Review **actual results** for the final commit before calling these complete.
- Existing screenshot evidence: GitHub Actions run `45270024517` artifact `chaotic-sunshine-visual-qa`; these are historical baseline screenshots, **not** signoff for current release.
- Main production and private ChatGPT Sites review are **not** synchronized to this branch. Do not claim preview publication from a local build.

## P0 release blockers

| Gate | Required verification | Status / owner |
| --- | --- | --- |
| V4 original assets | Check exact hashes and full artifact inventory | CI automated; must be green at release SHA |
| Cloudflare apex domain | HTTPS must no longer return 522 | **FAIL: 522 observed 2026-11-25**; needs Cloudflare account/operator |
| www redirect/indexability | Production must not be test/noindex; canonical/robots/sitemap consistent | **FAIL: www is test edition, signup/feedback not connected**; needs deployment/operator |
| Exact preview | Publish SHA-identical staging export, noindex, inspect 1440/768/390 and iPhone | **NOT VERIFIED**; private Sites deploy connection needed |
| Kit live journey | Controlled signup, confirmation, welcome, unsubscribe, consent, fallback | **NOT VERIFIED**; existing form action preserved; Kit owner |
| Hosted downloads | All 11 guides / all PDF editions return valid PDF bytes on real domain | **NOT VERIFIED**; local export tests aren't hosting evidence |
| 90 Scripture / art | Human contextual/biblical/content/rights review with dated records | **NOT VERIFIED**; editor/owner |
| Physical iPhone / assistive tech | Real Safari touch, keyboard/AT | **NOT VERIFIED**; device tester |
| Public support/privacy | Tested support channel, accurate privacy claims and no hidden data collection | **NOT VERIFIED**; owner/legal review |
| Release safety | Required branch checks, monitored origin, protected production, rehearsed rollback | **NOT VERIFIED**; repository/Cloudflare operator |

## P1 high-value improvements

| Area | Current position |
| --- | --- |
| Banner/navigation, responsive shell | Candidate CSS committed; awaiting rendered acceptance |
| Sunshine Mail approved artwork | Candidate restoration committed; screenshot and original-reference comparison required |
| Little Free Library cards/covers | Originals protected, no replacement; link and mobile proof required |
| Daily Cabinet and jar | Data-backed candidate, unique draws and privacy logic; browser tests required |
| Side Quest collections | 72 authored prompts across three categories; 100-per-category idea **not complete** |
| SEO, search | Devotion finder exists; **full-text PDF indexing and unified topic/verse/pain-point search remain open** |
| Social sharing | Per-resource email/SMS/Pinterest and original cover OG metadata **open** |
| Conversion analytics | Currently disabled, setup/consent verification needed |
| Search Console/Bing | Ownership and live indexing not verified |
| Performance/broken links/storage | Automated static and responsive QA, real mobile/edge-case review still needed |

## P2 deferred or gated by earlier approvals

- Add Sacred Scribbles and Wildly Curious Bible as **additional** catalog collections; preserve all free guides and covers.
- One approved artwork/file per SKU, with dimensions, actual material/transparent proof, rights/price/delivery metadata.
- No paid checkout, member accounts, public journal sharing or product availability claims until the owner approves the files and functional/commerce tests are complete.
- Community content needs separate opt-in and moderation. Never mix it with a private jar.

## Acceptance evidence format

For every gate record: route, asset ID, commit SHA, width/device, expected, actual, screenshot/log, status (not tested / failed / passed), owner, date and next action. No invented approval score. Release only after 100% of P0s are verified. If the original is missing, classify it as a blocker and recover; do not draw a substitute.
