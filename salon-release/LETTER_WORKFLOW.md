# Sunshine Mail: reusable envelope and separate issues

The authoritative source is lifetatoo/ChaoticSunshine.com on salon-release-2026-11-15 (draft PR #2). The private Sites review is a deployment copy, not an independent design source.

The envelope shell is assets/sunshine-envelope-shell-v1.webp. It has transparent surroundings and contains no letter or seasonal illustration. The same asset is layered behind and in front of a separate paper element. Only that paper moves. Its front mask preserves the envelope's centered V, ribbon, seal and stamp.

Each issue lives in letters.json: stable issue ID, title, label, description, artwork path, meaningful alt text and clear-text blocks. Add the optimized artwork to assets/, add a new issue record, and change current only when approved. Existing issues can be opened with welcome.html?letter=ISSUE_ID. Unknown IDs safely fall back to current. No email is sent or scheduled by changing the issue.

Keep prior issue assets and records for stable email links. For this initial release only the approved welcome issue exists. Do not invent a new seasonal letter as a placeholder.

Run npm run build for production or npm run build:staging for noindex review. Both generate the initial welcome markup from the same issue data and component used by the interactive view. Run npm test (CS_STAGING=1 for staging). Output remains source/site-kit. The build injects letter-system.js into app.js before its single final render; do not hand-edit generated app.js.

Acceptance: envelope geometry stays fixed; paper lifts smoothly; reader heading receives focus after the reveal; clear-text view works; full-screen artwork uses a native dialog, Escape and close restore focus; return tucks the letter away; reduced-motion removes transitions; 320/375/430px widths have no horizontal overflow; no-JavaScript has direct artwork and complete text; printing targets the active letter.

Opening a letter never implies subscription. Kit delivery and public-domain launch remain separate acceptance gates. Actual iPhone Safari and screen-reader acceptance have not been certified by desktop Chrome tests.
