import React, { useState } from "react";
import CardExamples from "../../components/Examples/Card/CardExamples";
import ButtonExamples from "../../components/Examples/Button/ButtonExamples";
import InputExamples from "../../components/Examples/Input/InputExamples";
import ModalExamples from "../../components/Examples/Modal/ModalExamples";
import TitleExamples from "../../components/Examples/Title/TitleExamples";
import SubtitleExamples from "../../components/Examples/Subtitle/SubtitleExamples";
import AlertExamples from "../../components/Examples/Alert/AlertExamples";
import SecondaryLinkExamples from "../../components/Examples/SecondaryLink/SecondaryLinkExamples";

interface TabProps {
  label: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
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
    { id: "title", label: "Title Component", component: TitleExamples },
    {
      id: "subtitle",
      label: "Subtitle Component",
      component: SubtitleExamples,
    },
    { id: "button", label: "Button Component", component: ButtonExamples },
    { id: "input", label: "Input Component", component: InputExamples },
    { id: "alert", label: "Alert Component", component: AlertExamples },
    { id: "secondarylink", label: "SecondaryLink Component", component: SecondaryLinkExamples },
    { id: "modal", label: "Modal Component", component: ModalExamples },
  ];

  return (
    <div className="h-full p-5 bg-gray-100 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-gray-800 text-3xl font-semibold">
          🔍 Component Examples 🔍
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
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
            <h2 className="mb-6 text-gray-700 text-xl font-medium">
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
