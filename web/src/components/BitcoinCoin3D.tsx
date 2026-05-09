"use client";

import { useEffect, useRef } from "react";

function buildFaceTexture(front: boolean): HTMLCanvasElement {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const cx = S / 2;
  const cy = S / 2;

  const radial = ctx.createRadialGradient(cx - 60, cy - 80, 20, cx, cy, S / 2);
  radial.addColorStop(0, "#FFB74D");
  radial.addColorStop(0.45, "#F7931A");
  radial.addColorStop(1, "#9A5A0A");
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(cx, cy, S / 2, 0, Math.PI * 2);
  ctx.fill();

  const sweep = ctx.createLinearGradient(60, 60, S - 60, S - 60);
  sweep.addColorStop(0, "rgba(255,255,255,0.18)");
  sweep.addColorStop(0.5, "rgba(255,255,255,0)");
  sweep.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = sweep;
  ctx.beginPath();
  ctx.arc(cx, cy, S / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,220,140,0.5)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 232, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,200,100,0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 202, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,240,180,0.35)";
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * 218, cy + Math.sin(a) * 218, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (front) {
    ctx.save();
    ctx.shadowColor = "rgba(255, 180, 60, 0.9)";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 290px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", cx + 2, cy + 14);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = "bold 56px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("21,000,000", cx, cy - 24);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "26px monospace";
    ctx.fillText("BTC · MAX SUPPLY", cx, cy + 36);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.font = "bold 60px Arial";
    ctx.fillText("₿", cx, cy - 100);
    ctx.fillText("₿", cx, cy + 120);
  }

  return canvas;
}

export function BitcoinCoin3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mountRef.current) return;
    const container = mountRef.current;

    let animId: number;
    let disposed = false;

    void (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const W = container.clientWidth;
      const H = container.clientHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 50);
      camera.position.set(0, 0, 5.5);

      const geo = new THREE.CylinderGeometry(1.6, 1.6, 0.14, 80);
      const frontTex = new THREE.CanvasTexture(buildFaceTexture(true));
      const backTex = new THREE.CanvasTexture(buildFaceTexture(false));

      const edgeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#C4700F"),
        metalness: 0.95,
        roughness: 0.18,
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        metalness: 0.7,
        roughness: 0.22,
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: backTex,
        metalness: 0.7,
        roughness: 0.22,
      });

      const coin = new THREE.Mesh(geo, [edgeMat, frontMat, backMat]);
      // Rotate so the face (Y caps) points toward the camera (Z axis)
      coin.rotation.x = Math.PI / 2;

      const group = new THREE.Group();
      group.add(coin);
      scene.add(group);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);
      const fillLight = new THREE.PointLight(0xf7931a, 1.8, 12);
      fillLight.position.set(-3, -1, 3);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xffd080, 0.8);
      rimLight.position.set(0, -4, 2);
      scene.add(rimLight);

      // --- Rotation state ---
      // rotX/rotY are world-space offsets applied via the group quaternion
      let rotX = 0;   // accumulated pitch (drag up/down)
      let rotY = 0;   // accumulated yaw  (drag left/right)
      let velX = 0;   // inertia
      let velY = 0;
      let idleT = 0;

      // --- Drag state ---
      let dragging = false;
      let prevX = 0;
      let prevY = 0;
      // track mouse inside container for light sheen
      let lightX = 0;
      let lightY = 0;

      const SENSITIVITY = 0.01;
      const INERTIA = 0.92;
      const IDLE_SPEED = 0.004; // slow idle spin when untouched

      // Use window for move/up so drag continues outside the element
      const onMouseDown = (e: MouseEvent) => {
        dragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
        container.style.cursor = "grabbing";
      };
      const onMouseMove = (e: MouseEvent) => {
        // light tracking (only meaningful when inside container)
        const r = container.getBoundingClientRect();
        lightX = ((e.clientX - r.left) / r.width) * 2 - 1;
        lightY = -(((e.clientY - r.top) / r.height) * 2 - 1);

        if (!dragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        velY = dx * SENSITIVITY;
        velX = dy * SENSITIVITY;
        rotY += velY;
        rotX += velX;
        prevX = e.clientX;
        prevY = e.clientY;
      };
      const onMouseUp = () => {
        dragging = false;
        container.style.cursor = "grab";
      };

      // Touch support
      const onTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        dragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      };
      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (!dragging) return;
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;
        velY = dx * SENSITIVITY;
        velX = dy * SENSITIVITY;
        rotY += velY;
        rotX += velX;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      };
      const onTouchEnd = () => { dragging = false; };

      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      container.addEventListener("touchstart", onTouchStart, { passive: false });
      container.addEventListener("touchmove", onTouchMove, { passive: false });
      container.addEventListener("touchend", onTouchEnd);
      container.style.cursor = "grab";

      const animate = () => {
        animId = requestAnimationFrame(animate);
        idleT += 0.016;

        if (!dragging) {
          // Inertia decay
          velX *= INERTIA;
          velY *= INERTIA;
          rotX += velX;
          rotY += velY;

          // Idle spin kicks in only when inertia is negligible
          if (Math.abs(velX) + Math.abs(velY) < 0.0004) {
            rotY += IDLE_SPEED;
          }
        }

        // Apply accumulated rotation as Euler: yaw (Y world) then pitch (X world)
        // We keep coin.rotation.x = PI/2 fixed (face orientation)
        // and drive the group with the user's accumulated angles
        group.rotation.x = rotX;
        group.rotation.y = rotY;

        // Gentle float
        group.position.y = Math.sin(idleT * 0.7) * 0.06;

        // Dynamic light for metallic sheen
        fillLight.position.x = -3 + lightX * 2.5;
        fillLight.position.y = -1 + lightY * 2.5;

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      (container as HTMLDivElement & { _coinCleanup?: () => void })._coinCleanup = () => {
        cancelAnimationFrame(animId);
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("resize", onResize);
        frontTex.dispose();
        backTex.dispose();
        geo.dispose();
        edgeMat.dispose();
        frontMat.dispose();
        backMat.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      const el = container as HTMLDivElement & { _coinCleanup?: () => void };
      el._coinCleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[280px] select-none"
      title="Arraste para rotacionar"
    />
  );
}
