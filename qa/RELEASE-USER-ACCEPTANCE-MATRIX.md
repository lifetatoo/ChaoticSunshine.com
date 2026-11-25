# Chaotic Sunshine — user journeys, acceptance criteria, automated QA, and launch hit list

**Baseline:** November 16, 2026. Canonical source is draft integrated release PR #3 (merge 3bdb5f4653b2d993b2bde79e2ef9aff79255ea72). This QA extension is proposed in PR #4 and does not change the website or deploy production.

## Goal and non-negotiable rules

The objective is a website that can receive visitors, deliver usable Scripture-centered content and printable resources, confirm real Sunshine Mail subscriptions, and recover from common failures **without routine owner troubleshooting**. There is no valid "maintenance-free" guarantee; prevention, observability, rollback, and a named operator minimize intervention.

- One canonical source (GitHub integrated branch, then main after approval); one build command; one SHA-identical Cloudflare preview; documented rollback.
- Preserve 90 readings, 11 guides and 21 guide PDF editions, 9 teaching selections, 24 Side Quests, rotating catalog and existing creative/letter artwork. Do not silently overwrite or shrink content.
- Monthly **digital** Sunshine Mail, free guides ungated, no fictional mailing frequency, no hidden unconfigured payments or gated forms.
- Preserve the adult editorial jewel-tone collage and real illustrated teaching art. No generic beige redesign, artificial filler, or unapproved changes to Scripture.
- Reader privacy by default: journaling and gratitude stay in browser; exports should work; no invisible data transmission.
- Every deployed change must come from an audited PR, pass automated user journeys, and have an identifiable source SHA.

## User personas and key experiences

1. **First-time mobile reader:** Arrives via a social post and needs to understand the free faith-and-art offer in seconds, find a reading and follow a coherent next action.
2. **Returning reader:** Opens a Soul Snack, switches reading mode, continues, saves or prints, and recovers a private draft.
3. **Resource seeker / group leader:** Finds one of 11 guides, chooses color/print edition, opens the right PDF, and optionally finds a related teaching sheet.
4. **Daily cabinet visitor:** Opens a consistent daily card, flips for context and attribution, picks another, and keeps or exports a private observation.
5. **Side Quest explorer:** Filters 24 missions, navigates, downloads a field note, and can share a story only by deliberate choice.
6. **Email subscriber:** Understands Sunshine Mail's offer, enters an email, passes confirmation, receives a working illustrated welcome, and can unsubscribe.
7. **Accessibility/offline-oriented reader:** Uses keyboard, screen reader, zoom, reduced motion, disabled JS, or unreliable connectivity without becoming locked out.
8. **Publisher/operator:** Changes content once, verifies it, deploys safely, sees any errors with actionable diagnostics, and can roll back without involvement from the owner.

## Full screen-family and function map

| ID | Screen family (representative route) | Happy path | Failure/recovery cases | Auto/manual acceptance |
|---|---|---|---|---|
| U01 | Home (/) + shared masthead/footer | Understand promise; Read, Library, Teachings, Daily card, Make, Quests, Sunshine Mail | 320px overflow; broken navigation; 404; lost keyboard focus; no-JS | Browser checks all nav targets, desktop sticky nav, phone bottom 4 tabs + More; manual recognition test |
| U02 | Topic chooser (/start) | Topic -> matching Soul Snack -> back to topic | Empty topic; misleading category label; unrelated reading; duplicate link | Route integrity automatic; relevance editorial |
| U03 | Soul Snacks hub (/soul-snacks) | Choose short/medium/long -> readable matching devotion | Empty length; wrong order; loading error; keyboard-only use | 30/30/30 content integrity, navigation, readability, human editorial |
| U04 | Reading pages (/soul-snack-01 through -90) | Read Scripture, see original teaching artwork, quiet mode, reflect, prev/next, print | Missing/incorrect art, mismatched verse, broken next/back, draft loss, print clipping | All 90 structural; sample live interactions; all 90 contextual review |
| U05 | The Little Free Library (/freebies) | Open blue/magenta doors -> search -> select a guide | Wrong cover, hidden book focus, zero results, search clearing, no-JS fallback | 11 books exact, keyboard handles, filter and empty state |
| U06 | Guide pages (11 routes) | Read overview -> preview -> direct color/print PDF | Wrong file, missing edition, file served as HTML, incomplete PDF, password/gate | Validate binary %PDF signature, 21 paths and nonempty content; spot-check text visually |
| U07 | Teaching Shelf (/teaching-shelf and 9 details) | Pull spine -> display original teaching sheet -> direct PDF | Missing attribution, wrong spine preview, broken links | All nine selections, download integrity and teaching context |
| U08 | Daily Cabinet (/daily-cabinet) | Deterministic local-day card -> flip for context -> another -> drawer filters | Repeat too soon; stale rotation; incorrect source; missing card library; midnight/time zone rollover | Six starter cards currently exist; content source/rotation expansion requires editorial import |
| U09 | Gratitude jar (on /daily-cabinet) | Add -> persist -> pull -> export -> clear with confirmation | Storage disabled/quota full, accidental deletion, blank input, XSS-like text | Tested storage, export and two-step destructive action; verify nothing sent |
| U10 | Side Quest Society (/side-quests) | Filter -> next/previous/surprise -> follow one of 24 missions -> field notes | Wrong art/quest, broken deep links, search zero results, private notes leaked | 24 mission integrity and sample interactive state; specific art-context review |
| U11 | Read · Make · Try · Share (/make, /try, /share) | Read -> write/draw -> plan a small practice -> optionally copy/export/share | Reload loses draft, accidental upload, drawing unusable on touch, untrusted HTML executed | Draft persistence, downloadable files, tap/keyboard tests, privacy statements |
| U12 | Sunshine Mail (/subscribe and footer forms) | See monthly digital value -> fill -> Kit POST -> CAPTCHA/confirmation -> welcome email | Blank/invalid/duplicate email, bot trap, Kit unavailable, missing redirect, no delivery, unsubscribe fails | Mock browser POST for code; real controlled subscriber required for provider acceptance |
| U13 | Illustrated letter (/welcome?letter=ID) | Open envelope -> letter emerges -> readable art/text -> zoom/print -> tuck away | Bent envelope, missing issue, no JavaScript, focus trap, reduced-motion broken, old links | Browser interaction and 320px checks; real iPhone visual and accessibility review |
| U14 | Privacy/About/permissions/contact | Learn who writes, how data works, how to use printables, how to reach support | False privacy claim, broken reply address, unclear rights/collection | Copy and link audit; controlled support message |
| U15 | Error pages and global SEO | 404 recovers, canonical links, sitemap, share cards, robots | Apex 522, www noindex, duplicate canonical, stale preview indexed | Automatic static + live HTTP/sitemap test, exact release SHA |
| U16 | Publisher operation | Make content update -> PR -> QA -> preview -> signoff -> production -> monitor | Wrong branch deployed, rollback unavailable, tests bypassed, untracked change | Branch protections/review requirements, deployment verification, rollback exercise |

Treat 145 HTML outputs as these reusable functional families plus 90 devotion, 11 guide and 9 teaching data variants. Do not hand-click all 145 on every release: exhaustive **data and link** checks plus targeted **interaction** checks for each family are a better balance.

## Executable automated scenarios in QA PR #4

- U01 Home/main menu across 1440, 390 and 320 pixels, bottom tabs + More
- U02 Reading, quiet mode and next devotion
- U03 Interactive library handles, search, zero-result fallback
- U04 Guide PDF HTTP bytes and PDF signature
- U05 Teaching Shelf nine-spine selection and working PDF
- U06 Daily card flip, another card, studio category
- U07 Gratitude add/reload/pull/export/two-stage clear
- U08 Side Quest next/back and category filter
- U09 Studio private writing reload, export and sketch mode
- U10 Try and Share private draft persistence
- U11 Kit form required-field validation + fake local intercepted POST (NO REAL SUBSCRIPTION)
- U12 Sunshine Mail illustrated envelope, text view, art modal and return
- U13 No-JavaScript accessibility for home, library, reading, welcome, subscription

A passing mocked Kit POST only validates the HTML/client integration. It never validates CAPTCHA, double opt-in, subscriber creation, actual welcome sending, delivery, spam folder, deduplication, or unsubscribe.

## Required testing layers and evidence

