#!/usr/bin/env python3
"""
Script to create health units in the database
This script creates basic health units for testing purposes.
"""

import requests
from typing import List, Dict

API_BASE_URL = "http://localhost:8000/api/v1"

TEST_USER_CPF = "11144477735"
TEST_USER_PASSWORD = "senha123"

auth_token = None

HEALTH_UNITS = [
    {
        "nome": "Unidade Básica de Saúde Centro",
        "bairro": "Centro",
        "regiao": "Centro",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Boa Vista",
        "bairro": "Boa Vista",
        "regiao": "Norte",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Portão",
        "bairro": "Portão",
        "regiao": "Sul",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Santa Felicidade",
        "bairro": "Santa Felicidade",
        "regiao": "Oeste",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Cajuru",
        "bairro": "Cajuru",
        "regiao": "Norte",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Pinheirinho",
        "bairro": "Pinheirinho",
        "regiao": "Sul",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Fazendinha",
        "bairro": "Fazendinha",
        "regiao": "Sul",
        "ativo": True
    },
    {
        "nome": "Unidade Básica de Saúde Bairro Alto",
        "bairro": "Bairro Alto",
        "regiao": "Norte",
        "ativo": True
    }
]


def authenticate():
    """Authenticate and get access token"""
    global auth_token
    if auth_token:
        return auth_token
    
    login_url = f"{API_BASE_URL}/login"
    try:
        response = requests.post(
            login_url,
            data={
                "username": TEST_USER_CPF,
                "password": TEST_USER_PASSWORD
            },
            timeout=30
        )
        
        if response.status_code == 200:
            token_data = response.json()
            auth_token = token_data.get("access_token")
            print("✓ Authenticated successfully")
            return auth_token
        else:
            print(f"✗ Authentication failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"✗ Authentication error: {e}")
        return None


def make_api_request(method: str, endpoint: str, data: Dict = None):
    """Make API request with error handling and authentication"""
    token = authenticate()
    if not token:
        print("✗ Cannot make request: Authentication failed")
        return None
    
    if endpoint.startswith('/'):
        endpoint = endpoint[1:]
    url = f"{API_BASE_URL}/{endpoint}"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None


def get_existing_health_units() -> List[Dict]:
    """Get existing health units from API"""
    response = make_api_request("GET", "health-units/")
    if response and response.status_code == 200:
        return response.json()
    return []


def create_health_unit(health_unit_data: Dict) -> bool:
    """Create a health unit"""
    response = make_api_request("POST", "health-units/", health_unit_data)
    
    if not response:
        print(f"Failed to create health unit: {health_unit_data['nome']} - No response from server")
        return False
    
    if response.status_code == 201:
        created_unit = response.json()
        print(f"Created health unit: {created_unit['nome']} (ID: {created_unit['id']}) - {created_unit['bairro']}, {created_unit['regiao']}")
        return True
    elif response.status_code == 409:
        print(f"⚠️  Health unit already exists: {health_unit_data['nome']}")
        return False
    else:
        error_msg = "Unknown error"
        try:
            error_data = response.json()
            if isinstance(error_data, dict):
                error_msg = error_data.get('detail', str(error_data))
            else:
                error_msg = str(error_data)
        except:
            error_msg = response.text[:200] if response.text else "No error message"
        
        print(f"Failed to create health unit: {health_unit_data['nome']}")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {error_msg}")
        return False


def main():
    """Main function"""
    print("🏥 HEALTH UNITS CREATOR")
    print("=" * 50)
    
    print("\n📋 Checking existing health units...")
    existing_units = get_existing_health_units()
    if existing_units:
        print(f"Found {len(existing_units)} existing health units:")
        for unit in existing_units:
            print(f"  - {unit['nome']} (ID: {unit['id']}) - {unit['bairro']}, {unit['regiao']}")
    else:
        print("No existing health units found.")
    
    print(f"\n🚀 Creating {len(HEALTH_UNITS)} health units...")
    print("-" * 50)
    
    created_count = 0
    skipped_count = 0
    failed_count = 0
    
    for health_unit_data in HEALTH_UNITS:
        if create_health_unit(health_unit_data):
            created_count += 1
        else:
            existing_names = [u['nome'] for u in existing_units]
            if health_unit_data['nome'] in existing_names:
                skipped_count += 1
            else:
                failed_count += 1
    
    print("\n" + "=" * 50)
    print("📊 SUMMARY")
    print("=" * 50)
    print(f"Created: {created_count}")
    print(f"⚠️  Skipped (already exists): {skipped_count}")
    print(f"Failed: {failed_count}")
    print(f"📋 Total: {len(HEALTH_UNITS)}")
    
    print("\n📋 All health units in database:")
    all_units = get_existing_health_units()
    if all_units:
        for unit in all_units:
            print(f"  - ID {unit['id']}: {unit['nome']} - {unit['bairro']}, {unit['regiao']}")
    else:
        print("  No health units found.")
    
    print("\nDone!")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Create health units in the database")
    parser.add_argument("--check-only", action="store_true",
                       help="Only check existing health units, don't create new ones")
    
    args = parser.parse_args()
    
    if args.check_only:
        print("🏥 HEALTH UNITS CHECKER")
        print("=" * 50)
        existing_units = get_existing_health_units()
        if existing_units:
            print(f"\nFound {len(existing_units)} health units:")
            for unit in existing_units:
                print(f"  - ID {unit['id']}: {unit['nome']} - {unit['bairro']}, {unit['regiao']}")
        else:
            print("\nNo health units found.")
    else:
        main()

