"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function GraduationLanding() {
  const targetDate = new Date("2026-06-21T09:00:00");

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

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
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.pageWrap}>
      <section className={styles.poster}>
        <div className={styles.paperTexture} />

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

        <div className={styles.topLogo}>UEL</div>

        <Image
          src="/avatar.png"
          alt="Graduation portrait"
          width={430}
          height={780}
          className={styles.avatar}
          priority
        />

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

        <div className={styles.heroText}>
          <p className={styles.invited}>You&apos;re Invited to</p>
          <h1 className={styles.newTitle}>A NEW</h1>
          <p className={styles.chapter}>Chapter</p>
          <p className={styles.quote}>
            “Thanh xuân như một chuyến tàu,
            <br />
            dừng lại một ga để trưởng thành hơn,
            <br />
            rồi lại tiếp tục hành trình của riêng mình.”
          </p>

          <div className={styles.gradLine}>
            <span>SẮP TỐT NGHIỆP</span>
          </div>

          <h2 className={styles.name}>NGUYỄN THẢO LINH</h2>
          <p className={styles.faculty}>KHOA KINH TẾ ĐỐI NGOẠI</p>
          <p className={styles.school}>
            TRƯỜNG ĐẠI HỌC KINH TẾ - LUẬT
            <br />
            ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
          </p>
        </div>

        <section className={styles.infoCard}>
          <article>
            <p className={styles.cardLabel}>THỜI GIAN</p>
            <h3>09:00 AM</h3>
            <p>THỨ BẢY</p>
            <p>21 . 06 . 2026</p>
          </article>
          <article>
            <p className={styles.cardLabel}>ĐỊA ĐIỂM</p>
            <h3>HỘI TRƯỜNG A.116</h3>
            <p>TRƯỜNG ĐẠI HỌC KINH TẾ - LUẬT</p>
            <p>669 QUỐC LỘ 1A, P. LINH XUÂN, TP. THỦ ĐỨC</p>
          </article>
          <article>
            <p className={styles.cardLabel}>DRESSCODE</p>
            <h3>TONE XANH &amp; TRẮNG</h3>
            <div className={styles.colorDots}>
              <span />
              <span />
              <span />
            </div>
          </article>
        </section>

        <section className={styles.letterCard}>
          <p className={styles.dear}>Dear you,</p>
          <p>
            Cảm ơn vì đã luôn là một phần thanh xuân của mình.
            <br />
            Hãy đến để cùng chia sẻ khoảnh khắc ý nghĩa này
            <br />
            và mở đầu cho một hành trình mới nhé!
          </p>
          <p className={styles.sign}>Thảo Linh</p>
        </section>

        <Image
          src="/card.png"
          alt="Envelope decoration"
          width={330}
          height={250}
          className={styles.envelope}
        />

        <div className={styles.polaroid}>
          <Image
            src="/5T5A1815.JPG"
            alt="Polaroid portrait"
            width={120}
            height={160}
            className={styles.polaroidPhoto}
          />
        </div>

        <section className={styles.countdown}>
          <p className={styles.countdownTitle}>ĐẾM NGƯỢC ĐẾN NGÀY ĐẶC BIỆT</p>
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
