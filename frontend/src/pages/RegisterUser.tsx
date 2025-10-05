import React, { useState } from "react";
import Card from "../components/base/Card";
import Title from "../components/base/Title";
import Tabs, { type Tab } from "../components/base/Tabs";
import Select, { type SelectOption } from "../components/base/Select";
import Button from "../components/base/Button";
import TextInput from "../components/base/Input/TextInput";
import DocumentInput from "../components/base/Input/DocumentInput";
import PhoneInput from "../components/base/Input/PhoneInput";
import CEPInput from "../components/base/Input/CepInput";
import DateInput from "../components/base/Input/DateInput";
import "./RegisterUser.css";

interface FormData {
  // Dados Pessoais - Gestor
  matricula: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  sexo: string;
  dataNascimento: string;
  // Dados Profissionais - Técnico
  registroProfissional: string;
  especialidade: string;
  unidadeLotacao: string;
  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
}

const RegisterUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("gestor");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    matricula: "",
    nomeCompleto: "",
    cpf: "",
    telefone: "",
    sexo: "",
    dataNascimento: "",
    registroProfissional: "",
    especialidade: "",
    unidadeLotacao: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    municipio: "",
    uf: "",
  });

  const tabs: Tab[] = [
    { id: "gestor", label: "Gestor" },
    { id: "tecnico", label: "Técnico" },
  ];

  const sexoOptions: SelectOption[] = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
  ];

  const ufOptions: SelectOption[] = [
    { value: "AC", label: "AC" },
    { value: "AL", label: "AL" },
    { value: "AP", label: "AP" },
    { value: "AM", label: "AM" },
    { value: "BA", label: "BA" },
    { value: "CE", label: "CE" },
    { value: "DF", label: "DF" },
    { value: "ES", label: "ES" },
    { value: "GO", label: "GO" },
    { value: "MA", label: "MA" },
    { value: "MT", label: "MT" },
    { value: "MS", label: "MS" },
    { value: "MG", label: "MG" },
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PR", label: "PR" },
    { value: "PE", label: "PE" },
    { value: "PI", label: "PI" },
    { value: "RJ", label: "RJ" },
    { value: "RN", label: "RN" },
    { value: "RS", label: "RS" },
    { value: "RO", label: "RO" },
    { value: "RR", label: "RR" },
    { value: "SC", label: "SC" },
    { value: "SP", label: "SP" },
    { value: "SE", label: "SE" },
    { value: "TO", label: "TO" },
  ];

  const unidadeOptions: SelectOption[] = [
    { value: "unidade1", label: "Unidade Central" },
    { value: "unidade2", label: "Unidade Norte" },
    { value: "unidade3", label: "Unidade Sul" },
    { value: "unidade4", label: "Unidade Leste" },
    { value: "unidade5", label: "Unidade Oeste" },
  ];

  const especialidadeOptions: SelectOption[] = [
    { value: "fisioterapia", label: "Fisioterapia" },
    { value: "enfermagem", label: "Enfermagem" },
    { value: "medicina", label: "Medicina" },
    { value: "nutricao", label: "Nutrição" },
    { value: "psicologia", label: "Psicologia" },
    { value: "terapia_ocupacional", label: "Terapia Ocupacional" },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBuscarCep = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, "");
    
    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    setIsLoadingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        municipio: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do formulário:", {
      tipo: activeTab,
      ...formData,
    });
    alert(`Usuário ${activeTab} cadastrado com sucesso!`);
  };

  return (
    <div className="register-user-page">
      <div className="register-user-container">
        <Title level="h1" align="center" className="page-title">
          Cadastrar Novo Usuário
        </Title>

        <Card maxWidth="800px" className="register-card">
          <Tabs
            tabs={tabs}
            defaultActiveTab="gestor"
            onTabChange={setActiveTab}
          />

          <form onSubmit={handleSubmit}>
            {/* Dados Pessoais */}
            <div className="form-section">
              <h3 className="section-title">Dados Pessoais</h3>

              <div className="form-grid">
                {activeTab === "gestor" && (
                  <div className="form-field">
                    <TextInput
                      label="Matrícula"
                      placeholder="Digite sua matrícula"
                      value={formData.matricula}
                      onChange={(value) => handleInputChange("matricula", value)}
                      required
                    />
                  </div>
                )}

                <div className={activeTab === "gestor" ? "form-field" : "form-field-full"}>
                  <TextInput
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    value={formData.nomeCompleto}
                    onChange={(value) => handleInputChange("nomeCompleto", value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <DocumentInput
                    label="CPF"
                    placeholder="000.000.000-00"
                    documentType="cpf"
                    value={formData.cpf}
                    onChange={(value) => handleInputChange("cpf", value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <PhoneInput
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(value) => handleInputChange("telefone", value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <Select
                    label="Sexo"
                    placeholder="Selecione"
                    options={sexoOptions}
                    value={formData.sexo}
                    onChange={(value) => handleInputChange("sexo", value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <DateInput
                    label="Data de Nascimento"
                    placeholder="DD/MM/AAAA"
                    value={formData.dataNascimento}
                    onChange={(value) => handleInputChange("dataNascimento", value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dados Profissionais - Apenas para Técnico */}
            {activeTab === "tecnico" && (
              <div className="form-section">
                <h3 className="section-title">Dados Profissionais</h3>

                <div className="form-grid">
                  <div className="form-field">
                    <TextInput
                      label="Registro Profissional"
                      placeholder="Ex: CREFITO 123456"
                      value={formData.registroProfissional}
                      onChange={(value) =>
                        handleInputChange("registroProfissional", value)
                      }
                      required
                    />
                  </div>

                  <div className="form-field">
                    <Select
                      label="Especialidade"
                      placeholder="Selecione"
                      options={especialidadeOptions}
                      value={formData.especialidade}
                      onChange={(value) => handleInputChange("especialidade", value)}
                      required
                    />
                  </div>

                  <div className="form-field-full">
                    <Select
                      label="Unidade de Lotação"
                      placeholder="Selecione"
                      options={unidadeOptions}
                      value={formData.unidadeLotacao}
                      onChange={(value) => handleInputChange("unidadeLotacao", value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Endereço */}
            <div className="form-section">
              <h3 className="section-title">Endereço</h3>

              <div className="form-grid">
                <div className="cep-field">
                  <CEPInput
                    label="CEP"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(value) => handleInputChange("cep", value)}
                    required
                  />
                </div>

                <div className="cep-button-field">
                  <Button
                    variant="primary"
                    onClick={handleBuscarCep}
                    loading={isLoadingCep}
                    disabled={formData.cep.replace(/\D/g, "").length !== 8}
                    type="button"
                    className="buscar-cep-button"
                  >
                    Buscar
                  </Button>
                </div>

                <div className="form-field-full">
                  <TextInput
                    label="Logradouro"
                    placeholder="Rua / Avenida"
                    value={formData.logradouro}
                    onChange={(value) => handleInputChange("logradouro", value)}
                    disabled={isLoadingCep}
                    required
                  />
                </div>

                <div className="form-field">
                  <TextInput
                    label="Número"
                    placeholder="Nº"
                    value={formData.numero}
                    onChange={(value) => handleInputChange("numero", value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <TextInput
                    label="Complemento"
                    placeholder="Apto / Bloco / Casa"
                    value={formData.complemento}
                    onChange={(value) => handleInputChange("complemento", value)}
                  />
                </div>

                <div className="form-field">
                  <TextInput
                    label="Bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(value) => handleInputChange("bairro", value)}
                    disabled={isLoadingCep}
                    required
                  />
                </div>

                <div className="form-field">
                  <TextInput
                    label="Município"
                    placeholder="Cidade"
                    value={formData.municipio}
                    onChange={(value) => handleInputChange("municipio", value)}
                    disabled={isLoadingCep}
                    required
                  />
                </div>

                <div className="form-field-small">
                  <Select
                    label="UF"
                    placeholder="Estado"
                    options={ufOptions}
                    value={formData.uf}
                    onChange={(value) => handleInputChange("uf", value)}
                    disabled={isLoadingCep}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}
            <div className="form-actions">
              <Button type="submit" variant="primary" fullWidth>
                Continuar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUser;
