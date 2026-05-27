/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LandmarkId, FireworkParams, DroneParams, AtmosphereSettings } from '../types';
import { audio } from '../utils/audio';
import { generateDroneShapePoints } from '../utils/shapes';
import { Play, RotateCcw, Volume2, VolumeX, Eye, Maximize2 } from 'lucide-react';

interface ViewportProps {
  landmarkId: LandmarkId;
  fireworkParams: FireworkParams;
  droneParams: DroneParams;
  atmosphere: AtmosphereSettings;
  launchTrigger: number;
  dronesActive: boolean;
  setDronesActive: (active: boolean) => void;
  onFireworkLaunched: () => void;
  lang: 'zh-TW' | 'en';
}

export default function Viewport({
  landmarkId,
  fireworkParams,
  droneParams,
  atmosphere,
  launchTrigger,
  dronesActive,
  setDronesActive,
  onFireworkLaunched,
  lang,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const landmarkGroupRef = useRef<THREE.Group | null>(null);
  const skyStarsRef = useRef<THREE.Points | null>(null);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);

  // Particles state structure
  const activeFireworksRef = useRef<any[]>([]);
  const dronesRef = useRef<{
    positions: THREE.Vector3[];
    targets: THREE.Vector3[];
    colors: THREE.Color[];
    velocities: THREE.Vector3[];
    randomSpeeds: number[];
  }>({ positions: [], targets: [], colors: [], velocities: [], randomSpeeds: [] });

  // WebGL particles objects
  const dronePointsRef = useRef<THREE.Points | null>(null);
  
  // Controls feedback values
  const [fps, setFps] = useState<number>(60);
  const [activeParticlesCount, setActiveParticlesCount] = useState<number>(0);
  const [cameraDistance, setCameraDistance] = useState<number>(120);

  // Setup sound on click warning states
  const [soundWarn, setSoundWarn] = useState<boolean>(true);

  // Helper trigger to launch custom firework from inside UI
  useEffect(() => {
    if (launchTrigger > 0) {
      triggerFirework(null);
    }
  }, [launchTrigger]);

  // Handle Drone Active State - triggers drone swarm activation/hum
  useEffect(() => {
    if (dronesActive) {
      audio.startDroneHum(droneParams.droneCount);
      rebuildDronePositions();
    } else {
      audio.stopDroneHum();
    }
  }, [dronesActive, droneParams.pattern, droneParams.customText, droneParams.droneCount, droneParams.height, droneParams.scale]);

  // Set initial drone target arrays
  const rebuildDronePositions = () => {
    const count = droneParams.droneCount;
    const baseHeight = droneParams.height;
    const scale = droneParams.scale;
    const targets = generateDroneShapePoints(
      droneParams.pattern,
      droneParams.customText,
      count,
      baseHeight,
      scale
    );

    const positions: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const velocities: THREE.Vector3[] = [];
    const randomSpeeds: number[] = [];

    // If starting drones or existing size doesn't match:
    const oldPositions = dronesRef.current.positions;
    
    for (let i = 0; i < count; i++) {
      const targetPos = new THREE.Vector3(targets[i][0], targets[i][1], targets[i][2]);
      
      // Spawn drones near landmark center or carry over previous positions
      let startPos: THREE.Vector3;
      if (oldPositions && oldPositions[i]) {
        startPos = oldPositions[i].clone();
      } else {
        // Spawn from ground level as if launching
        startPos = new THREE.Vector3(
          (Math.random() - 0.5) * 80,
          0.1 + Math.random() * 5,
          (Math.random() - 0.5) * 80
        );
      }
      
      positions.push(startPos);
      velocities.push(new THREE.Vector3(0, 0, 0));
      colors.push(new THREE.Color(droneParams.color));
      randomSpeeds.push(0.5 + Math.random() * 1.0);
    }

    dronesRef.current = {
      positions,
      targets: targets.map(t => new THREE.Vector3(t[0], t[1], t[2])),
      colors,
      velocities,
      randomSpeeds
    };
  };

  // Re-color drones when parameter shifts
  useEffect(() => {
    if (dronesRef.current.colors.length > 0) {
      const droneColor = new THREE.Color(droneParams.color);
      for (let i = 0; i < dronesRef.current.colors.length; i++) {
        dronesRef.current.colors[i].copy(droneColor);
      }
    }
  }, [droneParams.color]);

  // WebGL Lifecycle Loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // SCENE & RENDERER SETUP
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmosphere color presets
    let skyColor = 0x010103;
    if (atmosphere.timeOfDay === 'cyan_twilight') {
      skyColor = 0x01131a;
      scene.fog = new THREE.FogExp2(0x01131a, 0.0035);
    } else if (atmosphere.timeOfDay === 'deep_purple') {
      skyColor = 0x0c0617;
      scene.fog = new THREE.FogExp2(0x0c0617, 0.004);
    } else {
      scene.fog = new THREE.FogExp2(0x010103, 0.0028);
    }
    
    scene.background = new THREE.Color(skyColor);

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 45, 120);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground grid
    controls.minDistance = 25;
    controls.maxDistance = 300;
    controls.target.set(0, 30, 0);
    controlsRef.current = controls;

    // AMBIENT & DIRECTIONAL LIGHTS
    const ambientLight = new THREE.AmbientLight(0x0a1122, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x112233, 1.2);
    dirLight1.position.set(50, 100, 50);
    scene.add(dirLight1);

    // Dynamic Top Spotlight for Eiffel Beacon
    const searchlight = new THREE.SpotLight(0xaaddff, 12, 250, Math.PI / 18, 0.2, 0.5);
    searchlight.position.set(0, 90, 0);
    searchlight.target = new THREE.Object3D();
    searchlight.target.position.set(100, 0, 0);
    scene.add(searchlight);
    scene.add(searchlight.target);
    spotlightRef.current = searchlight;

    // STARRY SKY PARTICLES
    const starCount = atmosphere.starDensity * 5;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Points inside upper hemispherical dome
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(v) * 0.9; // Concentrate near top hemisphere
      const r = 300 + Math.random() * 150;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi) + 10;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      
      starSizes[i] = 1.0 + Math.random() * 2.5;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    // Custom shader material for beautiful circular depth stars
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false
    });
    
    const skyStars = new THREE.Points(starGeometry, starMaterial);
    scene.add(skyStars);
    skyStarsRef.current = skyStars;

    // GRID & REFLECTIVE WATER PLANE
    const gridHelper = new THREE.GridHelper(400, 50, 0x112244, 0x091224);
    gridHelper.position.y = 0.05;
    if (atmosphere.showGrid) {
      scene.add(gridHelper);
    }

    // Water base mesh (highly reflective dark floor)
    const waterGeo = new THREE.PlaneGeometry(500, 500);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x020813,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    scene.add(water);

    // LANDMARK GRAPHICS GROUP
    const landmarkGroup = new THREE.Group();
    scene.add(landmarkGroup);
    landmarkGroupRef.current = landmarkGroup;

    // DRAW THE SELECTED LANDMARK
    buildLandmark(landmarkId, landmarkGroup);

    // INITIALIZE GEOMETRIES FOR DYNAMIC DRONES
    const droneGeometry = new THREE.BufferGeometry();
    const droneMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const dronePointsObj = new THREE.Points(droneGeometry, droneMaterial);
    scene.add(dronePointsObj);
    dronePointsRef.current = dronePointsObj;

    // Ensure drone arrays populate on first launch if active
    if (dronesActive) {
      rebuildDronePositions();
    }

    // MAIN ANIMATION RENDER LOOP WITH FRAME TIME
    let lastTime = 0;
    let frameId = 0;
    let frameCount = 0;
    let fpsInterval = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // FPS counter
      frameCount++;
      fpsInterval += delta;
      if (fpsInterval >= 1.0) {
        setFps(Math.round(frameCount / fpsInterval));
        frameCount = 0;
        fpsInterval = 0;
      }

      // Rotate starfield extremely slowly
      if (skyStars) {
        skyStars.rotation.y = time * 0.000015;
      }

      // Controls camera angle feedback distance slider
      if (cameraRef.current) {
        setCameraDistance(Math.round(cameraRef.current.position.distanceTo(new THREE.Vector3(0,0,0))));
      }

      // Update Eiffel searchlight sweeping beacon
      if (spotlightRef.current && (landmarkId === 'eiffel' || landmarkId === 'tokyo')) {
        const speed = landmarkId === 'eiffel' ? 0.0006 : 0.0012;
        const angle = time * speed;
        spotlightRef.current.target.position.set(
          Math.cos(angle) * 150,
          0,
          Math.sin(angle) * 150
        );
      }

      // 1. UPDATE FIREWORKS & GENERATING EXPLOSION PARTICLES
      updateFireworksPhysics(delta, scene);

      // 2. UPDATE DRONES POSITION INTERPOLATION (LEAP TO TARGETS)
      if (dronesActive && dronesRef.current.positions.length > 0) {
        updateDronesPhysics(time, delta);
      } else {
        // Clear drone points buffer from scene if inactive
        droneGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
        droneGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(0), 3));
      }

      // Update Controls damping
      controls.update();

      // Render actual scene inside WebGL canvas
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // KEYBOARD LISTENER Inside canvas wrapper
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 4;
      if (!cameraRef.current || !controlsRef.current) return;
      
      switch (e.key.toLowerCase()) {
        case 'w': // Move focus target forward
          controlsRef.current.target.z -= step;
          break;
        case 's': // Move backward
          controlsRef.current.target.z += step;
          break;
        case 'a': // Move left
          controlsRef.current.target.x -= step;
          break;
        case 'd': // Move right
          controlsRef.current.target.x += step;
          break;
        case ' ': // space to fire custom firework
          e.preventDefault();
          triggerFirework(null);
          break;
        case 'r': // Reset Camera angle
          cameraRef.current.position.set(0, 45, 120);
          controlsRef.current.target.set(0, 30, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // WINDOW RESIZER Event
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    // CLEANUP STAGE
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      resizeObserver.disconnect();
      
      // Memory cleanup for shapes
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      gridHelper.dispose();
      waterMat.dispose();
      waterGeo.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      droneGeometry.dispose();
      droneMaterial.dispose();
      clearLandmarkGroup(landmarkGroup);
    };
  }, [landmarkId, atmosphere.timeOfDay, atmosphere.showGrid, atmosphere.starDensity]);

  // Sync volume with sound library when parameters swap
  useEffect(() => {
    audio.setVolume(atmosphere.soundVolume);
  }, [atmosphere.soundVolume]);

  // Dynamic geometry drawer for landmarks
  const buildLandmark = (type: LandmarkId, group: THREE.Group) => {
    clearLandmarkGroup(group);

    switch (type) {
      case 'taipei101': {
        // TAIPEI 101 NEON WIREFRAME GEOMETRY
        // Draw elegant stack of inverted pyramid truncated segments
        const segments = 8;
        const baseH = 5;
        const stepH = 8;
        
        // Base structure cylinders
        const baseGeo = new THREE.CylinderGeometry(4, 5, baseH, 8, 2, true);
        const neonWireframeMat = new THREE.MeshBasicMaterial({
          color: 0x00dfbb,
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
        const neonSpireMat = new THREE.MeshBasicMaterial({
          color: 0xfff321,
          wireframe: true
        });

        const baseMesh = new THREE.Mesh(baseGeo, neonWireframeMat);
        baseMesh.position.y = baseH / 2;
        group.add(baseMesh);

        // Tower segmented rings
        for (let i = 0; i < segments; i++) {
          const lowerR = 3.5 + (0.5 - (i * 0.15));
          const upperR = lowerR + 1.2;
          const segmentGeo = new THREE.CylinderGeometry(upperR, lowerR, stepH, 8, 2, true);
          const segmentMesh = new THREE.Mesh(segmentGeo, neonWireframeMat);
          
          // Truncated segment has rotation upside down to match T101 standard architectural tiers
          segmentMesh.rotation.x = Math.PI;
          segmentMesh.position.y = baseH + i * stepH + stepH / 2;
          group.add(segmentMesh);

          // Neon level ring plate indicator
          const ringGeo = new THREE.CylinderGeometry(upperR + 0.5, upperR + 0.5, 0.4, 8, 1, false);
          const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
            color: 0x00ff77,
            wireframe: true
          }));
          ringMesh.position.y = baseH + i * stepH + stepH;
          group.add(ringMesh);
        }

        // Spire pinnacle at top
        const spireH = 20;
        const spireGeo = new THREE.CylinderGeometry(0.1, 1.5, spireH, 6, 4, true);
        const spireMesh = new THREE.Mesh(spireGeo, neonSpireMat);
        spireMesh.position.y = baseH + segments * stepH + spireH / 2;
        group.add(spireMesh);

        // Spot Beacon at spire tip
        const pointLight = new THREE.PointLight(0xfff321, 3, 50);
        pointLight.position.set(0, baseH + segments * stepH + spireH, 0);
        group.add(pointLight);

        // Spotlight configuration hide Eiffel beam
        if (spotlightRef.current) spotlightRef.current.visible = false;
        break;
      }

      case 'eiffel': {
        // EIFFEL TOWER WIREFRAME WITH BEACON APEX
        const eiffelMat = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          wireframe: true,
          transparent: true,
          opacity: 0.65
        });

        // Layer 1: Platform base support
        const baseH = 15;
        const bottomGeo = new THREE.CylinderGeometry(10, 22, baseH, 4, 3, true);
        const bottomMesh = new THREE.Mesh(bottomGeo, eiffelMat);
        bottomMesh.position.y = baseH / 2;
        group.add(bottomMesh);

        // Arch visual details
        const archGeo = new THREE.TorusGeometry(12, 1, 8, 8, Math.PI);
        const arch = new THREE.Mesh(archGeo, new THREE.MeshBasicMaterial({ color: 0xcc6600, wireframe: true }));
        arch.position.set(0, 0, 0);
        group.add(arch);

        // Layer 2: Mid Deck
        const midH = 25;
        const midGeo = new THREE.CylinderGeometry(5, 10, midH, 4, 4, true);
        const midMesh = new THREE.Mesh(midGeo, eiffelMat);
        midMesh.position.y = baseH + midH / 2;
        group.add(midMesh);

        // Layer 3: Spire Top
        const topH = 50;
        const topGeo = new THREE.CylinderGeometry(0.8, 5, topH, 4, 8, true);
        const topMesh = new THREE.Mesh(topGeo, eiffelMat);
        topMesh.position.y = baseH + midH + topH / 2;
        group.add(topMesh);

        // Toggle Eiffel searchlight visible
        if (spotlightRef.current) {
          spotlightRef.current.visible = true;
          spotlightRef.current.color.setHex(0xaaddff);
          spotlightRef.current.position.set(0, baseH + midH + topH, 0);
        }
        break;
      }

      case 'tokyo': {
        // TOKYO TOWER - RED & WHITE COLORED LATTICE
        const redMat = new THREE.MeshBasicMaterial({ color: 0xff3300, wireframe: true, transparent: true, opacity: 0.75 });
        const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

        const sections = 5;
        const sectionH = 18;
        
        for (let i = 0; i < sections; i++) {
          const lowerW = 18 - i * 3.5;
          const upperW = 18 - (i + 1) * 3.5;
          const geo = new THREE.CylinderGeometry(upperW, lowerW, sectionH, 4, 3, true);
          const mat = i % 2 === 0 ? redMat : whiteMat;
          
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = i * sectionH + sectionH / 2;
          group.add(mesh);

          // Tower observation decks
          if (i === 1 || i === 3) {
            const deckGeo = new THREE.BoxGeometry(lowerW * 1.3, 1.5, lowerW * 1.3);
            const deckMesh = new THREE.Mesh(deckGeo, new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true }));
            deckMesh.position.y = i * sectionH;
            group.add(deckMesh);
          }
        }

        // Long antenna top spire
        const spineH = 22;
        const spine = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.8, spineH, 4, 3, true),
          whiteMat
        );
        spine.position.y = sections * sectionH + spineH / 2;
        group.add(spine);

        // Enable red rotational sweep beacon
        if (spotlightRef.current) {
          spotlightRef.current.visible = true;
          spotlightRef.current.color.setHex(0xff1133);
          spotlightRef.current.position.set(0, sections * sectionH + 2, 0);
        }
        break;
      }

      case 'bridge': {
        // GOLDEN GATE BRIDGE TOWERS SILHOUETTE
        const steelColor = 0xe84128; // International Orange
        const bridgeMat = new THREE.MeshBasicMaterial({ color: steelColor, wireframe: true });

        // Left Tower
        const buildTower = (offsetZ: number) => {
          const towerH = 65;
          const pillarGeo = new THREE.BoxGeometry(3, towerH, 3);
          
          const p1 = new THREE.Mesh(pillarGeo, bridgeMat);
          p1.position.set(-8, towerH / 2, offsetZ);
          group.add(p1);

          const p2 = new THREE.Mesh(pillarGeo, bridgeMat);
          p2.position.set(8, towerH / 2, offsetZ);
          group.add(p2);

          // Cross beams connecting 2 pillars
          for (let h = 15; h < towerH; h += 15) {
            const crossGeo = new THREE.BoxGeometry(16, 2, 2);
            const cross = new THREE.Mesh(crossGeo, bridgeMat);
            cross.position.set(0, h, offsetZ);
            group.add(cross);
          }
        };

        buildTower(-35);
        buildTower(35);

        // Suspension cable lines dropping down to sea level
        const curvePoints = [];
        for (let z = -60; z <= 60; z += 5) {
          // Parabolic drooping curve
          const yVal = 8 + Math.pow(z / 40, 2) * 25;
          curvePoints.push(new THREE.Vector3(0, yVal, z));
        }
        const splineCurve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(splineCurve, 24, 0.4, 4, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xffeebb, wireframe: true }));
        group.add(tubeMesh);

        // Roadway line indicators
        const roadGeo = new THREE.BoxGeometry(22, 1, 140);
        const road = new THREE.Mesh(roadGeo, new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true }));
        road.position.set(0, 10, 0);
        group.add(road);

        if (spotlightRef.current) spotlightRef.current.visible = false;
        break;
      }
    }
  };

  const clearLandmarkGroup = (group: THREE.Group) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
  };

  // PHYSICS: UPDATE FLYINGprojectiles AND SPARKS EXPLOSION VECTORS
  const updateFireworksPhysics = (delta: number, scene: THREE.Scene) => {
    const list = activeFireworksRef.current;
    
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];

      // STATE A: PROJECTILE ASCENT (LAUNCHING)
      if (f.state === 'ascent') {
        f.position.addScaledVector(f.velocity, delta);
        // Apply wind/drag drift
        f.velocity.y -= f.gravity * 0.15 * delta;

        // Visual rocket rendering point inside scene
        f.mesh.position.copy(f.position);

        // Generate dynamic rocket streamer trails sparks
        const trailSparkle = createTrailSparkle(f.position, f.primaryColor);
        scene.add(trailSparkle);
        activeFireworksRef.current.push({
          state: 'trail_spark',
          mesh: trailSparkle,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            -Math.random() * 8,
            (Math.random() - 0.5) * 4
          ),
          opacity: 1.0,
          decay: 1.8 + Math.random() * 2.0
        });

        // Altitude detonates limit
        if (f.velocity.y <= 0 || f.position.y >= f.altitude) {
          // Detonation triggers!
          scene.remove(f.mesh);
          f.mesh.geometry.dispose();
          f.mesh.material.dispose();

          // Detonate explosion particle array group
          detonateFireworkExplosion(f, scene);
          
          list.splice(i, 1);
        }
      }
      // STATE B: TRAIL SPARKS OR GLOSS ROCKET REMAINS
      else if (f.state === 'trail_spark') {
        f.mesh.position.addScaledVector(f.velocity, delta);
        f.opacity -= f.decay * delta;
        
        if (f.mesh.material) {
          f.mesh.material.opacity = f.opacity;
        }

        if (f.opacity <= 0) {
          scene.remove(f.mesh);
          f.mesh.geometry.dispose();
          f.mesh.material.dispose();
          list.splice(i, 1);
        }
      }
      // STATE C: ACTIVE ACTIVE DETONATED PARTICLES CLOUD
      else if (f.state === 'particles') {
        const positionsAttr = f.geometry.getAttribute('position') as THREE.BufferAttribute;
        const colorsAttr = f.geometry.getAttribute('color') as THREE.BufferAttribute;
        
        let alive = false;
        f.age += delta;

        const count = positionsAttr.count;
        for (let pIdx = 0; pIdx < count; pIdx++) {
          const vx = f.particleVelocities[pIdx * 3];
          const vy = f.particleVelocities[pIdx * 3 + 1];
          const vz = f.particleVelocities[pIdx * 3 + 2];

          // Move coordinate
          let px = positionsAttr.getX(pIdx) + vx * delta;
          let py = positionsAttr.getY(pIdx) + vy * delta;
          let pz = positionsAttr.getZ(pIdx) + vz * delta;

          // Drag resistance deceleration
          f.particleVelocities[pIdx * 3] *= Math.max(0, 1 - 1.2 * delta * f.drag);
          f.particleVelocities[pIdx * 3 + 1] *= Math.max(0, 1 - 1.2 * delta * f.drag);
          f.particleVelocities[pIdx * 3 + 2] *= Math.max(0, 1 - 1.2 * delta * f.drag);

          // Apply Gravity vector downward
          f.particleVelocities[pIdx * 3 + 1] -= f.gravity * delta;

          positionsAttr.setXYZ(pIdx, px, py, pz);

          // Sparkle tail dissipation
          if (f.sparkleType === 'chrysanthemum' && Math.random() < 0.15 * delta && f.age < f.lifetime * 0.7) {
            // Re-boost speed sideways to look crackling
            f.particleVelocities[pIdx * 3] += (Math.random() - 0.5) * 10;
            f.particleVelocities[pIdx * 3 + 2] += (Math.random() - 0.5) * 10;
          }
        }

        positionsAttr.needsUpdate = true;

        // Custom opacity transition over time
        const lifeRatio = f.age / f.lifetime;
        f.material.opacity = Math.max(0, 1.0 - lifeRatio);
        f.material.size = f.size * Math.max(0.1, 1.0 - lifeRatio * 0.6);

        // Water reflection dynamic updates vertically
        if (f.reflectionPoints) {
          const reflPositions = f.reflectionGeometry.getAttribute('position') as THREE.BufferAttribute;
          for (let pIdx = 0; pIdx < count; pIdx++) {
            const rx = positionsAttr.getX(pIdx);
            // Inverted vertical reflect below zero waterplane
            const ry = -positionsAttr.getY(pIdx) + (Math.sin(timeOfDaySineValueRef() + rx) * 0.2);
            const rz = positionsAttr.getZ(pIdx);
            reflPositions.setXYZ(pIdx, rx, ry, rz);
          }
          reflPositions.needsUpdate = true;
          f.reflectionMaterial.opacity = atmosphere.reflectionIntensity * Math.max(0, 0.4 - lifeRatio * 0.4);
          f.reflectionMaterial.size = f.size * 0.9;
        }

        if (lifeRatio < 1.0) {
          alive = true;
        }

        if (!alive) {
          scene.remove(f.pointsObj);
          f.geometry.dispose();
          f.material.dispose();

          if (f.reflectionPoints) {
            scene.remove(f.reflectionPoints);
            f.reflectionGeometry.dispose();
            f.reflectionMaterial.dispose();
          }

          list.splice(i, 1);
        }
      }
    }

    // Set count for debugging screen stats (Active particles)
    let totalP = 0;
    for (const f of list) {
      if (f.state === 'particles') {
        totalP += f.geometry.getAttribute('position').count;
      } else {
        totalP += 1;
      }
    }
    setActiveParticlesCount(totalP);
  };

  // Helper values reference
  const timeOfDaySineValueRef = () => {
    return (Date.now() / 1500) % (Math.PI * 2);
  };

  // Generate Ascent Single Projectile Rocket Mesh
  const createTrailSparkle = (pos: THREE.Vector3, colHex: string) => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([pos.x, pos.y, pos.z]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Tiny size material sparkles
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colHex),
      size: 0.8 + Math.random() * 1.2,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return new THREE.Points(geo, mat);
  };

  // PHYSICS: DETONATE FIREWORK AND ALLOCATE PARTICLE BUFFERS
  const detonateFireworkExplosion = (f: any, scene: THREE.Scene) => {
    // Generate boom synthesize audio trigger
    audio.playExplosion(f.type, f.volumeScale);

    const N = f.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);

    const colPrimary = new THREE.Color(f.primaryColor);
    const colSecondary = new THREE.Color(f.secondaryColor);

    // Draft physics shape distribution paths
    for (let i = 0; i < N; i++) {
      // Base origin
      positions[i * 3] = f.position.x;
      positions[i * 3 + 1] = f.position.y;
      positions[i * 3 + 2] = f.position.z;

      // Color variation blending percentage
      const blend = Math.random();
      const currentC = colPrimary.clone().lerp(colSecondary, blend);
      colors[i * 3] = currentC.r;
      colors[i * 3 + 1] = currentC.g;
      colors[i * 3 + 2] = currentC.b;

      // Directions based on styles
      let dir = new THREE.Vector3();

      if (f.type === 'peony' || f.type === 'chrysanthemum') {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2 * Math.PI;
        const phi = Math.acos(2 * v - 1);
        
        const speed = (0.5 + Math.random() * 0.5) * f.speed;
        dir.set(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        ).multiplyScalar(speed);
      }
      else if (f.type === 'heart') {
        // Parametric heart formula applied as directional velocities
        const t = (i / N) * Math.PI * 2;
        const vx = 16 * Math.pow(Math.sin(t), 3);
        const vy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const vz = (Math.random() - 0.5) * 5;
        
        dir.set(vx, vy, vz).normalize().multiplyScalar((0.8 + Math.random() * 0.4) * f.speed * 0.9);
      }
      else if (f.type === 'ring') {
        // Flat horizontal ring expansion with vertical noise
        const theta = (i / N) * Math.PI * 2;
        const rx = Math.cos(theta);
        const rz = Math.sin(theta);
        const speed = (0.95 + Math.random() * 0.1) * f.speed;
        
        dir.set(rx, (Math.random() - 0.5) * 0.1, rz).normalize().multiplyScalar(speed * 1.2);
      }
      else if (f.type === 'crossette') {
        // Cross bursts directions aligned to primary axes + noise
        const axisIndex = i % 6;
        const speed = f.speed * (0.85 + Math.random() * 0.2);
        if (axisIndex === 0) dir.set(1, 0, 0);
        else if (axisIndex === 1) dir.set(-1, 0, 0);
        else if (axisIndex === 2) dir.set(0, 1, 0);
        else if (axisIndex === 3) dir.set(0, -1, 0);
        else if (axisIndex === 4) dir.set(0, 0, 1);
        else dir.set(0, 0, -1);

        dir.add(new THREE.Vector3((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25));
        dir.normalize().multiplyScalar(speed);
      }
      else if (f.type === 'streamer') {
        // Particles form long trailing arcs falling like willow weeping
        const theta = Math.random() * Math.PI * 2;
        const r = Math.sin(Math.random() * Math.PI / 2); // Downward concentrated
        const vx = Math.cos(theta) * r;
        const vz = Math.sin(theta) * r;
        const vy = Math.cos(Math.random() * Math.PI / 2) * 0.25; // Mostly horizontal & downwards
        
        dir.set(vx, vy, vz).normalize().multiplyScalar((0.3 + Math.random() * 0.8) * f.speed * 1.15);
      }
      else if (f.type === 'fountain') {
        // Shoots particles straight up like flare fountain
        dir.set(
          (Math.random() - 0.5) * 3,
          10 + Math.random() * 12,
          (Math.random() - 0.5) * 3
        ).normalize().multiplyScalar((0.5 + Math.random() * 0.8) * f.speed * 1.4);
      }

      velocities[i * 3] = dir.x;
      velocities[i * 3 + 1] = dir.y;
      velocities[i * 3 + 2] = dir.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow transparent particles shader
    const material = new THREE.PointsMaterial({
      size: f.size,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointsObj = new THREE.Points(geometry, material);
    scene.add(pointsObj);

    // WATER REFLECTION POINT CLOUD SETTINGS
    let reflectionPoints: THREE.Points | null = null;
    let reflectionGeometry = new THREE.BufferGeometry();
    let reflectionMaterial = new THREE.PointsMaterial({
      size: f.size * 0.8,
      vertexColors: true,
      transparent: true,
      opacity: atmosphere.reflectionIntensity * 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    if (atmosphere.reflectionIntensity > 0) {
      const reflPositions = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        reflPositions[i * 3] = positions[i * 3];
        reflPositions[i * 3 + 1] = -positions[i * 3 + 1]; // Inverted height
        reflPositions[i * 3 + 2] = positions[i * 3 + 2];
      }
      reflectionGeometry.setAttribute('position', new THREE.BufferAttribute(reflPositions, 3));
      reflectionGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      reflectionPoints = new THREE.Points(reflectionGeometry, reflectionMaterial);
      scene.add(reflectionPoints);
    }

    // Push into engine physics tracking list
    activeFireworksRef.current.push({
      state: 'particles',
      geometry,
      material,
      pointsObj,
      reflectionGeometry,
      reflectionMaterial,
      reflectionPoints,
      particleVelocities: velocities,
      drag: f.type === 'chrysanthemum' ? 0.05 : 0.018,
      gravity: f.gravity * (f.type === 'streamer' ? 22 : 9.8),
      lifetime: f.type === 'streamer' ? 1.8 + Math.random() * 1.5 : 1.3 + Math.random() * 0.9,
      size: f.size,
      age: 0,
      sparkleType: f.type
    });
  };

  // PHYSICS: FLIGHT AND ROTOR VIBRATION CONTROLLER FOR ACTIVE DRONES
  const updateDronesPhysics = (time: number, delta: number) => {
    const list = dronesRef.current;
    const count = list.positions.length;
    if (count === 0 || !dronePointsRef.current) return;

    const positionsArr = new Float32Array(count * 3);
    const colorsArr = new Float32Array(count * 3);

    // Adjust variables based on user parameters
    const speedCoeff = droneParams.flyingSpeed * 1.2;

    for (let i = 0; i < count; i++) {
      const pos = list.positions[i];
      const target = list.targets[i];
      const speedRandomizer = list.randomSpeeds[i];

      // Standard distance vector
      const dist = pos.distanceTo(target);

      if (dist > 0.1) {
        // Move towards target coordinates using custom interpolation
        // Speed up when far away, slow down as they approach the formation gracefully
        const step = Math.min(speedCoeff * delta * speedRandomizer * (0.15 + dist * 0.18), dist);
        const dir = new THREE.Vector3().subVectors(target, pos).normalize();
        pos.addScaledVector(dir, step);
      } else {
        // Elegant hover state micro-vibrations simulating physical wind/rotor drafts
        const hoverWaveX = Math.sin(time * 0.0035 + i * 0.5) * 0.04;
        const hoverWaveY = Math.cos(time * 0.0028 + i * 0.8) * 0.05;
        const hoverWaveZ = Math.sin(time * 0.0019 + i * 1.1) * 0.03;
        pos.x += hoverWaveX;
        pos.y += hoverWaveY;
        pos.z += hoverWaveZ;
      }

      positionsArr[i * 3] = pos.x;
      positionsArr[i * 3 + 1] = pos.y;
      positionsArr[i * 3 + 2] = pos.z;

      // Map color bytes to list
      const col = list.colors[i];
      colorsArr[i * 3] = col.r;
      colorsArr[i * 3 + 1] = col.g;
      colorsArr[i * 3 + 2] = col.b;
    }

    // Commit positions to WebGL BufferAttributes
    const geom = dronePointsRef.current.geometry;
    geom.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
    geom.getAttribute('position').needsUpdate = true;
    geom.getAttribute('color').needsUpdate = true;
  };

  // Launch a new firework from specific positions depending on presets
  const triggerFirework = (launchPosOverride: THREE.Vector3 | null) => {
    if (!sceneRef.current) return;

    // Acknowledge custom callback to notify active user counter
    onFireworkLaunched();

    // Determine launch position
    let launchX = (Math.random() - 0.5) * 60;
    let launchY = 0.5;
    let launchZ = (Math.random() - 0.5) * 60;

    let targetH = fireworkParams.altitude + (Math.random() - 0.5) * 20;

    // If landmark shoots custom fireworks:
    if (!launchPosOverride) {
      if (landmarkId === 'taipei101') {
        const shootFromBalconies = Math.random() < 0.6;
        if (shootFromBalconies) {
          // Shoot sideways from台北101 mid balconies sections! Very visual!
          const tier = Math.floor(Math.random() * 8);
          const heightLevel = 5 + tier * 8 + 4;
          launchX = (Math.random() > 0.5 ? 1 : -1) * 4.5;
          launchY = heightLevel;
          launchZ = (Math.random() > 0.5 ? 1 : -1) * 4.5;

          // Shoots outward sideways velocity!
          const rocketVel = new THREE.Vector3(launchX * 1.5, 25 + Math.random() * 8, launchZ * 1.5);
          createAscentRocket(new THREE.Vector3(launchX, launchY, launchZ), rocketVel, heightLevel + 15 + Math.random() * 15);
          return;
        }
      } else if (landmarkId === 'eiffel') {
        const shootFromSpire = Math.random() < 0.35;
        if (shootFromSpire) {
          launchX = 0;
          launchY = 90; // Eiffel pinnacle tip
          launchZ = 0;
          
          const rocketVel = new THREE.Vector3((Math.random() - 0.5) * 8, 40 + Math.random() * 10, (Math.random() - 0.5) * 8);
          createAscentRocket(new THREE.Vector3(launchX, launchY, launchZ), rocketVel, launchY + 25 + Math.random() * 15);
          return;
        }
      }
    }

    const startPos = launchPosOverride || new THREE.Vector3(launchX, launchY, launchZ);
    // Vertical ascending speed calculations
    const rocketVel = new THREE.Vector3(
      (Math.random() - 0.5) * 15, // Sideways drift
      68 + Math.random() * 20,     // Primary upwards speed
      (Math.random() - 0.5) * 15
    );

    createAscentRocket(startPos, rocketVel, targetH);
  };

  const createAscentRocket = (startPos: THREE.Vector3, velocity: THREE.Vector3, altitude: number) => {
    if (!sceneRef.current) return;

    // Play soaring whistling launch audio
    if (fireworkParams.soundEnabled) {
      audio.playLaunch(1.0);
    }

    // Render single glowing rocket tip particle
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([startPos.x, startPos.y, startPos.z]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(fireworkParams.primaryColor),
      size: 2.5,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });
    const rocketMesh = new THREE.Points(geo, mat);
    sceneRef.current.add(rocketMesh);

    // Add into active tracking arrays
    activeFireworksRef.current.push({
      state: 'ascent',
      position: startPos.clone(),
      velocity: velocity.clone(),
      altitude,
      gravity: fireworkParams.gravity,
      primaryColor: fireworkParams.primaryColor,
      secondaryColor: fireworkParams.secondaryColor,
      particleCount: fireworkParams.particleCount,
      size: fireworkParams.size,
      speed: fireworkParams.speed,
      type: fireworkParams.type,
      mesh: rocketMesh,
      volumeScale: fireworkParams.soundVolume
    });
  };

  // Launch a cascade of level-bursting quick shows
  const handleSimulateFullShow = () => {
    if (!sceneRef.current) return;
    
    // Launch a series of 6 synchronized fireworks with delay loops!
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const customX = (Math.random() - 0.5) * 80;
        const customZ = (Math.random() - 0.5) * 80;
        const customCol = ['#ff2255', '#22ff88', '#ffff22', '#22aaff', '#ff9922', '#e222ff'][i];
        
        triggerWithCustomColor(new THREE.Vector3(customX, 0.5, customZ), customCol);
      }, i * 450);
    }
  };

  const triggerWithCustomColor = (startPos: THREE.Vector3, color: string) => {
    if (!sceneRef.current) return;
    onFireworkLaunched();
    
    if (fireworkParams.soundEnabled) {
       audio.playLaunch(0.9);
    }

    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([startPos.x, startPos.y, startPos.z]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 2.5,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });
    const rocketMesh = new THREE.Points(geo, mat);
    sceneRef.current.add(rocketMesh);

    activeFireworksRef.current.push({
      state: 'ascent',
      position: startPos.clone(),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 12, 72 + Math.random() * 15, (Math.random() - 0.5) * 12),
      altitude: 45 + Math.random() * 25,
      gravity: fireworkParams.gravity,
      primaryColor: color,
      secondaryColor: '#ffffff',
      particleCount: fireworkParams.particleCount,
      size: fireworkParams.size,
      speed: fireworkParams.speed,
      type: fireworkParams.type,
      mesh: rocketMesh,
      volumeScale: fireworkParams.soundVolume
    });
  };

  const enableAudioFirstTime = () => {
    setSoundWarn(false);
    audio.playExplosion('peony', 0.2);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#000000] border border-[#2A2A2E] rounded overflow-hidden shadow-2xl" id="panel_3d_viewport">
      {/* Top dashboard info widget overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none" id="viewport_telemetry">
        <div className="px-2 py-1 bg-[#141417]/95 border border-[#2A2A2E] flex items-center gap-1.5 text-[9px] font-mono text-cyan-300 rounded shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          FPS: {fps}
        </div>
        <div className="px-2 py-1 bg-[#141417]/95 border border-[#2A2A2E] text-[9px] font-mono text-indigo-400 rounded shadow-md">
          {lang === 'zh-TW' ? '活躍粒子' : 'ACTIVE'}: {activeParticlesCount} P
        </div>
        <div className="px-2 py-1 bg-[#141417]/95 border border-[#2A2A2E] text-[9px] font-mono text-gray-400 rounded shadow-md">
          {lang === 'zh-TW' ? '視距' : 'RANGE'}: {cameraDistance}m
        </div>
      </div>

      {/* Floating sound permission alert */}
      {soundWarn && (
        <div className="absolute top-3 right-3 z-20" id="sound_activation_block">
          <button
            onClick={enableAudioFirstTime}
            className="px-3 py-1 bg-[#1C2C1D] border border-emerald-500 text-white rounded text-[10px] font-mono uppercase tracking-tight flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-950/20"
          >
            <Volume2 className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
            {lang === 'zh-TW' ? '啟動音效系統' : 'Enable Audio System'}
          </button>
        </div>
      )}

      {/* Primary Rendering WebGL HTML5 canvas */}
      <div className="flex-1 w-full h-full" ref={containerRef} id="canvas_viewport_wrap">
        <canvas className="w-full h-full cursor-grab active:cursor-grabbing block" ref={canvasRef} />
      </div>

      {/* Interactive HUD instructions & controls on deck bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 p-2.5 bg-[#141417]/95 border border-[#2A2A2E] rounded flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-auto" id="viewport_hud_bar">
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1 uppercase tracking-tight w-full">
            <span className="px-1 py-0.5 bg-[#2A2A2E] text-cyan-400 rounded border border-slate-700 font-mono text-[9px]">W</span>
            <span className="px-1 py-0.5 bg-[#2A2A2E] text-cyan-400 rounded border border-slate-700 font-mono text-[9px]">A</span>
            <span className="px-1 py-0.5 bg-[#2A2A2E] text-cyan-400 rounded border border-slate-700 font-mono text-[9px]">S</span>
            <span className="px-1 py-0.5 bg-[#2A2A2E] text-cyan-400 rounded border border-slate-700 font-mono text-[9px]">D</span>
            <span className="ml-1">{lang === 'zh-TW' ? '鍵盤移動相機 | 滑鼠拖曳旋轉星空三維視角' : 'Keys Move Observer | Drag Mouse to Rotate Sphere'}</span>
          </div>
          <div className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">
            {lang === 'zh-TW' ? (
              <>
                按下 <kbd className="px-1 py-0.2 bg-[#2A2A2E] rounded border border-slate-700 text-cyan-300 text-[9px] font-mono">空白鍵</kbd> 直接發射煙火 // 按下 <kbd className="px-1 py-0.2 bg-[#2A2A2E] rounded border border-slate-700 text-cyan-300 text-[9px]">R</kbd> 鍵還原相機視角
              </>
            ) : (
              <>
                Press <kbd className="px-1 py-0.2 bg-[#2A2A2E] rounded border border-slate-700 text-cyan-300 text-[9px] font-mono">SPACEBAR</kbd> to Launch Shell // Press <kbd className="px-1 py-0.2 bg-[#2A2A2E] rounded border border-slate-700 text-cyan-300 text-[9px]">R</kbd> to Reset Vector Angle
              </>
            )}
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex items-center gap-1.5 self-end md:self-auto" id="hud_action_buttons">
          <button
            onClick={() => triggerFirework(null)}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[10px] rounded uppercase font-semibold flex items-center gap-1 cursor-pointer transition-all font-mono"
            id="btn_trigger_single"
          >
            <Play className="w-3 h-3 fill-current" />
            {lang === 'zh-TW' ? '單發煙火' : 'Launch Single'}
          </button>
          <button
            onClick={handleSimulateFullShow}
            className="px-2.5 py-1 bg-slate-900 border border-[#2A2A2E] hover:border-slate-500 hover:bg-slate-800 text-teal-300 text-[10px] rounded uppercase font-semibold flex items-center gap-1 transition-all font-mono"
            id="btn_trigger_show"
          >
            {lang === 'zh-TW' ? '自動連續秀' : 'Continuous Show'}
          </button>
          
          <div className="w-px h-4 bg-[#2A2A2E] mx-1" />

          {/* Clean Drones Fast Toggler */}
          <button
            onClick={() => setDronesActive(!dronesActive)}
            className={`px-2 py-1 text-[10px] rounded flex items-center gap-1 transition-all uppercase font-mono ${
              dronesActive 
                ? 'bg-[#142A22] border border-teal-500 text-teal-300 shadow shadow-teal-950/35'
                : 'bg-slate-900 border border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-slate-850'
            }`}
            id="btn_hud_drones"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${dronesActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-650'}`} />
            {lang === 'zh-TW' ? '無人機編隊開啟' : 'Swarms Active'}
          </button>
        </div>
      </div>
    </div>
  );
}
