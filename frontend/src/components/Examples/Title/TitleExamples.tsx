import React from "react";
import ExampleContainer from "../ExampleContainer";
import Title from "../../Title/Title";

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
        title="H1 Title - Main Heading"
        description="Primary title for main screen or section"
        size="medium"
      >
        <Title level="h1">
          Entrar na Plataforma
        </Title>
      </ExampleContainer>

      <ExampleContainer
        title="H2 Title - Section Heading"
        description="Secondary title for subsections"
        size="medium"
      >
        <Title level="h2">
          Recuperar Senha
        </Title>
      </ExampleContainer>

      <ExampleContainer
        title="Centered Title"
        description="Title with center alignment"
        size="medium"
      >
        <Title level="h1" align="center">
          Cadastrar Novo Usuário
        </Title>
      </ExampleContainer>

      <ExampleContainer
        title="Right Aligned Title"
        description="Title with right alignment"
        size="medium"
      >
        <Title level="h2" align="right">
          Configurações da Conta
        </Title>
      </ExampleContainer>

      <ExampleContainer
        title="Long Title Example"
        description="Shows how the title handles longer text"
        size="large"
      >
        <Title level="h1" align="center">
          Bem-vindo ao Sistema de Gerenciamento de Dados
        </Title>
      </ExampleContainer>

      <ExampleContainer
        title="Title Hierarchy"
        description="Shows H1 and H2 together for comparison"
        size="large"
      >
        <Title level="h1" align="center">
          Dashboard Principal
        </Title>
        <div style={{ marginTop: "16px" }}>
          <Title level="h2" align="left">
            Estatísticas do Mês
          </Title>
        </div>
      </ExampleContainer>
    </div>
  );
};

export default TitleExamples;
