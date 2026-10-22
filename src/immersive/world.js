import * as THREE from 'three';

// The 3D world the homepage flies through. One continuous scene; scroll moves
// the camera along a path past a series of "stations", each holding one part
// of the pitch. Everything here is plain Three.js so it can be torn down
// cleanly; the React page only calls update() every frame and listens to
// hover/select callbacks.

const C = {
  violet: 0x6c3cff,
  pink: 0xff3d8a,
  sun: 0xffb020,
  teal: 0x00d6b4,
  ink: 0x0b0820,
  paper: 0xfdfcff,   // the site's background
};

// Camera keyframes: where the camera is and what it looks at, and the scroll
// progress at which it arrives. The page's text panels use the same numbers.
export const STATIONS = [
  { id: 'hero', t: 0.0, cam: [0, 0, 15], look: [0, 0, 0] },
  { id: 'in', t: 0.12, cam: [0, 0.3, 3.2], look: [0, 0, -3] },
  { id: 'leak', t: 0.21, cam: [0, -0.2, -1.2], look: [0, 0, -7] },
  { id: 'rise', t: 0.3, cam: [1.5, 9, -10], look: [3.2, 12, -26] },
  { id: 'services', t: 0.37, cam: [1.4, 12.3, -15], look: [0.6, 12, -26] },
  { id: 'services2', t: 0.45, cam: [3.8, 12.6, -16], look: [1.0, 12, -26] },
  { id: 'autoTop', t: 0.52, cam: [8, 6, -38], look: [0, 5, -46] },
  { id: 'autoBottom', t: 0.68, cam: [8, -13, -38], look: [0, -13, -46] },
  { id: 'voice', t: 0.75, cam: [12, -18, -55], look: [20, -18, -66] },
  { id: 'chat', t: 0.82, cam: [-8, -13, -71], look: [-16, -14, -82] },
  { id: 'chat2', t: 0.89, cam: [-23, -12, -73], look: [-16, -14, -82] },
  { id: 'out', t: 1.0, cam: [34, 16, 4], look: [2, -5, -42] },
];

const SERVICE_CENTER = new THREE.Vector3(3.4, 12, -26);
const HELIX = { x: 0, z: -46, top: 5, bottom: -13, r: 3.4 };
const VOICE_AT = new THREE.Vector3(20, -18, -66);
const CHAT_AT = new THREE.Vector3(-16, -14, -82);

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

function cardTexture(card, i) {
  const cv = document.createElement('canvas');
  cv.width = 1024; cv.height = 680;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 1024, 680);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#f6f2ff');
  roundRect(ctx, 6, 6, 1012, 668, 56);
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = ['#8a63ff', '#ff5c9d', '#ffc04d', '#2be0c2'][i % 4]; ctx.stroke();
  ctx.font = '96px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  ctx.fillText(card.icon, 70, 170);
  ctx.fillStyle = '#17123a';
  ctx.font = '700 70px "Space Grotesk", sans-serif';
  ctx.fillText(card.title, 70, 290);
  ctx.fillStyle = '#5f5b7e';
  ctx.font = '400 38px Inter, sans-serif';
  wrap(ctx, card.short, 880).slice(0, 4).forEach((l, k) => ctx.fillText(l, 70, 370 + k * 56));
  ctx.fillStyle = '#6c3cff';
  ctx.font = '600 30px Inter, sans-serif';
  ctx.fillText('CLICK TO EXPLORE  →', 70, 625);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function labelSprite(text, color = '#17123a') {
  const cv = document.createElement('canvas');
  cv.width = 1024; cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.font = '600 52px "Space Grotesk", sans-serif';
  const w = Math.min(1000, ctx.measureText(text).width + 60);
  roundRect(ctx, (1024 - w) / 2, 14, w, 100, 50);
  ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(108,60,255,0.25)'; ctx.stroke();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 512, 66);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  s.scale.set(4.2, 0.525, 1);
  return s;
}

function glowTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

