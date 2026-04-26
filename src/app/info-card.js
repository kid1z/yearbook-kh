import styles from "./page.module.css";

export default function InfoCard() {
  return (
    <section className={styles.infoCard}>
      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>◌</span>
          <p className={styles.cardLabel}>THỜI GIAN</p>
        </div>
        <h3>09:00 AM</h3>
        <p className={styles.subLine}>THỨ Hai</p>
        <p className={styles.dateLine}>11 . 05 . 2026</p>
      </article>

      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>⌖</span>
          <p className={styles.cardLabel}>ĐỊA ĐIỂM</p>
        </div>
        <h3>HỘI TRƯỜNG A.116</h3>
        <p className={styles.subLine}>TRƯỜNG ĐẠI HỌC KINH TẾ - LUẬT</p>
        <p className={styles.dateLine}>ĐHQG TP. HỒ CHÍ MINH</p>
        <p className={styles.addressLine}>
          669 QUỐC LỘ 1A, P. LINH XUÂN, TP. THỦ ĐỨC
        </p>
      </article>

      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>◈</span>
          <p className={styles.cardLabel}>DRESSCODE</p>
        </div>
        <h3>TONE XANH &amp; TRẮNG</h3>
        <div className={styles.colorDots}>
          <span />
          <span />
          <span />
        </div>
      </article>
    </section>
  );
}
