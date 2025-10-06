#!/usr/bin/env python3
"""
Test script for User CRUD API
Run this after starting the server with: python src/main.py
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def print_response(response, title):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")

def test_create_gestor():
    """Test creating a Gestor user"""
    data = {
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
        "uf": "sp",
        "matricula": "GES001",
        "password": "senha123",
        "profile_type": "gestor"
    }
    
    response = requests.post(f"{BASE_URL}/users/", json=data)
    print_response(response, "TEST 1: Create Gestor User")
    return response.json().get("id") if response.status_code == 201 else None

def test_create_tecnico():
    """Test creating a Técnico user"""
    data = {
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
    
    response = requests.post(f"{BASE_URL}/users/", json=data)
    print_response(response, "TEST 2: Create Técnico User")
    return response.json().get("id") if response.status_code == 201 else None

def test_duplicate_cpf():
    """Test creating user with duplicate CPF"""
    data = {
        "nome_completo": "Pedro Oliveira",
        "cpf": "12345678901",  # Same as first user
        "matricula": "GES002",
        "password": "senha789",
        "profile_type": "gestor"
    }
    
    response = requests.post(f"{BASE_URL}/users/", json=data)
    print_response(response, "TEST 3: Create User with Duplicate CPF (should fail)")

def test_list_users():
    """Test listing all users"""
    response = requests.get(f"{BASE_URL}/users/")
    print_response(response, "TEST 4: List All Users")

def test_get_user(user_id):
    """Test getting a specific user"""
    response = requests.get(f"{BASE_URL}/users/{user_id}")
    print_response(response, f"TEST 5: Get User by ID ({user_id})")

def test_update_user(user_id):
    """Test updating a user"""
    data = {
        "telefone": "(11) 99999-9999",
        "especialidade": "Engenharia Elétrica"
    }
    
    response = requests.put(f"{BASE_URL}/users/{user_id}", json=data)
    print_response(response, f"TEST 6: Update User {user_id}")

def test_get_nonexistent_user():
    """Test getting a non-existent user"""
    response = requests.get(f"{BASE_URL}/users/9999")
    print_response(response, "TEST 7: Get Non-existent User (should fail)")

def test_delete_user(user_id):
    """Test deleting a user"""
    response = requests.delete(f"{BASE_URL}/users/{user_id}")
    print_response(response, f"TEST 8: Delete User {user_id}")

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("STARTING API TESTS")
    print("="*60)
    print("Make sure the server is running on http://localhost:8000")
    print("="*60)
    
    try:
        # Test creating users
        gestor_id = test_create_gestor()
        tecnico_id = test_create_tecnico()
        
        # Test duplicate CPF
        test_duplicate_cpf()
        
        # Test listing users
        test_list_users()
        
        # Test getting specific user
        if tecnico_id:
            test_get_user(tecnico_id)
        
        # Test updating user
        if tecnico_id:
            test_update_user(tecnico_id)
        
        # Test getting non-existent user
        test_get_nonexistent_user()
        
        # Test deleting user
        if gestor_id:
            test_delete_user(gestor_id)
        
        # List users again to see final state
        test_list_users()
        
        print("\n" + "="*60)
        print("ALL TESTS COMPLETED")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the server.")
        print("Please make sure the server is running:")
        print("  cd src && python main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    main()
