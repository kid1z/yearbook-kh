"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import InfoCard from "./info-card";
import styles from "./page.module.css";

gsap.registerPlugin(useGSAP, SplitText);

const INTRO_DURATION_MS = 4000;
const REVEAL_TIMELINE_DELAY_S = 3.1;

const introLines = [
  {
    id: 1,
    text: "Graduation Ceremony",
    className: styles.introPrimaryLine,
  },
  { id: 2, text: "11/05/2026", className: styles.introDateLine },
  {
    id: 3,
    text: "Dang Phan Khanh Huyen",
    className: styles.introNameLine,
  },
];

const blossomItems = Array.from({ length: 50 }, (_, index) => {
  const cycle = index % 10;
  const row = Math.floor(index / 10);

  return {
    id: index + 1,
    left: (cycle * 10 + row * 1.7) % 100,
    top: -12 - row * 5,
    size: 10 + (index % 5) * 4,
    duration: 16 + (index % 7) * 1.3,
    sway: 10 + (index % 6) * 3,
    delay: cycle * 0.26 + row * 0.12,
    rotate: -20 + (index % 8) * 5,
    opacity: 0.44 + (index % 5) * 0.08,
  };
});

export default function GraduationLanding() {
  const targetDate = new Date("2026-05-11T00:00:00");
  const pageRef = useRef(null);
  const introLineRefs = useRef([]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showIntro, setShowIntro] = useState(true);

  function getTimeLeft() {
    const now = new Date();
    const diff = Math.max(targetDate.getTime() - now.getTime(), 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hideIntroTimer = window.setTimeout(() => {
      setShowIntro(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(hideIntroTimer);
  }, []);

  useGSAP(
    () => {
      const select = gsap.utils.selector(pageRef);
      const topLogo = select(`.${styles.topLogo}`);
      const heroTextChildren = select(`.${styles.heroText} > *`);
      const avatar = select(`.${styles.avatar}`);
      const infoCard = select(`.${styles.infoCard}`);
      const flowers = select(`.${styles.flowerLeft}, .${styles.flowerRight}`);

      const introSplits = introLineRefs.current.filter(Boolean).map((element) =>
        SplitText.create(element, {
          type: "chars",
          charsClass: styles.introChar,
        }),
      );

      const introTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.12,
      });

      introTimeline
        .from(introSplits[0]?.chars ?? [], {
          opacity: 0,
          y: 28,
          rotateX: -80,
          filter: "blur(10px)",
          stagger: 0.028,
          duration: 1.05,
        })
        .from(
          introSplits[1]?.chars ?? [],
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
            filter: "blur(8px)",
            stagger: 0.05,
            duration: 0.8,
          },
          "-=0.45",
        )
        .from(
          introSplits[2]?.chars ?? [],
          {
            opacity: 0,
            y: 18,
            filter: "blur(8px)",
            stagger: 0.02,
            duration: 0.92,
          },
          "-=0.32",
        )
        .to(
          introSplits.flatMap((split) => split.chars),
          {
            y: -8,
            opacity: 0,
            filter: "blur(9px)",
            stagger: 0.006,
            duration: 0.6,
          },
          2.95,
        );

      const revealTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: REVEAL_TIMELINE_DELAY_S,
      });

      revealTimeline
        .from(topLogo, {
          y: -42,
          opacity: 0,
          duration: 0.85,
        })
        .from(
          heroTextChildren,
          {
            y: 34,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(
          avatar,
          {
            x: 90,
            opacity: 0,
            duration: 1.05,
          },
          "-=0.85",
        )
        .from(
          infoCard,
          {
            y: 86,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.7",
        )
        .from(
          flowers,
          {
            opacity: 0,
            scale: 0.85,
            duration: 0.85,
            stagger: 0.1,
          },
          "-=0.95",
        );

      gsap.to(`.${styles.flowerLeft}`, {
        y: -16,
        rotation: 21,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(`.${styles.flowerRight}`, {
        y: 14,
        rotation: -24,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => {
        introSplits.forEach((split) => split.revert());
      };
    },
    { scope: pageRef },
  );

  return (
    <main ref={pageRef} className={styles.pageWrap}>
      <div className={styles.blossomLayer} aria-hidden="true">
        {blossomItems.map((blossom) => (
          <motion.div
            key={blossom.id}
            className={styles.blossomPetal}
            style={{
              left: `${blossom.left}%`,
              top: `${blossom.top}vh`,
              width: `${blossom.size}px`,
              height: `${blossom.size}px`,
              opacity: blossom.opacity,
            }}
            initial={{ y: "-14vh", opacity: 0, rotate: blossom.rotate }}
            animate={{
              y: ["-14vh", "118vh"],
              x: [
                0,
                blossom.sway,
                -blossom.sway * 0.55,
                blossom.sway * 0.25,
                0,
              ],
              rotate: [
                blossom.rotate,
                blossom.rotate + 18,
                blossom.rotate - 14,
                blossom.rotate + 8,
              ],
              opacity: [0, blossom.opacity, blossom.opacity, 0],
            }}
            transition={{
              duration: blossom.duration,
              delay: blossom.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          >
            <Image
              src="/blossom.svg"
              alt=""
              fill
              sizes="32px"
              className={styles.blossomImage}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className={styles.introOverlay}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            aria-hidden="true"
          >
            <svg
              className={styles.introBorderSvg}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect
                className={styles.introBorderRect}
                x="1"
                y="1"
                width="98"
                height="98"
                rx="1.3"
                ry="1.3"
                pathLength="100"
              />
            </svg>

            {/* <motion.div
              className={styles.introGlow}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: [0.92, 1.18, 0.98],
                opacity: [0.42, 0.95, 0.58],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            /> */}

            <div className={styles.introTextStack}>
              {introLines.map((line, index) => (
                <h2
                  key={line.id}
                  ref={(element) => {
                    introLineRefs.current[index] = element;
                  }}
                  className={`${styles.introTitle} ${line.className}`}
                >
                  {line.text}
                </h2>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className={styles.poster}>
        <div className={styles.topLogo}>
          <Image
            src="/logo_uel.png"
            alt="UEL Logo"
            width={120}
            height={120}
            className={styles.uelLogo}
          />
        </div>
        <div className={styles.hero}>
          <div className={styles.backgroundLayer}>
            <Image
              src="/school.jpg"
              alt="UEL Campus"
              fill
              sizes="(max-width: 900px) 100vw, 768px"
              className={styles.schoolImage}
              priority
            />
          </div>

          <div className={styles.heroText}>
            <p className={styles.invited}>You&apos;re Invited to</p>
            <h1 className={styles.newTitle}>Graduation</h1>
            <p className={styles.chapter}>Ceremony</p>

            <div className={styles.gradLine}>
              <span>SẮP TỐT NGHIỆP</span>
            </div>

            <h2 className={styles.name}>Đặng Phan Khánh Huyền</h2>
            <p className={styles.faculty}>Khoa Quản Trị Kinh Doanh</p>
            <p className={styles.school}>
              TRƯỜNG ĐẠI HỌC KINH TẾ - LUẬT
              <br />
              ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
            </p>
          </div>

          <Image
            src="/avatar.png"
            alt="Graduation portrait"
            width={430}
            height={780}
            className={styles.avatar}
            priority
          />
        </div>

        {/* <div className={styles.paperTexture} /> */}

        <div className={styles.flower}>
          <Image
            src="/flower.png"
            alt="Flower decoration"
            width={340}
            height={240}
            className={styles.flowerLeft}
          />

          <Image
            src="/flower.png"
            alt="Flower decoration"
            width={310}
            height={220}
            className={styles.flowerRight}
          />
        </div>

        <InfoCard />

        <section className={styles.letterCard}>
          <Image
            src="/Paper-Texture.png"
            alt=""
            fill
            sizes="(max-width: 900px) 95vw, 720px"
            className={styles.paperTextureImg}
          />

          <p className={styles.dear}>Dear you,</p>
          <p className={styles.letterBody}>
            Cảm ơn vì đã luôn là thanh xuân của mình, hãy đến để cùng chia sẻ
            những khoảng khắc ý nghĩa này với mình nhé ♡♡♡.
          </p>
          <p className={styles.sign}>Khánh Huyền</p>
        </section>

        <Image
          src="/card.png"
          alt="Card decoration"
          width={460}
          height={320}
          className={styles.envelope}
        />

        <Image
          src="/white-flower.png"
          alt="White flower decoration"
          width={220}
          height={220}
          className={styles.whiteFlower}
        />
        <Image
          src="/charm.png"
          alt="White flower decoration"
          width={220}
          height={220}
          className={styles.charm}
        />

        {/* <div className={styles.polaroid}>
          <Image
            src="/5T5A1815.JPG"
            alt="Polaroid portrait"
            width={120}
            height={160}
            className={styles.polaroidPhoto}
          />
        </div> */}

        <section className={styles.countdown}>
          <p className={styles.countdownTitle}>
            ĐẾM NGƯỢC ĐẾN NGÀY ĐẶC BIỆT ♥︎
          </p>
          <div className={styles.countGrid}>
            <article>
              <h4>{String(timeLeft.days).padStart(2, "0")}</h4>
              <p>NGÀY</p>
            </article>
            <article>
              <h4>{String(timeLeft.hours).padStart(2, "0")}</h4>
              <p>GIỜ</p>
            </article>
            <article>
              <h4>{String(timeLeft.minutes).padStart(2, "0")}</h4>
              <p>PHÚT</p>
            </article>
            <article>
              <h4>{String(timeLeft.seconds).padStart(2, "0")}</h4>
              <p>GIÂY</p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
