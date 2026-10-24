import * as THREE from 'three';

export type FinishTheme = 'navy' | 'black' | 'titanium';

export interface ExplodablePart {
  object: THREE.Object3D;
  basePosition: THREE.Vector3;
  explodeOffset: THREE.Vector3;
  baseRotation?: THREE.Euler;
}

/**
 * Detects software WebGL (SwiftShader, llvmpipe, softpipe) from GPU renderer string
 * as required by the Three.js performance guidelines.
 */
export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Creates a procedural brushed metal normal/roughness data texture in linear space
 */
export function createBrushedMetalTexture(): THREE.DataTexture {
  const width = 128;
  const height = 128;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    const streak = Math.floor(124 + Math.sin(y * 0.85) * 18 + ((y * 37) % 14));
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const micro = ((x * 13 + y * 7) % 9) - 4;
      const val = Math.max(0, Math.min(255, streak + micro));
      data[idx] = val;
      data[idx + 1] = 128;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Shared studio material library strictly using #0B1F3A (Navy), #05070B (Jet Black), and #FFFFFF (White/Chrome)
 */
export function createBarberMaterialLibrary(finish: FinishTheme = 'navy') {
  const brushedMap = createBrushedMetalTexture();

  const primaryHex =
    finish === 'navy' ? 0x0b1f3a : finish === 'black' ? 0x05070b : 0xd8dee9;
  const secondaryHex =
    finish === 'navy' ? 0x05070b : finish === 'black' ? 0x0b1f3a : 0x0b1f3a;

  const primaryBody = new THREE.MeshPhysicalMaterial({
    color: primaryHex,
    metalness: finish === 'titanium' ? 0.88 : 0.38,
    roughness: finish === 'titanium' ? 0.2 : 0.36,
    clearcoat: 0.78,
    clearcoatRoughness: 0.16,
    normalMap: brushedMap,
    normalScale: new THREE.Vector2(0.08, 0.08),
  });

  const secondaryBody = new THREE.MeshStandardMaterial({
    color: secondaryHex,
    metalness: 0.55,
    roughness: 0.52,
  });

  const brushedSteel = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.96,
    roughness: 0.14,
    anisotropy: 0.85,
    clearcoat: 0.35,
    normalMap: brushedMap,
    normalScale: new THREE.Vector2(0.14, 0.04),
  });

  const darkChrome = new THREE.MeshPhysicalMaterial({
    color: 0x10233d,
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.65,
  });

  const pureWhiteAccent = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.32,
    metalness: 0.1,
    roughness: 0.15,
  });

  return {
    primaryBody,
    secondaryBody,
    brushedSteel,
    darkChrome,
    pureWhiteAccent,
    dispose() {
      brushedMap.dispose();
      primaryBody.dispose();
      secondaryBody.dispose();
      brushedSteel.dispose();
      darkChrome.dispose();
      pureWhiteAccent.dispose();
    },
  };
}

/**
 * 1. Composite 10-Part Precision Electric Hair Clipper (THREE.Group)
 * Uses LatheGeometry for ergonomic contoured grip and InstancedMesh for precision blade teeth.
 */
