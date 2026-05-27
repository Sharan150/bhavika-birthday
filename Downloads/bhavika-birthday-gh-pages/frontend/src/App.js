import Petals from "./components/petals";
import Thoughts from "./components/Thoughts";

export default function App() {
  return (
    <div className="app">
      <Petals />

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <img
          src={`${process.env.PUBLIC_URL}/Thought.png`}
          alt="Thought"
          style={{
            width: "200%",
            maxWidth: "1000px",
            height: "auto",
            display: "block",
            margin: "0 auto",
            objectFit: "contain"
          }}
        />
      </div>

      <Thoughts />
    </div>
  );
} 