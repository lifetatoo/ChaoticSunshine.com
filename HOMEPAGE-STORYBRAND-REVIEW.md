# A warmer front door for Chaotic Sunshine

Design and conversion review · November 13, 2026

## What needed fixing

StoryBrand principles were present, but split between two entrances. The homepage described resources; the first menu item, “Start Here,” led to “Which one sounds like today?” before making readers feel welcomed or explaining the benefit. Repeating choices and putting a large signup section early interrupted discovery. The visual system also mixed the richly layered masthead with flatter, differently styled content panels.

This revision applies the public StoryBrand framework. It is an editorial and design interpretation, not a review or endorsement by Donald Miller.

## The reader’s story

| StoryBrand element | Application |
| --- | --- |
| Reader / hero | A woman who wants to understand Scripture, grow in faith, and find room for joy in an ordinary, busy, sometimes difficult life. |
| Want | A meaningful encounter with God’s Word and something useful to carry into the day. |
| Problem | Mental noise, tiredness, questions, and the sense that faith has become another thing to get right. Too many unexplained options create another small burden. |
| Guide | Amy Grace offers an illustrated journal, honest reflections, and real printable resources. Her story appears after visitors experience what the work offers. |
| Simple plan | Find your page → let a little truth in → carry something good. Each numbered paper card opens to an explanation and a working destination. |
| Primary action | “Read a devotion” opens an actual reading, with a non-JavaScript fallback. |
| Supporting actions | Open the free library; explore teaching illustrations; find a page through feeling cards. |
| Transitional conversion | Preview an entire illustrated letter and subscribe to one free Sunday letter a month. The frequency and unsubscribe choice remain explicit. |
| Stakes | Avoid making a useful beginning feel like another assignment or leaving readers lost among resources. The copy does not use spiritual guilt or threats to force signup. |
| Success | Understand a passage, ask an honest question, pray in one’s own voice, or try one small response. The site promises useful ways to engage, not an easy life or guaranteed emotional result. |

