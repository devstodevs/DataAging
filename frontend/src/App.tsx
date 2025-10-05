import { useState } from "react";
import { LogIn, FileText, LayoutDashboard, BarChart3, UserPlus, Activity, Heart } from "lucide-react";
import "./App.css";
import ComponentExamples from "./pages/ComponentExamples/ComponentExamples";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import IVCFDashboard from "./pages/IVCFDashboard";
import RegisterUser from "./pages/Register/RegisterUser";
import PhysicalActivityDashboard from "./pages/PhysicalActivityDashboard";
import FACTFDashboard from "./pages/FACTFDashboard";

function App() {
  type PageType = "login" | "examples" | "home" | "ivcf-dashboard" | "register-user" | "physical-activity" | "factf-dashboard";
  
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  const handleNavigate = (page: string) => {
    // Type-safe navigation handler that validates the page string
    const validPages: PageType[] = ["login", "examples", "home", "ivcf-dashboard", "register-user", "physical-activity", "factf-dashboard"];
    if (validPages.includes(page as PageType)) {
      setCurrentPage(page as PageType);
    } else {
      console.warn(`Invalid page: ${page}`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login />;
      case "examples":
        return <ComponentExamples />;
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "ivcf-dashboard":
        return <IVCFDashboard testId="ivcf-20" onNavigate={handleNavigate} />;
      case "register-user":
        return <RegisterUser />;
      case "physical-activity":
        return <PhysicalActivityDashboard onNavigate={handleNavigate} />;
      case "factf-dashboard":
        return <FACTFDashboard onNavigate={handleNavigate} />;
      default:
        return <Home />;
    }
  };

  const menuItems = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "ivcf-dashboard", label: "Teste IVCF-20", icon: BarChart3 },
    { id: "physical-activity", label: "Atividade Física", icon: Activity },
    { id: "factf-dashboard", label: "Teste FACT-F", icon: Heart },
    { id: "register-user", label: "Cadastrar Usuário", icon: UserPlus },
    { id: "login", label: "Login", icon: LogIn },
    { id: "examples", label: "Exemplos", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">DataAging</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderPage()}</div>
    </div>
  );
}

export default App;
