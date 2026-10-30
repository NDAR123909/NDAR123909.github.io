// Side-by-side animation of the true Lorenz attractor and the echo state
// network's cold run at three unseen values of rho.
//
// Data: /assets/data/attractors.json, exported unchanged from the computation in
// experiments/make_attractor_figure.py (realization 0, master seed 20260613).
// Each trajectory is a flat [x0, y0, z0, x1, ...] array of round(coord * scale).

(function () {
  "use strict";

  const figure = document.querySelector("[data-attractors]");
  if (!figure) return;

  const canvases = [...figure.querySelectorAll("canvas")];
  const rhoButtons = [...figure.querySelectorAll("[data-rho]")];
  const playButton = figure.querySelector("[data-play]");
  const view = figure.querySelector("[data-view]");
  const status = figure.querySelector("[data-status]");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const POINTS_PER_SECOND = 220;
  const Z_CENTER = 27.5;
  const HALF_WIDTH = 38; // covers x in [-22, 22], y in [-30, 30] at any rotation

  let panels = [];
  let current = 0;
  let shown = 0;          // number of points drawn so far
  let playing = false;
  let lastTime = null;
  let azimuth = (-45 * Math.PI) / 180;
  let elevation = (20 * Math.PI) / 180;

  function decode(flat, scale) {
    const out = new Float32Array(flat.length);
    for (let i = 0; i < flat.length; i++) out[i] = flat[i] / scale;
    return out;
  }

  function color(name) {
    return getComputedStyle(figure).getPropertyValue(name).trim();
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    for (const canvas of canvases) {
      const w = canvas.clientWidth;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * 0.9 * dpr);
    }
    draw();
  }

  function drawOne(canvas, points, stroke, count) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!points || count < 2) return;

    const cosA = Math.cos(azimuth), sinA = Math.sin(azimuth);
    const cosE = Math.cos(elevation), sinE = Math.sin(elevation);
    const halfHeight = Z_CENTER * cosE + HALF_WIDTH * sinE;
    const s = 0.94 * Math.min(w / (2 * HALF_WIDTH), h / (2 * halfHeight));

    // Orthographic projection: rotate about z, then tilt toward the viewer.
    const project = (i) => {
      const x = points[3 * i], y = points[3 * i + 1], z = points[3 * i + 2] - Z_CENTER;
      const sx = x * cosA - y * sinA;
      const depth = x * sinA + y * cosA;
      const sy = z * cosE - depth * sinE;
      return [w / 2 + s * sx, h / 2 - s * sy];
    };

    const dpr = window.devicePixelRatio || 1;
    ctx.lineWidth = 0.7 * dpr;
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    let [px, py] = project(0);
    ctx.moveTo(px, py);
    for (let i = 1; i < count; i++) {
      [px, py] = project(i);
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mark the current point while the trace is still running.
    if (count < points.length / 3) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.arc(px, py, 2.5 * dpr, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function total() {
    return panels.length ? panels[current].truth.length / 3 : 0;
  }

  function draw() {
    if (!panels.length) return;
    const p = panels[current];
    const n = Math.min(Math.floor(shown), total());
    drawOne(canvases[0], p.truth, color("--truth"), n);
    drawOne(canvases[1], p.esn, color("--network"), n);
  }

  function updatePlayButton() {
    if (playing) playButton.textContent = "Pause";
    else if (shown >= total()) playButton.textContent = "Replay";
    else playButton.textContent = "Play";
  }

  function tick(time) {
    if (!playing) return;
    if (lastTime !== null) shown += ((time - lastTime) / 1000) * POINTS_PER_SECOND;
    lastTime = time;
    if (shown >= total()) {
      shown = total();
      playing = false;
      updatePlayButton();
    }
    draw();
    if (playing) requestAnimationFrame(tick);
  }

  function play() {
    if (shown >= total()) shown = 0;
    playing = true;
    lastTime = null;
    updatePlayButton();
    requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    updatePlayButton();
  }

  function selectRho(index) {
    current = index;
    rhoButtons.forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
    status.textContent = rhoButtons[index].dataset.label;
    shown = reduceMotion ? total() : 0;
    draw();
    if (reduceMotion) updatePlayButton();
    else play();
  }

  // Drag (mouse, touch, pen) and arrow keys rotate both panes together.
  let drag = null;
  view.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY, az: azimuth, el: elevation };
    view.setPointerCapture(e.pointerId);
  });
  view.addEventListener("pointermove", (e) => {
    if (!drag) return;
    azimuth = drag.az - (e.clientX - drag.x) * 0.01;
    elevation = clampElevation(drag.el + (e.clientY - drag.y) * 0.01);
    draw();
  });
  const endDrag = () => { drag = null; };
  view.addEventListener("pointerup", endDrag);
  view.addEventListener("pointercancel", endDrag);

  view.addEventListener("keydown", (e) => {
    const step = (5 * Math.PI) / 180;
    if (e.key === "ArrowLeft") azimuth += step;
    else if (e.key === "ArrowRight") azimuth -= step;
    else if (e.key === "ArrowUp") elevation = clampElevation(elevation + step);
    else if (e.key === "ArrowDown") elevation = clampElevation(elevation - step);
    else return;
    e.preventDefault();
    draw();
  });

  function clampElevation(el) {
    const limit = (80 * Math.PI) / 180;
    return Math.max(-limit, Math.min(limit, el));
  }

  rhoButtons.forEach((b, i) => b.addEventListener("click", () => selectRho(i)));
  playButton.addEventListener("click", () => (playing ? pause() : play()));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  new ResizeObserver(resize).observe(canvases[0]);

  fetch(figure.dataset.src)
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((data) => {
      panels = data.panels.map((p) => ({
        truth: decode(p.truth, data.scale),
        esn: decode(p.esn, data.scale),
      }));
      figure.classList.add("is-ready");
      resize();

      // Start tracing once the figure scrolls into view.
      const start = () => selectRho(current);
      if (!("IntersectionObserver" in window)) return start();
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          io.disconnect();
          start();
        }
      }, { threshold: 0.35 });
      io.observe(view);
    })
    .catch(() => {
      status.textContent = "The trajectory data didn't load. The static version of this figure is linked below.";
    });
})();
