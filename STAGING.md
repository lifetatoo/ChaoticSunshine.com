# Design review staging

Review branch: `staging`. Do not merge or promote to production before Amy reviews the rendered website.

Cloudflare Pages preview configuration:

- Keep the current production branch and deployment unchanged.
- Enable preview deployments for `staging`.
- Build command: `npm run build`.
- Build output directory: `source/site-kit`.
- Preview environment variable: `CS_STAGING=1`.
- Do not set `CS_STAGING` in production.

Alternatively `npm run build:staging` creates the same preview output locally. Preview responses include `X-Robots-Tag: noindex, nofollow` and robots.txt disallows crawling. Canonicals remain on the intended production domain. This controls search indexing, not access: preview URLs may be publicly accessible.

An existing direct-upload Pages project may need a separate Git-connected preview project; do not replace the live project just to enable staging. A GitHub branch alone does not host the website.

Verification: run `npm run build && npm test` for production checks, then `npm run build:staging` and inspect `_headers` and `robots.txt` for preview directives. Live forms still target Kit; do not create test subscribers without a controlled test inbox.