export function buildClipperModel(
  mats: ReturnType<typeof createBarberMaterialLibrary>
): { group: THREE.Group; parts: ExplodablePart[] } {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];

  const registerPart = (
    mesh: THREE.Object3D,
    basePos: [number, number, number],
    explodeVec: [number, number, number]
  ) => {
    mesh.position.set(...basePos);
    group.add(mesh);
    parts.push({
      object: mesh,
      basePosition: new THREE.Vector3(...basePos),
      explodeOffset: new THREE.Vector3(...explodeVec),
    });
  };

  // Part 1: Ergonomic Sculpted Lathe Body
  const lathePoints = [
    new THREE.Vector2(0.01, -1.08),
    new THREE.Vector2(0.26, -1.04),
    new THREE.Vector2(0.31, -0.65),
    new THREE.Vector2(0.28, -0.15),
    new THREE.Vector2(0.35, 0.45),
    new THREE.Vector2(0.38, 0.98),
    new THREE.Vector2(0.01, 1.02),
  ];
  const chassisGeo = new THREE.LatheGeometry(lathePoints, 36);
  chassisGeo.scale(1.0, 1.0, 0.72);
  chassisGeo.computeVertexNormals();
  const chassis = new THREE.Mesh(chassisGeo, mats.primaryBody);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  registerPart(chassis, [0, 0, 0], [0, 0, 0]);

  // Part 2: Beveled Top Faceplate Shield
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(-0.24, -0.65);
  shieldShape.lineTo(0.24, -0.65);
  shieldShape.lineTo(0.28, 0.55);
  shieldShape.lineTo(-0.28, 0.55);
  shieldShape.closePath();

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  const shield = new THREE.Mesh(shieldGeo, mats.secondaryBody);
  shield.castShadow = true;
  registerPart(shield, [0, -0.05, 0.21], [0, 0, 0.55]);

  // Part 3: Precision White Calibration Spine
  const stripGeo = new THREE.BoxGeometry(0.045, 0.95, 0.03);
  const strip = new THREE.Mesh(stripGeo, mats.pureWhiteAccent);
  registerPart(strip, [0, -0.05, 0.31], [0, 0, 0.85]);

  // Part 4: Rotary Motor Core Cylinder (Visible when Exploded)
  const motorGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.85, 24);
  const motorMesh = new THREE.Mesh(motorGeo, mats.brushedSteel);
  registerPart(motorMesh, [0, 0.15, 0], [0, 0.25, -0.55]);

  // Part 5: Anodized Neck Crown
  const neckGeo = new THREE.CylinderGeometry(0.41, 0.36, 0.38, 32);
  neckGeo.scale(1.0, 1.0, 0.72);
  const neck = new THREE.Mesh(neckGeo, mats.darkChrome);
  neck.castShadow = true;
  registerPart(neck, [0, 1.12, 0.02], [0, 0.4, 0]);

  // Part 6: Stationary Bottom Clipper Blade (Zero-Gap Bevel)
  const stationaryBladeGeo = new THREE.BoxGeometry(0.92, 0.46, 0.065);
  const stationaryBlade = new THREE.Mesh(stationaryBladeGeo, mats.brushedSteel);
  stationaryBlade.rotation.x = -0.22;
  stationaryBlade.castShadow = true;
  registerPart(stationaryBlade, [0, 1.46, 0.08], [0, 0.78, 0.28]);

  // Part 7: Moving Cutter Blade + Instanced Teeth Array (24 teeth)
  const teethGroup = new THREE.Group();
  const cutterBaseGeo = new THREE.BoxGeometry(0.84, 0.28, 0.045);
  const cutterBase = new THREE.Mesh(cutterBaseGeo, mats.darkChrome);
  teethGroup.add(cutterBase);

  const toothGeo = new THREE.BoxGeometry(0.022, 0.17, 0.038);
  const teethInstanced = new THREE.InstancedMesh(toothGeo, mats.brushedSteel, 24);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 24; i++) {
    const x = -0.41 + (i / 23) * 0.82;
    dummy.position.set(x, 0.2, 0);
    dummy.updateMatrix();
    teethInstanced.setMatrixAt(i, dummy.matrix);
  }
  teethInstanced.instanceMatrix.needsUpdate = true;
  teethInstanced.computeBoundingSphere();
  teethGroup.add(teethInstanced);
  teethGroup.rotation.x = -0.22;
  registerPart(teethGroup, [0, 1.54, 0.02], [0, 1.15, -0.22]);

  // Part 8: Side Taper Lever Assembly
  const leverGroup = new THREE.Group();
  const pivotGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20);
  pivotGeo.rotateZ(Math.PI / 2);
  const pivotMesh = new THREE.Mesh(pivotGeo, mats.brushedSteel);
  const armGeo = new THREE.BoxGeometry(0.055, 0.44, 0.1);
  const armMesh = new THREE.Mesh(armGeo, mats.brushedSteel);
  armMesh.position.set(0.04, -0.16, 0.08);
  armMesh.rotation.x = 0.35;
  leverGroup.add(pivotMesh, armMesh);
  registerPart(leverGroup, [-0.38, 0.92, 0.05], [-0.68, 0.25, 0]);

  // Part 9: Tactile Power Switch
  const switchGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.14, 16);
  switchGeo.rotateZ(Math.PI / 2);
  const powerSwitch = new THREE.Mesh(switchGeo, mats.pureWhiteAccent);
  registerPart(powerSwitch, [0.36, 0.35, 0], [0.58, 0.1, 0]);

  // Part 10: Bottom Hanging Loop & Tail Cap
  const capGeo = new THREE.CylinderGeometry(0.28, 0.21, 0.26, 28);
  capGeo.scale(1.0, 1.0, 0.72);
  const tailCap = new THREE.Mesh(capGeo, mats.darkChrome);
  const ringGeo = new THREE.TorusGeometry(0.12, 0.024, 12, 24);
  const ringMesh = new THREE.Mesh(ringGeo, mats.brushedSteel);
  ringMesh.position.set(0, -0.22, 0);
  tailCap.add(ringMesh);
  registerPart(tailCap, [0, -1.14, 0], [0, -0.58, 0]);

  return { group, parts };
}

