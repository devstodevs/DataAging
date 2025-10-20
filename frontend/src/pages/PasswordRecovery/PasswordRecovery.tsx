import React, { useState } from "react";
import Card from "../../components/base/Card/Card";
import Title from "../../components/base/Title/Title";
import Subtitle from "../../components/base/Subtitle/Subtitle";
import { PasswordInput } from "../../components/base/Input";
import DocumentInput from "../../components/base/Input/DocumentInput";
import Alert from "../../components/base/Alert/Alert";
import Button from "../../components/base/Button/Button";
import SecondaryLink from "../../components/base/SecondaryLink/SecondaryLink";
import { validateCPF } from "../../utils/cpfValidator";

interface PasswordRecoveryProps {
  onNavigateToLogin?: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onNavigateToLogin }) => {
  const [cpf, setCpf] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar CPF
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    // Validar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      setError("A nova senha e a confirmação devem ser iguais");
      return;
    }

    // Validar tamanho da nova senha
    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/recover-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: cpf.replace(/\D/g, ""), // Remove formatação do CPF
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao alterar senha");
      }

      setSuccess("Senha alterada com sucesso!");
      
      // Limpar formulário após sucesso
      setCpf("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
      {/* Título Principal */}
      <div className="mb-8">
        <Title level="h1" align="center">
          Recuperação de Senha
        </Title>
      </div>

      {/* Card Principal */}
      <Card maxWidth="400px">
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <div style={{ marginBottom: "8px" }}>
            <Title size="small" align="left">
              Alterar Senha
            </Title>
          </div>
          <Subtitle align="left">
            Digite seu CPF, senha atual e a nova senha
          </Subtitle>
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
            />
          </div>

          {/* Campo de Senha Atual */}
          <div style={{ marginBottom: "16px" }}>
            <PasswordInput
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
              iconPosition="right"
            />
          </div>

          {/* Campo de Nova Senha */}
          <div style={{ marginBottom: "16px" }}>
            <PasswordInput
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChange={setNewPassword}
              required
              iconPosition="right"
            />
          </div>

          {/* Campo de Confirmação de Senha */}
          <div style={{ marginBottom: "16px" }}>
            <PasswordInput
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              iconPosition="right"
            />
          </div>

          {/* Link para Login */}
          <div style={{ marginBottom: "16px", textAlign: "center" }}>
            <SecondaryLink
              href="#"
              color="#2563eb"
              onClick={handleLoginClick}
            >
              Voltar para o login
            </SecondaryLink>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div style={{ marginBottom: "16px" }}>
              <Alert type="error" message={error} />
            </div>
          )}

          {/* Alerta de Sucesso */}
          {success && (
            <div style={{ marginBottom: "16px" }}>
              <Alert type="success" message={success} />
            </div>
          )}

          {/* Botão de Submissão */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={!cpf || !currentPassword || !newPassword || !confirmPassword}
          >
            Alterar Senha
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PasswordRecovery;