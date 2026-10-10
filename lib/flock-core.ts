/**
 * Flock: twelve independent agents that follow the cursor, form a ring
 * around it, circle for a moment, and then perform one finale: every agent
 * crosses to the opposite side of the ring through the same center point,
 * at the same time, without any two ever touching. Then everything goes still.
 *
 * The finale is the textbook hard case for multi-agent motion (the
 * "antipodal swap"): naive steering jams in the middle. Here it's solved
 * the way Fly-In solves drone traffic, by planning in space-time:
 * each agent's departure time is reserved so its whole trajectory keeps a
 * clearance from every trajectory already reserved. Agents keep right on
 * their lane, so head-on partners pass each other instead of colliding.
 *
 * Framework-free on purpose: Flock.tsx wraps it for Next.js, and the demo
 * page is built from this exact file, so what you test is what ships.
 *
 * Rules it keeps:
 * - Calm. One performance per arrival, then the flock slowly turns through a
 *   series of figures (triangle, star, grid…) while the cursor rests, and
 *   eases back to a still ring after a long rest. Nothing ever stops dead.
 * - Cheap. One rAF loop that sleeps when nothing moves; only the dirty
 *   rectangle is cleared each frame; DPR-aware canvas capped at 2x; the
 *   ~20 ms plan is computed once, when the browser is idle.
 * - Honest. "Never collide" is enforced: planned clearance during the
 *   finale, and a hard minimum distance at all times.
 */

export type FlockHandle = {
  setActive(active: boolean): void;
  destroy(): void;
};

export type FlockOptions = {
  /** Dot and trail color as "r, g, b". Defaults to the site ink, #1B1A17. */
  inkRgb?: string;
};

const N = 12; // agents (even: each has an antipodal partner)
const DOT = 2.25; // dot radius, px
const R = 34; // resting ring radius around the cursor, px
const RING_OFFSET_X = 4; // the pointer's hotspot is its tip; nudge the ring
const RING_OFFSET_Y = 7; // toward the arrow's body so it looks centered
const MAX_SPEED = 210; // px/s
const MAX_FORCE = 560; // px/s², caps acceleration and turning: the source of smoothness
const SLOW_RADIUS = 130; // start braking inside this distance
const WAKE = 130; // cursor this far from the flock's center: break formation, follow
const FORM = R + 18; // flock's center this close to the cursor: form the ring
const MIN_GAP = 10; // hard minimum distance between dot centers, always
const SEP_RADIUS = 15; // soft separation range (below ring spacing, so a resting ring feels no forces)
const SEP_WEIGHT = 2600;
const ORBIT_SPEED = 0.55; // rad/s while circling
const ORBIT_FOR = 2; // s of stillness before the ring slows down
const DRIFT_SPEED = 0.12; // rad/s the ring keeps drifting at once it has slowed down
const REST_FOR = 45; // s of stillness before the figures end, the ring fades to still and the loop sleeps
const FIRST_HOLD = 1.2; // s the ring holds after the finale before the first figure
const HOLD_T = 2.6; // s each figure holds
const MORPH_T = 1.4; // s to glide from one figure to the next
const SETTLE_T = 0.5; // s to absorb any offset when figures take over from steering
const SPIN_UP = 3; // 1/s, how quickly the ring picks up speed
const SPIN_DOWN = 1.1; // 1/s, how gently it slows down (lower = longer, softer)
const FADE_OUT = 0.8; // 1/s, the final fade from drift to still
const ARM_AFTER = 1; // s of following before the next arrival earns a finale
const SHOW_BEAT = 0.4; // s of settled drift before the finale starts

// Finale geometry and timing
const STAGE_R = 56; // ring expands to this radius for the crossing
const LANE = 8; // keep-right offset at the center, px
const CROSS_T = 1.3; // s for one agent to cross
const CLEAR = 11; // planned clearance between any two agents, px
const EXPAND_T = 0.5;
const CONTRACT_T = 0.6;

