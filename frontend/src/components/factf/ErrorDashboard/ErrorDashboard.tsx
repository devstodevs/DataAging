import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import "./ErrorDashboard.css";

interface ErrorDashboardProps {
  error?: string;
  onRetry: () => void;
  onGoHome?: () => void;
}

const ErrorDashboard: React.FC<ErrorDashboardProps> = ({
  error = "Erro ao carregar dados do dashboard",
  onRetry,
  onGoHome
}) => {
  return (
    <div className="error-dashboard">
      <Card className="error-card">
        <CardHeader className="error-header">
          <div className="error-icon">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="error-title">
            Ops! Algo deu errado
          </CardTitle>
        </CardHeader>
        <CardContent className="error-content">
          <p className="error-message">
            {error}
          </p>
          
          <div className="error-details">
            <p className="error-suggestion">
              Isso pode ter acontecido por alguns motivos:
            </p>
            <ul className="error-reasons">
              <li>Problema de conexão com a internet</li>
              <li>Servidor temporariamente indisponível</li>
              <li>Erro interno do sistema</li>
            </ul>
          </div>

          <div className="error-actions">
            <Button 
              onClick={onRetry}
              className="retry-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            
            {onGoHome && (
              <Button 
                variant="outline"
                onClick={onGoHome}
                className="home-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            )}
          </div>

          <div className="error-help">
            <p className="help-text">
              Se o problema persistir, entre em contato com o suporte técnico.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDashboard;