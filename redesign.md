# MEDHA UI Redesign: Cursor Auto-Mode Instructions

Paste this whole file into Cursor (or save it as `.cursor/rules/medha-redesign.mdc` and reference it with `@`). Attach screenshots of the three design artboards (Landing, Subjects mobile, Syllabus) as visual reference if you have them. Everything needed is also specified in text below.

---

## 0. Mission

Redesign three screens of MEDHA Revision (landing/home, Subjects, Subject syllabus) into a premium **light + deep-navy hybrid** look, good enough for an Awwwards submission. Preserve all existing routing, auth, API calls and data flow. This is a visual and UX rewrite of the presentation layer, not a backend change.

Design thesis: *a calm light canvas anchored by confident navy surfaces, big tight editorial type, one cyan accent, and a ridgeline (mountain) motif.* No rainbow accents, no pastel gradient washes.

---

## 1. Hard rules (do not break)

1. **Scope: work ONLY in `medha-frontend/` (React + Vite + Tailwind) and, where data is needed, `medha-backend/` (Node/Express/MongoDB).** Do not open, read or modify any other directory in the monorepo. Inspect these two before editing: how the frontend is built and routed, which API endpoints supply subjects/syllabus data, and the existing conventions for components, styling and state.
2. **Reuse existing routes, hooks, services, auth and API clients.** Do not rename routes, change auth flow, or change API contracts.
3. **No fabricated data.** Every number (subject count, unit count, topic count, semester list, subject codes, curriculum badges) must come from the real syllabus/subject data already used by the app. No fake progress bars, completion percentages, streaks, "trending" labels or result counts. If data for something does not exist (e.g. progress), do not render it.
4. **No hardcoded university content in generic components.** RTU vs "RTU · Arya Autonomous" is data (a `curriculum`/`university` field), rendered by one reusable badge component. Two subjects with the same title but different codes are different subjects; never merge or dedupe by title.
5. **Mobile-first.** Build for 320–430px first, then scale up to tablet and desktop.
6. **Accessibility:** real `<button>`, `<a>`, `<input>` with labels; `aria-label` on icon-only buttons; visible focus rings; body text contrast ≥ 4.5:1; touch targets ≥ 44px; respect `prefers-reduced-motion`.
7. Do not add dependencies unless clearly justified. Allowed: a motion lib (`framer-motion` / `motion`) if not already present, for the optional motion phase only.
8. Do not touch unrelated pages. If a shared component must change, check every usage first.

---

## 2. Design tokens

Put these in the existing Tailwind config (`theme.extend.colors`) and/or CSS variables on `:root`. Prefer one source of truth; do not scatter hex codes in components.

```css
:root {
  --navy:        #102D50; /* primary brand, headings, strong surfaces */
  --navy-2:      #173F6E; /* ridgeline back layer */
  --navy-3:      #1B5189; /* ridgeline mid layer */
  --blue:        #1769AA; /* interactive, links, outlines */
  --cyan:        #42BDEB; /* accent: only on navy, or as small dots/underlines */
  --cyan-soft:   #BFE8F8; /* marker underline behind hero highlight word */
  --cloud:       #F5F8FC; /* page background */
  --ice:         #E3EDF7; /* secondary surfaces, chips, tab track */
  --line:        #D5E3F1; /* hairlines, card borders */
  --slate:       #26384B; /* body text */
  --slate-2:     #4B6178; /* secondary text (passes AA on cloud/white) */
  --muted:       #5A7087; /* small metadata (passes AA) */
  --on-navy-2:   #BFD6EA; /* secondary text on navy */
  --numeral:     #BFD6EC; /* large faded unit numerals */
  --aura-bg:     #EEE8FF; /* Aura ONLY */
  --aura-fg:     #5B3FC4; /* Aura ONLY */
}
```

