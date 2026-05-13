import Petals from "./components/petals";

export default function App() {
  return (
    <div className="app">
      <Petals />

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <img 
          src="/Thought.png" 
          alt="Thought" 
          style={{ width: "100%", maxWidth: "500px", height: "auto", display: "block", margin: "0 auto", objectFit: "contain" }}
        />
      </div>
    </div>
  );
} 