# Change request: the hero's "crossing the frontier" effect

One change to the site that is already built. Nothing else on the page should change.

Class names below are the ones from the original reference page (`lf-stage`, `lf-hero`, `lf-world`, and so on). If the build renamed them, map them across.

## The problem

At the end of the scroll effect, the world has covered the whole hero and the title, the line and the button are still there in ivory on plain blue. The text sits right of centre with nothing on the left, so the screen looks like a broken second hero.

## The new behaviour

- As the visitor scrolls, the hero stays where it is and the blue world grows from its bottom-left corner, as now.
- The title, the line and the button are **swallowed** at the world's edge. They no longer turn ivory and stay.
- Inside the growing world, the next section ("What we cover") rises into place at normal scroll speed.
- When the world has filled the window, the visitor is looking at the top of "What we cover". There is never a blue screen with the hero's text on it.
- Scrolling back up reverses it exactly.
- The page does not get longer. The 40 units of extra scroll distance that the stage had are removed.

## 1. Markup

Remove the world layer (the `aria-hidden` copy of the title, line and button). Wrap the real text in one new layer, the sky.

Before:

```html
<div class="lf-stage">
  <section class="lf-hero" aria-label="Introduction">
    <div class="lf-side"> h1, line, button </div>
    <div class="lf-world" aria-hidden="true" inert> copy of the text </div>
    <div class="lf-ripples" aria-hidden="true">...</div>
    <div class="lf-orbit" aria-hidden="true">...</div>
  </section>
</div>
```

After:

```html
<div class="lf-stage">
  <section class="lf-hero" aria-label="Introduction">
    <div class="lf-sky">
      <div class="lf-side"> h1, line, button </div>
    </div>
    <div class="lf-ripples" aria-hidden="true">...</div>
    <div class="lf-orbit" aria-hidden="true">...</div>
  </section>
</div>
```

The ripples and the orbit stay outside the sky, so they are not masked.

## 2. Styles

### 2.1 Move the hero unit to the page root

The section after the hero now needs the unit, so `--u`, `--R0`, `--d` and `--ring` move from `.lf-stage` to the root (`.lf`). The cap on the unit goes from 18 px to 24 px so the hero fills large monitors.

```css
.lf { --u: min(1vw, 1.7857vh, 24px); --R0: 38; --d: 10.6; --ring: 2.1; }

@media (max-width: 999px) {
  .lf { --u: min(1vw, 5.6px); --R0: 70; --d: 19.6; --ring: 3.9; }
}
```

### 2.2 Replace the hero rules

Delete every `.lf-world` rule and the old `.lf-stage.is-pin` rules. The hero block becomes:

```css
.lf-stage { background: var(--ink); }                 /* not positioned, no z-index */
.lf-stage.is-pin { height: 200vh; }
.lf-stage.is-pin .lf-hero { position: sticky; top: 0; z-index: 5; height: 100vh; }
.lf-stage.is-pin + .lf-sec { margin-top: -100vh; }    /* the next section sits under the pinned hero */

.lf-hero { --R: var(--R0); --p: 0; position: relative; overflow: hidden;
           height: calc(var(--u) * 56); color: var(--ink); }   /* no background any more */
.lf-hero.is-gone, .lf-hero.is-gone * { pointer-events: none; }

.lf-sky {
  position: absolute; inset: 0; background: var(--ivory);
  -webkit-mask-image: radial-gradient(circle at 0 100%, transparent calc(var(--u) * var(--R) - .5px), #000 calc(var(--u) * var(--R) + .5px));
          mask-image: radial-gradient(circle at 0 100%, transparent calc(var(--u) * var(--R) - .5px), #000 calc(var(--u) * var(--R) + .5px));
}

/* browsers without CSS masks: a static world, no scroll effect */
@supports not ((mask-image: none) or (-webkit-mask-image: none)) {
  .lf-sky { background: radial-gradient(circle at 0 100%, var(--ink) calc(var(--u) * var(--R0) - .5px), rgba(28, 61, 122, 0) calc(var(--u) * var(--R0) + .5px)) var(--ivory); }
}
```

Under 1000 px the hero's padding moves to the sky, which goes back into normal flow:

```css
@media (max-width: 999px) {
  .lf-hero { height: auto; }                           /* padding removed from here */
  .lf-sky  { position: relative; padding: calc(var(--u) * 14) calc(var(--u) * 6) calc(var(--u) * 84); }
}
```

Everything else in the hero is unchanged: `.lf-side`, the title, the ripples, the orbit and the dot.

### 2.3 How it works

- The sky is the ivory ground and the text in one layer, with a circular hole cut out of it by the mask. The world is not drawn. It is the stage's ink showing through the hole.
- `--R` is the hole's radius in hero units. The script already animates it. As the hole grows it removes the ivory ground and the text together and shows whatever is underneath.
- While pinned, what is underneath is the next section, which the negative margin has pulled up under the hero.

