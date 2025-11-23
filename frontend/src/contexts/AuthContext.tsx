import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_CONFIG } from '../config/api';

// Tipos
interface User {
  id: number;
  cpf: string;
  nome_completo: string;
  profile_type: 'gestor' | 'tecnico';
  telefone?: string;
  sexo?: string;
  data_nascimento?: string;
  matricula?: string;
  registro_profissional?: string;
  especialidade?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  cpf: string;
  password: string;
  recovery_password: string;
  nome_completo: string;
  profile_type: 'gestor' | 'tecnico';
  telefone?: string;
  sexo?: string;
  data_nascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  // Campos específicos do Gestor
  matricula?: string;
  // Campos específicos do Técnico
  registro_profissional?: string;
  especialidade?: string;
  unidade_lotacao_id?: number;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = API_CONFIG.BASE_URL;

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (cpf: string, password: string): Promise<void> => {
    try {
      // Limpar CPF (remover pontos e traços)
      const cleanCpf = cpf.replace(/\D/g, '');
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: cleanCpf,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // O backend já retorna o usuário junto com o token
      // Salvar no estado e localStorage
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Tratar diferentes tipos de erro
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Erros de validação do Pydantic
            interface ValidationError {
              loc?: (string | number)[];
              msg?: string;
            }
            const errorMessages = (errorData.detail as ValidationError[]).map((err) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            throw new Error(errorMessages);
          } else {
            throw new Error(errorData.detail);
          }
        }
        throw new Error('Erro ao criar usuário');
      }

      // Após registro bem-sucedido, não fazemos login automático
      // O usuário deve fazer login manualmente
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};