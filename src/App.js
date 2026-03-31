import { useState } from "react";
import Bouquet from "./components/Bouquet";
import RoastBox from "./components/RoastBox";
import Finale from "./components/Finale";
import Sparkles from "./components/Sparkles";
import Petals from "./components/petals";

export default function App() {
  const [stage, setStage] = useState(0);

  return (
    <div className="app">
      <Petals />

      {stage === 0 && <Bouquet onOpen={() => setStage(1)} />}

      {stage === 1 && (
        <>
          <Sparkles />
          <RoastBox />

          <div style={{ marginTop: "40px" }}>
            <button onClick={() => setStage(2)}>Next 😏</button>
          </div>
        </>
      )}

      {stage === 2 && <Finale />}
    </div>
  );
}