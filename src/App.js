import { useState } from "react";
import Bouquet from "./components/Bouquet";
import Balloons from "./components/Balloons";
import RoastBox from "./components/RoastBox";
import Finale from "./components/Finale";

export default function App() {
  const [stage, setStage] = useState(0);

  return (
    <div className="app">
      {stage === 0 && <Bouquet onOpen={() => setStage(1)} />}

      {stage === 1 && (
        <>
          <Balloons />
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