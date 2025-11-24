# Testes cURL - DataAging API

---

## 1️⃣ Criar Usuários

### 1.1. Criar Usuário Gestor

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cpf": "11144477735",
    "telefone": "(11) 98765-4321",
    "sexo": "Masculino",
    "data_nascimento": "1985-03-15",
    "cep": "01310-100",
    "logradouro": "Av. Paulista",
    "numero": "1000",
    "complemento": "Sala 501",
    "bairro": "Bela Vista",
    "municipio": "São Paulo",
    "uf": "SP",
    "matricula": "GES001",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

### 1.2. Criar Usuário Técnico

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Maria Santos",
    "cpf": "12345678909",
    "telefone": "(11) 91234-5678",
    "sexo": "Feminino",
    "data_nascimento": "1990-07-22",
    "cep": "04567-890",
    "logradouro": "Rua das Flores",
    "numero": "250",
    "bairro": "Jardim Paulista",
    "municipio": "São Paulo",
    "uf": "SP",
    "registro_profissional": "CREA-SP 123456",
    "especialidade": "Engenharia Civil",
    "unidade_lotacao_id": 1,
    "password": "senha456",
    "profile_type": "tecnico"
  }'
```

### 1.3. Criar Gestor Mínimo (apenas campos obrigatórios)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Pedro Alves",
    "cpf": "11122233344",
    "matricula": "GES002",
    "password": "senha789",
    "profile_type": "gestor"
  }'
```

### 1.4. Criar Técnico Mínimo

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Ana Costa",
    "cpf": "55566677788",
    "password": "senha321",
    "profile_type": "tecnico"
  }'
```

### 1.5. Tentar Criar com CPF Duplicado (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Outro Usuário",
    "cpf": "11144477735",
    "matricula": "GES003",
    "password": "senha999",
    "profile_type": "gestor"
  }'
```

### 1.6. Tentar Criar com Matrícula Duplicada (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Outro Gestor",
    "cpf": "99988877766",
    "matricula": "GES001",
    "password": "senha999",
    "profile_type": "gestor"
  }'
```

---

## 2️⃣ Autenticação

### 2.1. Login com Credenciais Corretas

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=11144477735&password=senha123"
```

**💡 Copie o `access_token`**

### 2.2. Login com CPF Formatado (deve funcionar)

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=111.444.777-35&password=senha123"
```


### 2.3. Login com Senha Errada (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=12345678901&password=senhaerrada"
```

### 2.4. Login com CPF Inexistente (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=00000000000&password=senha123"
```

---

## 3️⃣ Endpoints Protegidos (Requerem Token)

### 3.1. Obter Dados do Usuário Atual

```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3.2. Tentar Acessar sem Token (deve falhar)

```bash
curl -X GET "http://localhost:8000/api/v1/me"
```

### 3.3. Tentar Acessar com Token Inválido (deve falhar)

```bash
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer token_invalido_123"
```

---

## 4️⃣ Listar Usuários

### 4.1. Listar Todos os Usuários

```bash
curl -X GET "http://localhost:8000/api/v1/users/"
```

### 4.2. Listar com Paginação

```bash
# Pular os primeiros 2 e retornar no máximo 5
curl -X GET "http://localhost:8000/api/v1/users/?skip=2&limit=5"
```

### 4.3. Listar Apenas 1 Usuário

```bash
curl -X GET "http://localhost:8000/api/v1/users/?skip=0&limit=1"
```

---

## 5️⃣ Buscar Usuário por ID

### 5.1. Buscar Usuário Existente

```bash
curl -X GET "http://localhost:8000/api/v1/users/1"
```

### 5.2. Buscar Usuário Inexistente (deve falhar)

```bash
curl -X GET "http://localhost:8000/api/v1/users/9999"
```

---

## 6️⃣ Atualizar Usuários

### 6.1. Atualizar Telefone

```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 99999-9999"
  }'
```

### 6.2. Atualizar Múltiplos Campos

```bash
curl -X PUT "http://localhost:8000/api/v1/users/2" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 98888-8888",
    "especialidade": "Engenharia Elétrica",
    "cep": "01310-200"
  }'
```

### 6.3. Atualizar Endereço Completo

```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "cep": "04567-890",
    "logradouro": "Rua Nova",
    "numero": "500",
    "complemento": "Apto 102",
    "bairro": "Centro",
    "municipio": "São Paulo",
    "uf": "SP"
  }'
```

### 6.4. Atualizar Senha

```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "novaSenha123"
  }'
```

### 6.5. Tentar Atualizar com CPF Duplicado (deve falhar)

```bash
curl -X PUT "http://localhost:8000/api/v1/users/2" \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901"
  }'
```

### 6.6. Atualizar Usuário Inexistente (deve falhar)

```bash
curl -X PUT "http://localhost:8000/api/v1/users/9999" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 99999-9999"
  }'
```

---

## 7️⃣ Deletar Usuários

### 7.1. Deletar Usuário Existente

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/3"
```

### 7.2. Deletar Usuário Inexistente (deve falhar)

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/9999"
```

### 7.3. Tentar Deletar Usuário Já Deletado (deve falhar)

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/3"
```

---

## 8️⃣ Testes de Validação

### 8.1. Criar com Nome Muito Curto (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "AB",
    "cpf": "11111111111",
    "matricula": "GES999",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

### 8.2. Criar com Senha Muito Curta (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Teste Validação",
    "cpf": "22222222222",
    "matricula": "GES998",
    "password": "123",
    "profile_type": "gestor"
  }'
```

### 8.3. Criar sem Campos Obrigatórios (deve falhar)

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Teste Sem Matricula",
    "cpf": "33333333333",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

---

## Checklist de Testes

- [ ] Criar usuário Gestor
- [ ] Criar usuário Técnico
- [ ] Login com credenciais corretas
- [ ] Login com senha errada (deve falhar)
- [ ] Acessar /me com token válido
- [ ] Acessar /me sem token (deve falhar)
- [ ] Listar todos os usuários
- [ ] Buscar usuário por ID
- [ ] Atualizar dados do usuário
- [ ] Deletar usuário
- [ ] Tentar criar com CPF duplicado (deve falhar)
- [ ] Tentar criar com matrícula duplicada (deve falhar)
- [ ] Validação de campos obrigatórios
