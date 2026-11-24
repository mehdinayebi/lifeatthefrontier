# Design spec

Everything here is implemented in `reference/index.html` and `reference/styles.css`. Where this document and the reference differ, the reference wins. Class names below are the ones used in the reference.

## 1. Tokens

### Colour ("Daybreak" palette)

| Token | Value | Use |
|---|---|---|
| `--ivory` | `#FFF8EC` | Light ground. Text on ink blue. |
| `--ink` | `#1C3D7A` | Dark ground. Text on ivory. The world shape. |
| `--tangerine` | `#F26A1B` | The dot, heading full stops, buttons, list numerals, the lens curve, label dots, hover lines, focus rings. |

Derived tints, all ivory over ink: 24% for hairlines, 50% for the question rule and pill borders, 80% for secondary text (7.0:1), 90% for the question descriptions (8.4:1).

Sections alternate: hero ivory, frontiers ink, lens ivory, Frontier Test ink, host ivory, newsletter and footer ink. The page body behind everything is ink.

### Contrast rules

| Pair | Ratio | Allowed for |
|---|---|---|
| Ink on ivory, ivory on ink | 9.96:1 | Any text |
| Ink on tangerine | 3.43:1 | Bold text of 19 px or more only (buttons, number discs) |
| Tangerine on ink | 3.43:1 | Graphics and bold text of 19 px or more only (list numerals, label dots) |
| Tangerine on ivory | 2.90:1 | Decoration only (heading full stops, the dot, the curve). Never body text. |

### Type

Two families, both self-hosted from `assets/fonts/`.

- **Instrument Sans**: weights 400, 500, 600, 700. Fallback stack: `'Helvetica Neue', Arial, sans-serif`.
- **JetBrains Mono**: weight 500. Fallback stack: `ui-monospace, Menlo, monospace`. Labels only.

| Element | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| Hero title (h1) | `9u` desktop, `16u` small (see hero unit) | 700 | 0.92 | -0.045em |
| Hero line | `2.3u` desktop, `clamp(20px, 5.4u, 28px)` small | 600 | 1.2 | -0.02em |
| Section heading (h2) | `clamp(40px, 6.4vw, 92px)` | 700 | 0.96 | -0.04em |
| Lens heading (h2) | `clamp(34px, 4.6vw, 64px)` | 700 | 1 | -0.04em |
| Host name (h2) | `clamp(28px, 3vw, 40px)` | 700 | 1.05 | -0.03em |
| Frontier name | `clamp(28px, 4.4vw, 62px)` | 600 | 1.02 | -0.03em |
| Frontier description | `clamp(18px, 1.55vw, 22px)` | 400 | 1.35 | 0 |
| Question (h3) | `clamp(24px, 2.4vw, 34px)` | 700 | 1.05 | -0.03em |
| Question description | `clamp(17px, 1.35vw, 20px)` | 400 | 1.45 | 0 |
| Body and lead | `clamp(17px, 1.5vw, 21px)` | 400 | 1.5 | 0 |
| Section label | `clamp(15px, 1.25vw, 18px)`, mono, uppercase | 500 | 1.2 | 0.12em |
| Footer column label | 13 px, mono, uppercase | 500 | normal | 0.12em |
| Buttons | 19 px | 700 | 1 | 0 |
| Footer links | 16 px | 400 | normal | 0 |
| Legal line | 14 px | 400 | normal | 0 |

Headings use `text-wrap: balance`. Paragraphs use `text-wrap: pretty`.

### Space and shape

| Token | Value | Use |
|---|---|---|
| `--pad` | `clamp(20px, 4vw, 64px)` | Left and right page padding |
| `--sp` | `clamp(72px, 9vw, 136px)` | Top and bottom section padding |
| `--arc` | `clamp(36px, 7vw, 112px)` | Height of the horizon arcs |
| `--ease` | `cubic-bezier(.2, .7, .2, 1)` | Default easing |
| `--spring` | `cubic-bezier(.3, 1.5, .5, 1)` | Overshoot easing for dots and the full stop |

Buttons, inputs and pills are fully rounded (`border-radius: 999px`). Nothing else has rounded corners except the portrait block (top-right corner only, 48 px) and the logo shapes.

### Breakpoints

| Width | Change |
|---|---|
| 1000 px and wider | Desktop hero: world and dot on the left, text on the right, fixed height |
| Under 1000 px | Small hero: text first, world in a band below it, height follows content |
| Under 900 px | Frontier rows stack: numeral, then name with the description beneath it |
| Any | Lens, question, newsletter and footer grids use `auto-fit` columns and collapse on their own |

## 2. Components

