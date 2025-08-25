import React, { useState } from "react";
import ExampleContainer from "../ExampleContainer";
import Alert from "../../Alert/Alert";

const AlertExamples: React.FC = () => {
    const [showDismissible, setShowDismissible] = useState(true);

    return (
        <ExampleContainer
            title="Alert Component Examples"
            description="Different alert types for various system messages and notifications"
            size="large"
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Tipos de Alerta
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="error"
                            message="E-mail não encontrado no sistema. Verifique o endereço digitado."
                        />

                        <Alert
                            type="warning"
                            message="2 pacientes em estado crítico identificados. Ação imediata necessária."
                        />

                        <Alert
                            type="info"
                            message="Sistema será atualizado em 5 minutos. Salve seu trabalho."
                        />

                        <Alert
                            type="success"
                            message="Dados salvos com sucesso. Todas as alterações foram aplicadas."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Contextos de Uso
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="error"
                            message="Falha na conexão com o servidor. Tente novamente em alguns instantes."
                        />

                        <Alert
                            type="warning"
                            message="Sua sessão expirará em 2 minutos. Clique aqui para renovar."
                        />

                        <Alert
                            type="info"
                            message="Nova versão disponível. Atualize para ter acesso às últimas funcionalidades."
                        />

                        <Alert
                            type="success"
                            message="Backup realizado com sucesso. Próximo backup agendado para amanhã às 02:00."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Mensagens de Sistema
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="error"
                            message="Erro 404: Página não encontrada. Verifique a URL ou volte à página inicial."
                        />

                        <Alert
                            type="warning"
                            message="Memória do sistema em 85%. Considere fechar aplicações desnecessárias."
                        />

                        <Alert
                            type="info"
                            message="Manutenção programada para domingo, 15/12, das 02:00 às 06:00."
                        />

                        <Alert
                            type="success"
                            message="Sincronização concluída. 1.247 registros atualizados."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Mensagens de Validação
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="error"
                            message="Formulário contém 3 erros. Corrija os campos destacados antes de continuar."
                        />

                        <Alert
                            type="warning"
                            message="Alguns campos opcionais não foram preenchidos. Deseja continuar mesmo assim?"
                        />

                        <Alert
                            type="info"
                            message="Preencha todos os campos obrigatórios marcados com asterisco (*)."
                        />

                        <Alert
                            type="success"
                            message="Formulário validado com sucesso. Todos os dados estão corretos."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Mensagens Médicas/Hospitalares
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="error"
                            message="Paciente João Silva apresenta sinais vitais críticos. Intervenção imediata necessária."
                        />

                        <Alert
                            type="warning"
                            message="3 leitos de UTI disponíveis. Capacidade em 90%."
                        />

                        <Alert
                            type="info"
                            message="Novo protocolo de medicação disponível. Consulte as diretrizes atualizadas."
                        />

                        <Alert
                            type="success"
                            message="Cirurgia de Maria Santos concluída com sucesso. Paciente em recuperação."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Mensagens Longas
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="info"
                            message="O sistema passará por uma atualização importante no próximo domingo, das 02:00 às 06:00. Durante este período, algumas funcionalidades podem ficar temporariamente indisponíveis. Recomendamos que você salve todo o seu trabalho antes deste horário e evite realizar operações críticas durante a manutenção."
                        />

                        <Alert
                            type="warning"
                            message="Detectamos atividade suspeita em sua conta. Por segurança, algumas funcionalidades foram temporariamente bloqueadas. Se você não reconhece esta atividade, altere sua senha imediatamente e entre em contato com o suporte técnico através do telefone (11) 1234-5678 ou email suporte@sistema.com.br."
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Alertas Dismissíveis
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {showDismissible && (
                            <Alert
                                type="info"
                                message="Este alerta pode ser fechado clicando no X. Clique para testar a funcionalidade."
                                dismissible
                                onDismiss={() => setShowDismissible(false)}
                            />
                        )}

                        {!showDismissible && (
                            <div style={{
                                padding: "12px 16px",
                                backgroundColor: "#f9fafb",
                                border: "1px dashed #d1d5db",
                                borderRadius: "6px",
                                color: "#6b7280",
                                fontSize: "14px",
                                textAlign: "center"
                            }}>
                                Alerta foi fechado.
                                <button
                                    onClick={() => setShowDismissible(true)}
                                    style={{
                                        marginLeft: "8px",
                                        padding: "4px 8px",
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Mostrar novamente
                                </button>
                            </div>
                        )}

                        <Alert
                            type="warning"
                            message="Este alerta de aviso também pode ser fechado pelo usuário."
                            dismissible
                            onDismiss={() => alert("Alerta de aviso foi fechado!")}
                        />

                        <Alert
                            type="error"
                            message="Alertas de erro críticos geralmente não são dismissíveis, mas este exemplo mostra que é possível."
                            dismissible
                            onDismiss={() => alert("Alerta de erro foi fechado!")}
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "16px", fontWeight: "600" }}>
                        Com Classe Personalizada
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Alert
                            type="success"
                            message="Este alerta tem uma classe CSS personalizada aplicada."
                            className="custom-alert-example"
                        />
                    </div>
                </div>

            </div>
        </ExampleContainer>
    );
};

export default AlertExamples;