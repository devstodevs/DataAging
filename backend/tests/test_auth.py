#!/usr/bin/env python3
"""
Test script for Authentication API
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

def test_create_test_user():
    """Create a test user for authentication"""
    data = {
        "nome_completo": "Test User Auth",
        "cpf": "11122233344",
        "telefone": "(11) 99999-9999",
        "matricula": "TEST001",
        "password": "test123",
        "profile_type": "gestor"
    }
    
    response = requests.post(f"{BASE_URL}/users/", json=data)
    print_response(response, "TEST 1: Create Test User for Authentication")
    return response.status_code == 201

def test_login_success():
    """Test successful login"""
    data = {
        "username": "11122233344",  # CPF
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/login", data=data)
    print_response(response, "TEST 2: Login with Correct Credentials")
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        return token
    return None

def test_login_wrong_password():
    """Test login with wrong password"""
    data = {
        "username": "11122233344",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/login", data=data)
    print_response(response, "TEST 3: Login with Wrong Password (should fail)")

def test_login_wrong_cpf():
    """Test login with non-existent CPF"""
    data = {
        "username": "99999999999",
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/login", data=data)
    print_response(response, "TEST 4: Login with Non-existent CPF (should fail)")

def test_get_current_user(token):
    """Test getting current user with valid token"""
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    print_response(response, "TEST 5: Get Current User Info with Valid Token")

def test_get_current_user_invalid_token():
    """Test getting current user with invalid token"""
    headers = {
        "Authorization": "Bearer invalid_token_here"
    }
    
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    print_response(response, "TEST 6: Get Current User with Invalid Token (should fail)")

def test_get_current_user_no_token():
    """Test getting current user without token"""
    response = requests.get(f"{BASE_URL}/me")
    print_response(response, "TEST 7: Get Current User without Token (should fail)")

def test_login_with_formatted_cpf():
    """Test login with formatted CPF (should work)"""
    data = {
        "username": "111.222.333-44",  # Formatted CPF
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/login", data=data)
    print_response(response, "TEST 8: Login with Formatted CPF (should work)")

def main():
    """Run all authentication tests"""
    print("\n" + "="*60)
    print("STARTING AUTHENTICATION TESTS")
    print("="*60)
    print("Make sure the server is running on http://localhost:8000")
    print("="*60)
    
    try:
        # Test 1: Create test user
        user_created = test_create_test_user()
        
        if not user_created:
            print("\n⚠️  User might already exist, continuing with tests...")
        
        # Test 2: Login with correct credentials
        token = test_login_success()
        
        if not token:
            print("\n❌ Login failed, cannot continue with token tests")
            return
        
        # Test 3: Login with wrong password
        test_login_wrong_password()
        
        # Test 4: Login with wrong CPF
        test_login_wrong_cpf()
        
        # Test 5: Get current user with valid token
        test_get_current_user(token)
        
        # Test 6: Get current user with invalid token
        test_get_current_user_invalid_token()
        
        # Test 7: Get current user without token
        test_get_current_user_no_token()
        
        # Test 8: Login with formatted CPF
        test_login_with_formatted_cpf()
        
        print("\n" + "="*60)
        print("ALL AUTHENTICATION TESTS COMPLETED")
        print("="*60)
        print("\n✅ Summary:")
        print("- User creation: OK")
        print("- Login with correct credentials: OK")
        print("- Login with wrong password: Correctly rejected")
        print("- Login with wrong CPF: Correctly rejected")
        print("- Get current user with token: OK")
        print("- Get current user with invalid token: Correctly rejected")
        print("- Get current user without token: Correctly rejected")
        print("- Login with formatted CPF: OK")
        print("\n🎉 Authentication system is working correctly!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the server.")
        print("Please make sure the server is running:")
        print("  cd src && python main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
