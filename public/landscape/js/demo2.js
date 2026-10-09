createLandscape({
  palleteImage: 'img/pallete6.png'
});

function createLandscape(params) {
  var container = document.querySelector(".landscape");
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene, renderer, camera;
  var terrain;
  var trophyGroup, sunFlareMesh, godRaysMesh, particleSystem;
  var particlePositions, particleAlphas;
  var PARTICLE_COUNT = 60;

  var mouse = { x: 0, y: 0, xDamped: 0, yDamped: 0 };
  var isMobile = typeof window.orientation !== 'undefined' || width < 768;

  init();

  function init() {
    sceneSetup();
    sceneElements();
    sceneTextures();
    setupTrophyAndAtmosphere();
    render();

    if (isMobile) {
      window.addEventListener("touchmove", onInputMove, { passive: false });
    } else {
      window.addEventListener("mousemove", onInputMove);
    }

    window.addEventListener("resize", resize);
    resize();
  }

  function sceneSetup() {
    scene = new THREE.Scene();

    // ─── 1. ATMOSPHERIC ROYAL BLUE TO GOLDEN SUNRISE SKY ─────────────
    var skyCanvas = document.createElement('canvas');
    skyCanvas.width = 1024;
    skyCanvas.height = 1024;
    var sctx = skyCanvas.getContext('2d');
    var sgrad = sctx.createLinearGradient(0, 0, 0, 1024);
    sgrad.addColorStop(0.00, '#07152E'); // Deep Navy Zenith (#07152E)
    sgrad.addColorStop(0.35, '#0b244d'); // Rich Deep Blue
    sgrad.addColorStop(0.60, '#123D7A'); // Royal Blue (#123D7A)
    sgrad.addColorStop(0.78, '#1e5299'); // Atmospheric Azure
    sgrad.addColorStop(0.88, '#85631a'); // Warm Bronze / Amber
    sgrad.addColorStop(0.96, '#d4af37'); // Metallic Gold Horizon Glow (#D4AF37)
    sgrad.addColorStop(1.00, '#f7f8fc'); // Warm White Horizon Light (#F7F8FC)
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 1024, 1024);

    // Subtle star dust in upper royal navy sky
    sctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (var i = 0; i < 90; i++) {
      var sx = Math.random() * 1024;
      var sy = Math.random() * 480;
      var sr = Math.random() * 1.6 + 0.4;
      sctx.beginPath();
      sctx.arc(sx, sy, sr, 0, Math.PI * 2);
      sctx.fill();
    }

    var skyTexture = new THREE.CanvasTexture(skyCanvas);
    scene.background = skyTexture;

    // Atmospheric Fog (blends distant terrain into royal navy)
    var fogColor = new THREE.Color(0x07152e);
    scene.fog = new THREE.Fog(fogColor, 40, 480);

    // Camera setup
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.y = 8;
    camera.position.z = 4;

    // ─── 2. CINEMATIC THREE-POINT LIGHTING ────────────────────────────
    // Key Light: Warm directional light onto trophy & terrain
    var keyLight = new THREE.DirectionalLight(0xfff5e6, 2.1);
    keyLight.position.set(-25, 55, 25);
    scene.add(keyLight);

    // Rim Light: Subtle royal blue / cyan rim light separating trophy from background
    var rimLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    rimLight.position.set(0, 25, -115);
    scene.add(rimLight);

    // Fill Light: Soft metallic gold bounce
    var fillLight = new THREE.DirectionalLight(0xd4af37, 0.9);
    fillLight.position.set(20, -5, 15);
    scene.add(fillLight);

    // Ambient Light: Soft warm slate/sapphire ambient
    var ambientLight = new THREE.AmbientLight(0xdde5f4, 1.1);
    scene.add(ambientLight);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: container,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
  }

  function sceneElements() {
    var geometry = new THREE.PlaneBufferGeometry(100, 400, 400, 400);

    var uniforms = {
      time: { type: "f", value: 0.0 },
      distortCenter: { type: "f", value: 0.1 },
      roadWidth: { type: "f", value: 0.5 },
      pallete: { type: "t", value: null },
      speed: { type: "f", value: 1 },
      maxHeight: { type: "f", value: 10.0 },
      color: new THREE.Color(1, 1, 1),
      fogColor: { type: "c", value: new THREE.Color(0x0e274f) },
      fogNear: { type: "f", value: 40.0 },
      fogFar: { type: "f", value: 480.0 }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.ShaderLib.basic.uniforms, uniforms]),
      vertexShader: document.getElementById('custom-vertex').textContent,
      fragmentShader: document.getElementById('custom-fragment').textContent,
      wireframe: false,
      fog: true
    });

    terrain = new THREE.Mesh(geometry, material);
    terrain.position.z = -180;
    terrain.rotation.x = -Math.PI / 2;

    scene.add(terrain);
  }

  function sceneTextures() {
    new THREE.TextureLoader().load(params.palleteImage, function(texture) {
      terrain.material.uniforms.pallete.value = texture;
      terrain.material.needsUpdate = true;
    });
  }

  // ─── 3. PROCEDURAL 3D CHAMPIONSHIP TROPHY & HORIZON ATMOSPHERE ───────
  function setupTrophyAndAtmosphere() {
    // A. Procedural Gold Reflection Environment Map
    var envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    var ectx = envCanvas.getContext('2d');
    var egrad = ectx.createLinearGradient(0, 0, 0, 256);
    egrad.addColorStop(0.00, '#0a1d42'); // Royal Navy
    egrad.addColorStop(0.35, '#1e40af'); // Vivid Sapphire
    egrad.addColorStop(0.48, '#60a5fa'); // Sky Glint
    egrad.addColorStop(0.52, '#fffbeb'); // Specular Sun Hotspot
    egrad.addColorStop(0.58, '#f59e0b'); // Radiant Horizon Gold
    egrad.addColorStop(0.72, '#b45309'); // Amber Bronze
    egrad.addColorStop(1.00, '#1c1917'); // Dark Foundation
    ectx.fillStyle = egrad;
    ectx.fillRect(0, 0, 512, 256);

    // Warm specular streak reflections
    ectx.fillStyle = 'rgba(255, 245, 215, 0.9)';
    ectx.fillRect(90, 124, 150, 12);
    ectx.fillRect(310, 128, 130, 9);

    var envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    // Materials
    var goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,       // Authentic Metallic Gold #D4AF37
      emissive: 0x1f1402,    // Subtle warm bronze depth
      roughness: 0.22,       // Refined dimensional metallic finish
      metalness: 0.88,       // High metallic sheen
      envMap: envTexture,
      envMapIntensity: 1.8
    });

    var baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x07152e,       // Deep navy foundation plinth (#07152E)
      roughness: 0.32,
      metalness: 0.70,
      envMap: envTexture,
      envMapIntensity: 1.0
    });

    var glowingGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x8c6d1f,
      emissiveIntensity: 0.35,
      roughness: 0.24,
      metalness: 0.85,
      envMap: envTexture,
      envMapIntensity: 1.8
    });

    // B. Build Trophy Geometry Hierarchy
    trophyGroup = new THREE.Group();

    // 1. Lower Plinth (Pedestal Base)
    var lowerBaseGeo = new THREE.CylinderBufferGeometry(6.4, 7.0, 1.8, 32);
    var lowerBase = new THREE.Mesh(lowerBaseGeo, baseMaterial);
    lowerBase.position.y = -7.5;
    trophyGroup.add(lowerBase);

    // Bottom Gold Trim Ring
    var bottomRingGeo = new THREE.TorusBufferGeometry(6.6, 0.28, 16, 48);
    var bottomRing = new THREE.Mesh(bottomRingGeo, goldMaterial);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = -8.3;
    trophyGroup.add(bottomRing);

    // Middle Stepped Gold Pedestal Tier
    var midBaseGeo = new THREE.CylinderBufferGeometry(5.2, 5.8, 1.2, 32);
    var midBase = new THREE.Mesh(midBaseGeo, goldMaterial);
    midBase.position.y = -6.1;
    trophyGroup.add(midBase);

    // Upper Obsidian Plinth Tier
    var upperBaseGeo = new THREE.CylinderBufferGeometry(4.3, 4.8, 1.0, 32);
    var upperBase = new THREE.Mesh(upperBaseGeo, baseMaterial);
    upperBase.position.y = -5.0;
    trophyGroup.add(upperBase);

    // Front Inscription Plaque
    var plaqueGeo = new THREE.BoxBufferGeometry(4.2, 1.0, 0.4);
    var plaque = new THREE.Mesh(plaqueGeo, glowingGoldMaterial);
    plaque.position.set(0, -6.1, 5.7);
    trophyGroup.add(plaque);

    // 2. Laurel Garland Ring & Stem
    var stemCollarGeo = new THREE.TorusBufferGeometry(2.8, 0.3, 16, 32);
    var stemCollar = new THREE.Mesh(stemCollarGeo, goldMaterial);
    stemCollar.rotation.x = Math.PI / 2;
    stemCollar.position.y = -4.4;
    trophyGroup.add(stemCollar);

    var laurelRing = new THREE.Group();
    laurelRing.position.y = -4.3;
    var leafGeo = new THREE.CylinderBufferGeometry(0.08, 0.35, 1.4, 8);
    leafGeo.scale(1, 1, 0.25);
    for (var i = 0; i < 20; i++) {
      var angle = (i / 20) * Math.PI * 2;
      var leaf = new THREE.Mesh(leafGeo, glowingGoldMaterial);
      leaf.position.set(Math.cos(angle) * 3.1, 0, Math.sin(angle) * 3.1);
      leaf.rotation.y = -angle;
      leaf.rotation.z = (i % 2 === 0 ? 0.45 : -0.45);
      laurelRing.add(leaf);
    }
    trophyGroup.add(laurelRing);

    // Fluted Central Baluster Stem
    var nodeGeo = new THREE.CylinderBufferGeometry(2.0, 3.0, 3.0, 24);
    var stemNode = new THREE.Mesh(nodeGeo, goldMaterial);
    stemNode.position.y = -2.8;
    trophyGroup.add(stemNode);

    var stemUpperGeo = new THREE.TorusBufferGeometry(2.3, 0.28, 16, 32);
    var stemUpper = new THREE.Mesh(stemUpperGeo, goldMaterial);
    stemUpper.rotation.x = Math.PI / 2;
    stemUpper.position.y = -1.2;
    trophyGroup.add(stemUpper);

    // 3. The Grand Championship Cup (Chalice / Bowl with LatheBufferGeometry)
    var cupPoints = [
      new THREE.Vector2(1.8, 0.0),
      new THREE.Vector2(2.4, 0.8),
      new THREE.Vector2(3.6, 2.2),
      new THREE.Vector2(5.0, 4.2),
      new THREE.Vector2(6.2, 6.8),
      new THREE.Vector2(6.8, 9.6),
      new THREE.Vector2(6.6, 11.8),
      new THREE.Vector2(7.2, 13.2),
      new THREE.Vector2(7.6, 13.8),
      new THREE.Vector2(7.2, 14.0),
      new THREE.Vector2(6.8, 13.6),
      new THREE.Vector2(6.2, 11.8),
      new THREE.Vector2(5.6, 9.2),
      new THREE.Vector2(4.4, 6.0),
      new THREE.Vector2(2.6, 3.2),
      new THREE.Vector2(0.8, 1.8),
      new THREE.Vector2(0.0, 1.6)
    ];
    var cupGeo = new THREE.LatheBufferGeometry(cupPoints, 48);
    var cupMesh = new THREE.Mesh(cupGeo, goldMaterial);
    cupMesh.position.y = -1.2;
    trophyGroup.add(cupMesh);

    // Belly Accent Ring
    var bellyRingGeo = new THREE.TorusBufferGeometry(6.4, 0.22, 16, 48);
    var bellyRing = new THREE.Mesh(bellyRingGeo, glowingGoldMaterial);
    bellyRing.rotation.x = Math.PI / 2;
    bellyRing.position.y = 5.2;
    trophyGroup.add(bellyRing);

    // Front Victory Medallion Crest with Star
    var crestGeo = new THREE.CylinderBufferGeometry(1.6, 1.7, 0.35, 24);
    var crest = new THREE.Mesh(crestGeo, glowingGoldMaterial);
    crest.rotation.x = Math.PI / 2;
    crest.position.set(0, 4.8, 6.55);
    trophyGroup.add(crest);

    var crestStarGeo = new THREE.OctahedronBufferGeometry(0.8, 0);
    var crestStar = new THREE.Mesh(crestStarGeo, goldMaterial);
    crestStar.scale.set(1, 1, 0.3);
    crestStar.position.set(0, 4.8, 6.8);
    trophyGroup.add(crestStar);

    // 4. Twin Sweeping Olympian Scroll Handles
    function createHandle(isLeft) {
      var sign = isLeft ? -1 : 1;
      var handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sign * 6.8, 12.6, 0.0),
        new THREE.Vector3(sign * 9.6, 14.4, 0.2),
        new THREE.Vector3(sign * 11.2, 11.2, 0.0),
        new THREE.Vector3(sign * 10.4, 7.2, 0.0),
        new THREE.Vector3(sign * 8.4, 4.2, 0.0),
        new THREE.Vector3(sign * 5.4, 3.6, 0.0)
      ]);
      var handleGeo = new THREE.TubeBufferGeometry(handleCurve, 36, 0.44, 16, false);
      var handleMesh = new THREE.Mesh(handleGeo, goldMaterial);

      var rosetteGeo = new THREE.SphereBufferGeometry(0.75, 16, 16);
      var rosette = new THREE.Mesh(rosetteGeo, glowingGoldMaterial);
      rosette.position.set(sign * 9.5, 14.3, 0.2);

      var hGroup = new THREE.Group();
      hGroup.add(handleMesh);
      hGroup.add(rosette);
      return hGroup;
    }
    trophyGroup.add(createHandle(true));
    trophyGroup.add(createHandle(false));

    // 5. Crowning Floating Victory Star
    var crownStarGeo = new THREE.OctahedronBufferGeometry(1.6, 0);
    var crownStar = new THREE.Mesh(crownStarGeo, glowingGoldMaterial);
    crownStar.position.y = 15.6;
    trophyGroup.add(crownStar);

    var crownStar2 = new THREE.Mesh(crownStarGeo, goldMaterial);
    crownStar2.scale.set(0.65, 1.3, 0.65);
    crownStar2.rotation.y = Math.PI / 4;
    crownStar2.position.y = 15.6;
    trophyGroup.add(crownStar2);

    // 6. Luminous Aurora Nimbus Ring (Halo)
    var haloGeo = new THREE.TorusBufferGeometry(9.6, 0.12, 16, 64);
    var haloMat = new THREE.MeshBasicMaterial({
      color: 0xffdf73,
      transparent: true,
      opacity: 0.75
    });
    var halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2 + 0.35;
    halo.position.y = 8.5;
    trophyGroup.add(halo);

    // Trophy Placement in the Sky Above the Horizon
    trophyGroup.position.set(0, 19.5, -95);
    scene.add(trophyGroup);

    trophyGroup.userData = {
      crownStar: crownStar,
      crownStar2: crownStar2,
      halo: halo,
      initialY: 19.5
    };

    // ─── C. RADIANT SUN FLARE BILLBOARD ────────────────────────────────
    var flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    var fctx = flareCanvas.getContext('2d');
    var fgrad = fctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    fgrad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
    fgrad.addColorStop(0.20, 'rgba(255, 246, 214, 0.95)');
    fgrad.addColorStop(0.40, 'rgba(245, 190, 56, 0.75)');
    fgrad.addColorStop(0.65, 'rgba(217, 119, 6, 0.40)');
    fgrad.addColorStop(0.85, 'rgba(30, 58, 138, 0.15)');
    fgrad.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');
    fctx.fillStyle = fgrad;
    fctx.fillRect(0, 0, 256, 256);

    var flareTexture = new THREE.CanvasTexture(flareCanvas);
    var flareGeo = new THREE.PlaneBufferGeometry(75, 75);
    var flareMat = new THREE.MeshBasicMaterial({
      map: flareTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.38
    });
    sunFlareMesh = new THREE.Mesh(flareGeo, flareMat);
    sunFlareMesh.position.set(0, 19.5, -125);
    scene.add(sunFlareMesh);

    // ─── D. VOLUMETRIC GOD RAYS FAN ────────────────────────────────────
    var raysCanvas = document.createElement('canvas');
    raysCanvas.width = 512;
    raysCanvas.height = 512;
    var rctx = raysCanvas.getContext('2d');
    var rgrad = rctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    rgrad.addColorStop(0.0, 'rgba(255, 240, 180, 0.7)');
    rgrad.addColorStop(0.5, 'rgba(245, 190, 56, 0.3)');
    rgrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    rctx.fillStyle = rgrad;

    // Draw 16 soft radial beam wedges
    for (var r = 0; r < 16; r++) {
      var rayAngle = (r / 16) * Math.PI * 2;
      rctx.beginPath();
      rctx.moveTo(256, 256);
      rctx.arc(256, 256, 256, rayAngle - 0.08, rayAngle + 0.08);
      rctx.closePath();
      rctx.fill();
    }

    var raysTexture = new THREE.CanvasTexture(raysCanvas);
    var raysGeo = new THREE.PlaneBufferGeometry(115, 115);
    var raysMat = new THREE.MeshBasicMaterial({
      map: raysTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.20
    });
    godRaysMesh = new THREE.Mesh(raysGeo, raysMat);
    godRaysMesh.position.set(0, 19.5, -124);
    scene.add(godRaysMesh);

    // ─── E. FLOATING GOLDEN CHAMPION PARTICLES ────────────────────────
    var pGeo = new THREE.BufferGeometry();
    particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    particleAlphas = new Float32Array(PARTICLE_COUNT);

    for (var p = 0; p < PARTICLE_COUNT; p++) {
      particlePositions[p * 3 + 0] = (Math.random() - 0.5) * 80;
      particlePositions[p * 3 + 1] = Math.random() * 45 + 5;
      particlePositions[p * 3 + 2] = -40 - Math.random() * 70;
      particleAlphas[p] = Math.random();
    }

    pGeo.addAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Texture
    var pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    var pctx = pCanvas.getContext('2d');
    var pgrad = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pgrad.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
    pgrad.addColorStop(0.4, 'rgba(245, 190, 56, 0.9)');
    pgrad.addColorStop(0.8, 'rgba(217, 119, 6, 0.4)');
    pgrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    pctx.fillStyle = pgrad;
    pctx.fillRect(0, 0, 64, 64);

    var pTexture = new THREE.CanvasTexture(pCanvas);
    var pMat = new THREE.PointsMaterial({
      size: 1.3,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffdf73
    });

    particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    isMobile = typeof window.orientation !== 'undefined' || width < 768;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // Intelligent responsive scaling & position of the championship trophy
    if (trophyGroup) {
      if (width < 640) {
        trophyGroup.scale.setScalar(0.65);
        trophyGroup.position.set(0, 20.2, -95);
        if (trophyGroup.userData) trophyGroup.userData.initialY = 19.2;
        if (sunFlareMesh) sunFlareMesh.position.y = 21.5;
        if (godRaysMesh) godRaysMesh.position.y = 21.5;
      } else if (width < 1024) {
        trophyGroup.scale.setScalar(0.80);
        trophyGroup.position.set(0, 19.2, -95);
        if (trophyGroup.userData) trophyGroup.userData.initialY = 20.2;
        if (sunFlareMesh) sunFlareMesh.position.y = 20.2;
        if (godRaysMesh) godRaysMesh.position.y = 20.2;
      } else {
        trophyGroup.scale.setScalar(0.92);
        trophyGroup.position.set(0, 18.2, -95);
        if (trophyGroup.userData) trophyGroup.userData.initialY = 18.2;
        if (sunFlareMesh) sunFlareMesh.position.y = 19.5;
        if (godRaysMesh) godRaysMesh.position.y = 19.5;
      }
    }
  }

  function onInputMove(e) {
    var x, y;
    if (e.type === "mousemove") {
      x = e.clientX;
      y = e.clientY;
    } else {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    }

    mouse.x = x;
    mouse.y = y;
  }

  function render() {
    requestAnimationFrame(render);

    // Damping mouse for smooth parallax
    mouse.xDamped = lerp(mouse.xDamped, mouse.x, 0.08);
    mouse.yDamped = lerp(mouse.yDamped, mouse.y, 0.08);

    var time = performance.now() * 0.001;

    // Terrain animation
    if (terrain && terrain.material && terrain.material.uniforms) {
      terrain.material.uniforms.time.value = time;
      terrain.material.uniforms.distortCenter.value = Math.sin(time) * 0.1;
      terrain.material.uniforms.maxHeight.value = map(mouse.yDamped, 0, height, 20, 5);
    }

    // Trophy Animation: Stately hover, slow regal rotation & halo spin
    if (trophyGroup && trophyGroup.userData) {
      var initY = trophyGroup.userData.initialY || 19.5;
      trophyGroup.position.y = initY + Math.sin(time * 0.8) * 0.45;
      trophyGroup.rotation.y = Math.sin(time * 0.5) * 0.12 + (mouse.xDamped / width - 0.5) * 0.25;
      trophyGroup.rotation.z = Math.sin(time * 0.4) * 0.02;

      if (trophyGroup.userData.crownStar) {
        trophyGroup.userData.crownStar.rotation.y = time * 0.9;
      }
      if (trophyGroup.userData.crownStar2) {
        trophyGroup.userData.crownStar2.rotation.y = time * 0.9 + Math.PI / 4;
      }
      if (trophyGroup.userData.halo) {
        trophyGroup.userData.halo.rotation.z = time * 0.35;
      }
    }

    // God Rays slow rotation & pulse
    if (godRaysMesh) {
      godRaysMesh.rotation.z = time * 0.025;
      var rayPulse = 1.0 + Math.sin(time * 0.7) * 0.05;
      godRaysMesh.scale.set(rayPulse, rayPulse, 1.0);
    }

    if (sunFlareMesh) {
      var flarePulse = 1.0 + Math.sin(time * 1.1) * 0.04;
      sunFlareMesh.scale.set(flarePulse, flarePulse, 1.0);
    }

    // Golden Champion Dust Particles (rising upward & gentle drift)
    if (particleSystem && particlePositions) {
      var pos = particleSystem.geometry.attributes.position.array;
      for (var p = 0; p < PARTICLE_COUNT; p++) {
        pos[p * 3 + 1] += 0.045; // upward drift
        pos[p * 3 + 0] += Math.sin(time + p) * 0.012; // gentle horizontal sway
        if (pos[p * 3 + 1] > 52) {
          pos[p * 3 + 1] = 6;
          pos[p * 3 + 0] = (Math.random() - 0.5) * 75;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}