Rules:
- **Cyan never appears as text on light backgrounds** (fails contrast). On light surfaces use `--blue` for text, cyan only as a 8px dot, 2px underline or marker stripe.
- **Purple is reserved for Aura** (the badge in the header). Remove all other purple, green, mint, orange, pink from these screens, including the per-unit coloured top bars and the green selected states.
- Remove the mint/green page background. Page background is `--cloud`.

### Typography
Load `Plus Jakarta Sans` (600, 700, 800) and `Inter` (400, 500, 600) via the app's existing font loading mechanism (Google Fonts `<link>` or `@fontsource`). Add a `display` and `sans` font family to Tailwind.

| Use | Font | Weight | Notes |
|---|---|---|---|
| Hero H1 | Plus Jakarta Sans | 800 | `clamp(46px, 6.4vw, 92px)`, line-height 0.98, letter-spacing -0.045em |
| Section H2 | Plus Jakarta Sans | 800 | `clamp(36px, 4.6vw, 60px)`, line-height 1.02, letter-spacing -0.04em |
| Card / unit titles | Plus Jakarta Sans | 800 | 19px (mobile card), 26px (unit), tracking -0.02 to -0.03em |
| Eyebrow labels | Inter | 600 | 13px, uppercase, letter-spacing 0.12em |
| Body | Inter | 400/500 | 15–20px, line-height 1.5–1.55 |
| Chips/badges | Inter | 700 | 12–13px, letter-spacing 0.04em |

Radii: cards 22–28px, large panels 32–36px, chips 14px, pills/badges 999px, inputs 16px.
Shadows: very soft only, e.g. `0 10px 24px -16px rgba(16,45,80,0.35)` for cards; `0 14px 30px -12px rgba(16,45,80,0.55)` for the primary navy button.

---

## 3. Shared components to create (or refactor existing ones into)

Create under the app's existing components folder, following its naming conventions. Props are data-driven.

1. **`BrandMark`**: 36px (32px on mobile) navy rounded square (r=11) with a white "M" drawn as a mountain polyline (`M8 26 L14 12 L18 20 L22 12 L28 26`, stroke 2.6, round caps) and a cyan dot at (28,10) r=2.6. Next to it the wordmark "Medha" in Plus Jakarta Sans 800, navy, tracking -0.02em.
2. **`AuraBadge`**: pill, `--aura-bg` background, `--aura-fg` text, 600 weight, text `Aura {n}`. The only purple in the UI.
3. **`CurriculumBadge`**: renders the `university`/`curriculum` label ("RTU", "RTU · Arya Autonomous"). One consistent style: outlined pill, 1px `--blue` border, `--blue` text, 12px/700. On navy surfaces use the cyan variant (cyan border + cyan text). It is **data-driven**; no hardcoded strings.
4. **`CodeChip`**: subject code ("5CS4-05"), `--ice` background, navy text, 12px/700, letter-spacing 0.04em. On navy use `rgba(255,255,255,0.12)` background, white text.
5. **`ArrowButton`** (navigation affordance): 40px circle, navy fill, cyan arrow icon (stroke 2.4). Used on subject cards to signal "tappable".
6. **`SubjectCard`**: see §5.
7. **`TopicChip`**: see §6. Includes optional `sharedWithAutonomous` boolean → 8px cyan dot.
8. **`Ridgeline`**: decorative SVG (`aria-hidden`), absolutely positioned at the bottom of navy panels. Props: `height`. Layers (viewBox 0 0 460 200, `preserveAspectRatio="none"`):
   - back `#173F6E`: `0,120 70,70 120,100 190,40 260,95 330,60 400,100 460,70 460,200 0,200`
   - mid `#1B5189`: `0,150 60,110 130,140 200,90 270,135 350,105 460,145 460,200 0,200`
   - cyan hairline `#42BDEB`, stroke 1.6, along the mid ridge points
   - front `#1769AA`: `0,175 90,150 170,172 260,140 350,168 460,150 460,200 0,200`
