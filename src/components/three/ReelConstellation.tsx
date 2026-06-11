import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { constellationState } from '@/components/three/constellation-state';
import { registerMediaPlaybackEntry } from '@/lib/media-playback-scheduler';
import { getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';

/**
 * The Reel Constellation — Gisela's actual reels as 9:16 cards floating in a
 * fogged 3D field. Scroll progress (written by use-constellation-scroll into
 * constellationState) dollies the camera *through* the work; cards part to
 * the sides and dissolve as the camera passes them.
 *
 * Budget rules (desktop only, mounted on idle):
 * - poster textures only, plus exactly ONE video texture on the focus card,
 *   negotiated through the site-wide playback scheduler ('hero' priority)
 * - DPR ≤ 1.5, rAF only while on screen and the tab is visible
 * - WebGL failure / context loss → host hides itself; the DOM poster
 *   collage underneath simply remains
 */

const CAMERA_START_Z = 9;
const CAMERA_END_Z = -38;
const FOG_COLOR = 0x0f121a; // matches the dark hero background (222 28% 8%)

/** Hand-tuned slots: a corridor down the middle, work on both flanks. */
const CARD_SLOTS: ReadonlyArray<{ x: number; y: number; z: number; ry: number; rz: number }> = [
  { x: 2.7, y: 0.05, z: 3.4, ry: -0.16, rz: 0.012 },   // focus card (video)
  { x: -3.4, y: 0.65, z: 1.2, ry: 0.18, rz: -0.02 },
  { x: 4.9, y: -0.85, z: -1.6, ry: -0.2, rz: 0.025 },
  { x: -2.3, y: -0.5, z: -4.4, ry: 0.14, rz: 0.018 },
  { x: 3.1, y: 1.15, z: -7.2, ry: -0.12, rz: -0.022 },
  { x: -5.2, y: 0.25, z: -9.8, ry: 0.22, rz: 0.014 },
  { x: 1.9, y: -1.1, z: -12.6, ry: -0.1, rz: 0.02 },
  { x: -3.0, y: 1.0, z: -15.4, ry: 0.16, rz: -0.016 },
  { x: 5.6, y: 0.3, z: -18.2, ry: -0.24, rz: 0.01 },
  { x: -1.8, y: -0.75, z: -21.0, ry: 0.1, rz: 0.024 },
  { x: 3.8, y: 0.85, z: -23.8, ry: -0.18, rz: -0.012 },
  { x: -4.6, y: -0.35, z: -26.6, ry: 0.2, rz: 0.016 },
  { x: 2.2, y: 0.55, z: -29.6, ry: -0.14, rz: 0.02 },
  { x: -2.9, y: 0.05, z: -32.4, ry: 0.12, rz: -0.018 },
];

/** Shared rounded-rect alpha mask so the cards read as app reels, not slabs. */
const createRoundedAlphaTexture = (): THREE.CanvasTexture | null => {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const r = 18;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 180, 320);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(0, 0, 180, 320, r);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

type ReelConstellationProps = {
  clips: ReelClip[];
};

const ReelConstellation = ({ clips }: ReelConstellationProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const clipsRef = useRef(clips);
  clipsRef.current = clips;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sceneClips = clipsRef.current;
    if (sceneClips.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      host.style.display = 'none';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(FOG_COLOR);
    scene.fog = new THREE.FogExp2(FOG_COLOR, 0.055);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80);
    camera.position.set(0, 0, CAMERA_START_Z);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const alphaMask = createRoundedAlphaTexture();

    const geometry = new THREE.PlaneGeometry(1.35, 2.4);
    const disposables: Array<{ dispose: () => void }> = [geometry, renderer];
    if (alphaMask) disposables.push(alphaMask);

    type Card = {
      mesh: THREE.Mesh;
      material: THREE.MeshBasicMaterial;
      slot: (typeof CARD_SLOTS)[number];
      phase: number;
      floatSpeed: number;
    };

    const cards: Card[] = [];
    const cardCount = Math.min(CARD_SLOTS.length, sceneClips.length);

    for (let i = 0; i < cardCount; i++) {
      const slot = CARD_SLOTS[i];
      const texture = textureLoader.load(getBestPosterSrc(sceneClips[i]));
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        alphaMap: alphaMask ?? undefined,
        toneMapped: false,
        fog: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(slot.x, slot.y, slot.z);
      mesh.rotation.set(0, slot.ry, slot.rz);
      scene.add(mesh);
      disposables.push(material, texture);
      cards.push({ mesh, material, slot, phase: i * 1.7, floatSpeed: 0.32 + (i % 4) * 0.05 });
    }

    // ── Focus-card video texture — one decoder, negotiated with the budget ──
    const focusClip = sceneClips[0];
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.crossOrigin = 'anonymous';
    video.src = focusClip.previewSrc;
    video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
    video.tabIndex = -1;
    host.appendChild(video);

    let videoTexture: THREE.VideoTexture | null = null;
    let videoGranted = false;
    let inView = true;

    const posterMap = cards[0]?.material.map ?? null;
    const refreshFocus = () => {
      const focus = cards[0];
      if (!focus) return;
      if (videoGranted && inView && !document.hidden) {
        if (!videoTexture) {
          videoTexture = new THREE.VideoTexture(video);
          videoTexture.colorSpace = THREE.SRGBColorSpace;
          disposables.push(videoTexture);
        }
        void video.play().catch(() => {});
        focus.material.map = videoTexture;
      } else {
        video.pause();
        focus.material.map = posterMap;
      }
      focus.material.needsUpdate = true;
    };

    const playbackEntry = registerMediaPlaybackEntry((granted) => {
      videoGranted = granted;
      refreshFocus();
    }, 'hero');
    playbackEntry.update(true);

    // ── Render loop ──
    const canvas = renderer.domElement;
    canvas.className = 'dc-constellation-canvas';
    host.appendChild(canvas);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    let elapsed = 0;
    let lastFrameAt = 0;
    let rafId = 0;
    let contextLost = false;

    const shouldRun = () => inView && !document.hidden && !contextLost;

    const frame = (now: number) => {
      rafId = 0;
      if (!shouldRun()) return;
      const delta = Math.min((now - lastFrameAt) / 1000, 0.05);
      lastFrameAt = now;
      elapsed += delta;

      pointer.lerp(pointerTarget, 0.045);
      const progress = constellationState.progress;

      camera.position.z = THREE.MathUtils.lerp(CAMERA_START_Z, CAMERA_END_Z, progress);
      camera.position.x = pointer.x * 0.8;
      camera.position.y = -pointer.y * 0.45;
      camera.rotation.y = -pointer.x * 0.035;
      camera.rotation.x = pointer.y * 0.02;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const { mesh, material, slot } = card;

        // 1 = comfortably ahead of the camera, 0 = camera reaching the card
        const dz = camera.position.z - slot.z;
        const ahead = THREE.MathUtils.clamp((dz - 0.9) / 3.4, 0, 1);
        const part = 1 - ahead;

        const side = slot.x >= 0 ? 1 : -1;
        mesh.position.x = slot.x + part * side * 2.4;
        mesh.position.y =
          slot.y + Math.sin(elapsed * card.floatSpeed + card.phase) * 0.07 + part * 0.35;
        mesh.rotation.y = slot.ry + Math.sin(elapsed * 0.22 + card.phase) * 0.02 + part * side * 0.3;

        // Entrance: staggered float-in on mount
        const reveal = THREE.MathUtils.clamp((elapsed - 0.1 - i * 0.055) / 0.9, 0, 1);
        const eased = 1 - Math.pow(1 - reveal, 3);
        material.opacity = eased * ahead;
        mesh.visible = material.opacity > 0.01;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    };

    const resume = () => {
      if (rafId === 0 && shouldRun()) {
        lastFrameAt = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        playbackEntry.update(inView);
        refreshFocus();
        resume();
      },
      { rootMargin: '160px 0px' },
    );
    intersectionObserver.observe(host);

    const onVisibility = () => {
      refreshFocus();
      resume();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      host.style.display = 'none';
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    renderer.render(scene, camera);
    canvas.dataset.ready = 'true';
    resume();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      playbackEntry.unregister();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      disposables.forEach((d) => d.dispose());
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className="dc-constellation" aria-hidden="true" />;
};

export default ReelConstellation;
