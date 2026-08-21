# Skill Passport Pro

SkillPass — Master Prompt for Lovable (v2)

Paste everything from Feel onward as your first message in a new Lovable project. If you want Lovable to reflect its understanding back before spending build credits, switch to Plan mode first, then generate.

Feel: official and quietly premium — like software built by a real credential-issuing authority, not a startup pitching itself. Confident, unshowy, evidence-first. Nothing about it should look like a generic AI-generated dashboard.

Context

Build the frontend for SkillPass, my submission for hackathon problem statement SOAIDEATHON-S30 (Smart Education / Software track). It converts a student's verified coursework, projects, competition wins, and micro-credentials into one portable skill passport, then matches that passport against internship listings and multidisciplinary team openings. It will be demoed live to judges in under 3 minutes, so every screen needs real, working, realistic content the moment it loads — no empty states, no "lorem ipsum."

Three things are explicitly graded and must be visible in the UI itself, not just true in the logic:

Explainability — every match shows exactly which evidence supports it.

Gap identification — every match shows which required skills are missing.

Fairness — every match shows that scoring excluded protected/irrelevant attributes (name, gender, photo, age, college tier, address), and this exclusion is stated in plain language on screen, not just assumed.

Design plan — commit to this before writing code

Before generating anything, briefly settle a compact design token system (palette, type, signature element) and check it against three defaults most AI-generated apps fall into by accident, so you deliberately land somewhere else: (1) warm cream background with a high-contrast serif headline and a terracotta/clay accent, (2) near-black background with one neon accent, (3) a zero-radius broadsheet/newspaper layout. None of those fit a credentialing product — ground the design in the real vernacular of passports and official documents instead: security paper, ink stamps, engraved plates, machine-readable strips.

Design tokens

Color

Token Hex Role Usage note Paper #F4F5F1 Background Cool, slightly grey-green — deliberately not cream. Ink #14201B Primary text Near-black with a green undertone. Bottle green #1E3B2C Brand primary Nav, headers, primary buttons. Deliberately not navy. ~11.2:1 against Paper — safe at any text size. Brass #A9763D Accent Verification stamps, badges, passport card border. ~3.6:1 against Paper — clears the 3:1 minimum for large/bold text (18px+), icons, and borders, but not small body copy. Use it for stamps, badges set ≥16px bold, icons, and the passport border; never for paragraph text or small metadata directly on Paper. Oxide rust #9C4A32 Gap / missing indicator only ~5.6:1 against Paper — safe at any text size, including the small Skill Gap chip labels. Muted, not alarm-red. Sage hairline #C7D0C4 Borders, dividers Used instead of drop shadows for most surfaces.

Two contrast notes worth building in deliberately, since they're the kind of detail that separates this from a default Tailwind palette:

White text on Bottle green (primary buttons): ~12.2:1 — safe.

Brass on Bottle green (the header's "Bias-free matching active" badge): ~3.1:1 — fine for the icon, tight for label text. Set that label in Paper white with a brass icon, not brass-on-green text.

Never use color alone to signal status. Verified / Pending / Needs Review and every Skill Gap chip already pair a color with a text label — keep that pairing (color + icon + word) anywhere a new status indicator shows up.

Light & dark mode

Both modes ship. Don't implement dark mode as an inverted filter over the light palette — a straight invert turns Bottle green nearly invisible against a near-black page (it drops to roughly 1.5:1, well under the 3:1 non-text minimum), which is exactly the kind of unconsidered dark mode this brief is trying to avoid. Instead, treat it as a second pass through the same document metaphor: light mode is paper and ink; dark mode is the same passport read under a desk lamp at night, where the metal catches the light — so Brass leads in dark mode, and Bottle green steps back into a supporting role instead of disappearing.

Token Light Dark Note Background Paper #F4F5F1 Vault #0F1712 Vault keeps the same green undertone as Ink, not a generic blue-black or pure #000. Surface (cards) Paper #F4F5F1 (border-only) Vault Surface #182620 One step lighter than Background so cards read as panels without needing a shadow. Text — primary Ink #14201B Bone #EDEEE7 Bone is a warm off-white, not stark #FFFFFF — keeps the "paper" character instead of reading as generic dark-UI text. Text — secondary Ink @ ~65% Bone @ ~65% Border / hairline Sage #C7D0C4 Sage (dark) #3A4A3F Same hairline-not-shadow approach in both modes. Primary action Bottle green #1E3B2C Brass #A9763D Brass actually gets stronger on Vault (~4.6:1) than it is on Paper (~3.6:1) — in dark mode it can carry small text and button labels directly, which it can't in light mode. Secondary / brand accent Brass #A9763D Bottle green (dark) #3E6B52 A brightened bottle green for outline buttons, chart secondary series, and subtle fills — the base Bottle green stays reserved for large shapes (sidebar fill) where full contrast isn't required. Gap / negative Oxide rust #9C4A32 Oxide (dark) #C97A5C Base oxide sits right at ~3:1 on Vault — fine for borders/icons, not quite enough for small chip text, so lighten it for any text/label use in dark mode.

A few implementation notes worth being explicit about so this doesn't get half-built:

Toggle: a small sun/moon icon control (lucide-react, same 18px/1.5-stroke as every other icon) in the sidebar footer, next to the identity chip.

Default: load in light mode on a user's first visit, regardless of system preference — the passport-hero "unfold" is designed as a light-paper moment, and this is a live demo where that first impression matters. After that, respect the user's explicit toggle choice (persist in localStorage); optionally match system preference only as the fallback before any choice has been made.

No new focus-ring token needed: the existing 2px brass focus outline already clears contrast on both Paper and Vault, so it's the one token that just carries over unchanged.

Transition: a single ~200ms crossfade on the swap, no flash; respects the reduced-motion setting already defined above.

The passport hero's guilloché line pattern and "VERIFIED" stamp still render in Brass in both modes; only the fine background linework switches from an Ink tint (light) to a Bone tint (dark) so the texture stays legible without needing separate artwork.

Type

Slab serif (Roboto Slab or Zilla Slab) for headings and eyebrow labels only, used with restraint.

IBM Plex Sans for all body/UI text.

IBM Plex Mono for anything that reads as an official code (passport ID, verification numbers).

Role Face Size / line-height Notes Eyebrow Slab serif 11px / 14px All caps, ~0.08em tracking. Page title (H1) Slab serif 32px / 38px (24/30 mobile) Ink. Section head (H2) Slab serif 20px / 26px Ink. Body Plex Sans 15px / 24px Ink. Meta / caption Plex Sans 13px / 18px Ink at reduced opacity, not a new grey. Code (passport ID, verification #) Plex Mono 13–14px Tabular figures, ~0.02em tracking.

Spacing & radius

4px base unit: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

Radius stays tight and document-like: 2px on inputs, chips, and proficiency-bar segments; 4px on cards; 0 on the passport border and the MRZ strip. Skip Tailwind's default rounded-xl/rounded-2xl — soft, bubbly corners undercut the "official document" read.

Elevation

Keep it mostly flat. Dashboard, Passport, Matches, and Evidence cards use a 1px sage hairline border and no shadow. Reserve the one soft shadow token (0 4px 16px rgba(20,32,27,0.12)) for things that genuinely float above content — the Add Evidence modal, the "Why this match?" expandable panel, dropdowns.

Iconography

lucide-react, 1.5px stroke, 18px for inline/UI icons, 20–24px for feature icons on stat tiles and badges. Keep brass reserved for verification/status icons specifically (checkmarks, stamps, the fairness shield) — use ink or bottle green for neutral UI icons (nav, filter, sort) so brass keeps its "official stamp" meaning instead of becoming decoration.

Chart color mapping (Recharts)

Recharts defaults to its own rainbow palette (blue/purple/orange), which would clash with everything else here. Define the series explicitly and reuse it everywhere a chart appears — the Skill Growth line, the radar chart, and each match's "Your Skills vs Required" chart:

Primary / your-skills series → Bottle green #1E3B2C

Comparison / required series → Brass #A9763D

Gap / deficit segments → Oxide rust #9C4A32

Gridlines → Sage hairline at low opacity

Tooltip → Paper background, Ink text, 1px sage border, no shadow beyond the standard elevation token

In dark mode, swap the lead: Primary series → Brass, Secondary → Bottle green (dark) #3E6B52, Gap → Oxide (dark) #C97A5C, gridlines → Sage (dark), tooltip → Vault Surface with Bone text — same mapping logic as the Light & dark mode token swap above, just applied to chart series instead of UI chrome.

Motion & interaction states

Base transitions: 150–200ms ease-out for hovers, focus changes, and tab switches.

One orchestrated entrance: the passport hero "unfolds" into place on first mount, ~600–700ms ease-out, plays once. Everywhere else stays instant and functional — this is the one moment worth being bold.

Hover on cards (Dashboard tiles, Match cards, Evidence cards): border shifts from sage hairline to brass. No scale-up, no shadow-lift — that's the generic SaaS-card tell this brief is trying to avoid.

Focus: 2px brass outline, 2px offset, visible on every interactive element — sidebar tabs, buttons, chips, filter controls.

Reduced motion: the hero unfold becomes a simple fade; every other transition is already short/functional enough to leave as-is.

Voice & microcopy

Plain, declarative, document-of-record tone. No exclamation points, no "Awesome!" toasts, no marketing adjectives.

Buttons name the action taken, not a generic verb — "Add Evidence," "Share Passport," "Export as PDF," never "Submit" or "Go."

Status words stay identical everywhere they appear: "Verified / Pending / Needs Review" — no synonyms like "Confirmed" sneaking in on one screen.

Zero-result states (e.g., Matches filtered down to nothing) get one direct sentence plus a next step, in the interface's own voice — e.g. "No matches meet these filters. Widen the score range or clear a filter to see more." Not a generic "No results found" or a cute illustration.

App shell

Left sidebar (collapses to a bottom tab bar under 768px) with the SkillPass wordmark and four tabs: Dashboard, Skill Passport, Matches, Evidence Vault. Below the tabs, a compact identity chip: avatar placeholder, "Kirito," and a Profile Strength ring at 82%, with the light/dark toggle sitting right beside it — same footer row, so it reads as part of the account area rather than a stray settings icon. In the header, a persistent small badge — brass shield icon + "Bias-free matching active" (icon brass, label set in Paper white in light mode, Bone in dark mode, per the contrast notes above) — visible on every screen, not just one. Nav tabs, the identity chip, and the theme toggle all get the same hover/focus treatment defined above.

Dashboard

Greeting header ("Welcome back, Kirito") with the Profile Strength gauge.

Four stat tiles: Verified Credentials, Active Matches, Skills Tracked, Pending Verifications.

A "Skill Growth" line chart (Recharts) trending proficiency up over the last 6 months as evidence gets added — styled per the chart color mapping above, not Recharts defaults.

A small skill-category radar chart (Recharts RadarChart) across 5–6 top categories, same color mapping.

"Top Matches This Week": 3 compact preview cards linking into Matches.

"Recently Verified": latest Evidence Vault additions.

Skill Passport

The hero passport card: a fine repeating guilloché line-pattern in the background at low opacity, a rotated brass "VERIFIED" ink-stamp badge, and a real two-line machine-readable-zone strip in monospace along the bottom encoding the passport ID (format like SKPS<<KIRITO<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< / 2604821<9IND2603<<<<<<<<<<<<<<<<<<<<<<<06). Plus a "Share / Export as PDF" button — this is the literal "portable" artifact the brief names, so it needs to look genuinely shareable.

Below it, skills grouped into three tabs: Technical, Soft Skills, Domain Knowledge. Each row: skill name, a 5-segment proficiency bar (2px radius segments, matching the document vernacular rather than full pill shapes), a brass verification checkmark, "Backed by N evidence items."

Clicking a skill expands the exact evidence items behind it — chevron rotates 150ms ease-out, evidence list slides open. This traceability is what makes the Matches page's explanations credible later.

A toggle: Verified only / Include self-reported.

Matches

This is the page judges will spend the most time on.

A filterable list mixing both types the brief asks for — tag each card Internship or Team. Cards use the same hairline-to-brass hover border, no lift/scale.

Each card: title, organization, a match-score ring, one-line summary.

An expandable "Why this match?" panel mapping each required skill to the specific evidence that satisfies it (e.g., "SQL → verified via DSA coursework + Google Data Analytics certificate"), written as a real explanation, not a generic paragraph.

A Skill Gaps row: chips for anything required but missing, each with a one-line suggestion. Chip text in oxide rust is safe at small sizes per the contrast notes above.

A small "Your Skills vs Required" bar or radar chart for that specific opportunity, using the chart color mapping.

A Fairness Check note, open by default on every card, in plain language: "This score used only skill-evidence signals. Name, photo, gender, age, and college tier were not part of the calculation." This is the detail most competing teams will skip — don't let it collapse into a tooltip.

Sort/filter by match score, opportunity type, domain. If a filter combination returns nothing, use the zero-result microcopy pattern above rather than a bare "no results."

Evidence Vault

A grid of evidence cards: type icon (course / project / competition / micro-credential), title, issuing source, date, status. Pair each status with a consistent color + icon: Verified — bottle green check; Pending — brass clock; Needs Review — oxide rust flag. Color and icon always travel together with the text label, never color alone.

"Add Evidence" opens a modal with mock ingestion options — Upload Certificate, Connect Coursera, Link GitHub Repo, Add Competition Result — visualizing the pipeline the brief describes even without a live backend.

Clicking an item shows which Skill Passport entries it feeds — traceable in both directions.

Seed data

Seed at least 12 skills, 10 evidence items, and 6 matches (a mix of internships and teams) — real-sounding, not placeholders:

Skills: Python, Data Structures & Algorithms, SQL, React.js, Machine Learning Basics, Data Visualization, Cloud Fundamentals (AWS), Git & Version Control, UI/UX Design, Public Speaking, Team Leadership, Technical Writing.

Evidence: "Data Structures & Algorithms — Semester Coursework (ITER)" [course, Verified]; "Smart Attendance System — Capstone Project" [project, Verified]; "Smart India Hackathon — Finalist" [competition, Verified]; "Google Data Analytics Certificate — Coursera" [micro-credential, Verified]; "AWS Cloud Practitioner Essentials" [micro-credential, Pending].

Matches: "Data Analyst Intern — Nimbus Fintech" (91%, evidence: SQL + Data Visualization, gap: Statistical Modeling); "Campus AI-for-Good Team — needs a frontend + data teammate" (87%, evidence: React.js + Python, gap: Public Speaking for the pitch role). Generate 4 more in this style.

Build constraints

React (function components + hooks), Tailwind CSS for all styling, lucide-react for every icon, Recharts for every chart. Frontend only — no backend or auth, everything runs off local mock data so the demo works instantly. Fully responsive down to 375px, with the sidebar collapsing to a bottom tab bar at 768px; use standard Tailwind breakpoints (sm/md/lg/xl) between those two points rather than only designing for the extremes. Organize components sensibly: a shared Layout/Sidebar, one component per tab, shared Card/Badge/StatTile pieces. Default shadcn/ui primitives are fine underneath, but re-theme them to the palette and radius scale above — nothing should look like the default component library.

Theming implementation: define every color from the Light & dark mode table as a CSS custom property (--color-bg, --color-surface, --color-text-primary, --color-text-secondary, --color-border, --color-action-primary, --color-accent-secondary, --color-gap) mapped once in :root and once under a .dark class, and point Tailwind's config at those variables rather than hardcoding hex values inside components. Toggle Tailwind's dark: variant by adding/removing the .dark class on <html>. This is what makes every component — including ones you haven't built yet — pick up both themes automatically instead of needing a manual dark: override on every single element.

Explicitly avoid

Default purple-to-blue gradients, unstyled default shadcn blue buttons, Inter used everywhere with no display face, empty or lorem-ipsum states, tiny illegible chart labels, a Fairness Check that appears once instead of on every match card, Recharts' default rainbow series palette, Tailwind's default rounded-xl/rounded-2xl corners (reads as generic SaaS, not an official document), card hover effects that scale or drop-shadow-lift instead of shifting the border color, exclamation-point marketing copy in toasts or empty states, brass used as small body text directly on Paper, dark mode implemented as a CSS filter: invert() or a straight 1:1 color flip, a pure #000000 or generic blue-black (#0F172A-style) dark background, and any component that's been manually re-colored for one theme but forgotten in the other.

Definition of done

[ ] All 4 tabs built and navigable; sidebar collapses correctly on mobile

[ ] Skill Passport hero reads as a real shareable credential, not a generic profile card

[ ] Every match card shows: score, why-this-match evidence, skill gaps, and an open (not hidden) fairness note

[ ] Dashboard has 2+ working charts with real seeded numbers

[ ] Evidence Vault items link back to the skills they support

[ ] No placeholder text anywhere

[ ] Bottle-green / brass / paper palette applied consistently — no default Tailwind blue-500

[ ] Color usage matches the contrast notes above — brass never used as small body text on Paper

[ ] All charts use the token color mapping, not Recharts defaults

[ ] Border radius stays within the 2–4px scale everywhere; no default rounded-xl/rounded-2xl

[ ] Hover, focus, and active states are visibly implemented on every interactive element

[ ] Light and dark mode both ship, toggle lives in the sidebar footer, and every screen — including charts and the passport hero — has been checked in both

[ ] Dark mode uses the Vault/Bone/Brass-led token set above, not an inverted or filtered version of the light palette

[ ] Colors are wired through CSS custom properties / Tailwind's dark: strategy, not hardcoded per component

[ ] First-visit default is light mode; the user's explicit toggle choice persists after that

[ ] Keyboard focus visible everywhere; reduced motion respected

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/01927bb9-baef-49b0-be69-c960431b91b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
