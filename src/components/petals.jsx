import { motion } from "framer-motion";

export default function Petals() {
  const petals = Array.from({ length: 20 });

  return petals.map((_, i) => (
    <motion.div
      key={i}
      initial={{
        y: -100,
        x: Math.random() * window.innerWidth,
        rotate: 0,
        opacity: 0.8,
      }}
      animate={{
        y: window.innerHeight + 100,
        x: Math.random() * window.innerWidth,
        rotate: 360,
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "linear",
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        fontSize: "20px",
        pointerEvents: "none",
      }}
    >
      🌸
    </motion.div>
  ));
}