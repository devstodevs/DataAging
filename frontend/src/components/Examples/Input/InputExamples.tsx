import React, { useState } from "react";
import ExampleContainer from "../ExampleContainer";
import {
  TextInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
  CepInput,
  DateInput,
  NumberInput,
  DocumentInput,
  CurrencyInput,
} from "../../base/Input";

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
            <TextInput
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={setName}
              required
            />

            <PhoneInput
              label="Telefone"
              value={phone}
              onChange={setPhone}
              required
            />

            <DateInput
              label="Data de Nascimento"
              placeholder="Selecione uma data"
              value={date}
              onChange={setDate}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Email com Validação
          </h3>
          <EmailInput
            label="E-mail"
            placeholder="exemplo@dominio.com"
            value={email}
            onChange={setEmail}
            required
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Senha com Toggle
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <PasswordInput
              label="Senha (Ícone à Esquerda)"
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              required
              iconPosition="left"
            />
            <PasswordInput
              label="Senha (Ícone à Direita)"
              placeholder="Digite sua senha"
              value={password}
              onChange={setPassword}
              required
              iconPosition="right"
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Busca com Ícone
          </h3>
          <TextInput
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
            disableSuccessValidation
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "16px", color: "#374151" }}>
            Estados Especiais
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextInput
              label="Campo Desabilitado"
              placeholder="Este campo está desabilitado"
              value="Valor fixo"
              disabled
            />

            <TextInput
              label="Campo com Erro"
              placeholder="Digite algo"
              value=""
              error="Este campo é obrigatório"
            />

            <TextInput
              label="Campo Válido"
              placeholder="Digite algo"
              value="Valor válido"
              success
            />

            <EmailInput
              label="Email sem Validação de Sucesso"
              placeholder="exemplo@dominio.com"
              value="test@example.com"
            />

            <PhoneInput
              label="Telefone sem Validação de Sucesso"
              value="(11) 99999-9999"
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
            <NumberInput
              label="Número"
              placeholder="Digite um número"
              value={number}
              onChange={setNumber}
              min={1}
              max={9999999999}
            />

            <DocumentInput
              label="CPF"
              value={cpf}
              onChange={setCpf}
              documentType="cpf"
              required
            />

            <CepInput label="CEP" value={cep} onChange={setCep} required />

            <DocumentInput
              label="CNPJ"
              value={cnpj}
              onChange={setCnpj}
              documentType="cnpj"
              required
            />

            <CurrencyInput
              label="Valor"
              value={currency}
              onChange={setCurrency}
              required
            />

            <TextInput
              label="URL"
              placeholder="https://exemplo.com"
              autoComplete="url"
              disableSuccessValidation
            />
          </div>
        </div>
      </div>
    </ExampleContainer>
  );
};

export default InputExamples;
