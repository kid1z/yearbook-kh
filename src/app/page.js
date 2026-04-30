"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import gsap from "gsap";
import { toast } from "sonner";
import InfoCard from "./info-card";
import styles from "./page.module.css";
import Chat from "./chat";
import ImageTrail from "../../components/image-trail";
import PhotoGlobe from "../../components/photo-globe";
import "../../components/photo-globe.css";
import DomeGallery from "../../components/dome-gallery";
gsap.registerPlugin(useGSAP, SplitText);

const LETTER_REVEAL_MS = 3000;

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
    delay: cycle * 0.26 + row * 0.12,
    sway: 10 + (index % 6) * 3,
    rotate: -20 + (index % 8) * 5,
    opacity: 0.44 + (index % 5) * 0.08,
    variant: index % 4,
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
  const introTextStackRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("text"); // "text" | "card" | "opening"
  const revealTimelineRef = useRef(null);
  const introCardRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatError, setChatError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const [rsvpDrawerOpen, setRsvpDrawerOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpTime, setRsvpTime] = useState("");
  const [rsvpSending, setRsvpSending] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpDeclined, setRsvpDeclined] = useState(false);
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

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

  function handleCardClick() {
    if (introPhase !== "card") return;
    setIntroPhase("opening");

    const cardEl = introCardRef.current;
    if (!cardEl) return;

    // Animate card opening — scale up and reveal letter
    const cardInner = cardEl.querySelector(".intro-envelope-front");
    const letter = cardEl.querySelector(".intro-letter");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(cardInner, {
      rotateX: -105,
      opacity: 0,
      duration: 0.7,
      ease: "power3.in",
    }).fromTo(
      letter,
      { scale: 0.5, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8 },
      "-=0.35",
    );

    // After letter reveal, transition to main page
    setTimeout(() => {
      revealTimelineRef.current?.play();
      setTimeout(() => setShowIntro(false), 500);
    }, LETTER_REVEAL_MS);
  }

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playAudio = () => {
      audio.volume = 0.5;
      audio.play().catch(() => {});
      document.removeEventListener("click", playAudio);
      document.removeEventListener("touchstart", playAudio);
    };
    audio.play().catch(() => {
      document.addEventListener("click", playAudio, { once: true });
      document.addEventListener("touchstart", playAudio, { once: true });
    });
  }, []);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

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

  async function handleRsvpSubmit() {
    const trimmedName = rsvpName.trim();
    const trimmedPhone = rsvpPhone.trim();
    const trimmedTime = rsvpTime.trim();
    if (!trimmedName || !trimmedPhone || !trimmedTime || rsvpSending) return;

    setRsvpSending(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          time: trimmedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit RSVP");
      }

      setRsvpName("");
      setRsvpPhone("");
      setRsvpTime("");
      setRsvpDrawerOpen(false);
      setRsvpDone(true);
      toast.success("Cảm ơn bạn, thông tin đã được ghi nhận!");
    } catch (error) {
      console.error("Error submitting RSVP:", error);
    } finally {
      setRsvpSending(false);
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
          introTextStackRef.current,
          {
            y: -0.14 * introLineElements.length * 1.2 * 100,
            scale: 0.78,
            duration: 0.65,
            ease: "power3.inOut",
          },
          "+=0.2",
        )
        .call(() => setIntroPhase("card"), undefined, "+=0.15");

      const revealTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
      });
      revealTimelineRef.current = revealTimeline;

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
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/audio/music.mp3" loop preload="auto" />
      <div className={styles.blossomLayer} aria-hidden="true">
        {blossomItems.map((blossom) => (
          <div
            key={blossom.id}
            className={`${styles.blossomPetal} ${styles[`blossomVariant${blossom.variant}`]}`}
            style={{
              left: `${blossom.left}%`,
              top: `${blossom.top}vh`,
              width: `${blossom.size}px`,
              height: `${blossom.size}px`,
              animationDuration: `${blossom.duration}s`,
              animationDelay: `${blossom.delay}s`,
              "--petal-opacity": blossom.opacity,
            }}
          >
            <Image
              src="/blossom.svg"
              alt=""
              fill
              sizes="32px"
              className={styles.blossomImage}
            />
          </div>
        ))}
      </div>
      <AnimatePresence>
        {showIntro && (
          <AnimatePresence>
            <motion.div
              className={styles.introOverlay}
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              }}
              aria-hidden="true"
            >
              <div ref={introTextStackRef} className={styles.introTextStack}>
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
              {/* Intro envelope card */}
              <AnimatePresence>
                {introPhase !== "text" && (
                  <motion.div
                    ref={introCardRef}
                    className={styles.introCard}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.68, -0.55, 0.27, 1.55],
                    }}
                    style={{
                      pointerEvents: introPhase === "card" ? "auto" : "none",
                    }}
                    onClick={handleCardClick}
                  >
                    <div className="intro-envelope-front">
                      <div className={styles.introCardSeal} />
                      <p className={styles.introCardHint}>
                        Nhấn để mở 1 điều đặc biệt dành cho bạn nha
                      </p>
                    </div>
                    <div className="intro-letter" style={{ opacity: 0 }}>
                      <Image src="/tenor.gif" alt="Letter content" fill />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
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
      <AnimatePresence>
        {!showIntro && (
          <motion.button
            className={styles.muteButton}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              if (muted) {
                audio.muted = false;
                audio.play().catch(() => {});
                setMuted(false);
              } else {
                audio.muted = true;
                setMuted(true);
              }
            }}
            aria-label={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </motion.button>
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
                "/NAM-1.png",
                "/NAM-2.png",
                // "/NAM_0443.png",
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

        <section className={styles.rsvpSection}>
          {!rsvpDone && !rsvpDeclined ? (
            <>
              <p className={styles.rsvpHeading}>
                Bạn sẽ tham dự cùng mình chứ?
              </p>
              <div className={styles.rsvpButtons}>
                <button
                  className={styles.rsvpYes}
                  onClick={() => setRsvpDrawerOpen(true)}
                >
                  Có, mình sẽ đến
                </button>
                <button
                  className={styles.rsvpNo}
                  onClick={() => setRsvpDeclined(true)}
                >
                  Tiếc quá, mình không đến được
                </button>
              </div>
            </>
          ) : rsvpDone ? (
            <p className={styles.rsvpHeading}>
              Cảm ơn bạn, hẹn gặp lại vào ngày 11/05/2026 nhé!
            </p>
          ) : (
            <p className={styles.rsvpHeading}>
              Cảm ơn bạn, hẹn gặp lại vào một dịp khác nhé!
            </p>
          )}
        </section>

        <section className={styles.guideSection}>
          <p className={styles.guideHeading}>Hướng dẫn để xe và di chuyển</p>
          <div className={styles.guideImageWrap}>
            <Image
              src="/maps.jpeg"
              alt="Bản đồ hướng dẫn"
              width={600}
              height={400}
              className={styles.guideImage}
            />
          </div>
          <p className={styles.guideText}>
            Mọi người đi xe máy thì đi vào <strong>cổng số 3</strong> (
            <a
              href="https://maps.app.goo.gl/WVfmeUP3Tq2D9u4f6"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#000", textDecoration: "underline" }}
            >
              Định vị ở đây nhé
            </a>
            ) Mình sẽ chờ ở khu vực trước <strong>Toà KTL.B1</strong>.
          </p>
        </section>

        {/* <PhotoGlobe visible={!showIntro} /> */}
        <div className={styles.domeWrap}>
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

      <AnimatePresence>
        {rsvpDrawerOpen && (
          <motion.div
            className={styles.drawerBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setRsvpDrawerOpen(false)}
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
              <h3 className={styles.drawerTitle}>Thông tin tham dự</h3>

              <input
                type="text"
                className={styles.drawerInput}
                placeholder="Họ và tên"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                maxLength={60}
              />

              <input
                type="tel"
                className={styles.drawerInput}
                placeholder="Số điện thoại"
                value={rsvpPhone}
                onChange={(e) => setRsvpPhone(e.target.value)}
                maxLength={20}
              />

              <input
                type="text"
                className={styles.drawerInput}
                placeholder="Thời gian tham dự (vd: 7:00 AM)"
                value={rsvpTime}
                onChange={(e) => setRsvpTime(e.target.value)}
                maxLength={40}
              />

              <button
                className={styles.drawerSend}
                onClick={handleRsvpSubmit}
                disabled={
                  !rsvpName.trim() ||
                  !rsvpPhone.trim() ||
                  !rsvpTime.trim() ||
                  rsvpSending
                }
              >
                {rsvpSending ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p>Created with 𓆩❤︎𓆪 by hiệp đẹp trai</p>
    </main>
  );
}
