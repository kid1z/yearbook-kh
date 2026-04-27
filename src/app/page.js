"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import InfoCard from "./info-card";
import styles from "./page.module.css";
import Chat from "./chat";
import ImageTrail from "../../components/image-trail";
import PhotoGlobe from "../../components/photo-globe";
import "../../components/photo-globe.css";
import DomeGallery from "../../components/dome-gallery";
gsap.registerPlugin(useGSAP, SplitText);

const INTRO_DURATION_MS = 4500;
const REVEAL_TIMELINE_DELAY_S = 4.1;

const introLines = [
  {
    id: 1,
    text: "Lễ Tốt Nghiệp",
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

const avatarPalette = [
  "#FE2C55",
  "#25F4EE",
  "#FFD166",
  "#7B68EE",
  "#FF6B6B",
  "#4ECDC4",
  "#FF8A5C",
  "#A78BFA",
  "#F472B6",
  "#38BDF8",
];

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
  const [chatMessages, setChatMessages] = useState([]);
  const [chatError, setChatError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

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

  async function refreshChat() {
    try {
      const response = await fetch("/api/chat", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load chat feed");
      }

      setChatMessages(data.documents || []);
      setChatError("");
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setChatError("Cannot load chat feed right now.");
    }
  }

  useEffect(() => {
    refreshChat();
  }, []);

  async function handleSend() {
    const trimmed = formMessage.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim() || "Anonymous",
          message: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      setFormName("");
      setFormMessage("");
      setDrawerOpen(false);
      await refreshChat();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  }

  useGSAP(
    () => {
      const select = gsap.utils.selector(pageRef);
      const poster = select(`.${styles.poster}`);
      const schoolImage = select(`.${styles.schoolImage}`);
      const heroTextChildren = select(`.${styles.heroText} > *`);
      const avatar = select(`.${styles.avatar}`);
      const infoCard = select(`.${styles.infoCard}`);
      const flowers = select(`.${styles.flowerLeft}, .${styles.flowerRight}`);
      const introLineElements = introLineRefs.current.filter(Boolean);

      const introSplits = introLineElements.map((element) =>
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
        .set(introLineElements, {
          autoAlpha: 1,
        })
        .from(introSplits[0]?.chars ?? [], {
          opacity: 0,
          y: 34,
          rotateX: -82,
          filter: "blur(12px)",
          stagger: 0.038,
          duration: 1.05,
        })
        .from(
          introSplits[1]?.chars ?? [],
          {
            opacity: 0,
            y: 24,
            scale: 0.88,
            filter: "blur(10px)",
            stagger: 0.06,
            duration: 1.02,
          },
          "-=0.62",
        )
        .from(
          introSplits[2]?.chars ?? [],
          {
            opacity: 0,
            y: 22,
            filter: "blur(10px)",
            stagger: 0.03,
            duration: 1.28,
          },
          "-=0.5",
        )
        .to(
          introSplits.flatMap((split) => split.chars),
          {
            y: -12,
            opacity: 0,
            filter: "blur(12px)",
            stagger: 0.01,
            duration: 0.95,
          },
          3.45,
        );

      const revealTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: REVEAL_TIMELINE_DELAY_S,
      });

      revealTimeline
        .set(poster, {
          autoAlpha: 1,
        })
        .fromTo(
          schoolImage,
          {
            scale: 1.14,
            y: 28,
            opacity: 0.38,
            filter: "blur(7px)",
          },
          {
            scale: 1,
            y: 0,
            opacity: 0.8,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          },
        )
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

      gsap.to(`.${styles.messageFeed}`, {
        y: -6,
        duration: 3.8,
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
      <AnimatePresence>
        {!showIntro && (
          <motion.nav
            className={styles.navbar}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.topLogo}>
              <Image
                src="/logo_uel.png"
                alt="UEL Logo"
                width={120}
                height={120}
                className={styles.uelLogo}
              />
            </div>

            <input
              ref={inputRef}
              type="text"
              className={styles.inputField}
              placeholder="Để lại lời chúc..."
              readOnly
              onClick={() => setDrawerOpen(true)}
            />
          </motion.nav>
        )}
      </AnimatePresence>
      <Chat
        showIntro={showIntro}
        chatMessages={chatMessages}
        chatError={chatError}
        avatarPalette={avatarPalette}
      />
      <section className={styles.poster}>
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
            <p className={styles.invited}>Mời bạn tới</p>
            <h1 className={styles.newTitle}>Lễ</h1>
            <p className={styles.chapter}>Tốt Nghiệp</p>

            <div className={styles.gradLine}>
              {/* <span>Đếm ngược: </span> */}
              {/* <h4>{String(timeLeft.days).padStart(2, "0")}</h4> */}
              <span>{String(timeLeft.days).padStart(2, "0")} Ngày</span>
              <span>{String(timeLeft.hours).padStart(2, "0")} Giờ</span>
              <span>{String(timeLeft.minutes).padStart(2, "0")} Phút</span>
              <span>{String(timeLeft.seconds).padStart(2, "0")} Giây</span>
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

        <div style={{ position: "relative" }}>
          <section
            // style={{ height: "500px", width: '100%', position: "relative", overflow: "hidden" }}
            className={styles.letterCard}
          >
            <ImageTrail
              key={`image-trail-${showIntro}`} // Reset animation when showIntro changes
              items={[
                "/NAM_0379.JPG",
                "/NAM_0437.JPG",
                "/NAM_0960.JPG",
                "/NAM_1426.JPG",
                "/NAM_1461.JPG",
                "/NAM-1.JPG",
                "/NAM-2.JPG",
                "/NAM_0443.JPG",
              ]}
              variant="1"
            />
            <p className={styles.dear}>Dear you,</p>
            <p className={styles.letterBody}>
              Cảm ơn vì đã luôn là thanh xuân của mình, hãy đến để cùng chia sẻ
              những khoảng khắc ý nghĩa này với mình nhé ♡♡♡.
            </p>
            <p className={styles.sign}>Khánh Huyền</p>

            <Image
              src="/Paper-Texture.png"
              alt=""
              fill
              sizes="(max-width: 900px) 95vw, 720px"
              className={styles.paperTextureImg}
            />
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
        </div>

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

        {/* <PhotoGlobe visible={!showIntro} /> */}
        <div style={{ width: "100%", height: "100vh" }}>
          <DomeGallery
            fit={0.6}
            minRadius={300}
            maxVerticalRotationDeg={3}
            segments={34}
            dragDampening={2}
            grayscale={false}
          />
        </div>
      </section>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className={styles.drawerBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              className={styles.drawer}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHandle} />
              <h3 className={styles.drawerTitle}>Để lại lời chúc</h3>

              <input
                type="text"
                className={styles.drawerInput}
                placeholder="Your name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                maxLength={60}
              />

              <textarea
                className={styles.drawerTextarea}
                placeholder="Write your message..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                maxLength={500}
                rows={4}
              />

              <button
                className={styles.drawerSend}
                onClick={handleSend}
                disabled={!formMessage.trim() || sending}
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
