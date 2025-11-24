# Authentication API Documentation

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication. Users login with their CPF and password, and receive a token that must be included in subsequent requests.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication Flow

1. **Create User** → Use `/users/` endpoint to register
2. **Login** → Use `/login` to get JWT token
3. **Access Protected Routes** → Include token in Authorization header
4. **Get Current User** → Use `/me` to verify token and get user info

---

## Endpoints

### 1. Login (Get Access Token)

**POST** `/login`

Authenticate a user and receive a JWT access token.

**Request (form-data):**
```
username: 11144477735  (CPF without formatting)
password: senha123
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=11144477735&password=senha123"
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome_completo": "João Silva",
    "cpf": "11144477735",
    "telefone": "(11) 98765-4321",
    "sexo": "Masculino",
    "data_nascimento": "1980-05-15",
    "profile_type": "gestor",
    "matricula": "GES001",
    "cep": "01310-100",
    "logradouro": "Av. Paulista",
    "numero": "1000",
    "complemento": "Apto 101",
    "bairro": "Bela Vista",
    "municipio": "São Paulo",
    "uf": "SP",
    "registro_profissional": null,
    "especialidade": null,
    "unidade_lotacao_id": null
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "CPF ou senha incorretos"
}
```

---

### 2. Get Current User Info

**GET** `/me`

Get information about the currently authenticated user.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Could not validate credentials"
}
```

---

## Using Authentication in Requests

### Step 1: Login and Get Token

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=11144477735&password=senha123"

# Response includes access_token
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### Step 2: Use Token in Protected Requests

```bash
# Get current user info
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Access other protected endpoints (when implemented)
curl -X GET "http://localhost:8000/api/v1/protected-resource" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Token Details

### Token Structure

The JWT token contains:
- **sub**: User CPF
- **user_id**: User database ID
- **profile_type**: User profile type (gestor/tecnico)
- **exp**: Expiration timestamp

### Token Expiration

- Default: 30 minutes
- Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` in settings

### Token Format

```
Authorization: Bearer <token>
```

---

## Security Features

### Password Security
- Passwords hashed with bcrypt
- Passwords never returned in responses
- Minimum 6 characters required

### Token Security
- JWT signed with secret key
- Tokens expire after configured time
- Tokens validated on each request

### Authentication
- CPF-based authentication
- Automatic CPF cleaning (removes formatting)
- Secure password verification

---

## Complete Authentication Example

### 1. Create a User

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cpf": "11144477735",
    "telefone": "(11) 98765-4321",
    "matricula": "GES001",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

### 2. Login with Created User

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=11144477735&password=senha123"
```

**Save the access_token from response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwMSIsInVzZXJfaWQiOjEsInByb2ZpbGVfdHlwZSI6Imdlc3RvciIsImV4cCI6MTY5ODM2MjQwMH0.abc123...",
  "user": {...}
}
```

### 3. Access Protected Endpoint

```bash
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwMSIsInVzZXJfaWQiOjEsInByb2ZpbGVfdHlwZSI6Imdlc3RvciIsImV4cCI6MTY5ODM2MjQwMH0.abc123..."
```

---

## Using with Swagger UI

### 1. Go to Swagger UI
```
http://localhost:8000/docs
```

### 2. Login
1. Expand the **POST /api/v1/login** endpoint
2. Click "Try it out"
3. Enter:
   - username: `11144477735` (your CPF)
   - password: `senha123` (your password)
4. Click "Execute"
5. Copy the `access_token` from the response

### 3. Authorize
1. Click the **🔓 Authorize** button at the top right
2. In the "Value" field, enter: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"
4. Click "Close"

### 4. Access Protected Endpoints
Now all requests will include your token automatically!

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 401 | Unauthorized (invalid credentials or token) |
| 422 | Validation Error |

---

## Python Client Example

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# 1. Login
login_data = {
    "username": "11144477735",
    "password": "senha123"
}

response = requests.post(
    f"{BASE_URL}/login",
    data=login_data
)

token_data = response.json()
access_token = token_data["access_token"]
user = token_data["user"]

print(f"Logged in as: {user['nome_completo']}")
print(f"Token: {access_token[:50]}...")

# 2. Use token in subsequent requests
headers = {
    "Authorization": f"Bearer {access_token}"
}

# Get current user info
response = requests.get(
    f"{BASE_URL}/me",
    headers=headers
)

current_user = response.json()
print(f"Current user: {current_user['nome_completo']}")
```

---

## JavaScript/Fetch Example

```javascript
const BASE_URL = "http://localhost:8000/api/v1";

// 1. Login
async function login(cpf, password) {
  const formData = new URLSearchParams();
  formData.append('username', cpf);
  formData.append('password', password);
  
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });
  
  const data = await response.json();
  
  // Save token to localStorage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// 2. Get current user
async function getCurrentUser() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${BASE_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Usage
login('11144477735', 'senha123')
  .then(data => {
    console.log('Logged in:', data.user.nome_completo);
    return getCurrentUser();
  })
  .then(user => {
    console.log('Current user:', user);
  });
```

---

## Protecting Your Own Endpoints

To protect your custom endpoints, use the `get_current_user` dependency:

```python
from fastapi import APIRouter, Depends
from api.auth import get_current_user
from models.user import User

router = APIRouter()

@router.get("/protected-resource")
def get_protected_resource(current_user: User = Depends(get_current_user)):
    """
    This endpoint requires authentication.
    The current_user will be automatically injected.
    """
    return {
        "message": f"Hello {current_user.nome_completo}!",
        "user_id": current_user.id,
        "profile": current_user.profile_type
    }
```

---

## Troubleshooting

### "CPF ou senha incorretos"
- Verify CPF is correct (11 digits, no formatting)
- Verify password matches the one used during registration
- CPF is case-insensitive and formatting is automatically removed

### "Could not validate credentials"
- Token may be expired (default: 30 minutes)
- Token may be invalid or malformed
- Login again to get a new token

### Token Not Working
- Ensure format is: `Bearer <token>` (with space)
- Check token hasn't expired
- Verify Authorization header is included

---

## Configuration

Edit `.env` or `src/config.py`:

```python
# JWT Settings
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Important:** Change `SECRET_KEY` in production! Generate a secure key:
```bash
openssl rand -hex 32
```