Primary framework references: [Your brand is not the hero](https://storybrand.com/downloads/your-brand-is-not-the-hero.pdf) and [Five things your website should include](https://storybrand.com/downloads/5-Things-Your-Website-Should-Include.pdf).

## Implemented page flow

1. **Welcome and benefit.** “Grow deeper in faith. Make room for a little joy.” Plain-language supporting text explains the illustrated journal, free library, Scripture, and practical response. The cold coffee / fourteen tabs detail brings a little recognition and humor.
2. **A clear next click.** A primary reading button, free-library link, accurate content counts, and a modest monthly-letter invitation appear in the opening. No email is required to begin.
3. **A simple plan.** Three numbered, taped paper cards explain how the experience works. Readers can open them with keyboard or touch.
4. **Three tangible destinations.** Soul Snacks, the little free library, and the original Teaching Shelf each have artwork, a useful description, and an explicit link. The teaching illustrations keep their own identity.
5. **Reasons to linger.** The existing everyday-life story, real sample teaching, featured guide, and Amy’s introduction remain. These provide substance before the main email invitation.
6. **A letter worth opening.** The dimensional Sunshine Mail artwork, complete illustrated sample letter, and existing Kit form follow the content. The footer’s compact envelope remains available across the site.

## Navigation and guided discovery

“Start Here” is now **Find Your Page** in the header and footer. The existing `/start` route remains intact so bookmarks and links continue to work.

The destination opens with **“Your day is welcome here.”** It explains the experience before showing the nine-card chooser. “Pick a little of what you need” introduces the game after the welcome. Deal, flip, return, and direct reading links remain functional.

## A consistent illustrated studio

- Keep the large transparent wordmark and approved jewel-paper masthead.
- Repeat cream paper, peacock teal, cobalt, plum, restrained raspberry, gold tape, and cloth-like bindings throughout the body.
- Use serif headings for clear hierarchy, brush lettering for an occasional accent, and a handwritten face for short notes. Keep prose in the readable body font.
- Use shared spacing, small paper shadows, and repeated colored edges. Give each page its functional character: library doors, teaching sheets, author scrapbook, journal spread, and letter envelope.
- Remove the artificial change from rich artwork to unrelated corporate-looking panels. Reading areas stay light and spacious; textures belong in stationery and surroundings.
- Keep the journal-caption text wholly on the left paper page, clear of the ribbon bookmark.

The shared styling applies to all 139 generated HTML pages, including the 404 page. Representative page families receive browser checks; this does not claim every pixel of every page was manually reviewed.

## Restoring the visible illustrated journal

The individual art had not been deleted. The narrow-screen script automatically collapsed the illustrated side at widths up to 760 pixels, including the in-app side panel. That made a defining part of the journal disappear from first view.

All 90 devotional pages now open with their own illustrated teaching/Scripture card visible at every width. A reader can fold the illustration manually, skip to the prose, or choose plain reading view. A visible “See today’s illustrated card” link returns from the reading and restores the illustrated view. Previous/next page-turn animation, motion preferences, Scripture passages, save/share controls, and original artwork remain.

## Conversion validation after release

Treat the new opening as a testable hypothesis, not a proven conversion lift. With real, consented analytics enabled, compare:

- Homepage visitors who open a devotional.
- Guide and teaching-sheet exploration and download clicks.
- Use of Find Your Page and onward reading.
- Homepage-to-letter interest and form submissions.
- Confirmed subscriptions in Kit, separately from form-submit events.
- Return visits and saved-reading use, when measurable without collecting private reflection text.

Do not count a form submission as a confirmed subscriber or a download click as a completed download. No invented conversion targets or results are presented here. Account settings, the email sequence, and live deployment are outside this design pass.

## Validation record

See `qa/front-door-brand-results.json` for page-family rendering, accessibility-rule checks, local references, and shared interactions. See `qa/front-door-interactions.json` for the four-width front-door/journal checks and the 90 distinct artwork references. These are browser-emulation checks, not physical-device certification.

## Follow-up: a clear journal workflow and richer illustration

The earlier “Find Your Page” label has now become **Browse Topics**. Soul Snacks has a single primary workflow: choose short, medium, or long; open the journal; read and turn within that selected length. Repeated topic grids, pace lists, teaching promotions, and “where it aches” sections were removed from that entrance. Topic discovery lives on its own illustrated nine-card page. The Teaching Shelf is a separate destination with a cream, high-contrast preview link.

The narrow-screen art-collapse issue was separate from a second problem: the preview process had stopped, producing a connection-refused error on the next navigation. The preview now runs as a hidden background process, with an idempotent restart helper. The source page-turn links and the real rendered navigation were checked in both directions.

All 90 original teaching/Scripture cards remain. Nine new watercolor-and-colored-pencil object scenes are assigned across the readings. The remaining semantic review must prioritize the meaning of each passage over a forced rotation. Day 2 now uses the name-tag/mirror scene rather than a cassette. Purple, teal, raspberry, cobalt, and emerald bindings rotate. Six optional creative exercise types include sketching, color annotation, paper collage, a postcard prayer, speech bubbles, and verse-word hunts with a reveal control. Coloring links lead to the existing Fully Family guide rather than an unbuilt resource.

The existing Side Quest Society HTML in Amy’s Downloads folder contains 24 real missions. Those missions now have a separate page and optional interludes on 24 journal pages. The larger collection concept is not advertised as completed. Field-note downloads are private text files; no unconnected submission form is shown.

Reading preferences live behind “Reading options”; the button labels state the next action. Print/save PDF, bookmarking, sharing, and private reflection appear after the reading. Reflections are not public comments or messages to Amy.

## Search and evidence audit

The launch keyword map was checked against the current templates. Public introductions and titles use established terms: Christian devotions, short devotionals for women, free illustrated Bible guides, Bible journaling, free Bible study printables, and original teaching illustrations where the resource actually supports them. Creative page headlines remain intact. Historical keyword-volume estimates were not represented as new research or ranking guarantees.

The current build has 139 unique page titles and descriptions across its 139 non-404 pages. Eight duplicate teaching-sheet descriptions were replaced with accurate sheet-specific summaries. The structured-data audit verifies 90 `BlogPosting` entries, 17 collection pages, 20 learning resources, consistent brand/website/author identities, and the real 24-item Side Quest list. The sitemap includes the new page and excludes the welcome and 404 pages. Dates, social profiles, analytics IDs, and endorsements have not been invented.

Consent-aware event hooks distinguish journal opening, page turning, creative-prompt opening, mission opening, reading clicks, file clicks, and form submissions. The project still needs its actual analytics property connected and tested; these are not claims of collected traffic or confirmed subscriptions.

Drawing-and-memory wording is grounded in [Wammes and colleagues’ drawing-effect research](https://uwspace.uwaterloo.ca/items/a8b52734-18f3-4527-8be2-008a105c85f2). The study concerns recall tasks, not a guarantee that every sketch improves Bible learning. A [small art-making study](https://pmc.ncbi.nlm.nih.gov/articles/PMC5004743/) found changes in stress markers after a 45-minute session; it does not establish that a quick doodle treats anxiety. The website offers a creative pause without making a clinical treatment claim.

The corrected method graphic is kept outside the public build. Its Bible text is typeset from [Romans 8:15–16, KJV](https://www.biblegateway.com/passage/?search=Romans%208%3A15-16&version=KJV), the envelope construction was corrected, and the actual approved transparent wordmark was placed without redrawing its strokes.

Current validation: `qa/journal-studio-layouts.json`, `qa/journal-studio-interactions.json`, and `qa/sunshine-letter-detail-results.json`. Earlier reports record earlier versions of the design and should be read as history.

## Side Quest cabinet refinement

The long mission grid has been replaced with one illustrated mission at a time. Twenty-four distinct new hand-drawn scenes map directly to the 24 activities, including journal interludes. A one-third illustration and two-thirds description composition on desktop becomes a compact illustrated heading and full-width task on phones. Themed drawers, previous/next, and a surprise button provide exploration without scrolling through every mission. Easier versions, friend ideas, and field notes are collapsed until requested. Search retains a suggestion on no match; exact mission hashes still work.

Current cabinet evidence: `qa/quest-cabinet-results.json`, `qa/cabinet-layout-results.json`, and `qa/cabinet-final-layout-results.json`. Four browser profiles include 320px and reduced motion. This is browser emulation, not physical-device testing.
