"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./photo-globe.css";

const PHOTOS = [
  "/5T5A1638.JPG",
  "/5T5A1789.JPG",
  "/5T5A1815.JPG",
  "/NAM_0379.JPG",
  "/NAM_0437.JPG",
  "/NAM_0960.JPG",
  "/NAM_1426.JPG",
  "/NAM_1461.JPG",
  "/NAM-1.png",
  "/NAM-2.png",
  "/school.jpg",
  "/school1.jpg",
  "/5T5A1527.JPG",
  "/5T5A1530.JPG",
  "/5T5A1574.JPG",
  "/5T5A1616.JPG",
  "/5T5A1636.JPG",
  "/5T5A1703.JPG",
  "/5T5A1794.JPG",
  "/5T5A1813.JPG",
  "/5T5A1840.JPG",
  "/5T5A1901.JPG",
  "/5T5A1974.JPG",
  "/5T5A1995.JPG",
  "/5T5A2089.JPG",
  "/5T5A2130.JPG",
  "/5T5A2137.JPG",
  "/5T5A2156.JPG",
];

function fibonacciSphere(n) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }
  return points;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function PhotoGlobe({ visible }) {
  const globeRef = useRef(null);
  const sceneRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotX = useRef(30);
  const rotY = useRef(0);
  const autoRotateRef = useRef(null);
  const decayRef = useRef(null);
  const rafPending = useRef(false);
  const spherePoints = useRef(fibonacciSphere(PHOTOS.length));

  function getRadius() {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w <= 500) return 240;
    if (w <= 900) return 330;
    return 460;
  }

  const [radius, setRadius] = useState(460);

  useEffect(() => {
    setRadius(getRadius());
    const onResize = () => setRadius(getRadius());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!visible || entered) return;
    const timer = setTimeout(() => setEntered(true), 800);
    return () => clearTimeout(timer);
  }, [visible, entered]);

  const applyRotation = useCallback(() => {
    const el = globeRef.current;
    if (!el) return;
    el.style.transform = `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
  }, []);

  /* ── Lightweight rAF auto-rotation ── */
  const startAutoRotate = useCallback(() => {
    let lastTime = performance.now();
    function tick(now) {
      if (!dragging.current) {
        const dt = Math.min(now - lastTime, 100);
        rotY.current += dt * 0.009;
        applyRotation();
      }
      lastTime = now;
      autoRotateRef.current = requestAnimationFrame(tick);
    }
    autoRotateRef.current = requestAnimationFrame(tick);
  }, [applyRotation]);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, []);

  /* ── Inertia decay via rAF ── */
  const startDecay = useCallback(() => {
    function decay() {
      if (dragging.current) return;
      velocity.current.x *= 0.92;
      velocity.current.y *= 0.92;
      if (
        Math.abs(velocity.current.x) < 0.08 &&
        Math.abs(velocity.current.y) < 0.08
      ) {
        decayRef.current = null;
        return;
      }
      rotY.current += velocity.current.x * 0.4;
      rotX.current = clamp(rotX.current - velocity.current.y * 0.4, -72, 72);
      applyRotation();
      decayRef.current = requestAnimationFrame(decay);
    }
    decayRef.current = requestAnimationFrame(decay);
  }, [applyRotation]);

  const stopDecay = useCallback(() => {
    if (decayRef.current) {
      cancelAnimationFrame(decayRef.current);
      decayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!entered) return;
    const el = globeRef.current;
    if (!el) return;

    applyRotation();
    startAutoRotate();

    const cards = el.querySelectorAll(".globe-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.05,
        ease: "back.out(1.7)",
      },
    );

    return () => {
      stopAutoRotate();
      stopDecay();
    };
  }, [entered, applyRotation, startAutoRotate, stopAutoRotate, stopDecay]);

  /* ── Pointer handlers on scene (not stage — stage is 0x0) ── */
  function onPointerDown(e) {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    stopDecay();
  }

  function onPointerMove(e) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    velocity.current = { x: dx, y: dy };
    rotY.current += dx * 0.4;
    rotX.current = clamp(rotX.current - dy * 0.4, -72, 72);
    lastPos.current = { x: e.clientX, y: e.clientY };

    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        applyRotation();
      });
    }
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    startDecay();
  }

  if (!visible) return null;

  return (
    <div
      className="globe-scene"
      ref={sceneRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="globe-stage" ref={globeRef}>
        {PHOTOS.map((src, i) => {
          const pt = spherePoints.current[i];
          const yaw = Math.atan2(pt.x, pt.z) * (180 / Math.PI);
          const rawTilt = Math.asin(pt.y) * (180 / Math.PI);
          const tilt = rawTilt * 0.45;
          const x = pt.x * radius;
          const y = pt.y * radius;
          const z = pt.z * radius;
          const depth = (pt.z + 1) / 2;
          const scale = 0.8 + depth * 0.22;
          const opacity = 0.55 + depth * 0.45;
          return (
            <div
              key={src}
              className="globe-card"
              style={{
                zIndex: Math.round(depth * 1000),
                opacity,
                transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${yaw}deg) rotateX(${tilt}deg) scale(${scale})`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="globe-card-img"
                width="180"
                height="135"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