### Section label (`.lf-kick`)

Mono uppercase text preceded by a tangerine dot (0.62em across, 0.75em gap). It inherits the section's text colour. Used above every section heading.

### Heading full stop (`.lf-o`)

The final full stop of the title and of each section heading is tangerine. Keep it as its own span.

### Primary button (`.lf-cta`, `.lf-go`)

Height 56 px, padding 0 28 px (26 px in the form), tangerine ground, ink text, 19 px bold, fully rounded. Hover: moves up 2 px over 180 ms. No underline on hover.

### Text links

Inherit colour, no underline. Hover: underline 2 px thick in tangerine, offset 5 px.

### Focus

`outline: 2px solid var(--tangerine); outline-offset: 3px` on every focusable element, shown with `:focus-visible`.

### Skip link

Not in the reference. Add one as the first focusable element: "Skip to content", visually hidden until focused, then shown top left as an ink pill with ivory text. It targets the frontiers section.

## 3. Sections

### 3.1 Hero

The hero is the logo at full scale: a quarter disc (the "world") anchored in the bottom-left corner, with the tangerine dot sitting on its edge.

**The hero unit.** All hero sizes are multiples of one unit, `--u`.

| | Desktop (1000 px and wider) | Small (under 1000 px) |
|---|---|---|
| `--u` | `min(1vw, 1.7857vh, 18px)` | `min(1vw, 5.6px)` |
| Hero height | `56u` (so never taller than the window, at most 1008 px) | Follows content |
| Hero padding | none | `14u 6u 84u` (the bottom band holds the world) |
| World radius `--R0` | `38` (in units) | `70` |
| Dot diameter `--d` | `10.6` (0.28 × radius, as in the logo) | `19.6` |
| Knockout ring `--ring` | `2.1` (0.055 × radius), ivory | `3.9` |
| Dot position | On the edge, 45° above the bottom edge, measured from the bottom-left corner | Same, fixed at 45° |
| Text block | Absolute: left `50u`, right `4u`, full height, centred vertically, children 2u apart, left aligned | In normal flow, children 18 px apart |

**Structure.** The hero sits inside a wrapper called the stage (`.lf-stage`, ink ground). The hero has two stacked layers that hold the same text in the same place:

1. **Base layer**: ivory ground, ink text. Holds the real `h1`, the line and the real button.
2. **World layer** (`.lf-world`): ink ground, ivory text, laid exactly over the base layer and clipped to a circle centred on the bottom-left corner: `clip-path: circle(calc(var(--u) * var(--R)) at 0 100%)`. It is a visual copy, so it carries `aria-hidden="true"`, the `inert` attribute and `pointer-events: none`. Its title is a `div`, not a second `h1`, and its button is a `span`.

This is what makes the title change colour exactly at the world's edge when the world grows (motion effect 1). Render both layers from one source so they can never drift apart. `--R` starts equal to `--R0`.

Above both layers: two thin ink rings that ripple outward from the world's edge (ambient, `aria-hidden`), then the orbit, a zero-size element at the bottom-left corner that is rotated to place the dot. The dot is translated along the orbit by `u × (R − d/2)`.

Below the hero the stage shows ink, so the world appears to continue into the next section.

### 3.2 The frontiers (ink)

Label, heading, lead (max width 640 px, 24 px below the heading), then an ordered list of six rows.

- Row grid, desktop: `56px | 1fr | up to 420px`, 24 px column gap, baseline aligned, vertical padding `clamp(18px, 2.2vw, 30px)`.
- Row grid under 900 px: `44px | 1fr`, description under the name with 8 px between.
- Each row has a 1 px hairline on its top edge (ivory 24%). The list has the same hairline on its bottom edge.
- Numerals `01` to `06`: 20 px bold tangerine, tabular figures, `aria-hidden` because the list is already ordered.
- Hover and arrival behaviour: motion effect 4.

### 3.3 The LATF lens (ivory)

Two columns that collapse to one (`auto-fit`, minimum 340 px, gap 48 px 64 px, centred vertically).

- Left: label, heading, paragraph (max width 520 px).
- Right: the curve box, `max-width: 640px`, `aspect-ratio: 16 / 11`, aligned to the right edge of its column.

The curve is one SVG path stretched to the box (`viewBox="0 0 100 100"`, `preserveAspectRatio="none"`, `vector-effect: non-scaling-stroke`), tangerine, 5 px, round caps:

```
M2,80.5 C3.3,80.1 4.3,81.2 10,78 C15.7,74.8 27.3,68.2 36,61 C44.7,53.8 53.3,41.8 62,35 C70.7,28.2 82.2,22.8 88,20 C93.8,17.2 95.5,18.3 97,18
```

