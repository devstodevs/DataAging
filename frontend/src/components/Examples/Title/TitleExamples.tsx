import React from "react";
import ExampleContainer from "../ExampleContainer";
import Title from "../../base/Title/Title";

const TitleExamples: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "16px 0",
      }}
    >
      <ExampleContainer
        title="Size Prop - Small, Medium, Large"
        description="New size prop with small, medium, and large options"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Title size="small">
            Small Title (20px)
          </Title>
          <Title size="medium">
            Medium Title (24px)
          </Title>
          <Title size="large">
            Large Title (32px)
          </Title>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Size Comparison"
        description="All sizes together for visual comparison"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Title size="small" align="center">
            Título Pequeno
          </Title>
          <Title size="medium" align="center">
            Título Médio
          </Title>
          <Title size="large" align="center">
            Título Grande
          </Title>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Alignment with Size Props"
        description="Different alignments using the new size props"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Title size="large" align="left">
            Alinhado à Esquerda
          </Title>
          <Title size="medium" align="center">
            Centralizado
          </Title>
          <Title size="small" align="right">
            Alinhado à Direita
          </Title>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Legacy Level Props (Backward Compatibility)"
        description="Original level prop still works for backward compatibility"
        size="medium"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Title level="h1">
            H1 Level (32px)
          </Title>
          <Title level="h2">
            H2 Level (24px)
          </Title>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Real-world Usage Examples"
        description="Common use cases with the new size props"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <Title size="large" align="center">
              Acesso ao DataAging
            </Title>
            <div style={{ marginTop: "8px" }}>
              <Title size="medium" align="center">
                Bem-vindo de volta
              </Title>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
            <Title size="medium">
              Configurações da Conta
            </Title>
            <div style={{ marginTop: "12px" }}>
              <Title size="small">
                Informações Pessoais
              </Title>
            </div>
          </div>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Long Text Handling"
        description="How different sizes handle longer text content"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Title size="large" align="center">
            Sistema de Gerenciamento Completo de Dados e Relatórios
          </Title>
          <Title size="medium" align="center">
            Painel de Controle e Monitoramento em Tempo Real
          </Title>
          <Title size="small" align="center">
            Configurações Avançadas de Segurança e Privacidade
          </Title>
        </div>
      </ExampleContainer>
    </div>
  );
};

export default TitleExamples;
