from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta
from jose import JWTError, jwt
from typing import Optional

from config import settings
from db.base import get_db
from db.user import user_crud
from db.user.user_crud import get_user_by_cpf
from models.user.user import User
from schemas.user import UserResponse
from schemas.auth import PasswordRecoveryRequest, PasswordRecoveryResponse
from services.auth import AuthService

router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/login")


class Token(BaseModel):
    """Esquema de resposta do token"""
    access_token: str
    user: UserResponse


class TokenData(BaseModel):
    """Esquema de dados do token"""
    cpf: Optional[str] = None


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Obtém o usuário autenticado atual a partir do token JWT.
    
    Args:
        token: Token JWT do cabeçalho Authorization
        db: Sessão do banco de dados
        
    Returns:
        Objeto User atual
        
    Raises:
        HTTPException: Se o token for inválido ou o usuário não for encontrado
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
        token_data = TokenData(cpf=cpf)
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_cpf(db, cpf=token_data.cpf)
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Endpoint de login - autentica o usuário e retorna token JWT.
    
    **Corpo da Requisição (form-data):**
    - username: CPF do usuário (sem formatação, ex: "11144477735")
    - password: Senha do usuário
    
    **Retorna:**
    - access_token: Token JWT para autenticação
    - user: Informações do usuário (sem senha)
    
    **Raises:**
    - 401: CPF ou senha incorretos
    
    **Nota:** Use o CPF como username no formulário de login.
    
    **Exemplo:**
    ```
    username: 11144477735
    password: senha123
    ```
    """
    # Use AuthService to authenticate and generate token
    return AuthService.login_user(db, form_data.username, form_data.password)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Obtém informações do usuário autenticado atual.
    
    **Cabeçalhos:**
    - Authorization: Bearer {token}
    
    **Retorna:**
    - Informações do usuário atual
    
    **Raises:**
    - 401: Token inválido ou ausente
    """
    return current_user


@router.post("/recover-password", response_model=PasswordRecoveryResponse)
def recover_password(
    password_data: PasswordRecoveryRequest,
    db: Session = Depends(get_db)
):
    """
    Recupera/altera a senha do usuário verificando a senha atual.
    
    **Corpo da Requisição:**
    - cpf: CPF do usuário (sem formatação, ex: "12345678901")
    - recovery_password: Senha atual para verificação
    - new_password: Nova senha (mínimo 6 caracteres)
    
    **Retorna:**
    - message: Mensagem de sucesso
    - success: Status de sucesso da operação
    
    **Raises:**
    - 404: Usuário não encontrado
    - 401: Senha atual incorreta
    - 500: Erro interno do servidor
    
    **Exemplo:**
    ```json
    {
        "cpf": "12345678901",
        "recovery_password": "senhaAtual123",
        "new_password": "novaSenha456"
    }
    ```
    """
    return AuthService.recover_password(
        db=db,
        cpf=password_data.cpf,
        recovery_password=password_data.recovery_password,
        new_password=password_data.new_password
    )