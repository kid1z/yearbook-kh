"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

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
  const [entered, setEntered] = useState(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotX = useRef(30); // stronger tilt so the sphere reads as a globe
  const rotY = useRef(0);
  const animId = useRef(null);
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

  useEffect(() => {
    if (!entered) return;
    const el = globeRef.current;
    if (!el) return;

    applyRotation(); // apply initial 15° tilt immediately

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

    const autoRotate = gsap.to(
      {},
      {
        duration: 40,
        repeat: -1,
        ease: "none",
        onUpdate() {
          if (dragging.current) return;
          rotY.current += 0.075;
          applyRotation();
        },
      },
    );

    return () => {
      autoRotate.kill();
    };
  }, [entered]);

  function applyRotation() {
    const el = globeRef.current;
    if (!el) return;
    el.style.transform = `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`;
  }

  function onPointerDown(e) {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    if (animId.current) {
      cancelAnimationFrame(animId.current);
      animId.current = null;
    }
    gsap.killTweensOf(velocity.current);
  }

  function onPointerMove(e) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    velocity.current = { x: dx, y: dy };
    rotY.current += dx * 0.4;
    rotX.current = clamp(rotX.current - dy * 0.4, -72, 72);
    lastPos.current = { x: e.clientX, y: e.clientY };
    applyRotation();
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    gsap.to(velocity.current, {
      x: 0,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
      onUpdate() {
        rotY.current += velocity.current.x * 0.4;
        rotX.current = clamp(rotX.current - velocity.current.y * 0.4, -72, 72);
        applyRotation();
      },
    });
  }

  if (!visible) return null;

  return (
    <div className="globe-scene">
      <div
        className="globe-stage"
        ref={globeRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {PHOTOS.map((src, i) => {
          const pt = spherePoints.current[i];
          const yaw = Math.atan2(pt.x, pt.z) * (180 / Math.PI);
          const rawTilt = Math.asin(pt.y) * (180 / Math.PI);
          const tilt = rawTilt * 0.45; // ±40° — visible curvature, cards stay readable
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
              <Image
                src={src}
                alt=""
                width={180}
                height={135}
                className="globe-card-img"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
