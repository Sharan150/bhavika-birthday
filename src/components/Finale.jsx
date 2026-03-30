import { motion } from "framer-motion";

export default function Finale() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1>🎉 Happy Birthday Bhavika 🎉</h1>
      <p style={{ marginTop: "20px" }}>
        You’re chaotic… but our chaotic 💖
      </p>

      <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
        (still improve a little 😭)
      </p>
    </motion.div>
  );
}