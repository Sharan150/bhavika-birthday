import { motion } from "framer-motion";
import { useState } from "react";

export default function Balloons() {
  const [balloons, setBalloons] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 90,
    }))
  );

  return balloons.map((b) => (
    <motion.div
      key={b.id}
      onClick={() => setBalloons(prev => prev.filter(x => x.id !== b.id))}
      initial={{ y: 400 }}
      animate={{ y: [-20, -500], x: [0, 20, -20, 0] }}
      transition={{
        duration: 6 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        left: `${b.left}%`,
        fontSize: "40px",
        cursor: "pointer",
      }}
    >
      🎈
    </motion.div>
  ));
}