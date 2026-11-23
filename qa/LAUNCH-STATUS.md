# Chaotic Sunshine Pilot — implementation and release gates
As of 2026-11-15. Owner approval remains required. This is the pilot branch, not a production release.

## What was changed on the draft branch
- Shared semantic jewel-tone tokens coordinate base and polish palette and common controls, preserving the original purple brush wordmark and editorial artwork. Legacy component-specific color literals still exist. This is partial consolidation, not completion of all 100 recommendations.
- Sunshine Mail source copy is now a free monthly DIGITAL letter by email. Retired Mail Club wording was removed from HTML alt text; embedded artwork needs visual approval.
- Navigation is now a narrow, sticky horizontal bar directly below the masthead; it scrolls horizontally rather than opening a drawer at phone widths.
- CI builds the generated site and checks metadata, local assets, PDF presence and mail form action. Browser QA checks Chrome at 1440/390/320px widths and saves screenshots.
- Human meaning-based review checklist added for all 90 devotional illustration assignments; no assignment is automatically considered approved.
- No change to production deployment, Kit account, analytics account or external feedback.

## Latest objective QA evidence
- Successful GitHub Actions CI run, with screenshots attached as artifacts.
- 139 content HTML pages + 404, 394 copied assets, 21/21 guide PDF editions.
- Static check of 140 HTML files, 1,706 asset links, 21 PDFs: zero findings.
- Rendered Chromium review: 33 page/profile cases (11 templates by 1440/390/320px); zero detected errors in page status, overflow, broken images, JavaScript, sticky navigation or automated axe accessibility; 12 screenshot previews.
- Not verified: published site, production email, physical device, human screen reader, theological review for all 90.

## Mandatory release blockers
| Gate | Status | Evidence required |
|---|---|---|
| Version-matched Cloudflare preview URL | BLOCKED | Staging URL, exact SHA, owner-approved screenshots |
| Sitewide visual and mobile navigation approval | REVIEW | Phone and desktop screenshot acceptance |
| 90 devotional image-to-meaning reviews | INCOMPLETE | Individual signed-off art/scripture results |
| Kit signup, confirm, welcome, unsubscribe | BLOCKED | Controlled real signup proof |
| 21 hosted PDF downloads | BLOCKED | Actual staging URL HTTP checks and manual opening |
| Apex/www redirects, robots, canonical, sitemap | BLOCKED | Live headers and indexing check |
| Analytics and conversion events | BLOCKED | Account-provided GA4 and Search Console, observed test events |
| Monitored support contact | BLOCKED | Tested contact route and delivered reply |
| Physical iPhone/Android and screen reader review | BLOCKED | Manual interaction evidence |
| Cloudflare rollback | BLOCKED | Previous deployment ID, rollback exercise and approval |

Do not merge or promote the draft PR without closing the P0 gates. P1/P2 entries from the 100-point audit remain a prioritized backlog, not verified defects or automatically completed actions.

## Verified November 15 rendered/domain observations

- Last browser CI: https://github.com/lifetatoo/ChaoticSunshine.com/actions/runs/43729226215 — 33 Chrome cases, 0 automated findings; 12 viewport screenshots. These are generated pilot screenshots, not public deployment screenshots.
- **Artwork blocker**: the actual desktop Sunshine Mail artwork still visibly contains the retired words "SUNSHINE MAIL CLUB" on the artwork, despite the corrected alt text and surrounding prose. Replace the source WebP artwork and inspect the desktop/phone results, then rerun CI.
- **Production routing blocker**: the external public-domain check in the same workflow returned `HTTP/2 522` for apex `https://chaoticsunshine.com/` and `HTTP/2 200` plus `x-robots-tag: noindex, nofollow` for `https://www.chaoticsunshine.com/`. This confirms that production indexing/routing is not ready at the moment checked; the pilot build itself was not deployed.
- Cloudflare access and live Kit confirmation remain unverified. Do not confuse the successful CI run with approved launch readiness.


## November 23 print UX quality pass (pilot branch only)

- Added a single consistent print/download panel on all 11 current Free Library guide detail pages.
- For guides that already include a separate printable PDF, the link says **Print white-paper PDF** and opens the actual PDF in a new tab. Where there is no separate print PDF, it explicitly says **Open PDF to print** rather than falsely labeling the illustrated file ink-friendly. Mobile instructions direct readers to Share → Print.
- A future optional `printSheets.file` source mapping supports a third **Print worksheet pages** action, but sheets appear only after a file is actually copied to `/guides/`. No broken or placeholder sheet links are created.
- Full PDF assets for five **new** Teaching Studio guides have not been added to this repository, so these new products are not yet linked or shown as published. Their separate white-paper print editions exist in the local release deliverables and must be uploaded with the illustrated PDFs before pilot deployment.
- The draft PR remains unmerged. Do not promote to production without staging and manual phone/tablet print testing. Browser automation checks only PDF availability, not success of the device OS print dialog.


**Print-label correction, Nov 23:** Existing legacy "print-friendly" editions are not all documented as pure-white background. The panel labels these accurately as **Print-friendly PDF** rather than claiming white pages. Only future guides with confirmed white output should set `printWhite:true` in their resource metadata and receive the **Print white-paper PDF** label. The new five Teaching Studio white-paper editions have been generated separately but are not hosted in this draft repository yet.
