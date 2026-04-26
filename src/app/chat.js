import styles from "./page.module.css";
import { AnimatePresence, motion } from "motion/react";

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d`;
  return `${Math.floor(diffSec / 604800)}w`;
}

function randomLike(seed) {
  if (!seed) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % 999;
}

export default function Chat({
  showIntro,
  chatMessages,
  chatError,
  avatarPalette,
}) {
  return (
    <AnimatePresence>
      {!showIntro && (
        <motion.section
          className={styles.messageFeed}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.65,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {chatError ? (
            <motion.p
              className={styles.noMessages}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {chatError}
            </motion.p>
          ) : chatMessages.length > 0 ? (
            <div
              className={styles.messageFeedInner}
              style={{
                animationDuration: `${Math.max(chatMessages.length * 2.8, 12)}s`,
              }}
            >
              {[...chatMessages, ...chatMessages].map((message, index) => {
                const colorIndex = index % chatMessages.length;
                return (
                  <motion.div
                    key={`${message.$id || index}-${index < chatMessages.length ? "a" : "b"}`}
                    className={styles.messageItem}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className={styles.messageBody}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageName}>
                          {message.name || "Anonymous"}
                        </span>
                        <span style={{ marginRight: "4px" }}>: </span>
                        <p className={styles.messageText}>
                          {message.message || ""}
                        </p>
                        {/* <span className={styles.messageTime}>
                          {formatRelativeTime(message.$createdAt)}
                        </span> */}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.p
              className={styles.noMessages}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              No messages yet...
            </motion.p>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
