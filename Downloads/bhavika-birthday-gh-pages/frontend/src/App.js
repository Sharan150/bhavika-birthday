import Petals from "./components/petals";

export default function App() {
  return (
    <div className="app">
      <Petals />

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <img 
          src="/bouqet.png" 
          alt="Thought" 
          style={{ maxWidth: "200%", height: "auto", maxHeight: "1000px" }}
        />
      </div>
    </div>
  );
} 