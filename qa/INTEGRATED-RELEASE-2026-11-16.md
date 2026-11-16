# Chaotic Sunshine — unified release candidate

Date: November 16, 2026

## Sources and conservation

- Content, shared art/brand tokens and CI: `design/illustrated-launch-review-2026-11-13` @ `31f1d1990683ea63d202279b27618dbaa04025e0`
- Latest salon website, permanent desktop menu and phone bottom navigation: `salon-release-2026-11-15` @ `af26b3c14058c6d66bb1bc8469dac6db7e76dba2`
- These are combined in a two-parent merge commit so no source branch is rewritten or abandoned.

The integrated tree retains the full salon site, 90 readings, 11 free guides / 21 PDF editions, nine teaching selections, 24 illustrated Side Quests, the daily cabinet, blue-and-magenta library doors, creative studio, animated illustrated Sunshine Mail letter and phone bottom tabs. It also retains the later core updates: shared brand tokens, Kit mailing copy, illustration and Scripture audit register, content/keyword report, updated built HTML checks and browser/axe CI.

## Explicit conflict resolutions

1. `package.json`: salon's single build and QA scripts plus core's static checks.
2. `source/build-site-kit.cjs`: salon share metadata/staging isolation plus the later brand-token CSS and asset-fingerprint corrections.
3. `source/site-chrome.cjs`: salon's added Christian Creativity footer destination plus core's independent sticky base nav. The finished salon presentation keeps its own desktop menu and separate phone bottom tabs.

## Single build and verification contract

- Production build: `npm run build`
- Full static suite: `npm run test:ci`
- Production output: `source/site-kit`
- Preview build: `npm run build:staging`, then `CS_STAGING=1 npm test`
- GitHub Actions: desktop/phone responsive, WCAG axe, actual guide/image links and preview indexing isolation.

## Still open for a public launch

Exact Cloudflare Pages preview link tied to the release SHA; apex/www DNS and redirects; live robots/sitemap responses; real Kit signup including CAPTCHA/double-opt-in/welcome/unsubscribe; public PDF URLs; physical iPhone Safari and assistive technology; editorial and artwork approvals; actual GA4/Search Console/Bing ownership; monitored contact channel; rollback evidence. Do not label any of these as passed just because the code is merged.

The integration branch is not `main` and is not publicly deployed by this merge.