| Gate | When | Automated action | Pass rule |
|---|---|---|---|
| G0 Source and policy | Each PR | Verify one build path, source data schema, no secrets/placeholder forms, no asset loss, no broken source references | 0 critical violations |
| G1 Generated static export | Each PR | Build 145 pages; titles, schema, canonicals, no accidental noindex; assets, 21 PDF editions, link targets and HTML integrity | 0 errors; page/asset counts don't regress unexpectedly |
| G2 Browser interaction | Each PR | Playwright desktop + phone, screenshot review, keyboard, axe accessibility, 12 functional scenarios plus no-JS | 100% P0 scenarios; no critical/serious WCAG violations |
| G3 Preview environment | Before merging to main | SHA-matched Cloudflare deploy; phone/manual flow, PDF 200 and %PDF, preview not indexable, console quiet | Preview URL, SHA and signed result recorded |
| G4 Live service acceptance | Before public promotion | Real Kit test address, confirm, welcome, unsubscribe; apex + www redirects; site HTTP and indexing; support delivery | Real-world evidence for every critical pathway |
| G5 Production safety | At deployment and after | Smoke tests from external client, monitor DNS/sitemap/home/form action/PDF, confirm analytics and rollback | Automatic block on mismatch; rollback on critical failure, page operator |
| G6 Ongoing quality | Per content update; daily or weekly monitors | Rebuild and regress; scan for expired artwork/license, incorrect citations, blocked pages, monitor workflows | No unreviewed content or operational drift |

### Test-fixture hygiene

Use test IDs, disposable browser contexts, an email address reserved for intentional provider testing, and zero real payments. All saved local QA notes should be cleaned up. Mock network requests at browser level; do not bypass or solve CAPTCHA. Keep evidence for the actual release SHA and do not assume yesterday's green run proves a new commit.

## Weighted evaluation rubric

| Category | Weight | Pass criteria |
|---|---:|---|
| Functionality and navigational task completion | 20 | 100% critical task completion; >=95% of the full matrix |
| Scripture, source integrity and editorial/brand fidelity | 15 | 0 incorrect attributions; approved content and art mapping |
| Accessibility and inclusive usability | 15 | WCAG 2.2 AA target; keyboard/reduced motion/zoom/focus/no-JS verified |
| Conversion, privacy and trust | 15 | Verified signup lifecycle, stated frequency, no unintended sharing |
| Search/crawl readiness | 10 | 200/301 correct, indexability, canonicals, sitemap, valid schema |
| Performance and mobile resilience | 10 | p75 LCP <=2.5s, INP <=200ms, CLS <=0.1 on real traffic; asset budgets |
| Reliability, errors and recoverability | 10 | No critical console errors; 404/failure recovery; rollback proven |
| Operator independence and maintainability | 5 | One-source deployments, monitoring and clear runbook/owner |
| **Total** | **100** | **>=90 overall AND every P0 gate green** |

A high average score cannot override any P0 blocker. Performance targets must be measured in production or meaningful field conditions; a fast localhost run is not a substitute.

## Launch repair hit list (verified / pending, not a generic wishlist)

### P0 — block public production until resolved

| ID | Work | Status on 2026-11-16 | Verifiable completion |
|---|---|---|---|
| P0-01 | Repair Cloudflare apex route (522) | **Confirmed failing** in GitHub CI live probe | HTTPS 200 at apex without timeout; durable status from external probes |
| P0-02 | Remove public www noindex and settle canonical redirect | **Confirmed failing** in same probe | One canonical hostname; 301/308 alternate; production pages indexable |
| P0-03 | Prove Cloudflare preview comes from the integrated SHA | **No evidence** | Deploy URL and SHA artifact match PR #3; not an older pilot |
| P0-04 | Verify 12 key end-to-end user flows on generated site | **QA PR #4** | New browser matrix green; found defects fixed and rerun |
| P0-05 | Run actual controlled Kit lifecycle | **Unverified** | Submit, CAPTCHA, opt-in confirmation, Kit record, welcome delivery, unsubscribe and duplicate behavior |
| P0-06 | Verify hosted free downloads | **Local build passed, hosted unverified** | 21 public PDF endpoints + nine teaching files correct and readable |
| P0-07 | Confirm actual privacy, support and policies | **Support channel unknown, feedback disabled** | Legal/privacy copy agrees with storage; monitored inbound support contact and response test |
| P0-08 | Review/approve 90 devotional Scripture and image mappings | **90 pending** in editorial source | Zero inaccurate verses, false interpretation/attributions, mismatched art; owner/editor signoff or keep pending pages unpublished |
| P0-09 | Validate real iPhone Safari and assistive technology | **Only browser emulation** | Navigation, downloads, keyboard/screen reader, envelope, touch sketch and zoom work |
| P0-10 | Record production rollback recovery | **No rehearsal evidence** | One-click or documented tested rollback to known good deployment; rehearsal logged |
| P0-11 | Approve production host/noindex/redirect/sitemap | **Unverified live** | Real HTTP/headers/robots/sitemap/social cards from release SHA |
| P0-12 | Restrict deployment to approved SHA after all gates | **Main untouched, PR #3 still draft** | Branch protection, required checks, build output configured and change freeze |

