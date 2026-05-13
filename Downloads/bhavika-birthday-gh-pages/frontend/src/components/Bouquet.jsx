import { motion } from "framer-motion";

export default function Bouquet({ onOpen }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={onOpen}
      style={{ cursor: "pointer", textAlign: "center" }}
    >
      <img src="/Thought.png" alt="Thought" style={{ width: "100%", maxWidth: "500px", height: "auto", display: "block", margin: "0 auto 20px auto", objectFit: "contain" }} />
    </motion.div>
  );
}