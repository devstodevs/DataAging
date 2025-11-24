"""
Script de inicialização de dados padrão.
Cria o primeiro usuário de teste se não existir nenhum usuário no banco.
"""
from sqlalchemy.orm import Session
from db.base import SessionLocal
from db.user import user_crud
from core.security import get_password_hash
from models.user.user import ProfileType


def create_test_user():
    """
    Cria o usuário de teste padrão se não existir nenhum usuário no banco.
    """
    db: Session = SessionLocal()
    try:
        test_cpf = "11144477735"
        test_matricula = "TEST001"
        
        test_user = user_crud.get_user_by_cpf(db, test_cpf)
        
        if not test_user:
            test_user = user_crud.get_user_by_matricula(db, test_matricula)
        
        if test_user:
            from core.security import verify_password
            correct_password_hash = get_password_hash("senha123")
            updated = False
            
            if test_user.cpf != test_cpf:
                test_user.cpf = test_cpf
                updated = True
            
            if test_user.matricula != test_matricula:
                test_user.matricula = test_matricula
                updated = True
            
            if not verify_password("senha123", test_user.hashed_password):
                test_user.hashed_password = correct_password_hash
                test_user.recovery_hashed_password = correct_password_hash
                updated = True
            
            if test_user.nome_completo != "Usuário de Teste":
                test_user.nome_completo = "Usuário de Teste"
                updated = True
            
            if test_user.profile_type != ProfileType.GESTOR:
                test_user.profile_type = ProfileType.GESTOR
                updated = True
            
            if updated:
                db.commit()
                db.refresh(test_user)
                print("=" * 60)
                print("Usuário de teste atualizado com sucesso!")
                print(f"   CPF: {test_cpf}")
                print("   Matrícula: TEST001")
                print("   Senha: senha123")
                print("=" * 60)
            else:
                print("Usuário de teste já existe com os dados corretos.")
            return
        
        test_user_data = {
            "nome_completo": "Usuário de Teste",
            "cpf": test_cpf,
            "matricula": test_matricula,
            "profile_type": ProfileType.GESTOR,
            "hashed_password": get_password_hash("senha123"),
            "recovery_hashed_password": get_password_hash("senha123"),
            "telefone": None,
            "sexo": None,
            "data_nascimento": None,
            "cep": None,
            "logradouro": None,
            "numero": None,
            "complemento": None,
            "bairro": None,
            "municipio": None,
            "uf": None,
        }
        
        created_user = user_crud.create_user(db, test_user_data)
        print("=" * 60)
        print("Usuário de teste criado com sucesso!")
        print(f"   CPF: {test_cpf}")
        print("   Matrícula: TEST001")
        print("   Senha: senha123")
        print("   Tipo: Gestor")
        print(f"   ID: {created_user.id}")
        print("=" * 60)
        
    except Exception as e:
        print(f"Erro ao criar usuário de teste: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    create_test_user()