/**
 * 2. Composite Forged Japanese Steel Barber Shears (THREE.Group)
 * Uses ExtrudeGeometry for authentic hollow-ground tapered shear blades.
 */
export function buildShearsModel(
  mats: ReturnType<typeof createBarberMaterialLibrary>
): {
  group: THREE.Group;
  bladeA: THREE.Group;
  bladeB: THREE.Group;
  parts: ExplodablePart[];
} {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];

  const createHalfShear = (isLeft: boolean) => {
    const half = new THREE.Group();
    const zOffset = isLeft ? 0.032 : -0.032;

    // Tapered Hollow-Ground Shear Blade via ExtrudeGeometry
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.085, -0.15);
    bladeShape.lineTo(0.085, -0.15);
    bladeShape.quadraticCurveTo(0.065, 0.85, 0.008, 1.82);
    bladeShape.lineTo(-0.015, 1.82);
    bladeShape.quadraticCurveTo(-0.075, 0.85, -0.085, -0.15);

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, mats.brushedSteel);
    bladeMesh.position.set(0, 0, zOffset - 0.009);
    bladeMesh.castShadow = true;
    half.add(bladeMesh);

    // Handle shank
    const shankGeo = new THREE.CylinderGeometry(0.042, 0.034, 0.92, 16);
    const shankMesh = new THREE.Mesh(shankGeo, mats.darkChrome);
    shankMesh.position.set(isLeft ? -0.12 : 0.12, -0.46, zOffset);
    shankMesh.rotation.z = isLeft ? -0.24 : 0.24;
    half.add(shankMesh);

    // Ergonomic Finger Ring
    const ringGeo = new THREE.TorusGeometry(0.22, 0.042, 18, 36);
    const ringMesh = new THREE.Mesh(
      ringGeo,
      isLeft ? mats.primaryBody : mats.brushedSteel
    );
    ringMesh.position.set(isLeft ? -0.28 : 0.28, -1.02, zOffset);
    ringMesh.castShadow = true;
    half.add(ringMesh);

    // Inner Thumb Insert Cushion Ring
    const innerRingGeo = new THREE.TorusGeometry(0.175, 0.016, 12, 28);
    const innerRing = new THREE.Mesh(innerRingGeo, mats.pureWhiteAccent);
    innerRing.position.set(isLeft ? -0.28 : 0.28, -1.02, zOffset);
    half.add(innerRing);

    // Pinky tang on right ring
    if (!isLeft) {
      const tangGeo = new THREE.CylinderGeometry(0.016, 0.028, 0.34, 12);
      const tangMesh = new THREE.Mesh(tangGeo, mats.brushedSteel);
      tangMesh.position.set(0.54, -1.16, zOffset);
      tangMesh.rotation.z = -1.1;
      half.add(tangMesh);
    }

    return half;
  };

  const bladeA = createHalfShear(true);
  const bladeB = createHalfShear(false);
  bladeA.rotation.z = 0.22;
  bladeB.rotation.z = -0.22;

  group.add(bladeA, bladeB);

  parts.push(
    {
      object: bladeA,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(-0.38, 0.15, 0.38),
    },
    {
      object: bladeB,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(0.38, -0.15, -0.38),
    }
  );

  // Center Tension Pivot Jewel Screw + Bearing Washer
  const washerGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.08, 24);
  washerGeo.rotateX(Math.PI / 2);
  const washerMesh = new THREE.Mesh(washerGeo, mats.brushedSteel);
  group.add(washerMesh);

  const screwGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.14, 24);
  screwGeo.rotateX(Math.PI / 2);
  const screwMesh = new THREE.Mesh(screwGeo, mats.primaryBody);
  const screwCapGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.16, 16);
  screwCapGeo.rotateX(Math.PI / 2);
  const screwCap = new THREE.Mesh(screwCapGeo, mats.pureWhiteAccent);
  screwMesh.add(screwCap);
  group.add(screwMesh);

  parts.push(
    {
      object: washerMesh,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(0, 0, -0.55),
    },
    {
      object: screwMesh,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(0, 0, 0.78),
    }
  );

  return { group, bladeA, bladeB, parts };
}

/**
 * 3. Composite Precision Barber Comb with Instanced Teeth
 */