const TRAIL_TIME = 0.24; // trail length in seconds: identical at 60 Hz and 120 Hz
const TRAIL_CAP = 48; // ring-buffer size; enough for 0.24 s at 144 Hz
const TRAIL_ALPHA = 0.2;
const DOT_ALPHA = 0.9;
const PACE = [1, 0.92, 1.08, 0.96, 1.04, 0.9, 1.02, 0.94, 1.06, 0.98, 0.91, 1.05];

const TAU = Math.PI * 2;
const STEP = TAU / N;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoother = (s: number) => s * s * s * (s * (s * 6 - 15) + 10); // zero velocity and acceleration at both ends

/** Agent k's crossing path in local ring coordinates, s = eased progress 0..1. */
function crossing(k: number, s: number): [number, number] {
  const ux = Math.cos(k * STEP);
  const uy = Math.sin(k * STEP);
  // Straight through the center, bulging to the agent's right (y-down screen),
  // so partners on the same diameter pass each other 2 * LANE apart.
  const off = LANE * Math.sin(Math.PI * s);
  return [STAGE_R * ux * (1 - 2 * s) + uy * off, STAGE_R * uy * (1 - 2 * s) - ux * off];
}

function crossingAt(k: number, t: number, start: number[]): [number, number] {
  return crossing(k, smoother(clamp((t - start[k]) / CROSS_T, 0, 1)));
}

/**
 * Space-time reservation: take agents one by one and give each the earliest
 * departure whose entire trajectory (waiting, crossing, arriving) stays at
 * least CLEAR away from every trajectory already reserved.
 *
 * Order matters: each agent is followed by its antipodal partner, because
 * an agent's destination is its partner's starting slot. The partner must be
 * planned to leave in time, while its slot is still being approached.
 */
function planCrossing(): { start: number[]; makespan: number } | null {
  const order: number[] = [];
  for (let k = 0; k < N / 2; k++) {
    const a = (k * 3) % (N / 2) + Math.floor((k * 3) / (N / 2)); // 0,3,1,4,2,5 — spreads diameters out
    order.push(a, a + N / 2);
  }
  const start: number[] = new Array(N).fill(0);
  const reserved: number[] = [];
  const dt = 1 / 120;
  for (const i of order) {
    let found = false;
    for (let t0 = 0; t0 < 6 && !found; t0 += 0.02) {
      start[i] = t0;
      let ok = true;
      for (const j of reserved) {
        const end = Math.max(t0, start[j]) + CROSS_T;
        for (let t = 0; t <= end && ok; t += dt) {
          const [ax, ay] = crossingAt(i, t, start);
          const [bx, by] = crossingAt(j, t, start);
          if (Math.hypot(ax - bx, ay - by) < CLEAR) ok = false;
        }
        if (!ok) break;
      }
      found = ok;
    }
    if (!found) return null; // no finale rather than an unsafe one
    reserved.push(i);
  }
  return { start, makespan: Math.max(...start) + CROSS_T };
}

// ── Shapes ──────────────────────────────────────────────────────────────
// While the cursor rests after the finale, the flock holds one figure, then
// glides into another. Each figure is 12 points around the cursor, sorted by
// angle, so a morph keeps every dot's place in the circle and no path cuts
// across the formation. A morph that would bring two dots closer than MIN_GAP
// is never used: safeMorphs() lists the allowed ones, computed once when idle.
// scripts/check-flock-shapes.ts prints the same table.

type Pt = [number, number];

/** Points spread evenly along a closed polygon's perimeter. */
function polygon(vertices: Pt[]): Pt[] {
  const sides = vertices.map((v, i) => {
    const w = vertices[(i + 1) % vertices.length];
    return { v, w, len: Math.hypot(w[0] - v[0], w[1] - v[1]) };
  });
  const total = sides.reduce((s, e) => s + e.len, 0);
  const out: Pt[] = [];
  for (let k = 0; k < N; k++) {
    let d = (k / N) * total;
    let e = sides[0];
    for (e of sides) {
      if (d <= e.len) break;
      d -= e.len;
    }
    const f = d / e.len;
    out.push([e.v[0] + (e.w[0] - e.v[0]) * f, e.v[1] + (e.w[1] - e.v[1]) * f]);
  }
  return out;
}

