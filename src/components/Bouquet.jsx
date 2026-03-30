import { motion } from "framer-motion";

export default function Bouquet({ onOpen }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={onOpen}
      style={{ cursor: "pointer", textAlign: "center" }}
    >
      <h2>Hey Bhavika 👀</h2>
      <p>Tap the bouquet 🌸</p>

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <img src="/bouqet.png" width="220" />
      </motion.div>
    </motion.div>
  );
}