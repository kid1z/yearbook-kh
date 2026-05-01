import styles from "./page.module.css";

export default function InfoCard() {
  return (
    <section className={styles.infoCard}>
      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>◌</span>
          <p className={styles.cardLabel}>THỜI GIAN</p>
        </div>
        <h3>10:00 AM</h3>
        <p className={styles.subLine}>THỨ Hai</p>
        <p className={styles.dateLine}>11 . 05 . 2026</p>
      </article>

      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>⌖</span>
          <p className={styles.cardLabel}>ĐỊA ĐIỂM</p>
        </div>
        <h3>HỘI TRƯỜNG KTL.B1</h3>
        <p className={styles.subLine}>TRƯỜNG ĐẠI HỌC KINH TẾ - LUẬT</p>
        <p className={styles.dateLine}>ĐHQG TP. HỒ CHÍ MINH</p>
        <p className={styles.addressLine}>
          669 QUỐC LỘ 1A, P. LINH XUÂN, TP. THỦ ĐỨC
        </p>
        <a
          href="https://www.google.com/maps/place/65%2F16+QL1A+-+Linh+Xu%C3%A2n/@10.8711496,106.7773372,17.7z/data=!4m14!1m7!3m6!1s0x3175277dbf11a271:0x4567e34b99494e3f!2sVietnam+National+University+HCM,+University+of+Economics+and+Law!8m2!3d10.8704225!4d106.7783101!16s%2Fm%2F0ds8rvh!3m5!1s0x3174d882869b5991:0x389c09ea862e5e7e!8m2!3d10.8723503!4d106.7798379!16s%2Fg%2F11z23561fq?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D"
          className={styles.mapLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Xem bản đồ
        </a>
      </article>

      <article>
        <div className={styles.cardHeading}>
          <span className={styles.iconMark}>◈</span>
          <p className={styles.cardLabel}>DRESSCODE</p>
        </div>
        <h3>Free Style</h3>
        <div className={styles.colorDots}>
          <span />
          <span />
          <span />
        </div>
      </article>
    </section>
  );
}