Four points sit on the curve as HTML elements positioned by percentage, so they stay round when the box stretches: 22 px tangerine discs with a 5 px ivory ring.

| Stage | Point (left, top) | Label position |
|---|---|---|
| Scientific breakthrough | 10%, 78% | left 4%, 22 px below the point |
| Technical validation | 36%, 61% | 4 px left of the point, 22 px below |
| Commercial adoption | 62%, 35% | 4 px left of the point, 22 px below |
| Real-world transformation | 88%, 20% | right aligned, 22 px above the point |

Labels: `clamp(14px, 1.3vw, 18px)`, weight 600, two lines each, no wrapping beyond the manual break. The whole box has `role="img"` and the text alternative from the copy deck.

### 3.4 The Frontier Test (ink)

Label, heading, lead, then four question blocks in an `auto-fit` grid (minimum 250 px, gap 40 px, `clamp(40px, 5vw, 72px)` above).

Each block: a 2 px top rule (ivory 50%), 20 px padding above the content, then a 40 px tangerine disc with the number in ink (19 px bold, `aria-hidden`), the question as `h3`, and the description. 12 px between items.

### 3.5 The host (ivory)

Deliberately small. One wrapping row, centred vertically, gap 20 px 40 px: portrait block (96×120 px, ink, top-right corner radius 48 px), then label and name, then the bio (17 px, max width 720 px, takes the remaining width).

Section padding: `clamp(40px, 5vw, 72px)` top, and the same plus `0.9 × --arc` at the bottom so the next arc never touches the content.

### 3.6 The newsletter and footer (ink)

- Label, heading, then a two-column `auto-fit` grid (minimum 360 px, gap 40 px 64 px): the paragraph (weight 500) on the left, the form on the right.
- Form: one row, 10 px gap. Email input: height 56 px, 1.5 px border in the text colour, transparent ground, fully rounded, 17 px text, placeholder at 78% opacity. Button as above. Note beneath at 14 px, ivory 80%.
- Footer: a hairline, then four `auto-fit` columns (minimum 220 px, gap 40 px 48 px): logo and line, Explore, Contact, Follow and listen. Then a second hairline and the legal row.
- Footer logo: the symbol at 28 px (ivory quarter disc, tangerine dot with an ink ring) beside the name at 19 px bold. Use `assets/logo/latf-one-line-colour-reversed.svg` or rebuild it in CSS as the reference does.
- Follow pills: text plus a 14 px arrow, 44 px high, 1.5 px border (ivory 50%). Hover: ivory fill, ink text.
- Every footer link has a tap area at least 44 px high.

### Newsletter form states

| State | Behaviour |
|---|---|
| Idle | As drawn |
| Sending | Button disabled, label "Subscribing...", input read-only |
| Success | Form row is replaced by the success sentence at 19 px, weight 600, announced with `role="status"`. The note beneath stays. |
| Invalid address | Input border turns tangerine, message appears beneath the row in place of the note, input gets `aria-invalid="true"` and `aria-describedby` pointing at the message |
| Error | Same position as the invalid message, form stays usable |

## 4. Horizon arcs

Every colour change between sections follows a shallow arc instead of a straight line. There are four: above the lens, the Frontier Test, the host and the newsletter. There is none between the hero and the frontiers, because the world shape already makes that transition.

Each arc is an empty `aria-hidden` element that is the first child of its section:

```css
.lf-arc {
  position: absolute; left: 0; right: 0;
  bottom: calc(100% - 1px);          /* sits on top of the section, 1 px overlap */
  height: var(--arc);
  background: var(--bg);             /* the section's own ground colour */
  border-radius: 0 100% 0 0 / 0 100% 0 0;   /* quarter ellipse: high on the left, falling to the right */
  transform-origin: 0 100%;
}
```

The arc overlaps the bottom padding of the section before it. To keep clear space, a section that is followed by an arc gets extra bottom padding: `--sp + 0.5 × --arc`.

## 5. Accessibility notes

- Landmarks: the reference wraps everything in a plain `div`. In the build, wrap the sections in `main`. The hero is a `section` with an accessible name. The footer is a `footer` with a `nav` for the Explore links.
- Heading order: one `h1`, then `h2` for each section heading and the host name, `h3` for the four questions.
- All decoration is `aria-hidden`: ripples, orbit and dot, world layer, arcs, numerals, number discs, the curve's SVG.
- The two title lines are separate block spans with a real space between them, so the title reads as "Life at the Frontier."
- External links open in a new tab with `rel="noopener"`.
- Smooth scrolling for in-page links only when motion is allowed.
