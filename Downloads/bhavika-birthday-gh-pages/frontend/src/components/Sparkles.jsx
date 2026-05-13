import { motion } from "framer-motion";

export default function Sparkles() {
  const items = Array.from({ length: 20 });

  return items.map((_, i) => (
    <motion.div
      key={i}
      initial={{
        opacity: 0,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        opacity: [0, 1, 0],
        y: [0, -40],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: i * 0.3,
      }}
      style={{
        position: "fixed",
        fontSize: "18px",
        pointerEvents: "none",
      }}
    >
      💖
    </motion.div>
  ));
}