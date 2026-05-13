import { motion } from "framer-motion";

export default function Bouquet({ onOpen }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={onOpen}
      style={{ cursor: "pointer", textAlign: "center" }}
    >
      <img src="/bouqet.png" alt="Thought" style={{ maxWidth: "100%", marginBottom: "20px" }} />
    </motion.div>
  );
}