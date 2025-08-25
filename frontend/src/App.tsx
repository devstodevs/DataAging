import { useState } from "react";
import { LogIn, FileText, LayoutDashboard } from "lucide-react";
import "./App.css";
import ComponentExamples from "./pages/ComponentExamples";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "examples" | "dashboard">("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login />;
      case "examples":
        return <ComponentExamples />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "login", label: "Login", icon: LogIn },
    { id: "examples", label: "Exemplos", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            DataAging
          </h1>
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
                    onClick={() => setCurrentPage(item.id as string)}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
