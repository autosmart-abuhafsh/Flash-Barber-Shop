import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  detectSoftwareWebGL,
  createBarberMaterialLibrary,
  buildClipperModel,
  buildShearsModel,
  buildCombModel,
} from '../utils/barber3DModels';

interface Hero3DSceneProps {
  activePreset: 'ensemble' | 'clipper' | 'shears';
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ activePreset }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const presetRef = useRef(activePreset);
  const [webglFallback, setWebglFallback] = useState(false);

  useEffect(() => {
    presetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let renderer: THREE.WebGLRenderer;
    const isSoftwareGl = detectSoftwareWebGL();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 540;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    // Cap DPR at 1.5 max for smooth 60fps scrolling on high-DPI mobile/laptop displays
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.075);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(0, 0.2, 6.2);

    // Lightweight 3-Point Studio Lighting Rig (Zero per-fragment RectAreaLight overhead)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0b1f3a, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4.2, 6.2, 5.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 1.8);
    rimLight.position.set(-5, 3.5, -4);
    scene.add(rimLight);

    // Build Composite Barber Models
    const mats = createBarberMaterialLibrary('navy');
    const ensembleGroup = new THREE.Group();
    scene.add(ensembleGroup);

    const clipper = buildClipperModel(mats);
    clipper.group.position.set(-0.95, 0.15, 0.35);
    clipper.group.rotation.set(0.22, 0.48, -0.28);
    ensembleGroup.add(clipper.group);

    const shears = buildShearsModel(mats);
    shears.group.position.set(1.05, 0.2, -0.1);
    shears.group.rotation.set(0.18, -0.42, 0.32);
    ensembleGroup.add(shears.group);

    const comb = buildCombModel(mats);
    comb.group.position.set(0.1, -1.35, 0.65);
    comb.group.rotation.set(0.35, 0.15, -0.12);
    ensembleGroup.add(comb.group);

    // Architectural Gyroscopic Framing Rings
    const outerRingGeo = new THREE.TorusGeometry(2.35, 0.012, 12, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, mats.brushedSteel);
    outerRing.rotation.set(0.45, 0.2, 0);
    ensembleGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(1.85, 0.018, 12, 56);
    const innerRing = new THREE.Mesh(innerRingGeo, mats.primaryBody);
    innerRing.rotation.set(-0.35, 0.5, 0.2);
    ensembleGroup.add(innerRing);

    // Subtle Micro-Particles (InstancedMesh)
    const particleCount = 24;
    const particleGeo = new THREE.OctahedronGeometry(0.026, 0);
    const particleMesh = new THREE.InstancedMesh(
      particleGeo,
      mats.pureWhiteAccent,
      particleCount
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.9 + ((i * 7) % 11) * 0.12;
      const y = (((i * 13) % 20) - 10) * 0.18;
      dummy.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius * 0.6
      );
      const s = 0.6 + ((i * 3) % 5) * 0.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      particleMesh.setMatrixAt(i, dummy.matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    particleMesh.computeBoundingSphere();
    ensembleGroup.add(particleMesh);

    // Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
      grad.addColorStop(0, 'rgba(5, 7, 11, 0.78)');
      grad.addColorStop(1, 'rgba(5, 7, 11, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 64, 64);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.58,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.25;
    scene.add(shadowPlane);

    // Pointer Parallax & Drag Rotation Tracking (Cached bounding rect to avoid layout reflow)
    let cachedRect = container.getBoundingClientRect();
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    let isDragging = false;
    const dragOffset = { x: 0, y: 0 };
    let prevPointer = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const nx =
        ((e.clientX - cachedRect.left) / Math.max(cachedRect.width, 1)) * 2 - 1;
      const ny =
        -((e.clientY - cachedRect.top) / Math.max(cachedRect.height, 1)) * 2 + 1;
      targetPointer.x = THREE.MathUtils.clamp(nx, -1, 1);
      targetPointer.y = THREE.MathUtils.clamp(ny, -1, 1);

      if (isDragging) {
        dragOffset.x += (e.clientX - prevPointer.x) * 0.008;
        dragOffset.y = THREE.MathUtils.clamp(
          dragOffset.y + (e.clientY - prevPointer.y) * 0.005,
          -0.45,
          0.45
        );
        prevPointer = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      cachedRect = container.getBoundingClientRect();
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Pause WebGL render loop automatically when Hero is scrolled out of view
    let frameId = 0;
    let isDisposed = false;
    let isInViewport = true;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      if (isDisposed || !isInViewport) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed || !isInViewport) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (isDisposed || !isInViewport) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      currentPointer.x = THREE.MathUtils.damp(
        currentPointer.x,
        targetPointer.x,
        4.5,
        dt
      );
      currentPointer.y = THREE.MathUtils.damp(
        currentPointer.y,
        targetPointer.y,
        4.5,
        dt
      );

      const mode = presetRef.current;
      const targetClipperX =
        mode === 'clipper' ? 0 : mode === 'shears' ? -2.25 : -0.95;
      const targetClipperScale =
        mode === 'clipper' ? 1.28 : mode === 'shears' ? 0.68 : 1.0;

      const targetShearsX =
        mode === 'shears' ? 0 : mode === 'clipper' ? 2.25 : 1.05;
      const targetShearsScale =
        mode === 'shears' ? 1.28 : mode === 'clipper' ? 0.68 : 1.0;

      clipper.group.position.x = THREE.MathUtils.damp(
        clipper.group.position.x,
        targetClipperX,
        5,
        dt
      );
      const cs = THREE.MathUtils.damp(
        clipper.group.scale.x,
        targetClipperScale,
        5,
        dt
      );
      clipper.group.scale.setScalar(cs);

      shears.group.position.x = THREE.MathUtils.damp(
        shears.group.position.x,
        targetShearsX,
        5,
        dt
      );
      const ss = THREE.MathUtils.damp(
        shears.group.scale.x,
        targetShearsScale,
        5,
        dt
      );
      shears.group.scale.setScalar(ss);

      if (!prefersReducedMotion) {
        clipper.group.position.y = 0.15 + Math.sin(elapsed * 1.3) * 0.11;
        clipper.group.rotation.y =
          0.48 + Math.sin(elapsed * 0.7) * 0.16 + currentPointer.x * 0.35;
        clipper.group.rotation.x = 0.22 + currentPointer.y * -0.22;

        shears.group.position.y = 0.2 + Math.cos(elapsed * 1.1) * 0.11;
        shears.group.rotation.y =
          -0.42 + Math.cos(elapsed * 0.65) * 0.16 + currentPointer.x * 0.35;
        const shearOpen = 0.18 + Math.sin(elapsed * 1.8) * 0.08;
        shears.bladeA.rotation.z = shearOpen;
        shears.bladeB.rotation.z = -shearOpen;

        comb.group.position.y = -1.35 + Math.sin(elapsed * 1.5 + 1) * 0.07;
        comb.group.rotation.z = -0.12 + currentPointer.x * 0.15;

        outerRing.rotation.z = elapsed * 0.08;
        innerRing.rotation.y = -elapsed * 0.11 + currentPointer.x * 0.25;
        particleMesh.rotation.y = elapsed * 0.05;
      }

      ensembleGroup.rotation.y = THREE.MathUtils.damp(
        ensembleGroup.rotation.y,
        currentPointer.x * 0.3 + dragOffset.x,
        4.5,
        dt
      );
      ensembleGroup.rotation.x = THREE.MathUtils.damp(
        ensembleGroup.rotation.x,
        -currentPointer.y * 0.18 + dragOffset.y,
        4.5,
        dt
      );

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !isInViewport) {
          isInViewport = true;
          clock.getDelta();
          cachedRect = container.getBoundingClientRect();
          tick();
        } else if (!nowVisible && isInViewport) {
          isInViewport = false;
          cancelAnimationFrame(frameId);
          clearTimeout(frameId);
        }
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    tick();

    return () => {
      isDisposed = true;
      isInViewport = false;
      visibilityObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      envTexture.dispose();
      shadowTex.dispose();
      mats.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFallback) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#05070B] border border-white/15 p-6 relative overflow-hidden">
        <svg
          viewBox="0 0 500 420"
          className="w-full max-w-md h-auto"
          aria-label="Ilustrasi teknis instrumen cukur presisi"
        >
          <circle
            cx="250"
            cy="210"
            r="165"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.2"
            strokeWidth="1.2"
          />
          <circle
            cx="250"
            cy="210"
            r="120"
            fill="#0B1F3A"
            fillOpacity="0.45"
            stroke="#FFFFFF"
            strokeOpacity="0.35"
            strokeDasharray="6 6"
          />
          {activePreset !== 'shears' && (
            <g transform="translate(155, 95)">
              <rect
                x="0"
                y="25"
                width="68"
                height="185"
                rx="18"
                fill="#0B1F3A"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <rect x="6" y="0" width="56" height="32" fill="#FFFFFF" />
            </g>
          )}
          {activePreset !== 'clipper' && (
            <g transform="translate(275, 90)">
              <line
                x1="0"
                y1="200"
                x2="75"
                y2="10"
                stroke="#FFFFFF"
                strokeWidth="6"
              />
              <line
                x1="75"
                y1="200"
                x2="0"
                y2="10"
                stroke="#FFFFFF"
                strokeWidth="6"
                strokeOpacity="0.7"
              />
              <circle
                cx="37.5"
                cy="105"
                r="8"
                fill="#0B1F3A"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
        <div className="text-center space-y-1 mt-2">
          <div className="font-mono-tabular text-[11px] tracking-widest uppercase text-white/70">
            ARCHITECTURAL VECTOR FALLBACK · {activePreset.toUpperCase()}
          </div>
          <p className="text-xs text-white/55">
            Visual presisi tetap aktif tanpa memerlukan akselerasi WebGL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px]">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Komposisi 3D interaktif alat cukur presisi barbershop"
      />
    </div>
  );
};