### P1 — high value; address before broad marketing / full feature claims

| ID | Work | Status | Acceptance |
|---|---|---|---|
| P1-01 | Replace six-card Daily Cabinet starter rotation with approved catalog | **Six cards only; cycles every six calendar days** | Import verified Claude data, citations and stable rotation, test across day/timezone |
| P1-02 | Make sure daily-card product description matches inventory | **Current experience promises a daily selection** | No claims of 365 if only six; choose between full import or honest soft-launch wording |
| P1-03 | Verify article and guide SEO search-intent summaries | **Audit recommendations unimplemented** | 12 first-priority pages, truthful titles/descriptions; no keyword stuffing |
| P1-04 | Connect production analytics/conversion monitoring | **Disabled in configuration** | Real property, consent behavior, events for form attempt/confirmed subscriber/download; no false conversion counts |
| P1-05 | Verify Search Console and Bing ownership | **Not evidenced** | Verified hosts and sitemap submissions |
| P1-06 | Establish daily public HTTP / form / PDF synthetic checks | **Only PR-time public probe** | Failures detected automatically; ticket/escalation routed to operator |
| P1-07 | Set meaningful performance budgets | **Not measured against public host** | Field measurements and transfer/asset budgets with regression checks |
| P1-08 | Expand user journeys to WebKit / Android physical spot checks | **Only CI Chromium matrix** | No Safari/touch-specific navigation, drawing, PDF failures |
| P1-09 | Normalize private-data lifecycle | **Local/session storage present** | Clear storage explanations, export, retention, private browsing and quota failure behavior |
| P1-10 | Expose useful error states, especially provider failures | **Live service responses untested** | User sees next safe step if Kit/download/provider is unavailable |
| P1-11 | Fix QA/editorial review document formatting | **90-day review file malformed with slash-separated letters** | Readable, editable checklist with one status per reading |
| P1-12 | Verify Sunshine Mail welcome art and name in image itself | **Prior artwork had retired "Mail Club" text** | Check *rendered* final art and alternate text, not copy alone |

### P2 — deliberately defer without risking a trustworthy first release

- Favorites/history across sessions, public comments and submissions
- Membership, checkout and paid book sales
- Full 365-card editorial calendar beyond the immediate promised rotation, if not used in launch marketing
- Advanced search personalization and community photo feeds
- New 90-article SEO rewrite, new design systems and unrequested artwork variations
- Additional animation, advanced analytics, A/B testing before baseline traffic exists

## Operating without routine owner intervention

1. **Prevention:** All content and code changes occur through PRs with required checks. Main is protected; generated site is never hand-edited.
2. **Detection:** Scheduled health probes check both hosts, key landing pages, sitemap, assets, a sample PDF and basic Kit form wiring. Never auto-submit fake subscribers every hour.
3. **Containment:** If a critical check fails, block promotion; after a known-bad deployment, automatically revert only when a safe, tested Cloudflare rollback automation has been provisioned and approved. Do not guess deployment IDs.
4. **Resolution:** Failed tests open a reproducible GitHub issue with route, expected/actual, release SHA, screenshot/log and severity. Assign a developer/operator, not the content owner, for routine incidents.
5. **Escalation:** Only alert the owner for release approvals, security/privacy incidents, editorial integrity, unresolved P0 business choices, or a true recovery that needs account-level consent.
6. **Cadence:** CI on every PR; brief daily health check; weekly synthetic and dependency review; monthly content, inbox delivery and backup validation; quarterly rollback drill.
7. **Single record:** PR #3 is the release candidate; this test matrix is the canonical QA plan. Do not spawn parallel source-of-truth boards.

## Final go/no-go

**GO** only if (a) all P0 are green with evidence, (b) functional cases pass on exact preview SHA, (c) owner signs off representative artwork, (d) monitoring and rollback are active and verified, and (e) no known critical errors remain. If any gate fails, keep the current production site undisturbed and repair the specific defect.

**No account changes, public deployment, Kit subscriber creation or main-branch merge are performed by these tests.**