export function createWorld(canvas, { services, automations, onHover, onSelect }) {
  // Phones get a lighter scene (fewer particles) but full sharpness: their
  // screens are small, so rendering at up to 2x the CSS pixels stays cheap and
  // keeps lines, nodes and labels crisp on high-density displays.
  const small = window.innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 2 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(C.paper, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.paper, 0.0075);
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);

  const disposables = [];
  const track = (o) => { disposables.push(o); return o; };
  const glow = track(glowTexture());

  // ---------- camera path ----------
  const camCurve = new THREE.CatmullRomCurve3(STATIONS.map((s) => new THREE.Vector3(...s.cam)), false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(STATIONS.map((s) => new THREE.Vector3(...s.look)), false, 'centripetal');
  const n = STATIONS.length - 1;
  // Turn scroll progress into a position along the curves, so that progress
  // STATIONS[i].t lands exactly on keyframe i.
  const along = (p) => {
    let i = 0;
    while (i < n - 1 && p > STATIONS[i + 1].t) i++;
    const a = STATIONS[i].t, b = STATIONS[i + 1].t;
    const u = THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);
    const eased = u * u * (3 - 2 * u);
    return (i + eased) / n;
  };

  // ---------- stars ----------
  {
    const g = track(new THREE.BufferGeometry());
    const pos = new Float32Array((small ? 900 : 2400) * 3);
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] = (Math.random() - 0.5) * 260;
      pos[i + 1] = (Math.random() - 0.5) * 160;
      pos[i + 2] = (Math.random() - 0.5) * 260 - 30;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = track(new THREE.PointsMaterial({ color: C.pink, size: 0.12, transparent: true, opacity: 0.35, depthWrite: false }));
    scene.add(new THREE.Points(g, m));
  }

  // ---------- hero: the AI network you fly into ----------
  const network = new THREE.Group();
  scene.add(network);
  const nodePos = [];
  {
    const N = 110, R = 5.2;
    const g = track(new THREE.BufferGeometry());
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(-1 + (2 * i) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;
      const r = R * (0.75 + Math.random() * 0.25);
      const v = new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
      nodePos.push(v);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = track(new THREE.PointsMaterial({ color: C.violet, size: 0.14, map: glow, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
    network.add(new THREE.Points(g, m));
    const lines = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (nodePos[i].distanceTo(nodePos[j]) < 1.9) lines.push(...nodePos[i].toArray(), ...nodePos[j].toArray());
    }
    const lg = track(new THREE.BufferGeometry());
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3));
    const lm = track(new THREE.LineBasicMaterial({ color: 0xb9a6ff, transparent: true, opacity: 0.55, blending: THREE.NormalBlending, depthWrite: false }));
    network.add(new THREE.LineSegments(lg, lm));
  }

  // ---------- services: floating cards ----------
  const cards = [];
  services.forEach((s, i) => {
    const group = new THREE.Group();
    const tex = track(cardTexture(s, i));
    const front = new THREE.Mesh(track(new THREE.PlaneGeometry(4.4, 2.92)), track(new THREE.MeshBasicMaterial({ map: tex, transparent: true })));
    const halo = new THREE.Mesh(
      track(new THREE.PlaneGeometry(6.2, 4.6)),
      track(new THREE.MeshBasicMaterial({ map: glow, color: [C.violet, C.pink, C.sun, C.teal][i], transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.NormalBlending }))
    );
    halo.position.z = -0.05;
    group.add(halo, front);
    // 2 x 2 grid, slightly cupped towards the camera.
    const col = i % 2 ? 1 : -1, row = i < 2 ? 1 : -1;
    const base = new THREE.Vector3(SERVICE_CENTER.x + col * 2.55, SERVICE_CENTER.y + row * 1.75, SERVICE_CENTER.z + 0.4);
    group.position.copy(base);
    group.rotation.y = -col * 0.12;
    group.userData = { kind: 'service', index: i, base, halo, hover: 0 };
    front.userData = group.userData;
    scene.add(group);
    cards.push(group);
  });

  // ---------- automations: a helix of glowing nodes ----------
  const orbs = [];
  const GREY = 0xd6d0e6;           // nodes you haven't reached yet
  const greyColor = new THREE.Color(GREY);
  const helixPts = [];
  automations.forEach((a, i) => {
    const t = automations.length === 1 ? 0 : i / (automations.length - 1);
    const y = HELIX.top + (HELIX.bottom - HELIX.top) * t;
    const ang = i * 1.05;
    const p = new THREE.Vector3(HELIX.x + Math.cos(ang) * HELIX.r, y, HELIX.z + Math.sin(ang) * HELIX.r);
    helixPts.push(p);
    const color = [C.violet, C.pink, C.sun, C.teal][i % 4];
    const orb = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.62, 1)), track(new THREE.MeshBasicMaterial({ color: GREY, wireframe: true, transparent: true, opacity: 0.9 })));
    const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.32, 20, 20)), track(new THREE.MeshBasicMaterial({ color: GREY })));
    const halo = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.NormalBlending })));
    halo.scale.set(3, 3, 1);
    const label = labelSprite(a.icon + '  ' + a.title);
    track(label.material.map); track(label.material);
    label.position.set(0, 1.25, 0);
    const g = new THREE.Group();
    g.add(halo, orb, core, label);
    g.position.copy(p);
    g.userData = { kind: 'automation', index: i, orb, core, halo, label, hover: 0, active: 0, lit: 0, color: new THREE.Color(color) };
    orb.userData = core.userData = g.userData;
    scene.add(g);
    orbs.push(g);
  });
  const helixCurve = new THREE.CatmullRomCurve3(helixPts);
  let helixTube, helixFill;
  {
    // A pale track for the whole chain, and a coloured line drawn over it
    // that fills down to wherever you've reached.
    helixTube = new THREE.Mesh(
      track(new THREE.TubeGeometry(helixCurve, 300, 0.05, 8, false)),
      track(new THREE.MeshBasicMaterial({ color: 0xe3ddf3, transparent: true, opacity: 1 }))
    );
    scene.add(helixTube);
    helixFill = new THREE.Mesh(
      track(new THREE.TubeGeometry(helixCurve, 300, 0.085, 10, false)),
      track(new THREE.MeshBasicMaterial({ color: C.violet }))
    );
    helixFill.geometry.setDrawRange(0, 0);
    scene.add(helixFill);
  }
  const FILL_STEP = 10 * 6;                         // indices per tube segment
  const FILL_TOTAL = 300 * FILL_STEP;
  let fill = 0;
  // ---------- voice station: a phone ringing out sound waves ----------
  const voice = new THREE.Group();
  voice.position.copy(VOICE_AT);
  scene.add(voice);
  const handset = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.9, 2.6, 8, 24)), track(new THREE.MeshBasicMaterial({ color: C.violet, wireframe: true, transparent: true, opacity: 0.85 })));
  handset.rotation.z = 0.5;
  voice.add(handset);
  const waves = [];
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.6, 0.04, 8, 90)), track(new THREE.MeshBasicMaterial({ color: C.pink, transparent: true, opacity: 0.8 })));
    ring.userData.offset = i / 5;
    voice.add(ring);
    waves.push(ring);
  }
  const voiceGlow = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glow, color: C.pink, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.NormalBlending })));
  voiceGlow.scale.set(9, 9, 1);
  voice.add(voiceGlow);

  // ---------- chat station: floating message bubbles ----------
  const chat = new THREE.Group();
  chat.position.copy(CHAT_AT);
  scene.add(chat);
  const bubbles = [];
  for (let i = 0; i < 9; i++) {
    const left = i % 2 === 0;
    const w = 2.2 + Math.random() * 2.4;
    const m = new THREE.Mesh(
      track(new THREE.PlaneGeometry(w, 0.9)),
      track(new THREE.MeshBasicMaterial({ color: left ? 0xe6e1f7 : C.violet, transparent: true, opacity: 0.9, side: THREE.DoubleSide }))
    );
    m.position.set((left ? -1 : 1) * (1.4 + Math.random() * 1.5), 4 - i * 1.05, (Math.random() - 0.5) * 3);
    m.userData.base = m.position.clone();
    m.userData.phase = Math.random() * Math.PI * 2;
    chat.add(m);
    bubbles.push(m);
  }

  // ---------- interaction ----------
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  let pointerPx = { x: 0, y: 0 };
  let hovered = null;
  const pickables = () => [...cards.map((c) => c.children[1]), ...orbs.flatMap((o) => [o.userData.orb, o.children[2]])];

  let pointerMoved = false, frameNo = 0;
  const onMove = (e) => {
    pointerMoved = true;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    pointerPx = { x: e.clientX, y: e.clientY };
  };
  const onClick = () => { if (hovered) onSelect(hovered.kind, hovered.index); };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('pointerleave', () => pointer.set(9, 9));

  // On a tall phone screen the bottom half is taken by the text panel, so
  // shift the picture up into the free space above it.
  const onResize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    if (camera.aspect < 1) camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  onResize();
  window.addEventListener('resize', onResize);

  const clock = new THREE.Timer();
  const tmpLook = new THREE.Vector3();
  let activeAuto = -1;
  const parallax = new THREE.Vector2();

  function update(progress) {
    clock.update();
    const t = clock.getElapsed();
    const u = along(progress);

    // Camera: follow the path, with a gentle sway towards the pointer.
    parallax.lerp(pointer.x > 2 ? new THREE.Vector2() : pointer, 0.04);
    camCurve.getPoint(u, camera.position);
    lookCurve.getPoint(u, tmpLook);
    // Narrow screens see less sideways, so step back to keep each scene in frame.
    if (camera.aspect < 1) {
      // On desktop the service cards sit right of centre to leave room for the
      // text panel; on a phone the panel is underneath, so centre them.
      const w = Math.max(0, 1 - Math.abs(progress - 0.41) / 0.1);
      const dx = (SERVICE_CENTER.x - tmpLook.x) * w;
      camera.position.x += dx; tmpLook.x += dx;
      const k = 1 + (1 - camera.aspect) * 1.6;
      camera.position.sub(tmpLook).multiplyScalar(k).add(tmpLook);
    }
    camera.position.x += parallax.x * 0.6;
    camera.position.y += parallax.y * 0.4;
    camera.lookAt(tmpLook);

    network.rotation.y = t * 0.06;
    network.rotation.x = Math.sin(t * 0.1) * 0.08;

    // Hover picking: only when the pointer moved, or every few frames while
    // the camera does, rather than raycasting the whole scene every frame.
    frameNo++;
    let now = hovered;
    if (pointerMoved || frameNo % 6 === 0) {
      pointerMoved = false;
      ray.setFromCamera(pointer, camera);
      const hit = pointer.x > 2 ? null : ray.intersectObjects(pickables(), false)[0];
      now = hit ? hit.object.userData : null;
    }
    if (now !== hovered) {
      hovered = now;
      canvas.style.cursor = hovered ? 'pointer' : '';
      onHover(hovered ? { kind: hovered.kind, index: hovered.index, x: pointerPx.x, y: pointerPx.y } : null);
    } else if (hovered) {
      onHover({ kind: hovered.kind, index: hovered.index, x: pointerPx.x, y: pointerPx.y });
    }

    cards.forEach((c, i) => {
      const d = c.userData;
      d.hover += ((hovered === d ? 1 : 0) - d.hover) * 0.15;
      c.position.y = d.base.y + Math.sin(t * 0.9 + i) * 0.18 + d.hover * 0.35;
      c.position.z = d.base.z + d.hover * 1.1;
      const s = 1 + d.hover * 0.1;
      c.scale.set(s, s, s);
      c.rotation.x = Math.sin(t * 0.6 + i) * 0.04 - parallax.y * 0.08 * d.hover;
      d.halo.material.opacity = 0.1 + d.hover * 0.3;
    });

    // The automation closest to the camera's height is the "current" one.
    const camY = camera.position.y;
    let nearest = -1, best = Infinity;
    orbs.forEach((o, i) => {
      const dy = Math.abs(o.position.y - camY);
      if (dy < best) { best = dy; nearest = i; }
    });
    const inHelix = progress > 0.49 && progress < 0.72;
    const current = inHelix ? nearest : -1;
    if (current !== activeAuto) { activeAuto = current; onSelect('autoFocus', current); }

    // The line fills down the chain as the camera descends: one node reached
    // per stop, and nodes light up in their colour only once the line gets there.
    const span = HELIX.top - HELIX.bottom;
    const want = progress < 0.45 ? 0 : progress > 0.74 ? 1 : THREE.MathUtils.clamp((HELIX.top - camY) / span, 0, 1);
    fill += (want - fill) * 0.12;
    helixFill.geometry.setDrawRange(0, Math.floor((fill * FILL_TOTAL) / FILL_STEP) * FILL_STEP);
    const last = orbs.length - 1;
    orbs.forEach((o, i) => {
      const d = o.userData;
      d.hover += ((hovered === d ? 1 : 0) - d.hover) * 0.15;
      d.active += ((i === activeAuto ? 1 : 0) - d.active) * 0.1;
      d.lit += ((fill >= i / last - 0.015 ? 1 : 0) - d.lit) * 0.12;
      d.orb.material.color.copy(greyColor).lerp(d.color, d.lit);
      d.core.material.color.copy(greyColor).lerp(d.color, d.lit);
      const s = 0.85 + d.lit * 0.15 + d.hover * 0.35 + d.active * 0.35;
      d.orb.scale.setScalar(s);
      d.core.scale.setScalar(1 + d.active * 0.5);
      d.orb.rotation.x = t * 0.4 + i;
      d.orb.rotation.y = t * 0.5;
      // Only the current node glows; the rest stay calm.
      d.halo.material.opacity = d.active * 0.35 + d.hover * 0.2;
      d.halo.scale.setScalar(3 + d.active * 2.5);
      d.label.material.opacity = 0.3 + d.lit * 0.25 + Math.max(d.hover, d.active) * 0.45;
    });

    handset.rotation.y = t * 0.6;
    waves.forEach((w) => {
      const k = (t * 0.35 + w.userData.offset) % 1;
      w.scale.setScalar(1 + k * 4);
      w.material.opacity = (1 - k) * 0.8;
      w.lookAt(camera.position);
    });
    bubbles.forEach((b) => {
      b.position.y = b.userData.base.y + Math.sin(t * 0.8 + b.userData.phase) * 0.25;
      b.lookAt(camera.position);
    });

    renderer.render(scene, camera);
    if (!window.__bgReady) {
      // Same signal the old background used: the opening animation waits for
      // the first (expensive) frame so it doesn't stutter.
      window.__bgReady = true;
      window.dispatchEvent(new Event('bg-ready'));
    }
  }

  function dispose() {
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('resize', onResize);
    disposables.forEach((d) => d.dispose && d.dispose());
    renderer.dispose();
  }

  // Scroll positions (0-1) the page should come to rest on: each scene, plus
  // one stop per automation node, found by where the camera passes its height.
  function checkpoints() {
    const at = (id) => STATIONS.find((s) => s.id === id).t;
    const pts = [
      { id: 'hero', p: 0 },
      { id: 'leak', p: at('leak') },
      { id: 'services', p: (at('services') + at('services2')) / 2 },
    ];
    const p = new THREE.Vector3();
    orbs.forEach((o, i) => {
      let best = 0, bestD = Infinity;
      for (let q = at('autoTop') - 0.02; q <= at('autoBottom') + 0.02; q += 0.0005) {
        camCurve.getPoint(along(q), p);
        const d = Math.abs(p.y - o.position.y);
        if (d < bestD) { bestD = d; best = q; }
      }
      pts.push({ id: 'auto' + i, p: best });
    });
    pts.push({ id: 'voice', p: at('voice') }, { id: 'chat', p: at('chat') }, { id: 'chat2', p: at('chat2') }, { id: 'out', p: 1 });
    return pts.sort((a, b) => a.p - b.p);
  }

  return { update, dispose, checkpoints };
}
