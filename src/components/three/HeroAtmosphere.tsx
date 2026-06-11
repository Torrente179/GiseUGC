import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * "Living silk" — a slow, domain-warped flow field in the brand palette that
 * replaces the blurred ambient video as the hero's backdrop on desktop.
 *
 * Budget rules:
 * - renders at 0.7× resolution, DPR clamped to 1 (the field is smooth, so
 *   upscaling is invisible) — frees a video decoder vs. the old backdrop
 * - rAF only while the hero is on screen and the tab is visible
 * - WebGL failure or context loss → host hides itself; the blurred poster
 *   underneath simply remains (no JS error surface)
 *
 * The hero viewport is permanently dark, so the palette is fixed — it does
 * not need to track the global light/dark theme.
 */

const RESOLUTION_SCALE = 0.7;

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.55;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / max(uRes.y, 1.0), 1.0) * 1.6;
    float t = uTime * 0.045;
    p += uPointer * 0.12;

    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.3) + t * 0.6),
      fbm(p + vec2(5.2, 1.3) - t * 0.4)
    );
    vec2 r = vec2(
      fbm(p + 3.2 * q + vec2(1.7, 9.2) + t),
      fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.8)
    );
    float f = fbm(p + 3.0 * r);

    /* Brand palette, dark-hero register */
    vec3 ink   = vec3(0.052, 0.049, 0.044); /* near-black, warm */
    vec3 ebony = vec3(0.165, 0.148, 0.126); /* deep-ebony */
    vec3 teal  = vec3(0.173, 0.655, 0.784); /* coastal-teal */
    vec3 sand  = vec3(0.863, 0.804, 0.710); /* warm-sand */
    vec3 khaki = vec3(0.624, 0.576, 0.400); /* washed-khaki */

    vec3 col = mix(ink, ebony, smoothstep(0.15, 0.95, f));
    col = mix(col, khaki * 0.45, smoothstep(0.45, 0.85, q.y) * 0.35);
    col += teal * smoothstep(0.55, 0.92, r.x) * 0.34 * (0.35 + 0.65 * f);
    col += sand * pow(clamp(f, 0.0, 1.0), 3.0) * 0.2;

    /* Vignette — edges and the left text zone stay calm */
    float vig = smoothstep(1.25, 0.35, length(uv - vec2(0.62, 0.5)));
    col *= mix(0.55, 1.0, vig);

    /* Grain kills banding on the slow gradients */
    float g = hash(uv * uRes + fract(uTime) * 100.0);
    col += (g - 0.5) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const HeroAtmosphere = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      host.style.display = 'none';
      return;
    }

    renderer.setPixelRatio(1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const canvas = renderer.domElement;
    canvas.className = 'hero-atmosphere-canvas';
    host.appendChild(canvas);

    let elapsed = 0;
    let lastFrameAt = 0;
    let rafId = 0;
    let inView = true;
    let contextLost = false;

    const pointerTarget = new THREE.Vector2(0, 0);

    const shouldRun = () => inView && !document.hidden && !contextLost;

    const frame = (now: number) => {
      rafId = 0;
      if (!shouldRun()) return;
      elapsed += Math.min((now - lastFrameAt) / 1000, 0.05);
      lastFrameAt = now;
      uniforms.uTime.value = elapsed;
      uniforms.uPointer.value.lerp(pointerTarget, 0.035);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    };

    const resume = () => {
      if (rafId === 0 && shouldRun()) {
        lastFrameAt = performance.now(); // swallow the pause gap
        rafId = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;
      const w = Math.round(clientWidth * RESOLUTION_SCALE);
      const h = Math.round(clientHeight * RESOLUTION_SCALE);
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        resume();
      },
      { rootMargin: '120px 0px' },
    );
    intersectionObserver.observe(host);

    const onVisibility = () => resume();
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

    // First render, then fade the canvas in over the blurred poster.
    renderer.render(scene, camera);
    canvas.dataset.ready = 'true';
    resume();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className="hero-atmosphere" aria-hidden="true" />;
};

export default HeroAtmosphere;
