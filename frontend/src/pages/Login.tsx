import React, { useState } from "react";
import Card from "../components/Card/Card";
import Title from "../components/Title/Title";
import Subtitle from "../components/Subtitle/Subtitle";
import Input from "../components/Input/Input";
import Alert from "../components/Alert/Alert";
import Button from "../components/Button/Button";
import SecondaryLink from "../components/SecondaryLink/SecondaryLink";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isEmailValid = email.length > 0 && validateEmail(email);
    const isEmailError = email.length > 0 && !validateEmail(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simular uma tentativa de login que falha para demonstrar o estado de erro
        setTimeout(() => {
            setError("E-mail ou senha inválidos");
            setIsLoading(false);
        }, 1000);
    };

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // implementar a lógica para recuperação de senha
        console.log("Esqueceu a senha clicado");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F9FAFB",
                padding: "20px",
            }}
        >
            {/* Título Principal */}
            <div style={{ marginBottom: "32px" }}>
                <Title level="h1" align="center">
                    Entrar na Plataforma
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
                        Digite suas credenciais para acessar sua conta
                    </Subtitle>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    {/* Campo de E-mail */}
                    <div style={{ marginBottom: "16px" }}>
                        <Input
                            label="E-mail"
                            placeholder="exemplo@dominio.com"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            required
                            error={isEmailError ? "E-mail inválido" : undefined}
                            success={isEmailValid}
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div style={{ marginBottom: "16px" }}>
                        <Input
                            label="Senha"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={setPassword}
                            type="password"
                            required
                            iconPosition="right"
                        />
                    </div>

                    {/* Link Esqueceu a Senha */}
                    <div style={{ marginBottom: "16px", textAlign: "center" }}>
                        <SecondaryLink href="#" color="#374151" onClick={handleForgotPassword}>
                            Esqueceu sua senha?
                        </SecondaryLink>
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
                        disabled={!email || !password}
                    >
                        Entrar
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;