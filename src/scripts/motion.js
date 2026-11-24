/* Life at the Frontier: motion (ported from reference/motion.js).
   Inlined at the end of <body> by src/pages/index.astro so it runs before first
   paint: the hidden starting states (lf-pre) and the pinned-hero decision are both
   in place before anything is drawn, so nothing flashes and nothing shifts.
   Nothing is hidden unless this script hides it, so the page reads fully without it.
   latfMotion(root) returns a function that undoes everything it set up. */
function latfMotion(root) {
  var win = window;
  var noop = function () {};
  var mq = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!root || (mq && mq.matches) || !('IntersectionObserver' in win)) return noop;

  var stage = root.querySelector('.lf-stage');
  var hero = root.querySelector('.lf-hero');
  var orbit = root.querySelector('.lf-orbit');
  var dot = root.querySelector('.lf-dot');
  if (!stage || !hero || !orbit || !dot) return noop;

  var undo = [];

  /* ---- arrivals: list, lens, four questions, horizon arcs ---- */
  var targets = Array.prototype.slice.call(root.querySelectorAll('[data-in]'));
  var heard = false;
  function arrive(el) {
    el.classList.remove('lf-pre');
    el.classList.add('lf-in');
  }
  var io = new IntersectionObserver(function (entries) {
    heard = true;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      arrive(entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
  targets.forEach(function (el) {
    el.classList.add('lf-pre');
    io.observe(el);
  });
  /* safety net: if the observer never reports, show everything */
  var safety = win.setTimeout(function () {
    if (!heard) targets.forEach(arrive);
  }, 1500);
  undo.push(function () {
    win.clearTimeout(safety);
    io.disconnect();
    targets.forEach(function (el) { el.classList.remove('lf-pre', 'lf-in'); });
  });

  /* ---- hero: crossing the frontier (scroll) and the dot that follows the cursor ---- */
  var s = {
    u: 14, R0: 38, d: 10.6, W: 0, H: 0, Rmax: 120, travel: 1,
    pinned: false, wide: true, p: -1,
    angle: 45, pointerAngle: null, pointerAt: 0,
    raf: 0, visible: true, t0: win.performance.now()
  };

  function measure() {
    var cs = win.getComputedStyle(hero);
    s.R0 = parseFloat(cs.getPropertyValue('--R0')) || 38;
    s.d = parseFloat(cs.getPropertyValue('--d')) || 10.6;
    s.W = hero.offsetWidth;
    s.H = hero.offsetHeight;
    s.u = (dot.offsetWidth / s.d) || 14;
    s.wide = win.innerWidth >= 1000;
    /* pin the hero only in a normal desktop viewport on a page that scrolls */
    var scrolls = document.documentElement.scrollHeight > win.innerHeight * 1.5;
    var pin = s.wide && scrolls && win.innerHeight >= 520 && win.innerHeight <= s.H * 1.7;
    if (pin !== s.pinned) {
      s.pinned = pin;
      stage.classList.toggle('is-pin', pin);
    }
    s.Rmax = Math.sqrt(s.W * s.W + s.H * s.H) / s.u + 1;
    s.travel = pin ? Math.max(1, stage.offsetHeight - s.H) : Math.max(1, s.H * 0.6);
    s.p = -1;
  }

  function frame(now) {
    s.raf = 0;
    /* scroll progress, 0 at the top, 1 when the world has filled the hero */
    var top = stage.getBoundingClientRect().top;
    var p = Math.min(1, Math.max(0, -top / s.travel));
    if (p !== s.p) {
      s.p = p;
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      hero.style.setProperty('--R', (s.R0 + (s.Rmax - s.R0) * e).toFixed(3));
      hero.style.setProperty('--p', p.toFixed(3));
    }
    /* dot angle, in degrees above the bottom edge, measured from the world's centre */
    var target = 45;
    if (s.wide) {
      var following = s.pointerAngle !== null && now - s.pointerAt < 2500;
      target = following ? s.pointerAngle : 45 + 4 * Math.sin((now - s.t0) / 36000 * Math.PI * 2);
    }
    s.angle += (target - s.angle) * 0.07;
    orbit.style.transform = 'rotate(' + (-s.angle).toFixed(2) + 'deg)';
    if (s.visible) s.raf = win.requestAnimationFrame(frame);
  }
  function start() {
    if (!s.raf) s.raf = win.requestAnimationFrame(frame);
  }

  function onPointer(ev) {
    if (ev.pointerType && ev.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect();
    var x = ev.clientX - r.left;
    var y = r.bottom - ev.clientY;
    var a = Math.atan2(y, Math.max(1, x)) * 180 / Math.PI;
    s.pointerAngle = Math.min(76, Math.max(14, a));
    s.pointerAt = win.performance.now();
  }
  function onLeave() { s.pointerAngle = null; }

  var heroIO = new IntersectionObserver(function (entries) {
    s.visible = entries[0].isIntersecting;
    if (s.visible) start();
  });

  orbit.classList.add('is-js');
  measure();
  heroIO.observe(stage);
  hero.addEventListener('pointermove', onPointer);
  hero.addEventListener('pointerleave', onLeave);
  win.addEventListener('resize', measure);
  var ro = null;
  if ('ResizeObserver' in win) {
    ro = new win.ResizeObserver(measure);
    ro.observe(hero);
  }
  start();

  undo.push(function () {
    if (s.raf) win.cancelAnimationFrame(s.raf);
    s.visible = false;
    heroIO.disconnect();
    if (ro) ro.disconnect();
    hero.removeEventListener('pointermove', onPointer);
    hero.removeEventListener('pointerleave', onLeave);
    win.removeEventListener('resize', measure);
    stage.classList.remove('is-pin');
    orbit.classList.remove('is-js');
    orbit.style.removeProperty('transform');
    hero.style.removeProperty('--R');
    hero.style.removeProperty('--p');
  });

  return function () {
    undo.forEach(function (fn) { fn(); });
  };
}

latfMotion(document.getElementById('top'));
