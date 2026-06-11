import { useEffect, useRef, type RefObject } from 'react';
import { track } from '@vercel/analytics/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { DIRECTOR_CLIPS } from '@/data/director-chapters';
import { getBestPosterSrc } from '@/data/portfolio-clips';
import { registerMediaPlaybackEntry } from '@/lib/media-playback-scheduler';

gsap.registerPlugin(ScrollTrigger);

type SpatialReelDirectorThreeProps = {
  sectionRef: RefObject<HTMLElement>;
  onActiveChange: (index: number) => void;
  onWebglFailure: () => void;
};

const PLANE_GAP = 5.8;
const CAMERA_DISTANCE = 8.6;
const PLANE_X = [-1.3, 3.5, -3.1, 3.7, -3.4, 1];
const PLANE_Y = [0.15, -0.2, 0.25, -0.25, 0.18, 0];

const SpatialReelDirectorThree = ({
  sectionRef,
  onActiveChange,
  onWebglFailure,
}: SpatialReelDirectorThreeProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b12');
    scene.fog = new THREE.FogExp2('#070b12', 0.035);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(PLANE_X[0], PLANE_Y[0], CAMERA_DISTANCE);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    } catch {
      onWebglFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const posterTextures = DIRECTOR_CLIPS.map((clip) => {
      const texture = loader.load(getBestPosterSrc(clip));
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

    const geometry = new THREE.PlaneGeometry(2.55, 4.53);
    const materials = posterTextures.map((texture) => new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 0.18,
      toneMapped: false,
      transparent: true,
    }));
    const meshes = materials.map((material, index) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(PLANE_X[index], PLANE_Y[index], -index * PLANE_GAP);
      mesh.rotation.z = index % 2 === 0 ? -0.025 : 0.025;
      scene.add(mesh);
      return mesh;
    });

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    let activeIndex = -1;
    let inView = true;
    let playbackGranted = false;
    let completedTracked = false;
    let previousRenderTime = 0;

    const showDecodedVideoFrame = () => {
      if (activeIndex < 0 || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      materials[activeIndex].map = videoTexture;
      materials[activeIndex].needsUpdate = true;
    };
    video.addEventListener('loadeddata', showDecodedVideoFrame);

    const syncPlayback = () => {
      if (inView && playbackGranted) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const playbackRegistration = registerMediaPlaybackEntry((granted) => {
      playbackGranted = granted;
      syncPlayback();
    }, 'hero');

    const setActive = (nextIndex: number) => {
      if (nextIndex === activeIndex) return;
      if (activeIndex >= 0) {
        materials[activeIndex].map = posterTextures[activeIndex];
        materials[activeIndex].needsUpdate = true;
      }
      activeIndex = nextIndex;
      video.src = DIRECTOR_CLIPS[activeIndex].previewSrc;
      video.load();
      syncPlayback();
      onActiveChange(activeIndex);
    };
    setActive(0);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.18;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.12;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const render = (time = 0) => {
      if (time - previousRenderTime < 1000 / 30) return;
      previousRenderTime = time;
      camera.rotation.x += ((-pointer.y * 0.12) - camera.rotation.x) * 0.035;
      camera.rotation.y += ((pointer.x * 0.12) - camera.rotation.y) * 0.035;
      meshes.forEach((mesh, index) => {
        const targetScale = index === activeIndex ? 1.04 : 0.94;
        const nextScale = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.045);
        const distanceFromActive = index - activeIndex;
        const targetOpacity = distanceFromActive === 0
          ? 1
          : distanceFromActive === 1
            ? 0.5
            : distanceFromActive === 2
              ? 0.2
              : distanceFromActive < 0
                ? 0.08
                : 0.06;
        mesh.scale.setScalar(nextScale);
        materials[index].opacity = THREE.MathUtils.lerp(materials[index].opacity, targetOpacity, 0.06);
      });
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(render);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? false;
      playbackRegistration.update(inView, 'hero');
      renderer.setAnimationLoop(inView ? render : null);
      syncPlayback();
    }, { threshold: 0.05 });
    visibilityObserver.observe(section);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const chapterProgress = self.progress * (DIRECTOR_CLIPS.length - 1);
        const lower = Math.floor(chapterProgress);
        const upper = Math.min(DIRECTOR_CLIPS.length - 1, lower + 1);
        const mix = chapterProgress - lower;
        camera.position.x = THREE.MathUtils.lerp(PLANE_X[lower], PLANE_X[upper], mix) + pointer.x;
        camera.position.y = THREE.MathUtils.lerp(PLANE_Y[lower], PLANE_Y[upper], mix) - pointer.y;
        camera.position.z = CAMERA_DISTANCE - chapterProgress * PLANE_GAP;
        setActive(Math.round(chapterProgress));
        if (self.progress > 0.96 && !completedTracked) {
          completedTracked = true;
          track('Cinematic Director Completed');
        }
      },
    });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      onWebglFailure();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    return () => {
      trigger.kill();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      playbackRegistration.unregister();
      video.removeEventListener('loadeddata', showDecodedVideoFrame);
      video.pause();
      video.removeAttribute('src');
      video.load();
      renderer.setAnimationLoop(null);
      meshes.forEach((mesh) => scene.remove(mesh));
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      posterTextures.forEach((texture) => texture.dispose());
      videoTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [onActiveChange, onWebglFailure, sectionRef]);

  return <div ref={mountRef} className="h-full w-full" />;
};

export default SpatialReelDirectorThree;