const regular = (sides: number, r: number, turn = -Math.PI / 2): Pt[] =>
  Array.from({ length: sides }, (_, i) => {
    const a = turn + (i / sides) * TAU;
    return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
  });

const fromPolar = (r: (a: number) => number, phase = 0): Pt[] =>
  Array.from({ length: N }, (_, k) => {
    const a = phase + k * STEP;
    return [Math.cos(a) * r(a), Math.sin(a) * r(a)] as Pt;
  });

export const SHAPES: Record<string, Pt[]> = {
  circle: fromPolar(() => R),
  triangle: polygon(regular(3, 42)),
  square: polygon(regular(4, 38, -Math.PI / 4)),
  rectangle: polygon([
    [-38, -19],
    [38, -19],
    [38, 19],
    [-38, 19],
  ]),
  hexagon: polygon(regular(6, 38)),
  star: Array.from({ length: N }, (_, k) => {
    const a = -Math.PI / 2 + k * STEP;
    const r = k % 2 === 0 ? 44 : 25;
    return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
  }),
  infinity: Array.from({ length: N }, (_, k) => {
    const s = ((k + 0.5) / N) * TAU; // half-step offset: no dot sits on the crossing point
    const d = 1 + Math.sin(s) ** 2;
    return [(62 * Math.cos(s)) / d, (62 * Math.sin(s) * Math.cos(s)) / d] as Pt;
  }),
  grid: Array.from({ length: N }, (_, k) => [((k % 4) - 1.5) * 20, (Math.floor(k / 4) - 1) * 20] as Pt),
  flower: fromPolar((a) => R * (0.78 + 0.3 * Math.cos(3 * a)), -Math.PI / 2),
};

// Index every figure by angle around the centre, starting at 0 rad, the same
// way the ring numbers its slots.
for (const name of Object.keys(SHAPES)) {
  SHAPES[name] = SHAPES[name]
    .map((p) => ({ p, a: (Math.atan2(p[1], p[0]) + TAU) % TAU }))
    .sort((u, v) => u.a - v.a)
    .map((u) => u.p);
}

/** Rotation of B's indices that moves the dots least when morphing A → B. */
export function bestShift(a: Pt[], b: Pt[]): number {
  let best = 0;
  let bestCost = Infinity;
  for (let s = 0; s < N; s++) {
    let cost = 0;
    for (let k = 0; k < N; k++) {
      const q = b[(k + s) % N];
      cost += (a[k][0] - q[0]) ** 2 + (a[k][1] - q[1]) ** 2;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = s;
    }
  }
  return best;
}

/** Closest any two dots come while morphing A → B (eased, like the real thing). */
export function morphGap(a: Pt[], b: Pt[], samples = 120): number {
  const s = bestShift(a, b);
  let m = Infinity;
  for (let i = 0; i <= samples; i++) {
    const u = smoother(i / samples);
    for (let p = 0; p < N; p++) {
      const q = b[(p + s) % N];
      const px = a[p][0] + (q[0] - a[p][0]) * u;
      const py = a[p][1] + (q[1] - a[p][1]) * u;
      for (let r = p + 1; r < N; r++) {
        const w = b[(r + s) % N];
        const rx = a[r][0] + (w[0] - a[r][0]) * u;
        const ry = a[r][1] + (w[1] - a[r][1]) * u;
        m = Math.min(m, Math.hypot(px - rx, py - ry));
      }
    }
  }
  return m;
}

