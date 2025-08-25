import React, { useState } from "react";
import ExampleContainer from "../ExampleContainer";
import SecondaryLink from "../../SecondaryLink/SecondaryLink";

const SecondaryLinkExamples: React.FC = () => {
    const [clickCount, setClickCount] = useState(0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <ExampleContainer
                title="Estados Básicos"
                description="Diferentes estados do SecondaryLink: normal, com ação, e desabilitado"
                size="medium"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
                    <div>
                        <SecondaryLink href="/forgot-password">
                            Esqueceu sua senha?
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="/login">
                            Voltar para login
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink onClick={() => setClickCount(prev => prev + 1)}>
                            Clique para ação (clicado {clickCount} vezes)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink disabled>
                            Link desabilitado
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Cores Customizadas"
                description="SecondaryLinks com diferentes cores usando a prop color"
                size="medium"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
                    <div>
                        <SecondaryLink href="#" color="#3b82f6">
                            Link azul (primário)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="#" color="#10b981">
                            Link verde (sucesso)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="#" color="#f59e0b">
                            Link amarelo (aviso)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="#" color="#ef4444">
                            Link vermelho (erro)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="#" color="#8b5cf6">
                            Link roxo (personalizado)
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="#" color="#374151">
                            Link cinza escuro
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Contexto de Login/Autenticação"
                description="SecondaryLinks em formulários de login e autenticação"
                size="medium"
            >
                <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    maxWidth: "400px",
                    margin: "0 auto"
                }}>
                    <h4 style={{ marginBottom: "16px", color: "#111827", fontSize: "18px", fontWeight: "600" }}>
                        Entrar na sua conta
                    </h4>

                    <form style={{ marginBottom: "16px" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", fontSize: "14px" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", fontSize: "14px" }}>
                                Senha
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                marginBottom: "16px"
                            }}
                        >
                            Entrar
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginBottom: "12px" }}>
                        <SecondaryLink href="/forgot-password">
                            Esqueceu sua senha?
                        </SecondaryLink>
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <SecondaryLink href="/register">
                            Não tem conta? Cadastre-se
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Navegação de Formulários"
                description="Links de navegação em formulários de recuperação e outros fluxos"
                size="medium"
            >
                <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    maxWidth: "500px",
                    margin: "0 auto"
                }}>
                    <h4 style={{ marginBottom: "8px", color: "#111827", fontSize: "18px", fontWeight: "600" }}>
                        Recuperar Senha
                    </h4>
                    <p style={{ marginBottom: "20px", color: "#6b7280", fontSize: "14px" }}>
                        Digite seu email para receber instruções de recuperação
                    </p>

                    <form style={{ marginBottom: "20px" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", fontSize: "14px" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                marginBottom: "16px"
                            }}
                        >
                            Enviar instruções
                        </button>
                    </form>

                    <div style={{ textAlign: "center" }}>
                        <SecondaryLink href="/login">
                            ← Voltar para login
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Links Externos e Navegação"
                description="Links para páginas externas, ajuda e políticas"
                size="small"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
                    <div>
                        <SecondaryLink href="https://example.com" target="_blank" rel="noopener noreferrer">
                            Abrir em nova aba ↗
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="/help">
                            Central de ajuda
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="/privacy">
                            Política de privacidade
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink href="/terms">
                            Termos de uso
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Contexto de Sistema/Dashboard"
                description="SecondaryLinks em interfaces de sistema e configurações"
                size="large"
            >
                <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    margin: "0 auto"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid #f3f4f6"
                    }}>
                        <h4 style={{ margin: 0, color: "#111827", fontSize: "18px", fontWeight: "600" }}>
                            Configurações da Conta
                        </h4>
                        <SecondaryLink href="/dashboard">
                            ← Voltar ao dashboard
                        </SecondaryLink>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
                            <h5 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
                                Informações Pessoais
                            </h5>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280" }}>
                                Atualize seus dados pessoais e informações de contato
                            </p>
                            <SecondaryLink href="/profile/edit">
                                Editar perfil
                            </SecondaryLink>
                        </div>

                        <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
                            <h5 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
                                Segurança
                            </h5>
                            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280" }}>
                                Gerencie sua senha e configurações de segurança
                            </p>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <SecondaryLink href="/security/password">
                                    Alterar senha
                                </SecondaryLink>
                                <SecondaryLink href="/security/2fa">
                                    Configurar 2FA
                                </SecondaryLink>
                            </div>
                        </div>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Ações Interativas"
                description="Links que executam ações em vez de navegar para outras páginas"
                size="small"
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
                    <div>
                        <SecondaryLink onClick={() => alert("Modal de ajuda aberto!")}>
                            Precisa de ajuda?
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink onClick={() => alert("Feedback enviado!")}>
                            Enviar feedback
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink onClick={() => alert("Chat iniciado!")}>
                            Falar com suporte
                        </SecondaryLink>
                    </div>

                    <div>
                        <SecondaryLink onClick={() => alert("Tour iniciado!")}>
                            Fazer tour do sistema
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Estados de Erro e Recuperação"
                description="SecondaryLinks em contextos de erro e recuperação do sistema"
                size="medium"
            >
                <div style={{
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "24px",
                    backgroundColor: "#fef2f2",
                    maxWidth: "500px",
                    margin: "0 auto"
                }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626" style={{ marginRight: "8px" }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <h4 style={{ margin: 0, color: "#dc2626", fontSize: "16px", fontWeight: "600" }}>
                            Erro de Conexão
                        </h4>
                    </div>

                    <p style={{ marginBottom: "16px", color: "#7f1d1d", fontSize: "14px" }}>
                        Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
                    </p>

                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "500",
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                        >
                            Tentar novamente
                        </button>

                        <SecondaryLink onClick={() => alert("Modo offline ativado!")}>
                            Trabalhar offline
                        </SecondaryLink>

                        <SecondaryLink href="/help/connection">
                            Ajuda com conexão
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

            <ExampleContainer
                title="Navegação em Listas e Tabelas"
                description="SecondaryLinks para ações em listas de dados e tabelas"
                size="large"
            >
                <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    margin: "0 auto"
                }}>
                    <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                            Pacientes Recentes
                        </h4>
                    </div>

                    <div style={{ padding: "0" }}>
                        {[
                            { name: "João Silva", id: "001", status: "Ativo" },
                            { name: "Maria Santos", id: "002", status: "Em consulta" },
                            { name: "Pedro Oliveira", id: "003", status: "Aguardando" }
                        ].map((patient, index) => (
                            <div
                                key={patient.id}
                                style={{
                                    padding: "16px",
                                    borderBottom: index < 2 ? "1px solid #f3f4f6" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                                        {patient.name}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                        ID: {patient.id} • {patient.status}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "12px" }}>
                                    <SecondaryLink href={`/patients/${patient.id}`}>
                                        Ver detalhes
                                    </SecondaryLink>
                                    <SecondaryLink href={`/patients/${patient.id}/edit`}>
                                        Editar
                                    </SecondaryLink>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: "16px", textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
                        <SecondaryLink href="/patients">
                            Ver todos os pacientes
                        </SecondaryLink>
                    </div>
                </div>
            </ExampleContainer>

        </div>
    );
};

export default SecondaryLinkExamples;