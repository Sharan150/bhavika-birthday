import { useState } from "react";
import { motion } from "framer-motion";
import Petals from "./petals";

function generateRoast() {
  const starters = [
    "Bhavika,",
    "Honestly Bhavika,",
    "Breaking news:",
    "Fun fact about Bhavika:",
  ];

  const traits = [
    "your decision-making",
    "your sleep schedule",
    "your life choices",
    "your attention span",
    "your sense of timing",
    "your logic sometimes",
  ];

  const roasts = [
    "is honestly impressive… in a confusing way 😭",
    "needs a software update immediately 💀",
    "should come with a user manual 😂",
    "deserves its own documentary 🎬",
    "is chaotic but entertaining 😌",
    "is iconic for no reason 🫶",
  ];

  const endings = [
    "but we love you anyway 💖",
    "and that’s why today is your day 🎉",
    "never change… or maybe just a little 😂",
    "and honestly we respect the confidence 😌",
  ];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return `${rand(starters)} ${rand(traits)} ${rand(roasts)} ${rand(endings)}`;
}

export default function RoastBox() {
  const [text, setText] = useState(generateRoast());
  const [count, setCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleRoast = () => {
    setText(generateRoast());
    setCount((c) => c + 1);

    if (count >= 4) setShowSecret(true);
  };

  return (
    <div className={`roast-box ${revealed ? "emotional" : ""}`}>
      {!revealed && (
        <>
          <p className="roast-text">{text}</p>

          <button onClick={handleRoast}>Roast Again 🔥</button>

          {showSecret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: "20px" }}
            >
              <button onClick={() => setRevealed(true)}>
                Okay fine… one real message 💌
              </button>
            </motion.div>
          )}
        </>
      )}

      {revealed && (
        <>
          <Petals />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ marginTop: "30px" }}
          >
            <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
              Okay jokes aside…  
              <br /><br />
              Bhavika… or should I say <strong>Tappu</strong> 😌  
              <br /><br />
              You genuinely make things more fun just by being around.  
              Even your chaos has a vibe to it.  
              <br /><br />
              Life feels a little less boring with you in it…  
              and that’s rare.  
              <br /><br />
              So yeah… stay exactly the way you are 💖  
              <br /><br />
              (but Tappu… seriously, fix your decisions a little 😭)
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}