import { useState } from "react";
import "./App.css";
import ComponentExamples from "./pages/ComponentExamples";
import Login from "./pages/Login";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "examples">("login");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login />;
      case "examples":
        return <ComponentExamples />;
      default:
        return <Login />;
    }
  };

  return (
    <div>
      {/* Navegação simples para demonstração */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setCurrentPage("login")}
          style={{
            padding: "8px 16px",
            backgroundColor: currentPage === "login" ? "#3B82F6" : "#E5E7EB",
            color: currentPage === "login" ? "white" : "#374151",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentPage("examples")}
          style={{
            padding: "8px 16px",
            backgroundColor: currentPage === "examples" ? "#3B82F6" : "#E5E7EB",
            color: currentPage === "examples" ? "white" : "#374151",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Exemplos
        </button>
      </div>

      {renderPage()}
    </div>
  );
}

export default App;