9. **`BottomNav`** (mobile): see §5.
10. **`TopNav`** (desktop): see §4.

Icons: use the existing Lucide set (already in the project). Do not introduce emoji.

---

## 4. Screen A: Landing / Home (desktop-first layout that collapses cleanly)

Page background `--cloud`. Container: `max-width: 1240px; margin: 0 auto; padding: 0 24px`.

**TopNav** (min-height 80): `BrandMark` + links `Home · Search · Subjects · Upload · You`; right side `AuraBadge`. Links are 15px/500, `--slate-2`, padding 9px 16px, pill radius. **Active link:** `--ice` background, navy text. (Replace any green active state.) Wraps on narrow widths; on mobile the app uses `BottomNav` instead (see §5), so hide the link row below `md`.

**Hero** (flex-wrap, gap 48px, padding 40px 24px 56px). Two columns, each `flex: 1 1 520px` / `1 1 440px`, stack on narrow widths.

Left column, vertically centered, gap 28px:
- Eyebrow: 8px cyan dot + "University-aware study search", `--blue`, uppercase.
- H1: "Your syllabus,<br>**searchable.**": second line in `--blue` with a marker stripe `background: linear-gradient(transparent 64%, var(--cyan-soft) 64%)`.
- Paragraph (20px/1.55, `--slate-2`, max 520px): "Pick your university. Tap any unit or topic. Medha brings the notes, videos and previous-year questions to you, in one place."
- Primary CTA: navy pill button, white 16px/600 text "Open my syllabus" + cyan arrow icon, padding 18px 28px, soft navy shadow. Links to the user's syllabus/subjects route.
- Secondary: text link "See how it works" in `--blue`, 2px cyan bottom border; anchors to the index section.
- Small caption 14px `--muted`: "Starting with RTU, Kota. Autonomous college syllabi included."

Right column, the **navy search panel**: `background: var(--navy); border-radius: 36px; padding: 28px; min-height: 620px; position: relative; overflow: hidden; box-shadow: 0 40px 80px -40px rgba(16,45,80,.6)`.
- White search bar (r=20, padding 10px 10px 10px 18px): search icon in `--blue`, query text (Plus Jakarta 700, 20px, navy), and a cyan "Search" button (r=14, text `#0B2240`, 700). This is a styled preview of the real search input. **Wire it to the real Search route** so typing/submitting goes to the existing search experience; the shown placeholder query can be an example topic like "Quick Sort".
- Breadcrumb row under it: pills on `rgba(255,255,255,.1)`: `RTU › CSE · Sem V › Analysis of Algorithms › Unit 02` (last pill `rgba(66,189,235,.22)`, white). Build from real selected context if available; otherwise use the example subject.
- Four result-type rows (cards on `rgba(255,255,255,.08)`, r=18, padding 16px 18px, 22px cyan stroke icon): **Notes & PDFs** (Shared by students) · **Video explanations** (From YouTube) · **Previous-year questions** (Matched to the topic) · **Plain-language explanation** (AI-assisted, tied to your syllabus). **No counts.**
- `Ridgeline` at the bottom (height 190, z-index below the content).

**Stats strip** (full container width, top and bottom 1px `--line` borders, three equal flex columns, padding 28px 0): big number (Plus Jakarta 800, 44px, navy) + label (15px, `--slate-2`): subjects in Semester V · units mapped from the syllabus · topics ready to search. **Compute all three from real data** (these were 6 / 37 / 264 in the current app).

