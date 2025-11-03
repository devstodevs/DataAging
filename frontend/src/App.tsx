import { useState } from "react";
import { LogOut, FileText, LayoutDashboard, BarChart3, Activity, Heart, User } from "lucide-react";
import "./App.css";
import ComponentExamples from "./pages/ComponentExamples/ComponentExamples";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import IVCFDashboard from "./pages/IVCFDashboard";
import RegisterUser from "./pages/Register/RegisterUser";
import PasswordRecovery from "./pages/PasswordRecovery/PasswordRecovery";
import PhysicalActivityDashboard from "./pages/PhysicalActivityDashboard";
import FACTFDashboard from "./pages/FACTFDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

const AuthenticatedApp: React.FC = () => {
  type PageType = "home" | "ivcf-dashboard" | "physical-activity" | "factf-dashboard" | "examples";

  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const { user, logout } = useAuth();

  const handleNavigate = (page: string) => {
    const validPages: PageType[] = ["home", "ivcf-dashboard", "physical-activity", "factf-dashboard", "examples"];
    if (validPages.includes(page as PageType)) {
      setCurrentPage(page as PageType);
    } else {
      console.warn(`Invalid page: ${page}`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "examples":
        return <ComponentExamples />;
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "ivcf-dashboard":
        return <IVCFDashboard testId="ivcf-20" onNavigate={handleNavigate} />;
      case "physical-activity":
        return <PhysicalActivityDashboard onNavigate={handleNavigate} />;
      case "factf-dashboard":
        return <FACTFDashboard onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const menuItems = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "ivcf-dashboard", label: "Teste IVCF-20", icon: BarChart3 },
    { id: "physical-activity", label: "Atividade Física", icon: Activity },
    { id: "factf-dashboard", label: "Teste FACT-F", icon: Heart },
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
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
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

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nome_completo}
              </p>
              <p className="text-xs text-gray-500 truncate">
                CPF: {user?.cpf}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderPage()}</div>
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "password-recovery">("login");

  const handleNavigateToRegister = () => setCurrentScreen("register");
  const handleNavigateToLogin = () => setCurrentScreen("login");
  const handleNavigateToPasswordRecovery = () => setCurrentScreen("password-recovery");

  if (currentScreen === "register") {
    return <RegisterUser onNavigateToLogin={handleNavigateToLogin} />;
  }

  if (currentScreen === "password-recovery") {
    return <PasswordRecovery onNavigateToLogin={handleNavigateToLogin} />;
  }

  return (
    <Login 
      onNavigateToRegister={handleNavigateToRegister}
      onNavigateToPasswordRecovery={handleNavigateToPasswordRecovery}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Componente que decide qual tela mostrar baseado na autenticação
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <AuthenticatedApp />;
};

export default App;
