# DataAging API - User Management Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Endpoints

### 1. Create User (Gestor)
**POST** `/users/`

Creates a new Gestor (Manager) user.

**Request Body:**
```json
{
  "nome_completo": "João Silva",
  "cpf": "12345678901",
  "telefone": "(11) 98765-4321",
  "sexo": "Masculino",
  "data_nascimento": "1980-05-15",
  "cep": "01310-100",
  "logradouro": "Av. Paulista",
  "numero": "1000",
  "complemento": "Apto 101",
  "bairro": "Bela Vista",
  "municipio": "São Paulo",
  "uf": "SP",
  "matricula": "GES001",
  "password": "senha123",
  "profile_type": "gestor"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nome_completo": "João Silva",
  "cpf": "12345678901",
  "telefone": "(11) 98765-4321",
  "sexo": "Masculino",
  "data_nascimento": "1980-05-15",
  "cep": "01310-100",
  "logradouro": "Av. Paulista",
  "numero": "1000",
  "complemento": "Apto 101",
  "bairro": "Bela Vista",
  "municipio": "São Paulo",
  "uf": "SP",
  "matricula": "GES001",
  "profile_type": "gestor",
  "registro_profissional": null,
  "especialidade": null,
  "unidade_lotacao_id": null
}
```

### 2. Create User (Técnico)
**POST** `/users/`

Creates a new Técnico (Technician) user.

**Request Body:**
```json
{
  "nome_completo": "Maria Santos",
  "cpf": "98765432109",
  "telefone": "(11) 91234-5678",
  "sexo": "Feminino",
  "data_nascimento": "1990-08-20",
  "cep": "04567-890",
  "logradouro": "Rua das Flores",
  "numero": "500",
  "bairro": "Jardim Paulista",
  "municipio": "São Paulo",
  "uf": "SP",
  "registro_profissional": "CREA-SP 123456",
  "especialidade": "Engenharia Civil",
  "unidade_lotacao_id": 1,
  "password": "senha456",
  "profile_type": "tecnico"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "nome_completo": "Maria Santos",
  "cpf": "98765432109",
  "telefone": "(11) 91234-5678",
  "sexo": "Feminino",
  "data_nascimento": "1990-08-20",
  "cep": "04567-890",
  "logradouro": "Rua das Flores",
  "numero": "500",
  "complemento": null,
  "bairro": "Jardim Paulista",
  "municipio": "São Paulo",
  "uf": "SP",
  "matricula": null,
  "profile_type": "tecnico",
  "registro_profissional": "CREA-SP 123456",
  "especialidade": "Engenharia Civil",
  "unidade_lotacao_id": 1
}
```

### 3. List Users
**GET** `/users/?skip=0&limit=100`

Lists all users with pagination.

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum records to return (default: 100, max: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "12345678901",
    "profile_type": "gestor",
    "matricula": "GES001",
    ...
  },
  {
    "id": 2,
    "nome_completo": "Maria Santos",
    "cpf": "98765432109",
    "profile_type": "tecnico",
    "registro_profissional": "CREA-SP 123456",
    ...
  }
]
```

### 4. Get User by ID
**GET** `/users/{user_id}`

Retrieves a specific user by ID.

**Path Parameters:**
- `user_id`: User ID (integer)

**Response (200 OK):**
```json
{
  "id": 1,
  "nome_completo": "João Silva",
  "cpf": "12345678901",
  "telefone": "(11) 98765-4321",
  "profile_type": "gestor",
  "matricula": "GES001",
  ...
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Usuário não encontrado"
}
```

### 5. Update User
**PUT** `/users/{user_id}`

Updates an existing user. All fields are optional.

**Path Parameters:**
- `user_id`: User ID (integer)

**Request Body (example - partial update):**
```json
{
  "telefone": "(11) 99999-9999",
  "cep": "01310-200",
  "especialidade": "Engenharia Elétrica"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "nome_completo": "Maria Santos",
  "cpf": "98765432109",
  "telefone": "(11) 99999-9999",
  "cep": "01310-200",
  "especialidade": "Engenharia Elétrica",
  ...
}
```

**Error Responses:**
- **404 Not Found:** User not found
- **409 Conflict:** CPF or matricula already exists (if updating these fields)

### 6. Delete User
**DELETE** `/users/{user_id}`

Deletes a user.

**Path Parameters:**
- `user_id`: User ID (integer)

**Response (200 OK):**
```json
{
  "detail": "User deleted"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Usuário não encontrado"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict (duplicate CPF or matricula) |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Validation Rules

### Required Fields (Gestor)
- `nome_completo` (min: 3 chars, max: 200 chars)
- `cpf` (11 digits)
- `password` (min: 6 chars)
- `matricula` (min: 1 char, max: 50 chars)
- `profile_type` = "gestor"

### Required Fields (Técnico)
- `nome_completo` (min: 3 chars, max: 200 chars)
- `cpf` (11 digits)
- `password` (min: 6 chars)
- `profile_type` = "tecnico"

### Unique Fields
- `cpf` - Must be unique across all users
- `matricula` - Must be unique (for Gestores)

### Security
- Passwords are hashed using bcrypt before storage
- Passwords are never returned in API responses
- CPF is automatically cleaned (non-numeric characters removed)
- UF is automatically converted to uppercase

## Testing with cURL

### Create Gestor
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cpf": "12345678901",
    "telefone": "(11) 98765-4321",
    "matricula": "GES001",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

### Create Técnico
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Maria Santos",
    "cpf": "98765432109",
    "telefone": "(11) 91234-5678",
    "registro_profissional": "CREA-SP 123456",
    "especialidade": "Engenharia Civil",
    "password": "senha456",
    "profile_type": "tecnico"
  }'
```

### List Users
```bash
curl -X GET "http://localhost:8000/api/v1/users/"
```

### Get User by ID
```bash
curl -X GET "http://localhost:8000/api/v1/users/1"
```

### Update User
```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 99999-9999"
  }'
```

### Delete User
```bash
curl -X DELETE "http://localhost:8000/api/v1/users/1"
```