**Index band** (full-bleed navy, `border-radius: 48px 48px 0 0`, padding 96px 24px, container inside):
- Left (flex `1 1 520px`): cyan eyebrow with the featured subject's code, curriculum and branch/semester (e.g. `5CS4-05 · RTU · CSE · Sem V`); H2 white "The syllabus<br>is the map."; then the subject's units as a numbered list: each row is a link with `border-bottom: 1px solid rgba(255,255,255,.16)`, padding 22px 0, numeral (cyan, Plus Jakarta 700, 15px, width 28px), unit title (Plus Jakarta 700, 24px, white, tracking -0.02em); the currently previewed unit shows a cyan arrow on the right. Data comes from the real syllabus of the featured subject.
- Right (flex `1 1 400px`, align to bottom): light panel (`--cloud`, r=32, padding 32): eyebrow "Unit 02", unit title (Plus Jakarta 800, 26px), a wrap of `TopicChip`s with one highlighted (navy fill, white text, small cyan search icon), then a divider and the sentence "Tap a topic and search opens with your university, subject and unit already set." (this must be literally true: wire topic taps to the search route with context, see §6).

**"Same name. Different syllabus." section** (container padding 112px 24px 96px): eyebrow "Curriculum clarity", H2 as written, 19px paragraph: "Data Structures and Algorithms is taught under two codes with two sets of topics. Medha keeps them apart, so you only ever study what your exam covers." Below, two cards in a flex-wrap row with a 56px navy circle containing a cyan "≠" between them (`aria-label="is not the same as"`):
- Light card (white, 1px `--line`, r=28, padding 32): `CodeChip` + `CurriculumBadge`, title, "5 units / 19 topics".
- Navy card (r=28, padding 32): cyan-variant badge, white title, "5 units / 38 topics".
**These two cards must be fed from real data** by querying two subjects that share a title but have different curriculum/code (the app currently has e.g. 3CS4-04 vs 3ITPC-04, and Digital Electronics 3CS4-05 vs 3CSES3-02). Pick pairs programmatically (group by title, take titles that have more than one curriculum). If none exist, hide the section.

**Closing**: top hairline, giant line "Less switching.<br>**More studying.**" (second line `--blue`), repeat the primary CTA, small footer row in `--muted`.

---

## 5. Screen B: Subjects (mobile-first, 390px reference)

Root: `background: var(--cloud)`, full viewport height, content scrolls under a fixed bottom nav. Add `padding-bottom` = nav height + `env(safe-area-inset-bottom)`.

Top to bottom, 20px horizontal padding:

1. **Header** (padding-top 20): `BrandMark` left, `AuraBadge` right.
2. **Title**: "Subjects", Plus Jakarta 800, 32px, tracking -0.04em, navy.
3. **Academic identity strip** (margin-top 14): a link/button, navy background, r=18, padding 12px 14px. Eyebrow line in cyan uppercase 12px/600: `{university} · {course} {branch}` (e.g. "RTU · B.Tech CSE"); below it white 15px/600: `Year {year} · Semester {sem}`; right side "Change" in `--on-navy-2`, 13px/600. Data from the user's profile/selected academic context. Tapping opens the existing academic-context picker (or navigates to profile if that's where it lives).
4. **Search**: height 52, white, 1px `--line`, r=16, search icon in `--blue`, a real `<input type="search">` with `aria-label`, 16px text (prevents iOS zoom), placeholder "Subject, code or topic". **Implement filtering over subject name, subject code, unit names and topic names** (and curriculum/university text), case-insensitive, debounced ~150ms. When there are no matches show an empty state (§7).
5. **Semester tabs** (margin-top 14): segmented control. Track `--ice`, padding 4, r=16, gap 6; each tab flex:1, height 40, r=12, 14px/600, inactive text `--slate-2` on transparent; **selected** = white background, navy text 700, `box-shadow: 0 2px 8px rgba(16,45,80,.14)`, `aria-pressed="true"`. Build the tab list from the semesters that exist in the data (plus "All"); do not hardcode.
6. **Collection heading row** (margin-top 20): left "Semester V" (Plus Jakarta 700, 18px, navy), right "{n} subjects" (14px, `--muted`), where `n` = the real filtered count.
7. **Subject cards** (margin-top 12, gap 12), each a full-width `<a>` to the existing subject route:
   - container: white, 1px `--line`, r=22, padding 16, soft shadow, `display:flex; align-items:center; gap:12`.
   - left column (gap 10): row of `CodeChip` + `CurriculumBadge`; title (Plus Jakarta 800, 19px, line-height 1.15, navy, wraps up to 2 lines); metadata "6 units · 39 topics" (14px, `--slate-2`).
   - right: `ArrowButton` (40px).
   - Pressed state: scale 0.99 + border `--blue`. Hover (desktop): shadow slightly stronger and the ArrowButton nudges 2px right.
   - **Same title, different code/curriculum = separate cards**, each clearly badged. Use the subject's unique id/code as the React key.
   - Do NOT render progress, favourites or "recently viewed" unless real persisted data exists in the backend. If it does, add them as optional rows below the metadata using the existing endpoints.
