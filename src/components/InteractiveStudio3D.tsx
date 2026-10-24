import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  detectSoftwareWebGL,
  createBarberMaterialLibrary,
  buildBarberChairModel,
  buildClipperModel,
  buildShearsModel,
  FinishTheme,
  ExplodablePart,
} from '../utils/barber3DModels';

type StudioSubject = 'chair' | 'clipper' | 'shears';

export const InteractiveStudio3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [subject, setSubject] = useState<StudioSubject>('chair');
  const [finish, setFinish] = useState<FinishTheme>('navy');
  const [explodePercent, setExplodePercent] = useState<number>(0);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);

  // Mutable refs for smooth animation loop consumption without remounting WebGL
  const stateRef = useRef({
    subject: 'chair' as StudioSubject,
    finish: 'navy' as FinishTheme,
    explodeTarget: 0,
    explodeCurrent: 0,
    yawTarget: 0.35,
    yawCurrent: 0.35,
    pitchTarget: 0.15,
    pitchCurrent: 0.15,
  });

  useEffect(() => {
    stateRef.current.subject = subject;
    if (subject === 'chair') {
      stateRef.current.yawTarget = 0.42;
      stateRef.current.pitchTarget = 0.16;
    } else if (subject === 'clipper') {
      stateRef.current.yawTarget = 0.55;
      stateRef.current.pitchTarget = 0.12;
    } else {
      stateRef.current.yawTarget = -0.35;
      stateRef.current.pitchTarget = 0.14;
    }
  }, [subject]);

  useEffect(() => {
    stateRef.current.finish = finish;
  }, [finish]);

  useEffect(() => {
    stateRef.current.explodeTarget = explodePercent / 100;
  }, [explodePercent]);

  // Keyboard shortcut 'H' to toggle Zen Mode dock when not typing in an input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 580;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x05070b, 1);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.065);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 5.4);
    camera.lookAt(0, 0.9, 0);

    // Studio Lighting Rig + Softboxes
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0b1f3a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4.5, 6.5, 5.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      const d = 4;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;

      RectAreaLightUniformsLib.init();
      const studioLight1 = new THREE.RectAreaLight(0xffffff, 4.0, 3.0, 2.0);
      studioLight1.position.set(2.5, 3.8, 2.5);
      studioLight1.lookAt(0, 1.0, 0);
      scene.add(studioLight1);

      const studioLight2 = new THREE.RectAreaLight(0x0b1f3a, 5.5, 4.0, 2.5);
      studioLight2.position.set(-3.2, 2.2, -2.5);
      studioLight2.lookAt(0, 1.0, 0);
      scene.add(studioLight2);
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 1.9);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Architectural Studio Pedestal & Floor Grid (Offset by >= 0.02 on Y to prevent Z-fighting)
    const mats = createBarberMaterialLibrary('navy');

    const floorGeo = new THREE.CircleGeometry(6.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x05070b,
      roughness: 0.7,
      metalness: 0.3,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.02;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const ringGeo = new THREE.RingGeometry(1.65, 1.68, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.005;
    scene.add(floorRing);

    // Build all 3 inspectable subjects
    const rootTurntable = new THREE.Group();
    scene.add(rootTurntable);

    const chairBuilt = buildBarberChairModel(mats);
    const clipperBuilt = buildClipperModel(mats);
    clipperBuilt.group.position.set(0, 1.15, 0);
    clipperBuilt.group.scale.setScalar(0.88);

    const shearsBuilt = buildShearsModel(mats);
    shearsBuilt.group.position.set(0, 1.2, 0);
    shearsBuilt.group.scale.setScalar(0.95);

    rootTurntable.add(chairBuilt.group, clipperBuilt.group, shearsBuilt.group);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Drag / Pointer Orbit Interaction
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      prevPointer = { x: e.clientX, y: e.clientY };

      stateRef.current.yawTarget += dx * 0.0085;
      stateRef.current.pitchTarget = THREE.MathUtils.clamp(
        stateRef.current.pitchTarget + dy * 0.005,
        -0.15,
        0.55
      );
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
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const _tempVec = new THREE.Vector3();
    let lastFinish: FinishTheme = 'navy';
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();

    const applyExplode = (parts: ExplodablePart[], factor: number) => {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        _tempVec
          .copy(p.basePosition)
          .addScaledVector(p.explodeOffset, factor);
        p.object.position.copy(_tempVec);
      }
    };

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
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
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);

      if (stateRef.current.finish !== lastFinish) {
        lastFinish = stateRef.current.finish;
        const pHex =
          lastFinish === 'navy'
            ? 0x0b1f3a
            : lastFinish === 'black'
            ? 0x05070b
            : 0xd8dee9;
        const sHex =
          lastFinish === 'navy'
            ? 0x05070b
            : lastFinish === 'black'
            ? 0x0b1f3a
            : 0x0b1f3a;
        mats.primaryBody.color.setHex(pHex);
        mats.primaryBody.metalness = lastFinish === 'titanium' ? 0.88 : 0.38;
        mats.secondaryBody.color.setHex(sHex);
      }

      const activeSub = stateRef.current.subject;
      chairBuilt.group.visible = activeSub === 'chair';
      clipperBuilt.group.visible = activeSub === 'clipper';
      shearsBuilt.group.visible = activeSub === 'shears';

      stateRef.current.explodeCurrent = THREE.MathUtils.damp(
        stateRef.current.explodeCurrent,
        stateRef.current.explodeTarget,
        6,
        dt
      );

      applyExplode(chairBuilt.parts, stateRef.current.explodeCurrent);
      applyExplode(clipperBuilt.parts, stateRef.current.explodeCurrent);
      applyExplode(shearsBuilt.parts, stateRef.current.explodeCurrent);

      if (!isDragging && !isSoftwareGl) {
        stateRef.current.yawTarget += dt * 0.14;
      }

      stateRef.current.yawCurrent = THREE.MathUtils.damp(
        stateRef.current.yawCurrent,
        stateRef.current.yawTarget,
        6,
        dt
      );
      stateRef.current.pitchCurrent = THREE.MathUtils.damp(
        stateRef.current.pitchCurrent,
        stateRef.current.pitchTarget,
        6,
        dt
      );

      rootTurntable.rotation.y = stateRef.current.yawCurrent;
      rootTurntable.rotation.x = stateRef.current.pitchCurrent;

      const targetCamZ = activeSub === 'chair' ? 5.6 : 4.2;
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetCamZ,
        5,
        dt
      );

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
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
      envTex.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      mats.dispose();
      renderer.dispose();
    };
  }, []);

  const handleResetView = () => {
    setExplodePercent(0);
    stateRef.current.yawTarget = 0.42;
    stateRef.current.pitchTarget = 0.16;
  };

  return (
    <section
      id="studio-3d"
      className="relative py-24 lg:py-32 bg-[#05070B] text-white border-b border-white/15"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-mono-tabular uppercase tracking-widest text-white/60">
              <span>Interactive 3D Barber Studio</span>
              <span aria-hidden="true">·</span>
              <span>360° Spatial Showcase</span>
            </div>
            <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] tracking-tight text-white">
              STEP INSIDE THE CRAFT.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
            Geser kursor atau drag pada ruang 3D di bawah untuk memutar kursi studio dan
            instrumen cukur 360°. Gunakan slider <strong className="text-white">Explode</strong>{' '}
            untuk melihat anatomi komponen presisi.
          </p>
        </div>

        {/* 3D Viewport Frame with Unobstructed Center & Unified Collapsible Bottom Dock */}
        <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[640px] border border-white/20 bg-[#05070B] overflow-hidden">
          {/* Top-Left Minimal Spec Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#05070B]/90 border border-white/15 px-3.5 py-2">
            <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-white/85">
              {subject === 'chair'
                ? '01 · HYDRAULIC BARBER STATION'
                : subject === 'clipper'
                ? '02 · PRECISION MOTOR CLIPPER'
                : '03 · FORGED JAPANESE SHEARS'}
            </div>
            <div className="text-[11px] text-white/55 font-mono-tabular">
              DRAG TO ROTATE 360° · EXPLODED VIEW: {explodePercent}% · FINISH:{' '}
              {finish.toUpperCase()}
            </div>
          </div>

          {/* Dedicated WebGL Mount Container or Interactive Architectural Fallback */}
          {webglError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#05070B]">
              <svg
                viewBox="0 0 600 360"
                className="w-full max-w-lg h-auto"
                aria-label="Diagram interaktif studio barbershop"
              >
                <circle
                  cx="300"
                  cy="180"
                  r="135"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.2"
                />
                {/* Interactive Exploded Layers responding to explodePercent */}
                <rect
                  x="220"
                  y={80 - explodePercent * 0.35}
                  width="160"
                  height="65"
                  fill={finish === 'navy' ? '#0B1F3A' : finish === 'black' ? '#05070B' : '#FFFFFF'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <rect
                  x="200"
                  y={165}
                  width="200"
                  height="45"
                  fill="#0B1F3A"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <rect
                  x="240"
                  y={230 + explodePercent * 0.35}
                  width="120"
                  height="30"
                  fill="#FFFFFF"
                />
              </svg>
              <p className="font-mono-tabular text-xs text-white/70 mt-2">
                INTERACTIVE SCHEMATIC FALLBACK · EXPLODE: {explodePercent}%
              </p>
            </div>
          ) : (
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              aria-label="Ruang studio barbershop 3D interaktif yang dapat diputar"
            />
          )}

          {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Clutter, No backdrop-blur over WebGL) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[900px] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#05070B] border border-b-0 border-white/25 text-[11px] font-mono-tabular uppercase tracking-widest text-white/80 hover:text-white cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Show Studio Controls [H]</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Hide Controls [H]</span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="w-full bg-[#05070B] border border-white/25 p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-[0_16px_40px_rgba(5,7,11,0.9)]">
                {/* 1. Model Subject Switcher */}
                <div className="md:col-span-5 flex items-center gap-1 bg-[#0B1F3A]/40 p-1 border border-white/10">
                  {(
                    [
                      { id: 'chair', label: 'Studio Chair' },
                      { id: 'clipper', label: 'Clipper' },
                      { id: 'shears', label: 'Shears' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubject(item.id)}
                      className={`flex-1 py-1.5 px-2.5 text-xs font-mono-tabular transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        subject === item.id
                          ? 'bg-white text-[#05070B] font-semibold'
                          : 'text-white/75 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* 2. Exploded View Slider */}
                <div className="md:col-span-4 flex items-center gap-3 px-2">
                  <label
                    htmlFor="explode-slider"
                    className="text-[11px] font-mono-tabular uppercase tracking-wider text-white/70 whitespace-nowrap shrink-0"
                  >
                    Explode
                  </label>
                  <input
                    id="explode-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={explodePercent}
                    onChange={(e) => setExplodePercent(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                  <span className="font-mono-tabular text-xs text-white/80 w-9 text-right shrink-0">
                    {explodePercent}%
                  </span>
                </div>

                {/* 3. Material Finish Swatches & Reset */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2">
                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: 'navy', label: 'Navy' },
                        { id: 'black', label: 'Black' },
                        { id: 'titanium', label: 'Steel' },
                      ] as const
                    ).map((sw) => (
                      <button
                        key={sw.id}
                        type="button"
                        onClick={() => setFinish(sw.id)}
                        title={`Material: ${sw.label}`}
                        className={`px-2.5 py-1 text-[11px] font-mono-tabular border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          finish === sw.id
                            ? 'border-white bg-white/15 text-white font-semibold'
                            : 'border-white/20 text-white/60 hover:text-white'
                        }`}
                      >
                        {sw.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleResetView}
                    title="Reset sudut pandang 3D"
                    aria-label="Reset sudut pandang 3D"
                    className="p-1.5 border border-white/20 text-white/75 hover:text-white hover:border-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
