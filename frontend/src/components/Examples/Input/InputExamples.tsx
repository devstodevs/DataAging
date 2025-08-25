import React, { useState } from "react";
import ExampleContainer from "../ExampleContainer";
import Input from "../../base/Input/Input";

const InputExamples: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [number, setNumber] = useState("");
  const [currency, setCurrency] = useState("");

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailValid = email.length > 0 && validateEmail(email);
  const isEmailError = email.length > 0 && !validateEmail(email);

  return (
    <ExampleContainer
      title="Input Component Examples"
      description="Different input types and validation states"
      size="large"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Basic Inputs
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={setName}
              required
            />

            <Input
              label="Telefone"
              value={phone}
              onChange={setPhone}
              type="tel"
              mask="phone"
              required
            />

            <Input
              label="Data de Nascimento"
              placeholder="Selecione uma data"
              value={date}
              onChange={setDate}
              type="date"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Email com Validação
          </h3>
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

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Senha com Toggle
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              label="Senha (Ícone à Esquerda)"
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              type="password"
              required
              iconPosition="left"
            />
            <Input
              label="Senha (Ícone à Direita)"
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              type="password"
              required
              iconPosition="right"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Busca com Ícone
          </h3>
          <Input
            label="Pesquisar"
            placeholder="Digite para pesquisar..."
            value={search}
            onChange={setSearch}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            }
            onIconClick={() => alert("Pesquisando por: " + search)}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Estados Especiais
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              label="Campo Desabilitado"
              placeholder="Este campo está desabilitado"
              value="Valor fixo"
              disabled
            />

            <Input
              label="Campo com Erro"
              placeholder="Digite algo"
              value=""
              error="Este campo é obrigatório"
            />

            <Input
              label="Campo Válido"
              placeholder="Digite algo"
              value="Valor válido"
              success
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Diferentes Tipos
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              label="Número"
              placeholder="Digite um número"
              type="number"
              value={number}
              onChange={setNumber}
              minLength={1}
              maxLength={10}
            />

            <Input
              label="CPF"
              value={cpf}
              onChange={setCpf}
              mask="cpf"
              required
            />

            <Input
              label="CEP"
              value={cep}
              onChange={setCep}
              mask="cep"
              required
            />

            <Input
              label="CNPJ"
              value={cnpj}
              onChange={setCnpj}
              mask="cnpj"
              required
            />

            <Input
              label="Valor"
              value={currency}
              onChange={setCurrency}
              mask="currency"
              required
            />

            <Input
              label="URL"
              placeholder="https://exemplo.com"
              type="text"
              autoComplete="url"
            />
          </div>
        </div>
      </div>
    </ExampleContainer>
  );
};

export default InputExamples;
