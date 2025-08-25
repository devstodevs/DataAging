import React from "react";
import ExampleContainer from "../ExampleContainer";
import Subtitle from "../../Subtitle/Subtitle";
import Title from "../../Title/Title";

const SubtitleExamples: React.FC = () => {
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
        title="Basic Subtitle"
        description="Simple subtitle with default styling"
        size="medium"
      >
        <Subtitle>
          Bem-vindo de volta! Digite suas credenciais para acessar sua conta.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Subtitle with Title"
        description="Shows how subtitle works with a main title"
        size="medium"
      >
        <Title level="h1" align="center">
          Entrar na Plataforma
        </Title>
        <div style={{ marginTop: "8px" }}>
          <Subtitle align="center">
            Digite suas credenciais para acessar sua conta
          </Subtitle>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Small Subtitle"
        description="Subtitle with small size (14px)"
        size="medium"
      >
        <Subtitle size="small">
          Informação adicional em tamanho menor para contexto secundário.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Large Subtitle"
        description="Subtitle with large size (16px)"
        size="medium"
      >
        <Subtitle size="large">
          Texto de destaque com tamanho maior para informações importantes.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Centered Subtitle"
        description="Subtitle with center alignment"
        size="medium"
      >
        <Subtitle align="center">
          Este texto está centralizado para melhor apresentação visual.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Right Aligned Subtitle"
        description="Subtitle with right alignment"
        size="medium"
      >
        <Subtitle align="right">
          Texto alinhado à direita para layouts específicos.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Multi-line Subtitle"
        description="Shows how subtitle handles longer text with multiple lines"
        size="large"
      >
        <Subtitle>
          Este é um exemplo de subtítulo com múltiplas linhas de texto.
          Ele demonstra como o componente se comporta com conteúdo mais extenso
          e como a quebra de linha funciona naturalmente.
        </Subtitle>
      </ExampleContainer>

      <ExampleContainer
        title="Form Context Example"
        description="Shows subtitle in a typical form context"
        size="large"
      >
        <Title level="h1" align="center">
          Recuperar Senha
        </Title>
        <div style={{ marginTop: "8px", marginBottom: "24px" }}>
          <Subtitle align="center">
            Digite seu email para receber um link de redefinição de senha
          </Subtitle>
        </div>
        <div style={{
          padding: "16px",
          backgroundColor: "#F9FAFB",
          borderRadius: "6px",
          border: "1px solid #E5E7EB"
        }}>
          <p style={{ margin: "0", fontSize: "14px", color: "#6B7280" }}>
            [Form inputs would go here]
          </p>
        </div>
      </ExampleContainer>
    </div>
  );
};

export default SubtitleExamples;
