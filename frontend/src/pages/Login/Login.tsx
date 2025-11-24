import React, { useState } from "react";
import Card from "../../components/base/Card/Card";
import Title from "../../components/base/Title/Title";
import Subtitle from "../../components/base/Subtitle/Subtitle";
import { PasswordInput } from "../../components/base/Input";
import DocumentInput from "../../components/base/Input/DocumentInput";
import Alert from "../../components/base/Alert/Alert";
import Button from "../../components/base/Button/Button";
import SecondaryLink from "../../components/base/SecondaryLink/SecondaryLink";
import { useAuth } from "../../contexts/AuthContext";
import { validateCPF } from "../../utils/cpfValidator";

interface LoginProps {
  onNavigateToRegister?: () => void;
  onNavigateToPasswordRecovery?: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onNavigateToPasswordRecovery }) => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar CPF antes de enviar
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    setIsLoading(true);

    try {
      await login(cpf, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToPasswordRecovery) {
      onNavigateToPasswordRecovery();
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
      {/* Título Principal */}
      <div className="mb-8">
        <Title level="h1" align="center">
          Acesso ao DataAging
        </Title>
      </div>

      {/* Card Principal */}
      <Card maxWidth="400px">
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <div style={{ marginBottom: "8px" }}>
            <Title size="small" align="left">
              Bem-vindo de volta
            </Title>
          </div>
          <Subtitle align="left">
            Digite seu CPF e senha para acessar sua conta
          </Subtitle>
        </div>

        <div style={{ 
          marginBottom: "24px", 
          padding: "12px", 
          backgroundColor: "#F0F9FF", 
          border: "1px solid #BAE6FD", 
          borderRadius: "8px",
          fontSize: "14px"
        }}>
          <div style={{ fontWeight: "600", marginBottom: "8px", color: "#0369A1" }}>
            Credenciais válidas para teste:
          </div>
          <div style={{ color: "#075985", lineHeight: "1.6" }}>
            <div><strong>CPF:</strong> 111.444.777-35</div>
            <div><strong>Senha:</strong> senha123</div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {/* Campo de CPF */}
          <div style={{ marginBottom: "16px" }}>
            <DocumentInput
              label="CPF"
              placeholder="000.000.000-00"
              documentType="cpf"
              value={cpf}
              onChange={setCpf}
              required
              autoComplete="username"
              name="cpf"
            />
          </div>

          {/* Campo de Senha */}
          <div style={{ marginBottom: "16px" }}>
            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              required
              iconPosition="right"
              autoComplete="current-password"
              name="password"
            />
          </div>

          {/* Links */}
          <div style={{ marginBottom: "16px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
            <SecondaryLink
              href="#"
              color="#374151"
              onClick={handleForgotPassword}
            >
              Alterar senha
            </SecondaryLink>
            {onNavigateToRegister && (
              <SecondaryLink
                href="#"
                color="#2563eb"
                onClick={handleRegisterClick}
              >
                Não tem conta? Cadastre-se
              </SecondaryLink>
            )}
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div style={{ marginBottom: "16px" }}>
              <Alert type="error" message={error} />
            </div>
          )}

          {/* Botão de Submissão */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={!cpf || !password}
          >
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