8. **BottomNav** (fixed, height 84 including 22px bottom padding/safe-area): white, top border 1px `--line`, 5 items evenly spaced: Home, Search, Subjects, Upload, You (Lucide icons, 22px; label 12px). Inactive: `--muted`, weight 500. **Active (Subjects):** icon sits in a 52×30 navy pill with a white icon, label navy 700. Remove the green active state.

States to implement: **loading** (skeleton cards: same shape, `--ice` blocks with a gentle shimmer, disabled under reduced motion), **empty** (no results for the query: friendly line, a "Clear search" button, suggestion to try a subject code or topic), **error** (message + "Try again" button wired to the refetch).

Tablet/desktop (`≥ 768px`): same page, but cards become a 2-column grid (3 columns `≥ 1100px`), container max-width 1240px, the bottom nav is replaced by the `TopNav`.

---

## 6. Screen C: Subject syllabus (desktop layout, collapses to one column)

Container 1240px. Breadcrumb at the top (14px, `--muted`): `Subjects › Semester V › Analysis of Algorithms` (last item navy 600).

Two-column flex-wrap, gap 40, `align-items: flex-start`:

**Left aside** (`flex: 0 1 380px; min-width: 300px`, navy, r=32, padding 32, `position: relative; overflow: hidden`). Do not make it sticky. Contents with gap 20:
- `CodeChip` (navy variant) + cyan `CurriculumBadge`.
- H1 subject title: Plus Jakarta 800, 44px, line-height 1, tracking -0.045em, white.
- Secondary line, 15px `--on-navy-2`: course + branch / year + semester.
- Stats row with top/bottom hairlines `rgba(255,255,255,.16)`: "units" and "topics" counts (Plus Jakarta 800, 34px, white), from real data.
- White search input (height 48, r=14): "Search this subject": filters units and topics on this page.
- Legend line: 8px cyan dot + "Also covered in RTU · Arya Autonomous" (13px, `--on-navy-2`). Only render this legend if the data actually marks any topic as shared.
- "Also in Semester V" list: eyebrow in cyan; rows with code (cyan 12px/700, 72px fixed) + title (white 15px/500), separated by `rgba(255,255,255,.12)` hairlines; each links to that subject. Data from the same semester's other subjects.
- `Ridgeline` at the bottom (height 120, opacity .9), plus 100px bottom spacer so content never collides with it.

**Right column** (`flex: 999 1 560px; min-width: 0`): one block per unit, `border-top: 1px solid var(--line)`, padding 36px 0, flex gap 28:
- Numeral: 76px wide, Plus Jakarta 800, 56px, line-height .9, tracking -0.05em, colour `--numeral`. Zero-pad (01, 02…).
- Unit title: Plus Jakarta 800, 26px, line-height 1.15, tracking -0.03em, navy.
- Topics as a wrapping row of `TopicChip`s, gap 10.

**`TopicChip`**: `<button>` (or `<a>` to the search route), white background, 1px `--line`, r=14, padding 11px 16px, Inter 15px/500, navy; if `sharedWithAutonomous` show a leading 8px cyan dot. Hover: border `--blue`, background `--cloud`. Focus-visible: 2px `--cyan` ring with 2px offset.