export function buildCombModel(
  mats: ReturnType<typeof createBarberMaterialLibrary>
): { group: THREE.Group; parts: ExplodablePart[] } {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];

  // Comb Spine
  const spineGeo = new THREE.BoxGeometry(2.3, 0.16, 0.06);
  const spineMesh = new THREE.Mesh(spineGeo, mats.primaryBody);
  spineMesh.position.set(0, 0.22, 0);
  spineMesh.castShadow = true;
  group.add(spineMesh);

  // Accent Calibration Rule on Spine
  const ruleGeo = new THREE.BoxGeometry(2.1, 0.025, 0.07);
  const ruleMesh = new THREE.Mesh(ruleGeo, mats.pureWhiteAccent);
  ruleMesh.position.set(0, 0.24, 0);
  group.add(ruleMesh);

  // Instanced Teeth (36 graduated teeth)
  const count = 36;
  const toothGeo = new THREE.BoxGeometry(0.025, 0.46, 0.045);
  const teethMesh = new THREE.InstancedMesh(toothGeo, mats.brushedSteel, count);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    const x = -1.08 + (i / (count - 1)) * 2.16;
    const scaleY = 1 - (i / count) * 0.22;
    dummy.position.set(x, -0.02 * scaleY, 0);
    dummy.scale.set(1, scaleY, 1);
    dummy.updateMatrix();
    teethMesh.setMatrixAt(i, dummy.matrix);
  }
  teethMesh.instanceMatrix.needsUpdate = true;
  teethMesh.computeBoundingSphere();
  group.add(teethMesh);

  parts.push(
    {
      object: spineMesh,
      basePosition: new THREE.Vector3(0, 0.22, 0),
      explodeOffset: new THREE.Vector3(0, 0.45, 0),
    },
    {
      object: ruleMesh,
      basePosition: new THREE.Vector3(0, 0.24, 0),
      explodeOffset: new THREE.Vector3(0, 0.65, 0.2),
    },
    {
      object: teethMesh,
      basePosition: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(0, -0.35, 0),
    }
  );

  return { group, parts };
}

/**
 * 4. Composite 11-Part Luxury Hydraulic Barber Chair & Architectural Studio Station
 */
