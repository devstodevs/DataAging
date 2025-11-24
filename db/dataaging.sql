CREATE TYPE enum_estado_civil AS ENUM (
    'SOLTEIRO', 'CASADO', 'SEPARADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL'
);

CREATE TYPE enum_estados_brasil AS ENUM (
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
);

CREATE TYPE enum_tipo_teste AS ENUM (
    'SEDENTARISMO', 'IVCF20', 'FACTF'
);

drop table endereco;
drop table teste;
drop table tecnico;
drop table paciente;
drop table pessoa;

CREATE TABLE pessoa (
    id SERIAL PRIMARY KEY,

);


CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    cep VARCHAR(15),
    logradouro VARCHAR(250),
    numero INT,
    complemento VARCHAR(100),
    bairro VARCHAR(50),
    municipio VARCHAR(50),
    uf enum_estados_brasil NOT NULL
);

CREATE TABLE tecnico (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(30) NOT NULL,
    tipo INT,
    ativo BOOLEAN,
    nome VARCHAR(100) NOT NULL,
    sexo VARCHAR(20),
    idade INT,
    data_nasc DATE,
    cpf VARCHAR(20),
    telefone VARCHAR(11),
    endereco_id INT REFERENCES endereco(id)
);


CREATE TABLE paciente (
    id SERIAL PRIMARY KEY,
    peso FLOAT,
    imc FLOAT,
    altura FLOAT,
    socioeconomico VARCHAR(50),
    escolaridade INT,
    estado_civil enum_estado_civil,
    nacionalidade VARCHAR(50),
    municipio_mae VARCHAR(50),
    uf_nasc enum_estados_brasil,
    cor_raca VARCHAR(30),
    rg VARCHAR(30),
    data_expedicao DATE,
    orgao_emissor VARCHAR(30),
    uf_emissor enum_estados_brasil,
    endereco_id INT REFERENCES endereco(id)
);


CREATE TABLE teste (
    id SERIAL PRIMARY KEY,
    tecnico_id INT REFERENCES tecnico(id),
    paciente_id INT REFERENCES paciente(id),
    pontuacao_total INT,
    pontuacao_maxima INT,
    data_criacao DATE,
    data_atualizacao DATE,
    tipo_teste enum_tipo_teste NOT NULL
);


























