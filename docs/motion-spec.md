# Motion spec

Six effects, all built from the logo's two shapes: the world and the dot. They are implemented and tested in `reference/index.html`. The script is `reference/motion.js` (about 150 lines, no dependencies) and the styles are in `reference/styles.css`.

## Principles

1. **Nothing decorative.** Every effect shows the idea of a frontier: an edge that advances, a line that is drawn, a horizon that rises. Do not add effects that are not listed here.
2. **Arrive once, then rest.** Apart from the two ambient loops in the hero (ripples and the dot's slow drift), every animation plays once and stops.
3. **The page never depends on motion.** With reduced motion or without JavaScript, everything is visible and static.
4. **Scrolling stays native.** No scroll hijacking, no smooth-scroll library, no snapping.

## Global rules

| Rule | Detail |
|---|---|
| Reduced motion | `@media (prefers-reduced-motion: reduce)` sets `animation: none` and `transition: none` on everything, and the script exits before doing anything. |
| No JavaScript | Nothing is hidden. Effects 1, 3, 4, 5 and the arrival part of 6 simply do not run. Effect 2 is pure CSS and still plays. |
| Hidden starting states | Only ever applied by the script, by adding the class `lf-pre` to an element. The CSS never hides content on its own. |
| Arrival trigger | One `IntersectionObserver` with `rootMargin: '0px 0px -60px 0px'` and `threshold: 0.12`. When a target enters, replace `lf-pre` with `lf-in` and stop observing it. Each target arrives once. |
| Safety net | If the observer has not reported within 1500 ms, reveal every target. |
| Fill mode | Arrival animations use `animation-fill-mode: backwards`, so elements return to their normal styles afterwards and hover effects keep working. |
| Easing | `--ease: cubic-bezier(.2, .7, .2, 1)`. `--spring: cubic-bezier(.3, 1.5, .5, 1)` (slight overshoot). |
| Properties | Animate only `transform`, `opacity` and `clip-path`. |
| First paint | Start the script before first paint, or set the `lf-pre` classes from an inline script in the `head`, so nothing flashes visible and then hides. |

Arrival targets, marked with `data-in` in the reference: the frontier list, the lens curve box, the question grid, and the four arcs.

---

## Effect 1. Crossing the frontier

> **Superseded (25 Nov 2026)** by `docs/change-hero-crossing.md`: the hero text is now swallowed by the world and the next section is revealed inside it. Where the two differ, the change request wins.

**What the visitor sees.** As they scroll out of the hero, the blue world grows from its corner until it fills the screen. The title changes from ink to ivory exactly where the edge passes over it. The dot rides the edge and leaves the frame. The hero ends fully blue and flows into the blue "What we cover" section. Scrolling back up reverses it.

**Structure.** See the design spec, section 3.1: a stage, and inside it a hero with a base layer and a clipped world layer holding the same text.

**Progress.** Each animation frame while the stage is on screen:

```
p = clamp(-stage.getBoundingClientRect().top / travel, 0, 1)
e = p < 0.5 ? 2p² : 1 - (-2p + 2)² / 2          // ease in and out
R = R0 + (Rmax - R0) × e                         // in hero units
Rmax = hypot(heroWidth, heroHeight) / u + 1      // reaches the far corner
```

Write two custom properties on the hero: `--R` and `--p`.

| Property | Drives |
|---|---|
| `--R` | The world layer's `clip-path` circle radius, and the dot's `translateX` along its orbit |
| `--p` | Ripple opacity: `calc(1 - var(--p) * 8)`, so the ripples are gone after the first eighth |

**Pinned mode (desktop).** The hero holds still while the world grows.

- The stage gets the class `is-pin`: its height becomes `96u` (the hero's `56u` plus `40u` of scroll distance) and the hero becomes `position: sticky; top: 0`.
- `travel = stage height − hero height`.
- Pin only when all of these are true: window width is 1000 px or more, the page scrolls, and the window height is between 520 px and 1.7 times the hero height. Re-check on resize.
- In production, decide pinned mode before first paint (a width media query plus the script check) so the stage does not change height after load.

**Unpinned mode (phones, tablets, unusual windows).** The hero scrolls away normally and the world grows as it goes. `travel = 0.6 × hero height`.

**Performance.** One `requestAnimationFrame` loop, running only while the stage intersects the viewport. It reads one rectangle and writes two custom properties. Re-measure sizes on `resize` and with a `ResizeObserver` on the hero.

**Fallback.** Without the script the hero is the static composition at `p = 0`.

---

## Effect 2. The title lands

**What the visitor sees.** On load the two title lines rise into place, the tangerine full stop drops in last, and the dot pops onto the world's edge. The line and the button fade up.

Pure CSS, inside `@media (prefers-reduced-motion: no-preference)`. Each title line sits in a wrapper with `overflow: hidden` so it rises from behind a mask. The wrapper has small padding with matching negative margins so no letter is clipped, and the `h1` is a flex column so those margins do not collapse.

| Element | From | Duration | Delay | Easing |
|---|---|---|---|---|
| Title line 1 | `translateY(125%)` | 950 ms | 0 | `--ease` |
| Title line 2 | `translateY(125%)` | 950 ms | 120 ms | `--ease` |
| Dot | `scale(0)` | 800 ms | 300 ms | `--spring` |
| Line under the title | `opacity: 0; translateY(14px)` | 800 ms | 500 ms | ease-out |
| Button | `opacity: 0; translateY(14px)` | 800 ms | 650 ms | ease-out |
| Full stop | `opacity: 0; translateY(-1em)` | 650 ms | 800 ms | `--spring` |

Both hero layers carry the same classes, so they animate in step. All end states are the elements' normal styles.

---

## Effect 3. The dot follows the visitor

**What the visitor sees.** On a computer, the dot glides along the world's edge to stay in line with the cursor. Left alone, it drifts slowly.

- Listen for `pointermove` on the hero. Ignore pointers that are not a mouse.
- Angle to the cursor, measured from the bottom-left corner of the hero, in degrees above the bottom edge: `a = atan2(hero.bottom − clientY, clientX − hero.left)`. Clamp to 14° to 76° so the dot and its ring stay inside the frame.
- Each frame: `angle += (target − angle) × 0.07`, then set the orbit to `rotate(−angle deg)`.
- If the cursor has not moved for 2500 ms, or leaves the hero, the target returns to the idle drift: `45° + 4° × sin(2π × t / 36 s)`.
- Under 1000 px wide: the target is fixed at 45°. No tracking on touch.
- When the script takes over, add `is-js` to the orbit to switch off the CSS drift.

**Fallback.** Without the script the dot drifts between 41° and 49° with a CSS animation (18 s, ease-in-out, alternating). Under 1000 px it stays at 45°.

---

## Effect 4. The list arrives

**What the visitor sees.** When the list of frontiers scrolls into view, each row's line draws from left to right and its content rises in, one row after another.

Trigger: the list (`ol`) enters the viewport. For row `i`, counting from 0:

| Element | From | Duration | Delay | Easing |
|---|---|---|---|---|
| Row hairline (`::before`) | `scaleX(0)`, origin left | 900 ms | `i × 90 ms` | `--ease` |
| Numeral, name, description | `opacity: 0; translateY(26px)` | 800 ms | `i × 90 ms + 120 ms` | `--ease` |

**Hover**, only on devices that can hover (`@media (hover: hover)`):

| Element | Change | Duration | Easing |
|---|---|---|---|
| A 2 px tangerine line on the row's top edge (`::after`) | `scaleX(0)` to `scaleX(1)`, origin left | 600 ms | `--ease` |
| The name | `translateX(12px)` | 500 ms | `--ease` |

Both reverse when the cursor leaves. The rows are not links at launch, so there is no pointer cursor and no click behaviour.

The four Frontier Test questions arrive with the same pattern: each block fades and rises 26 px (800 ms, delay `i × 120 ms`), and its number disc pops from `scale(0)` (600 ms, `--spring`, delay `i × 120 ms + 250 ms`).

---

## Effect 5. The lens draws itself

**What the visitor sees.** When the curve scrolls into view, the line is drawn from the lab to everyday life. Each stage lights up as the line reaches it. Then it rests.

Trigger: the curve box enters the viewport. The draw takes `T = 1700 ms`.

| Element | Animation | Duration | Delay | Easing |
|---|---|---|---|---|
| The SVG | Left-to-right wipe: `clip-path` from `inset(-24px 100% -24px -24px)` to `inset(-24px -24px -24px -24px)` | 1700 ms | 0 | linear |
| Each point | From `opacity: 0; scale(0)` | 600 ms | `x × T` | `--spring` |
| Each label | From `opacity: 0; translateY(14px)` | 700 ms | `x × T + 120 ms` | ease-out |

`x` is the point's horizontal position as a fraction: 0.10, 0.36, 0.62, 0.88. That gives point delays of 170, 612, 1054 and 1496 ms, so each point appears as the line passes it.

The wipe is used instead of a dash-offset draw because the path is stretched without keeping its proportions, which makes its on-screen length awkward to measure. The curve always moves to the right, so a wipe looks identical to drawing. The negative insets keep the round line ends and the stroke from being cut off.

---

## Effect 6. Horizons between sections

**What the visitor sees.** Sections do not meet on straight lines. Each new section comes up over a shallow arc, the same curve as the logo, and the arc rises as it arrives.

The static shape is in the design spec, section 4. Arrival, triggered when the arc itself enters the viewport:

| Element | From | To | Duration | Easing |
|---|---|---|---|---|
| Arc | `scaleY(0.2)`, origin bottom left | `scaleY(1)` | 1300 ms | `--ease` |

This one is a CSS transition, not a keyframe animation: the script adds `lf-pre` (the squashed state) and removes it on arrival.

---

## Ambient loops (hero only)

| Element | Animation |
|---|---|
| Two rings on the world's edge | `scale(1)` to `scale(1.28)` while fading from 50% to 0, 7 s, ease-out, endless, the second ring offset by 3.5 s. Hidden as soon as effect 1 begins. |
| The dot | The idle drift described in effect 3. |

## Test checklist

- [ ] Scroll down and up through the hero slowly and quickly: the world, the title colours and the dot always match the scroll position. No jump when the pin releases.
- [ ] Resize the window across 1000 px and reload at 1440×900, 1920×1080, 1366×640, 820×1180 and 390×844.
- [ ] On a very tall window the hero does not pin and nothing breaks.
- [ ] Each arrival plays once and never replays on scrolling back.
- [ ] Hover a frontier row, then leave: the line and the name return.
- [ ] Reduced motion on: no movement anywhere, everything visible.
- [ ] JavaScript off: everything visible, title still lands.
- [ ] Throttle the processor four times in the browser tools: effect 1 stays smooth.