### 2.4 Layering, which must be exactly this

| Element | Rule | Why |
|---|---|---|
| Stage | Not positioned, no `z-index`, no `transform` | It must not create a stacking context, or its ink ground would cover the next section |
| Next section (the frontiers) | `position: relative`, `z-index: auto` | Paints above the stage's ground |
| Hero, while pinned | `position: sticky; z-index: 5` | Paints above the next section |

No ancestor of the stage may have `overflow` other than `visible`, or the sticky hero stops working.

## 3. Script

Three edits in the motion module.

**3.1 Check for mask support once, near the top:**

```js
var canMask = !win.CSS || !win.CSS.supports ||
  win.CSS.supports('mask-image', 'none') || win.CSS.supports('-webkit-mask-image', 'none');
```

**3.2 Replace `measure()`.** The pin test is stricter, the hero is measured after the pin class is toggled (its height changes), and the unpinned travel is longer:

```js
function measure() {
  var cs = win.getComputedStyle(hero);
  s.R0 = parseFloat(cs.getPropertyValue('--R0')) || 38;
  s.d = parseFloat(cs.getPropertyValue('--d')) || 10.6;
  s.u = (dot.offsetWidth / s.d) || 14;
  s.wide = win.innerWidth >= 1000;
  /* pin the hero only when its designed height (56 units) roughly fills a desktop
     window, on a page that scrolls. While pinned the hero is exactly one window tall. */
  var designed = s.u * 56;
  var scrolls = document.documentElement.scrollHeight > win.innerHeight * 1.5;
  var pin = canMask && s.wide && scrolls && win.innerHeight >= 480 && win.innerHeight <= designed * 1.2;
  if (pin !== s.pinned) {
    s.pinned = pin;
    stage.classList.toggle('is-pin', pin);
  }
  s.W = hero.offsetWidth;
  s.H = hero.offsetHeight;
  s.Rmax = Math.sqrt(s.W * s.W + s.H * s.H) / s.u + 1;
  s.travel = pin ? Math.max(1, stage.offsetHeight - s.H) : Math.max(1, s.H * 0.85);
  s.p = -1;
}
```

**3.3 In `frame()`,** skip the effect without mask support and mark the hero as gone when the crossing is complete:

```js
var p = canMask ? Math.min(1, Math.max(0, -top / s.travel)) : 0;
if (p !== s.p) {
  s.p = p;
  var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  hero.style.setProperty('--R', (s.R0 + (s.Rmax - s.R0) * e).toFixed(3));
  hero.style.setProperty('--p', p.toFixed(3));
  /* once the world has taken the whole hero, let clicks through to what is underneath */
  hero.classList.toggle('is-gone', p >= 0.999);
}
```

Also remove `is-gone` from the hero in the module's clean-up function.

## 4. The two modes

| | Pinned | Unpinned |
|---|---|---|
| When | Width 1000 px or more, the page scrolls, and window height between 480 px and 1.2 × the hero's designed height (`56u`) | Everything else: phones, tablets, tall or narrow windows |
| Hero | Sticky, exactly one window tall | Normal flow, `56u` tall (content height under 1000 px) |
| Next section | Pulled up one window, slides under the hero | Follows the hero as usual |
| Travel | One window height | 0.85 × hero height |
| Result | The world wipes the hero away and reveals the next section | The hero scrolls away while the world swallows it |

The pin test as a media query, for deciding before first paint: `(min-width: 1000px) and (min-aspect-ratio: 149/100) and (min-height: 480px) and (max-height: 1612px)`, together with motion being allowed and the script running.

Toggling the pin does not move the next section: the stage grows by one window and the section moves up by one window.

## 5. Must stay the same

- The title landing on load, the dot following the cursor, the ripples, and every effect below the hero.
- Reduced motion and no JavaScript: the static hero, with the world visible and nothing hidden.
- The resting hero at the top of the page looks exactly as it does now.

## 6. Checks

- [ ] At 1288×543, 1440×900, 1920×1080 and 2560×1300: scrolling one window height ends on the top of "What we cover". No blue screen with the hero's text on it at any point.
- [ ] Halfway through, the title is cut by the world's edge, and the "What we cover" label and heading are visible inside the world.
- [ ] After the crossing, hovering a frontier row works (the invisible hero does not block it).
- [ ] Scrolling back to the top restores the hero exactly, and the Subscribe button is clickable again.
- [ ] The total page height is the same pinned and unpinned.
- [ ] At 1024×768 and 390×844 the hero is not pinned: it scrolls away while the world swallows it, with no overlap of the next section.
- [ ] With reduced motion, and with JavaScript off: static hero, world visible, nothing hidden.
- [ ] Safari and Firefox: the mask animates smoothly and the sticky hero holds.
