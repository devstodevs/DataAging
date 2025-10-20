from sqlalchemy import Column, Integer, String, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from db.base import Base
import enum


class ProfileType(str, enum.Enum):
    """User profile types"""
    GESTOR = "gestor"
    TECNICO = "tecnico"


class User(Base):
    """User ORM model"""
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Basic information
    nome_completo = Column(String, nullable=False)
    cpf = Column(String, unique=True, nullable=False, index=True)
    telefone = Column(String, nullable=True)
    sexo = Column(String, nullable=True)
    data_nascimento = Column(Date, nullable=True)
    
    # Security
    hashed_password = Column(String, nullable=False)
    
    # Profile type
    profile_type = Column(SQLEnum(ProfileType), nullable=False)
    
    # Address fields
    cep = Column(String, nullable=True)
    logradouro = Column(String, nullable=True)
    numero = Column(String, nullable=True)
    complemento = Column(String, nullable=True)
    bairro = Column(String, nullable=True)
    municipio = Column(String, nullable=True)
    uf = Column(String, nullable=True)
    
    # Specific fields for Gestor
    matricula = Column(String, unique=True, nullable=True, index=True)
    
    # Specific fields for Tecnico
    registro_profissional = Column(String, nullable=True)
    especialidade = Column(String, nullable=True)
    unidade_lotacao_id = Column(Integer, nullable=True)  # FK can be added later when unidade model exists
    
    def __repr__(self):
        return f"<User(id={self.id}, nome={self.nome_completo}, cpf={self.cpf}, profile={self.profile_type})>"