export function buildBarberChairModel(
  mats: ReturnType<typeof createBarberMaterialLibrary>
): { group: THREE.Group; parts: ExplodablePart[] } {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];

  const addChairPart = (
    mesh: THREE.Object3D,
    pos: [number, number, number],
    explode: [number, number, number]
  ) => {
    mesh.position.set(...pos);
    group.add(mesh);
    parts.push({
      object: mesh,
      basePosition: new THREE.Vector3(...pos),
      explodeOffset: new THREE.Vector3(...explode),
    });
  };

  // 1. Heavy Conical Lathe Chrome Base Disc (grounded at y = 0)
  const basePoints = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(1.04, 0),
    new THREE.Vector2(0.98, 0.05),
    new THREE.Vector2(0.32, 0.14),
    new THREE.Vector2(0.01, 0.14),
  ];
  const baseGeo = new THREE.LatheGeometry(basePoints, 40);
  const baseMesh = new THREE.Mesh(baseGeo, mats.brushedSteel);
  baseMesh.receiveShadow = true;
  addChairPart(baseMesh, [0, 0.01, 0], [0, -0.42, 0]);

  // 2. Hydraulic Pump Column + Foot Pedal Lever
  const colGroup = new THREE.Group();
  const columnGeo = new THREE.CylinderGeometry(0.14, 0.19, 0.78, 28);
  const columnMesh = new THREE.Mesh(columnGeo, mats.darkChrome);
  columnMesh.castShadow = true;
  const pedalGeo = new THREE.BoxGeometry(0.45, 0.03, 0.08);
  const pedalMesh = new THREE.Mesh(pedalGeo, mats.brushedSteel);
  pedalMesh.position.set(-0.28, -0.12, 0);
  pedalMesh.rotation.z = 0.25;
  colGroup.add(columnMesh, pedalMesh);
  addChairPart(colGroup, [0, 0.45, 0], [0, -0.15, 0]);

  // 3. Seat Cushion Box + Bolster Trim
  const seatGroup = new THREE.Group();
  const seatGeo = new THREE.BoxGeometry(1.22, 0.22, 1.18);
  const seatMesh = new THREE.Mesh(seatGeo, mats.primaryBody);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  const trimGeo = new THREE.BoxGeometry(1.26, 0.04, 1.22);
  const trimMesh = new THREE.Mesh(trimGeo, mats.brushedSteel);
  trimMesh.position.y = -0.11;
  seatGroup.add(seatMesh, trimMesh);
  addChairPart(seatGroup, [0, 0.9, 0.05], [0, 0.1, 0.22]);

  // 4. Sculpted Backrest Panel + Ribbed Stitching Channels
  const backGroup = new THREE.Group();
  const backGeo = new THREE.BoxGeometry(1.16, 1.28, 0.2);
  const backMesh = new THREE.Mesh(backGeo, mats.primaryBody);
  backMesh.castShadow = true;
  const backShellGeo = new THREE.BoxGeometry(1.2, 1.32, 0.06);
  const backShell = new THREE.Mesh(backShellGeo, mats.secondaryBody);
  backShell.position.z = -0.11;
  backGroup.add(backMesh, backShell);
  backGroup.rotation.x = -0.14;
  addChairPart(backGroup, [0, 1.62, -0.52], [0, 0.45, -0.55]);

  // 5. Adjustable Headrest & Twin Steel Rods
  const headrestGroup = new THREE.Group();
  const padGeo = new THREE.BoxGeometry(0.68, 0.28, 0.16);
  const padMesh = new THREE.Mesh(padGeo, mats.secondaryBody);
  const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12);
  const rodL = new THREE.Mesh(rodGeo, mats.brushedSteel);
  rodL.position.set(-0.18, -0.2, 0);
  const rodR = new THREE.Mesh(rodGeo, mats.brushedSteel);
  rodR.position.set(0.18, -0.2, 0);
  headrestGroup.add(padMesh, rodL, rodR);
  headrestGroup.rotation.x = -0.14;
  addChairPart(headrestGroup, [0, 2.45, -0.64], [0, 0.95, -0.65]);

  // 6 & 7. Left & Right Brushed Steel Armrests
  const armGeo = new THREE.BoxGeometry(0.14, 0.1, 1.08);
  const supportGeo = new THREE.BoxGeometry(0.1, 0.38, 0.12);

  [-0.68, 0.68].forEach((xPos, idx) => {
    const armGroup = new THREE.Group();
    const armPad = new THREE.Mesh(armGeo, mats.secondaryBody);
    const armSupport = new THREE.Mesh(supportGeo, mats.brushedSteel);
    armSupport.position.set(0, -0.22, -0.15);
    armGroup.add(armPad, armSupport);
    armGroup.castShadow = true;
    addChairPart(
      armGroup,
      [xPos, 1.28, 0.02],
      [idx === 0 ? -0.65 : 0.65, 0.25, 0]
    );
  });

  // 8. Chrome Footrest Bar & Platform
  const footrestGroup = new THREE.Group();
  const footPlateGeo = new THREE.BoxGeometry(0.86, 0.06, 0.38);
  const footPlate = new THREE.Mesh(footPlateGeo, mats.brushedSteel);
  const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 12);
  strutGeo.rotateX(Math.PI / 4);
  const strutL = new THREE.Mesh(strutGeo, mats.darkChrome);
  strutL.position.set(-0.34, 0.22, -0.22);
  const strutR = new THREE.Mesh(strutGeo, mats.darkChrome);
  strutR.position.set(0.34, 0.22, -0.22);
  footrestGroup.add(footPlate, strutL, strutR);
  addChairPart(footrestGroup, [0, 0.32, 0.92], [0, -0.15, 0.75]);

  // 9. Illuminated Studio Mirror Station & Console Shelf (Behind Chair)
  const stationGroup = new THREE.Group();
  const frameGeo = new THREE.BoxGeometry(2.45, 2.65, 0.08);
  const frameMesh = new THREE.Mesh(frameGeo, mats.secondaryBody);
  const mirrorGeo = new THREE.BoxGeometry(2.15, 2.35, 0.09);
  const mirrorMesh = new THREE.Mesh(mirrorGeo, mats.brushedSteel);
  const ledStripGeo = new THREE.BoxGeometry(2.25, 2.45, 0.085);
  const ledStrip = new THREE.Mesh(ledStripGeo, mats.pureWhiteAccent);
  const shelfGeo = new THREE.BoxGeometry(2.6, 0.08, 0.42);
  const shelfMesh = new THREE.Mesh(shelfGeo, mats.primaryBody);
  shelfMesh.position.set(0, -1.15, 0.2);
  stationGroup.add(frameMesh, ledStrip, mirrorMesh, shelfMesh);
  addChairPart(stationGroup, [0, 1.85, -1.75], [0, 0.35, -1.1]);

  return { group, parts };
}
