import React, { useState } from "react";
import CardExamples from "../components/Examples/Card/CardExamples";
import ButtonExamples from "../components/Examples/Button/ButtonExamples";
import InputExamples from "../components/Examples/Input/InputExamples";
import ModalExamples from "../components/Examples/Modal/ModalExamples";

interface TabProps {
  label: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, children, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "12px 24px",
      border: "none",
      backgroundColor: isActive ? "#3B82F6" : "transparent",
      color: isActive ? "white" : "#6B7280",
      cursor: "pointer",
      borderBottom: isActive ? "2px solid #3B82F6" : "2px solid transparent",
      fontWeight: isActive ? "600" : "400",
      transition: "all 0.2s ease",
    }}
  >
    {label}
  </button>
);

const TabContent: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
}> = ({ isActive, children }) => (
  <div style={{ display: isActive ? "block" : "none", padding: "24px 0" }}>
    {children}
  </div>
);

const ComponentExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState("card");

  const tabs = [
    { id: "card", label: "Card Component", component: CardExamples },
    { id: "button", label: "Button Component", component: ButtonExamples },
    { id: "input", label: "Input Component", component: InputExamples },
    { id: "modal", label: "Modal Component", component: ModalExamples },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F3F4F6",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{ marginBottom: "32px", color: "#1F2937", fontSize: "1.7rem" }}
        >
          🔍 Component Examples 🔍
        </h1>

        {/* Tabs */}
        <div
          style={{
            borderBottom: "1px solid #E5E7EB",
            marginBottom: "24px",
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </div>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabContent key={tab.id} isActive={activeTab === tab.id}>
            <h2
              style={{
                marginBottom: "24px",
                color: "#374151",
                fontSize: "1.3rem",
                fontWeight: "500",
              }}
            >
              {tab.label} Examples
            </h2>
            <tab.component />
          </TabContent>
        ))}
      </div>
    </div>
  );
};

export default ComponentExamples;
