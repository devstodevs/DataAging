import React, { useState } from "react";
import ExampleContainer from "../ExampleContainer";
import Button from "../../base/Button/Button";

const ButtonExamples: React.FC = () => {
  const [loadingState, setLoadingState] = useState(false);

  const handleLoadingClick = () => {
    setLoadingState(true);
    setTimeout(() => setLoadingState(false), 3000);
  };

  const ArrowIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );

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
        title="Primary Button"
        description="Standard primary button with default styling"
        size="medium"
      >
        <Button
          variant="primary"
          onClick={() => alert("Primary button clicked!")}
        >
          Entrar
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Full Width Button"
        description="Button that takes full width of its container"
        size="medium"
      >
        <Button fullWidth onClick={() => alert("Full width button clicked!")}>
          Continuar
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Button with Left Icon"
        description="Button with icon positioned on the left"
        size="medium"
      >
        <Button
          icon={<CheckIcon />}
          iconPosition="left"
          onClick={() => alert("Button with left icon clicked!")}
        >
          Confirmar
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Button with Right Icon"
        description="Button with icon positioned on the right"
        size="medium"
      >
        <Button
          icon={<ArrowIcon />}
          iconPosition="right"
          onClick={() => alert("Button with right icon clicked!")}
        >
          Próximo
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Loading Button"
        description="Button in loading state with spinner"
        size="medium"
      >
        <Button
          loading={loadingState}
          onClick={handleLoadingClick}
          disabled={loadingState}
        >
          Enviar Instruções
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Disabled Button"
        description="Button in disabled state"
        size="medium"
      >
        <Button
          variant="primary"
          disabled
          onClick={() => alert("This won't trigger")}
        >
          Botão Desabilitado
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Variant Examples with Context"
        description="Shows different variants in appropriate contexts"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Button variant="success" onClick={() => alert("Saved!")}>
              Salvar Alterações
            </Button>
            <Button variant="secondary" onClick={() => alert("Cancelled!")}>
              Cancelar
            </Button>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Button variant="danger" onClick={() => alert("Are you sure?")}>
              Excluir Conta
            </Button>
            <Button variant="warning" onClick={() => alert("Warning!")}>
              Ação Perigosa
            </Button>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Button variant="info" onClick={() => alert("More info!")}>
              Mais Informações
            </Button>
            <Button variant="light" onClick={() => alert("Light action!")}>
              Ação Secundária
            </Button>
          </div>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Submit Button"
        description="Button with submit type for forms"
        size="medium"
      >
        <Button type="submit" onClick={() => alert("Form submitted!")}>
          Enviar Formulário
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="Link Button"
        description="Button that acts as a link"
        size="medium"
      >
        <Button
          href="/home "
          onClick={() => alert("Navigating to home...")}
        >
          Ir para Home
        </Button>
      </ExampleContainer>

      <ExampleContainer
        title="All Button Variants"
        description="Shows all available button variants"
        size="large"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <Button variant="primary" onClick={() => alert("Primary clicked!")}>
            Primary
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert("Secondary clicked!")}
          >
            Secondary
          </Button>
          <Button variant="success" onClick={() => alert("Success clicked!")}>
            Success
          </Button>
          <Button variant="danger" onClick={() => alert("Danger clicked!")}>
            Danger
          </Button>
          <Button variant="warning" onClick={() => alert("Warning clicked!")}>
            Warning
          </Button>
          <Button variant="info" onClick={() => alert("Info clicked!")}>
            Info
          </Button>
          <Button variant="light" onClick={() => alert("Light clicked!")}>
            Light
          </Button>
          <Button variant="dark" onClick={() => alert("Dark clicked!")}>
            Dark
          </Button>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Button Sizes Comparison"
        description="Shows different button configurations"
        size="large"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start",
          }}
        >
          <Button
            variant="primary"
            onClick={() => alert("Small button clicked!")}
          >
            Botão Pequeno
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => alert("Full width button clicked!")}
          >
            Botão Largura Completa
          </Button>
          <Button
            variant="primary"
            icon={<ArrowIcon />}
            iconPosition="right"
            onClick={() => alert("Icon button clicked!")}
          >
            Botão com Ícone
          </Button>
        </div>
      </ExampleContainer>

      <ExampleContainer
        title="Form Context Example"
        description="Shows button in a typical form context"
        size="large"
      >
        <div
          style={{
            padding: "24px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "#1F2937" }}>Login Form</h3>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="email"
              placeholder="Email"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
                marginBottom: "8px",
              }}
            />
            <input
              type="password"
              placeholder="Senha"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <Button fullWidth onClick={() => alert("Login attempt!")}>
            Entrar na Conta
          </Button>
        </div>
      </ExampleContainer>
    </div>
  );
};

export default ButtonExamples;
