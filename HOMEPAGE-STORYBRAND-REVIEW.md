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
