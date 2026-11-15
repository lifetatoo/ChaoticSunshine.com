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
