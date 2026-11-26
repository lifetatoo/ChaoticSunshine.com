# Chaotic Sunshine Studio production punch list

November 25, 2026. Release base is GitHub staging at `4c88f2df` plus the Living Studio carryover. Amy reviews the rendered candidate before production promotion.

## P0 · Release blockers

| Work | Status | Done when |
| --- | --- | --- |
| Restore the public host | Apex returned HTTP 522. The www homepage returned 200 on a separate URL. | Apex serves the correct HTTPS release. www permanently redirects to the apex and preserves paths and query strings. Confirm DNS, TLS, origin health, and the final response from outside the dashboard. |
| Review the actual staging build | Local exports pass. Hosted equivalence and real-phone review are open. | Staging identifies the Git SHA under review and is noindex. Amy approves desktop and phone views of the masthead, Library, Shelf, Cabinet, Side Quests, and Sunshine Mail. Check keyboard focus, reduced motion, envelope cropping, and the drawer categories. |
| Run Sunshine Mail end to end | The export references Kit form 10182939. | A controlled signup confirms submission, consent or confirmation, the welcome redirect, actual email delivery, and unsubscribe. Open the sample independently of signup. Verify the contact channel and match privacy copy to actual local note and form behavior. |
| Review publication copy, Scripture, and rights | Repo reports 90 Soul Snack manuscripts awaiting final editorial approval. | Proofread public headings, buttons, form states, abstracts, and downloads. Read each intended manuscript and teaching sheet against its referenced passage. Record Bible translation and required notices, author and art credits, asset and font rights, and PDF reuse terms. Hold any unapproved materials from launch. |
| Check live routes and downloads | Local suites pass. | Check nav and legacy redirects, every guide and its 21 PDF editions, support links, production canonicals, noindex exceptions, robots, sitemap, JSON-LD, and representative share previews. Confirm 404 and mobile PDF behavior. |
| Promote and monitor | Pending approval and the checks above. | Record the approved SHA and rollback deployment. Promote that candidate, repeat the public smoke tests, and monitor errors, form conversions, and indexing. |

## P1 · Final polish for the review build

- Copyedit Side Quests so the 24 fuller adventures and 72 quick invitations each have an obvious entry point. Test that each new Field Note stays with its own mission, downloads correctly, and clears on reload.
- Compare the full Sunshine Mail composition with the approved envelope and illustrated letter on a physical phone. Proof the monthly promise and check the real welcome letter, accessible reading view, and success and error copy.
- Inspect all main page families for muddy backgrounds, weak contrast, uneven masthead or banner width, and mobile spacing. Fix CSS around original art while protecting the artwork files.
- Review the art registry for repeated images and incorrect credits or assignments. Verify the exact Table Talks full cover against the original archive. The verified product card can serve where a product-card treatment is appropriate.
- Remove any prototype wording and review labels from public page copy and browser titles. Align naming, CTA wording, capitalization, punctuation, and copyright notices across the site and PDFs.

## P2 · After a stable launch

- Check Search Console and Bing ownership, submit the sitemap, and monitor indexed pages and top queries.
- Review signup and download paths using actual measurement and consent settings. Prioritize new illustrations from the registry based on repetition and reader usage.
- Test guide and vellum print proofs and finish product rights and checkout before offering paid editions.

## Build evidence

- Local production and staging exports passed. Release checks covered 148 pages, 144 sitemap URLs, 55 protected originals, 24 missions, 72 pocket cards, and 11 fully indexed PDFs.
- The Living Studio prototype contains three mission samples already represented in the larger site. Its in-page Field Notes were carried across. Its book folios contain sample copy and reused artwork. The current site already has collection routes and the Sunshine Mail sample.