/** For each figure, the figures it can morph into without two dots getting closer than MIN_GAP. */
export function safeMorphs(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const a of Object.keys(SHAPES)) {
    out[a] = Object.keys(SHAPES).filter((b) => b !== a && morphGap(SHAPES[a], SHAPES[b]) >= MIN_GAP);
  }
  return out;
}

type Agent = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pace: number;
  slot: number;
  tx: Float32Array;
  ty: Float32Array;
  tt: Float64Array;
  head: number;
  count: number;
  ox: number; // offset from the figure when figures take over, eased away
  oy: number;
};

export function createFlock(canvas: HTMLCanvasElement, options: FlockOptions = {}): FlockHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setActive() {}, destroy() {} };
  const ink = `rgb(${options.inkRgb ?? "27, 26, 23"})`;

  // They start just off-screen to the right and fly in on the first mouse move.
  const agents: Agent[] = PACE.map((pace, i) => ({
    x: window.innerWidth + 24 + (i % 4) * 16,
    y: window.innerHeight * 0.66 + Math.floor(i / 4) * 16 + (i % 4) * 5,
    vx: -40,
    vy: 0,
    pace,
    slot: i,
    tx: new Float32Array(TRAIL_CAP),
    ty: new Float32Array(TRAIL_CAP),
    tt: new Float64Array(TRAIL_CAP),
    head: 0,
    count: 0,
    ox: 0,
    oy: 0,
  }));

  let W = 0;
  let H = 0;
  let mx = 0; // ring center (cursor + offset)
  let my = 0;
  let mode: "follow" | "ring" | "show" | "shape" = "follow";
  let moved = false; // the pointer moved since the last frame
  let theta = 0; // ring rotation
  let omega = 0; // ring angular speed
  let quiet = 0; // s since the cursor last moved (or the ring formed)
  let followFor = 0;
  let restFor = 0;
  let armed = false;
  let now = 0; // simulation clock, s
  let lastMotion = 0;
  let raf = 0;
  let last = 0;
  let active = true;
  let prevBox: [number, number, number, number] | null = null;

  // Finale state
  let plan: { start: number[]; makespan: number } | null = null;
  let showT = 0;
  let showX = 0;
  let showY = 0;
  let showTheta = 0;
  const bySlot: Agent[] = new Array(N);

  // Figure state
  let safe: Record<string, string[]> | null = null;
  let shape = "circle";
  let next: string | null = null;
  let shift = 0;
  let shapeT = 0; // s into the current hold or morph
  let holdFor = FIRST_HOLD;
  let enterT = 0; // s since figures took over
  let formX = 0;
  let formY = 0;

  // Plan once, off the critical path.
  const idle: (cb: () => void) => number =
    (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
    ((cb) => window.setTimeout(cb, 200));
  idle(() => {
    plan = planCrossing();
    safe = safeMorphs();
  });

  const draw = () => {
    if (prevBox) ctx.clearRect(prevBox[0], prevBox[1], prevBox[2], prevBox[3]);
    else ctx.clearRect(0, 0, W, H);

    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const grow = (x: number, y: number) => {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    };

    // Trails: short, faint flight paths that fade with age.
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    for (const a of agents) {
      grow(a.x, a.y);
      let px = a.x;
      let py = a.y;
      for (let k = 1; k < a.count; k++) {
        const idx = (a.head - k + TRAIL_CAP) % TRAIL_CAP;
        const age = now - a.tt[idx];
        if (age > TRAIL_TIME) break;
        const qx = a.tx[idx];
        const qy = a.ty[idx];
        ctx.globalAlpha = TRAIL_ALPHA * (1 - age / TRAIL_TIME);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(qx, qy);
        ctx.stroke();
        grow(qx, qy);
        px = qx;
        py = qy;
      }
    }

    ctx.globalAlpha = DOT_ALPHA;
    ctx.fillStyle = ink;
    for (const a of agents) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, DOT, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const pad = DOT + 4;
    prevBox = [Math.floor(x0 - pad), Math.floor(y0 - pad), Math.ceil(x1 - x0 + pad * 2), Math.ceil(y1 - y0 + pad * 2)];
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    prevBox = null;
    draw();
  };

  // Give each agent the ring slot nearest its current angle, keeping their
  // order around the cursor, and rotate the ring to minimise total travel.
  const assignSlots = () => {
    const order = agents
      .map((a, i) => ({ i, ang: Math.atan2(a.y - my, a.x - mx) }))
      .sort((p, q) => p.ang - q.ang);
    let sx = 0;
    let sy = 0;
    order.forEach((o, k) => {
      agents[o.i].slot = k;
      sx += Math.cos(o.ang - k * STEP);
      sy += Math.sin(o.ang - k * STEP);
    });
    theta = Math.atan2(sy, sx);
  };

  const startShow = () => {
    mode = "show";
    showT = 0;
    showX = mx;
    showY = my;
    showTheta = theta;
    omega = 0; // the ring frame holds still during the show, then eases back into the drift
    for (const a of agents) bySlot[a.slot] = a;
    armed = false;
  };

  // Where slot k should be at show time t, in screen coordinates.
  const showTarget = (k: number, t: number, p: { start: number[]; makespan: number }): [number, number] => {
    let lx: number;
    let ly: number;
    if (t < EXPAND_T) {
      const r = R + (STAGE_R - R) * smoother(t / EXPAND_T);
      lx = Math.cos(k * STEP) * r;
      ly = Math.sin(k * STEP) * r;
    } else if (t < EXPAND_T + p.makespan) {
      [lx, ly] = crossingAt(k, t - EXPAND_T, p.start);
    } else {
      const r = STAGE_R + (R - STAGE_R) * smoother(clamp((t - EXPAND_T - p.makespan) / CONTRACT_T, 0, 1));
      lx = -Math.cos(k * STEP) * r;
      ly = -Math.sin(k * STEP) * r;
    }
    const c = Math.cos(showTheta);
    const s = Math.sin(showTheta);
    return [showX + lx * c - ly * s, showY + lx * s + ly * c];
  };

  // Where an agent sits in the current figure (or between two), on screen.
  const shapeTarget = (a: Agent): [number, number] => {
    let [lx, ly] = SHAPES[shape][a.slot];
    if (next) {
      const [qx, qy] = SHAPES[next][(a.slot + shift) % N];
      const u = smoother(clamp(shapeT / MORPH_T, 0, 1));
      lx += (qx - lx) * u;
      ly += (qy - ly) * u;
    }
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const fade = 1 - smoother(clamp(enterT / SETTLE_T, 0, 1));
    return [formX + lx * c - ly * s + a.ox * fade, formY + lx * s + ly * c + a.oy * fade];
  };

  // Figures take over from the ring: same slots, same rotation, so nothing jumps.
  const startShapes = () => {
    mode = "shape";
    shape = "circle";
    next = null;
    shapeT = 0;
    holdFor = FIRST_HOLD;
    enterT = 0;
    formX = mx;
    formY = my;
    for (const a of agents) {
      a.ox = 0;
      a.oy = 0;
      const [px, py] = shapeTarget(a);
      a.ox = a.x - px;
      a.oy = a.y - py;
    }
  };

  const pickNext = (): string | null => {
    if (!safe) return null;
    if (quiet >= REST_FOR) return shape !== "circle" && safe[shape].includes("circle") ? "circle" : null;
    const options = safe[shape].filter((s) => s !== "circle");
    return options.length ? options[Math.floor(Math.random() * options.length)] : null;
  };

  const frame = (t: number) => {
    const dt = Math.min((t - last) / 1000, 1 / 30); // clamp after tab switches or jank
    last = t;
    now += dt;
    quiet += dt;

    let cx = 0;
    let cy = 0;
    for (const a of agents) {
      cx += a.x;
      cy += a.y;
    }
    const dC = Math.hypot(mx - cx / N, my - cy / N);

    // Mode changes, with hysteresis so nothing flickers.
    if (mode === "follow") {
      followFor += dt;
      if (followFor > ARM_AFTER) armed = true;
      if (dC < FORM) {
        mode = "ring";
        quiet = 0;
        restFor = 0;
        assignSlots();
      }
    } else if (mode === "ring" && dC > WAKE) {
      mode = "follow";
      followFor = 0;
    } else if (mode === "show" && Math.hypot(mx - showX, my - showY) > WAKE) {
      mode = "follow"; // the cursor left mid-performance: drop it and follow, momentum intact
      followFor = 0;
    } else if (mode === "shape" && moved) {
      mode = "ring"; // any movement ends the figures; steering takes over with momentum intact
      restFor = 0;
      assignSlots();
    }
    moved = false;

    // Ring speed: a lively orbit, easing into a slow drift, fading to still
    // only after a long rest. Every change is an exponential ease, never a cut.
    const turning = mode === "ring" || mode === "shape";
    const targetOmega = !turning
      ? 0
      : mode === "ring" && quiet < ORBIT_FOR
        ? ORBIT_SPEED
        : quiet < REST_FOR
          ? DRIFT_SPEED
          : 0;
    const rate = targetOmega > omega ? SPIN_UP : targetOmega > 0 ? SPIN_DOWN : FADE_OUT;
    omega += (targetOmega - omega) * (1 - Math.exp(-rate * dt));
    if (targetOmega === 0 && omega < 0.003) omega = 0; // ~0.1 px/s at the ring: invisible, safe to stop
    theta += omega * dt;

    // Once the orbit has settled into its drift: the finale if this arrival
    // earned one, otherwise straight into the figures.
    const drifting = quiet >= ORBIT_FOR && Math.abs(omega - DRIFT_SPEED) < 0.02;
    if (mode === "ring" && drifting && quiet < REST_FOR && (safe || (armed && plan))) {
      restFor += dt;
      if (restFor >= SHOW_BEAT) {
        if (armed && plan) startShow();
        else startShapes();
      }
    }

    let maxV = 0;

    if (mode === "show" && plan) {
      // Kinematic: positions come straight from the plan; velocity is derived
      // so that leaving the show mid-way hands momentum back to steering.
      showT += dt;
      const total = EXPAND_T + plan.makespan + CONTRACT_T;
      for (let k = 0; k < N; k++) {
        const a = bySlot[k];
        const [px, py] = showTarget(k, Math.min(showT, total), plan);
        a.vx = (px - a.x) / dt;
        a.vy = (py - a.y) / dt;
        a.x = px;
        a.y = py;
        maxV = Math.max(maxV, Math.hypot(a.vx, a.vy));
      }
      if (showT >= total) {
        // Everyone now sits on the opposite slot: rotate slot labels by half a turn.
        for (const a of agents) {
          a.slot = (a.slot + N / 2) % N;
          a.vx = 0;
          a.vy = 0;
        }
        theta = showTheta;
        quiet = ORBIT_FOR; // no encore fast orbit: ease straight back into the drift
        restFor = 0;
        startShapes();
      }
    } else if (mode === "shape") {
      // Kinematic like the show: positions come from the figures, velocity is
      // derived so a mouse move hands momentum back to steering.
      enterT += dt;
      shapeT += dt;
      if (!next && shapeT >= holdFor) {
        next = pickNext();
        if (next) {
          shift = bestShift(SHAPES[shape], SHAPES[next]);
          shapeT = 0;
        }
      } else if (next && shapeT >= MORPH_T) {
        for (const a of agents) a.slot = (a.slot + shift) % N;
        shape = next;
        next = null;
        shapeT = 0;
        holdFor = HOLD_T;
      }
      for (const a of agents) {
        const [px, py] = shapeTarget(a);
        a.vx = (px - a.x) / dt;
        a.vy = (py - a.y) / dt;
        a.x = px;
        a.y = py;
        maxV = Math.max(maxV, Math.hypot(a.vx, a.vy));
      }
    } else {
      for (const a of agents) {
        let dvx: number;
        let dvy: number;

        if (mode === "follow") {
          // Arrive: full pace when far, brake on approach. Aims inside the ring
          // radius so the flock reliably crosses FORM instead of creeping up on it.
          const dx = mx - a.x;
          const dy = my - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const s = MAX_SPEED * a.pace * clamp((d - R * 0.5) / SLOW_RADIUS, 0, 1);
          dvx = (dx / d) * s;
          dvy = (dy / d) * s;
        } else {
          // Ring: proportional pull toward the slot plus the slot's own
          // tangential velocity, so agents ride the rotating ring.
          const ang = theta + a.slot * STEP;
          const px = mx + Math.cos(ang) * R;
          const py = my + Math.sin(ang) * R;
          dvx = (px - a.x) * 4 - Math.sin(ang) * R * omega;
          dvy = (py - a.y) * 4 + Math.cos(ang) * R * omega;
        }

        // Soft separation.
        for (const b of agents) {
          if (b === a) continue;
          const ox = a.x - b.x;
          const oy = a.y - b.y;
          const d2 = ox * ox + oy * oy;
          if (d2 > 0 && d2 < SEP_RADIUS * SEP_RADIUS) {
            const d = Math.sqrt(d2);
            const f = SEP_WEIGHT * (1 / d - 1 / SEP_RADIUS);
            dvx += (ox / d) * f;
            dvy += (oy / d) * f;
          }
        }

        // Steering with a capped force: smooth starts, stops and turns.
        let sx = dvx - a.vx;
        let sy = dvy - a.vy;
        const sm = Math.hypot(sx, sy);
        const maxStep = MAX_FORCE * dt;
        if (sm > maxStep) {
          sx *= maxStep / sm;
          sy *= maxStep / sm;
        }
        a.vx += sx;
        a.vy += sy;
        const v = Math.hypot(a.vx, a.vy);
        const vmax = MAX_SPEED * a.pace * 1.15;
        if (v > vmax) {
          a.vx *= vmax / v;
          a.vy *= vmax / v;
        }
        maxV = Math.max(maxV, Math.hypot(a.vx, a.vy));
      }

      for (const a of agents) {
        a.x += a.vx * dt;
        a.y += a.vy * dt;
      }
    }

    // Hard constraint: no two dots closer than MIN_GAP, ever.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = agents[i];
          const b = agents[j];
          const ox = b.x - a.x;
          const oy = b.y - a.y;
          const d = Math.hypot(ox, oy);
          if (d < MIN_GAP) {
            const nx = d > 0 ? ox / d : 1;
            const ny = d > 0 ? oy / d : 0;
            const push = (MIN_GAP - d) / 2;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
      }
    }

    for (const a of agents) {
      a.head = (a.head + 1) % TRAIL_CAP;
      a.tx[a.head] = a.x;
      a.ty[a.head] = a.y;
      a.tt[a.head] = now;
      if (a.count < TRAIL_CAP) a.count++;
    }

    draw();

    if (maxV > 0.4) lastMotion = now;
    // Sleep only when everything is still, the trails have fully faded, and
    // no finale is pending. The last frame on screen is clean dots.
    const showPending = mode === "show" || (mode === "ring" && armed && plan !== null);
    const settled = !showPending && omega === 0 && now - lastMotion > TRAIL_TIME + 0.05;
    raf = settled ? 0 : requestAnimationFrame(frame);
  };

  const wake = () => {
    if (raf || !active) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    mx = e.clientX + RING_OFFSET_X;
    my = e.clientY + RING_OFFSET_Y;
    quiet = 0;
    restFor = 0;
    moved = true;
    wake();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  resize();

  return {
    setActive(next: boolean) {
      active = next;
      if (!next && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    },
  };
}