**Critical UX change from the current UI:** the curriculum badge appears **once** (in the aside and, if needed, per unit), NOT on every topic. Per-topic curriculum membership is communicated only by the small cyan dot + legend. Remove the repeated "RTU" / "RTU · ARYA AUTONOMOUS" pills inside every topic and unit.

**Topic tap behaviour (must work, not decorative):** navigate to the existing Search route, pre-filled with the topic text and carrying the context (university/curriculum, subject code, unit). Reuse whatever query-param / state convention the Search page already uses. Show a pressed state and keep the previously used "Recently searched" logic intact.

If a user searches within the subject, hide non-matching topics, hide units with zero matches, and highlight the matched substring with a `--cyan-soft` background.

---

## 7. Empty / loading / error states (all three screens)
- **Loading:** skeletons with the same dimensions as the final content. No layout shift.
- **Empty:** one sentence, one action. Example: "No subjects match “xyz”. Try a subject code like 5CS4-05." + "Clear search".
- **Error:** "Couldn’t load your syllabus." + "Try again".
- Never show a fake placeholder number.

---

## 8. Responsive checklist
Verify at **320, 360, 375, 390, 430, 768, 1024, 1280, 1440px**:
- no horizontal scroll, no clipped or overlapping badges, no text under the bottom nav;
- long titles ("Computer Graphics & Multimedia", "Information Theory & Coding") wrap to two lines inside cards without pushing the arrow button;
- bottom nav respects `env(safe-area-inset-bottom)`;
- H1 stays readable at 320px (clamp handles this; confirm).

---

## 9. Optional motion phase (do ONLY after everything above builds and passes)
Subtle and meaningful, all disabled under `prefers-reduced-motion`:
1. Hero ridgeline: layers parallax 4–8px against pointer/scroll; cyan hairline draws in once on load (stroke-dashoffset, ~1.2s).
2. Search panel: result rows stagger in (40ms apart, 8px rise + fade).
3. Index band: hovering a unit row slides its numeral 4px and reveals the cyan arrow; the right panel crossfades to that unit's topics (data-driven).
4. Subject cards: 2px arrow-button nudge on hover; 0.99 scale on press.
Keep all transitions 150–250ms, ease-out. No bouncing, no looping decorative animation, no layout-shifting animations.

---

## 10. Execution plan (follow in order, auto-run is fine)
1. Inspect `medha-frontend/` and `medha-backend/` → identify the source of truth for subjects/syllabus data (and the API endpoints serving it), the Search route and its query convention, and the profile/academic-context source. Write 5 lines summarising findings.
2. Add tokens (Tailwind + CSS vars), fonts, and the shared components in §3.
3. Rebuild **Subjects** (mobile first), then **Syllabus**, then **Landing**, wiring real data and real navigation as specified.
4. Add loading/empty/error states.
5. Run lint, type-check (if any), and a production build; fix everything. Run existing tests.
6. Start the dev server and verify the **rendered** pages at the widths in §8 (screenshots or browser tooling, not just reading code). Fix any overflow/clipping/contrast issues.
7. Only then do the optional motion phase.
8. Final report: files changed, components added, any spec item that could not be implemented and why, and anything that needed a data field that doesn't exist.

## 11. Definition of done
- [ ] No green, mint or random purple remains (purple only on Aura).
- [ ] Every number on screen is computed from real data.
- [ ] RTU vs Arya Autonomous subjects with identical titles are separate, clearly badged items.
- [ ] Curriculum badge is not repeated on every topic chip.
- [ ] Every card/chip that looks tappable navigates somewhere real.
- [ ] Search filters by name, code, unit and topic.
- [ ] Loading, empty and error states exist.
- [ ] Builds clean, no new console errors, no horizontal scroll at 320px.
- [ ] Contrast ≥ 4.5:1 for all body and metadata text; focus rings visible.
- [ ] Routing, auth and API contracts unchanged.