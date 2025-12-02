#!/usr/bin/env python3
"""
Complete Physical Activity Data Generator
This script cleans up existing data and creates new patients with evaluations for testing.
"""

import json
import random
from datetime import datetime, date, timedelta
from faker import Faker
import requests
from typing import List, Dict, Any

fake = Faker('pt_BR')

API_BASE_URL = "http://localhost:8000/api/v1"
NUM_PATIENTS = 70


TEST_USER_CPF = "11144477735"
TEST_USER_PASSWORD = "senha123"

auth_token = None

CURITIBA_NEIGHBORHOODS = [
    "Centro", "Centro Histórico", "Boa Vista", "Portão", "Santa Felicidade", 
    "Cabral", "Rebouças", "Xaxim", "Juvevê", "Água Verde", "Batel", 
    "Bigorrilho", "Cristo Rei", "Jardim Botânico", "Mercês", "São Francisco",
    "Vila Izabel", "Ahú", "Alto da Glória", "Bacacheri", "Bairro Alto",
    "Cajuru", "Capão Raso", "Cidade Industrial", "Fazendinha", "Hauer",
    "Jardim das Américas", "Lindóia", "Novo Mundo", "Parolin", "Pilarzinho",
    "Pinheirinho", "Santa Cândida", "Seminário", "Tarumã", "Uberaba"
]

HEALTH_UNIT_IDS = [1, 2, 3, 4]  

COMORBIDITIES = [
    "Hipertensão arterial sistêmica",
    "Diabetes mellitus tipo 2", 
    "Insuficiência cardíaca leve (ICC)",
    "Artrose de joelhos",
    "Osteoporose",
    "Hipotireoidismo",
    "Dislipidemia",
    "Doença renal crônica leve",
    "Fibrilação atrial",
    "DPOC leve",
    "Depressão leve",
    "Ansiedade",
    "Insônia",
    "Refluxo gastroesofágico",
    "Catarata",
    "Glaucoma",
    "Perda auditiva leve"
]

PROFESSIONALS = [
    "Dr. Carlos Silva", "Dra. Maria Santos", "Dr. João Oliveira",
    "Dra. Ana Costa", "Dr. Pedro Almeida", "Dra. Lucia Ferreira",
    "Dr. Roberto Lima", "Dra. Fernanda Rocha", "Dr. Marcos Souza",
    "Dra. Patricia Mendes", "Dr. Ricardo Barbosa", "Dra. Juliana Campos"
]


def generate_cpf():
    """Generate a valid Brazilian CPF number with exactly 11 digits"""
    cpf = [random.randint(0, 9) for _ in range(9)]
    
    sum1 = sum(cpf[i] * (10 - i) for i in range(9))
    digit1 = 11 - (sum1 % 11)
    if digit1 >= 10:
        digit1 = 0
    cpf.append(digit1)
    
    sum2 = sum(cpf[i] * (11 - i) for i in range(10))
    digit2 = 11 - (sum2 % 11)
    if digit2 >= 10:
        digit2 = 0
    cpf.append(digit2)
    
    cpf_str = ''.join(map(str, cpf))
    
    if len(cpf_str) != 11:
        raise ValueError(f"Generated CPF has invalid length: {len(cpf_str)} (expected 11)")
    
    return cpf_str


def generate_phone():
    """Generate a Brazilian phone number"""
    return f"41{random.randint(90000, 99999)}{random.randint(1000, 9999)}"


def generate_email(name: str):
    """Generate email based on name"""
    name_parts = name.lower().split()
    if len(name_parts) >= 2:
        username = f"{name_parts[0]}.{name_parts[-1]}"
    else:
        username = name_parts[0]
    
    domains = ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com"]
    return f"{username}@{random.choice(domains)}"


def generate_registration_date():
    """Generate a random registration date within the last 18 months"""
    start_date = date.today() - timedelta(days=540) 
    end_date = date.today() - timedelta(days=30)
    
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randrange(days_between)
    
    return start_date + timedelta(days=random_days)


def generate_evaluation_date(registration_date: date):
    """Generate evaluation date after registration date, spread over last 12 months"""
    min_date = date.today() - timedelta(days=365)
    max_date = date.today()
    
    if registration_date > min_date:
        min_date = registration_date
    
    if min_date >= max_date:
        return max_date
    
    time_between = max_date - min_date
    days_between = time_between.days
    if days_between == 0:
        return max_date
    
    random_days = random.randrange(days_between + 1)
    return min_date + timedelta(days=random_days)


def generate_comorbidities(classification: str = None) -> str:
    """Generate realistic comorbidities based on activity level"""
    
    if classification == "Crítico":
        num_comorbidities = random.randint(2, 4)
    elif classification == "Alto":
        num_comorbidities = random.randint(1, 3)
    elif classification == "Moderado":
        num_comorbidities = random.randint(0, 2)
    else:  # Baixo
        num_comorbidities = random.randint(0, 1)
    
    if num_comorbidities == 0:
        return "Nenhuma comorbidade conhecida"
    
    selected = random.sample(COMORBIDITIES, min(num_comorbidities, len(COMORBIDITIES)))
    return ", ".join(selected)


def get_sedentary_risk_from_hours(sedentary_hours: float) -> str:
    """Get sedentary risk level from hours per day"""
    if sedentary_hours < 6:
        return "Baixo"
    elif sedentary_hours < 8:
        return "Moderado"
    elif sedentary_hours <= 10:
        return "Alto"
    else:
        return "Crítico"


def generate_physical_activity_data():
    """Generate physical activity data with realistic and varied distribution"""
    
    profiles = ["sedentario", "pouco_ativo", "moderadamente_ativo", "muito_ativo"]
    weights = [0.20, 0.35, 0.30, 0.15]  # 20% sedentário, 35% pouco ativo, 30% moderado, 15% muito ativo
    
    profile = random.choices(profiles, weights=weights)[0]
    
    if profile == "sedentario":
        light_minutes = random.randint(0, 25)
        light_days = random.randint(0, 3)
        moderate_minutes = random.randint(0, 15)
        moderate_days = random.randint(0, 2)
        vigorous_minutes = 0
        vigorous_days = 0
        sedentary_hours = round(random.uniform(10, 16), 1)
        screen_time = round(random.uniform(5, 10), 1)
        
    elif profile == "pouco_ativo":
        light_minutes = random.randint(20, 80)
        light_days = random.randint(2, 6)
        moderate_minutes = random.randint(10, 40)
        moderate_days = random.randint(1, 4)
        vigorous_minutes = random.randint(0, 15)
        vigorous_days = random.randint(0, 2)
        sedentary_hours = round(random.uniform(7, 11), 1)
        screen_time = round(random.uniform(3, 7), 1)
        
    elif profile == "moderadamente_ativo":
        light_minutes = random.randint(40, 120)
        light_days = random.randint(4, 7)
        moderate_minutes = random.randint(25, 60)
        moderate_days = random.randint(3, 6)
        vigorous_minutes = random.randint(10, 35)
        vigorous_days = random.randint(1, 4)
        sedentary_hours = round(random.uniform(4, 8), 1)
        screen_time = round(random.uniform(2, 5), 1)
        
    else:  # muito_ativo
        light_minutes = random.randint(60, 150)
        light_days = random.randint(5, 7)
        moderate_minutes = random.randint(40, 90)
        moderate_days = random.randint(4, 7)
        vigorous_minutes = random.randint(20, 60)
        vigorous_days = random.randint(3, 6)
        sedentary_hours = round(random.uniform(2, 6), 1)
        screen_time = round(random.uniform(1, 3), 1)
    
    total_weekly_moderate = moderate_minutes * moderate_days
    total_weekly_vigorous = vigorous_minutes * vigorous_days
    
    who_compliance = total_weekly_moderate >= 150 or total_weekly_vigorous >= 75
    
    sedentary_risk_level = get_sedentary_risk_from_hours(sedentary_hours)
    
    return {
        'light_activity_minutes_per_day': light_minutes,
        'light_activity_days_per_week': light_days,
        'moderate_activity_minutes_per_day': moderate_minutes,
        'moderate_activity_days_per_week': moderate_days,
        'vigorous_activity_minutes_per_day': vigorous_minutes,
        'vigorous_activity_days_per_week': vigorous_days,
        'sedentary_hours_per_day': sedentary_hours,
        'screen_time_hours_per_day': screen_time,
        'total_weekly_moderate_minutes': total_weekly_moderate,
        'total_weekly_vigorous_minutes': total_weekly_vigorous,
        'who_compliance': who_compliance,
        'sedentary_risk_level': sedentary_risk_level,
        'profile': profile
    }


def generate_patient(classification: str = None):
    """Generate a patient with realistic data"""
    name = fake.name()
    age = random.randint(60, 95) 
    
    patient_data = {
        "nome_completo": name,
        "cpf": generate_cpf(),
        "idade": age,
        "telefone": generate_phone() if random.random() > 0.3 else None,
        "email": generate_email(name) if random.random() > 0.6 else None,
        "bairro": random.choice(CURITIBA_NEIGHBORHOODS),
        "unidade_saude_id": random.choice(HEALTH_UNIT_IDS),
        "diagnostico_principal": random.choice(COMORBIDITIES) if random.random() > 0.4 else None,
        "comorbidades": generate_comorbidities(classification),
        "medicamentos_atuais": None,  
        "ativo": True
    }
    
    medications = []
    if "Hipertensão" in patient_data["comorbidades"]:
        medications.extend(random.sample(["Losartana", "Enalapril", "Amlodipina"], random.randint(1, 2)))
    if "Diabetes" in patient_data["comorbidades"]:
        medications.extend(random.sample(["Metformina", "Glibenclamida"], random.randint(1, 2)))
    if "Depressão" in patient_data["comorbidades"]:
        medications.append("Sertralina")
    if "Ansiedade" in patient_data["comorbidades"]:
        medications.append("Clonazepam")
    
    if medications:
        patient_data["medicamentos_atuais"] = ", ".join(medications)
    
    return patient_data


def generate_evaluation(patient_id: int, registration_date: date):
    """Generate an evaluation for a patient"""
    activity_data = generate_physical_activity_data()
    
    evaluation_data = {
        "data_avaliacao": generate_evaluation_date(registration_date).isoformat(),
        "light_activity_minutes_per_day": activity_data['light_activity_minutes_per_day'],
        "light_activity_days_per_week": activity_data['light_activity_days_per_week'],
        "moderate_activity_minutes_per_day": activity_data['moderate_activity_minutes_per_day'],
        "moderate_activity_days_per_week": activity_data['moderate_activity_days_per_week'],
        "vigorous_activity_minutes_per_day": activity_data['vigorous_activity_minutes_per_day'],
        "vigorous_activity_days_per_week": activity_data['vigorous_activity_days_per_week'],
        "sedentary_hours_per_day": activity_data['sedentary_hours_per_day'],
        "screen_time_hours_per_day": activity_data['screen_time_hours_per_day'],
        "total_weekly_moderate_minutes": activity_data['total_weekly_moderate_minutes'],
        "total_weekly_vigorous_minutes": activity_data['total_weekly_vigorous_minutes'],
        "who_compliance": activity_data['who_compliance'],
        "sedentary_risk_level": activity_data['sedentary_risk_level'],
        "profissional_responsavel": random.choice(PROFESSIONALS),
        "observacoes": fake.text(max_nb_chars=200) if random.random() > 0.7 else None
    }
    
    return evaluation_data, activity_data['sedentary_risk_level']


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
        return {"error": True, "detail": "Authentication failed"}
    
    if not endpoint.startswith('/'):
        endpoint = '/' + endpoint
    url = f"{API_BASE_URL}{endpoint}"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    try:
        if method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            error_info = {"status_code": response.status_code, "error": True}
            try:
                error_data = response.json()
                if isinstance(error_data, dict):
                    error_info["detail"] = error_data.get('detail', str(error_data))
                else:
                    error_info["detail"] = str(error_data)
            except:
                error_info["detail"] = response.text[:200] if response.text else "No error message"
            return error_info
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"error": True, "detail": str(e)}


def get_available_health_units():
    """Get available health units from API"""
    global HEALTH_UNIT_IDS
    try:
        response = make_api_request("GET", "/health-units/")
        if response and not (isinstance(response, dict) and response.get('error')):
            if isinstance(response, list):
                health_units = response
            elif isinstance(response, dict) and 'id' in response:
                health_units = [response]
            else:
                health_units = []
            
            if health_units:
                HEALTH_UNIT_IDS = [unit['id'] for unit in health_units if 'id' in unit]
                print(f"Found {len(HEALTH_UNIT_IDS)} health units: {HEALTH_UNIT_IDS}")
                return True
            else:
                print("⚠️  No health units found in database")
                print("   Please create health units first or update HEALTH_UNIT_IDS in the script")
                return False
        else:
            print("⚠️  Could not fetch health units from API")
            if isinstance(response, dict):
                print(f"   Status: {response.get('status_code', 'N/A')}")
                print(f"   Error: {response.get('detail', 'Unknown error')}")
            print("   Using default IDs: [1, 2, 3, 4]")
            return False
    except Exception as e:
        print(f"⚠️  Error fetching health units: {e}")
        print("   Using default IDs: [1, 2, 3, 4]")
        return False

def get_available_health_units():
    """Get available health units from API"""
    global HEALTH_UNIT_IDS
    try:
        response = make_api_request("GET", "/health-units/")
        if response and not (isinstance(response, dict) and response.get('error')):
            # Response can be a list or a single dict
            if isinstance(response, list):
                health_units = response
            elif isinstance(response, dict) and 'id' in response:
                health_units = [response]
            else:
                health_units = []
            
            if health_units:
                HEALTH_UNIT_IDS = [unit['id'] for unit in health_units if 'id' in unit]
                print(f"✅ Found {len(HEALTH_UNIT_IDS)} health units: {HEALTH_UNIT_IDS}")
                return True
            else:
                print("⚠️  No health units found in database")
                print("   Please create health units first or update HEALTH_UNIT_IDS in the script")
                return False
        else:
            print("⚠️  Could not fetch health units from API")
            if isinstance(response, dict):
                print(f"   Status: {response.get('status_code', 'N/A')}")
                print(f"   Error: {response.get('detail', 'Unknown error')}")
            print("   Using default IDs: [1, 2, 3, 4]")
            return False
    except Exception as e:
        print(f"⚠️  Error fetching health units: {e}")
        print("   Using default IDs: [1, 2, 3, 4]")
        return False

def cleanup_existing_data():
    """Clean up existing physical activity data using SQLite directly"""
    print("🧹 Cleaning up existing physical activity data...")
    
    try:
        import sqlite3
        import os
        
        db_path = os.path.join(os.path.dirname(__file__), '../../src/dataaging.db')
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM physical_activity_evaluations")
        evaluations_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM physical_activity_patients")
        patients_count = cursor.fetchone()[0]
        
        cursor.execute("DELETE FROM physical_activity_evaluations")
        print(f"✓ Deleted {evaluations_count} evaluations")
        
        cursor.execute("DELETE FROM physical_activity_patients")
        print(f"✓ Deleted {patients_count} patients")
        
        conn.commit()
        conn.close()
        
        print("Cleanup completed!")
        
    except Exception as e:
        print(f"⚠️ Database cleanup failed: {e}")
        print("Trying API cleanup as fallback...")
        
        page = 1
        all_patients = []
        
        while True:
            patients_response = make_api_request("GET", f"/physical-activity-patients/?page={page}&per_page=100&active_only=false")
            if not patients_response or "patients" not in patients_response:
                break
            
            patients = patients_response["patients"]
            if not patients:
                break
            
            all_patients.extend(patients)
            
            if len(patients) < 100:
                break
            
            page += 1
        
        if all_patients:
            print(f"Found {len(all_patients)} existing patients. Deleting...")
            
            for patient in all_patients:
                patient_id = patient["id"]
                delete_response = make_api_request("DELETE", f"/physical-activity-patients/{patient_id}")
                if delete_response:
                    print(f"✓ Soft deleted patient {patient_id}")
                else:
                    print(f"✗ Failed to delete patient {patient_id}")
        
        print("Cleanup completed!")


def create_patient_with_evaluation(patient_data: Dict, registration_date: date):
    """Create a patient and their evaluation"""
    
    patient_response = make_api_request("POST", "/physical-activity-patients/", patient_data)
    
    if not patient_response:
        print(f"✗ Failed to create patient: {patient_data['nome_completo']} - No response from server")
        return None
    
    if isinstance(patient_response, dict) and patient_response.get('error'):
        error_msg = patient_response.get('detail', 'Unknown error')
        print(f"✗ Failed to create patient: {patient_data['nome_completo']}")
        print(f"   Status: {patient_response.get('status_code', 'N/A')}")
        print(f"   Error: {error_msg}")
        print(f"   Data sent: {patient_data}")
        return None
    
    if not isinstance(patient_response, dict) or "id" not in patient_response:
        print(f"✗ Failed to create patient: {patient_data['nome_completo']} - Invalid response format")
        print(f"   Response: {patient_response}")
        return None
    
    patient_id = patient_response["id"]
    print(f"✓ Created patient: {patient_data['nome_completo']} (ID: {patient_id})")
    
    evaluation_data, sedentary_risk = generate_evaluation(patient_id, registration_date)
    
    evaluation_response = make_api_request(
        "POST", 
        f"/physical-activity-patients/{patient_id}/evaluations", 
        evaluation_data
    )
    
    if evaluation_response and isinstance(evaluation_response, dict):
        if evaluation_response.get('error'):
            error_msg = evaluation_response.get('detail', 'Unknown error')
            print(f"  ✗ Failed to create evaluation for patient {patient_id}")
            print(f"     Status: {evaluation_response.get('status_code', 'N/A')}")
            print(f"     Error: {error_msg}")
            return patient_response, None
        else:
            print(f"  ✓ Created evaluation (Risk: {sedentary_risk}, WHO: {'✓' if evaluation_response.get('who_compliance') else '✗'})")
            return patient_response, evaluation_response
    else:
        print(f"  ✗ Failed to create evaluation for patient {patient_id} - Invalid response")
        return patient_response, None


def generate_complete_dataset(num_patients: int = NUM_PATIENTS):
    """Generate complete dataset with patients and evaluations"""
    
    print(f"🚀 Generating {num_patients} physical activity patients with evaluations...")
    
    print("\n🏥 Checking available health units...")
    if not get_available_health_units():
        print("⚠️  Warning: Could not verify health units. Proceeding with default IDs.")
    
    if not HEALTH_UNIT_IDS:
        print("No health units available. Cannot create patients.")
        print("   Please create health units first using the API or database.")
        return [], []
    
    created_patients = []
    created_evaluations = []
    
    risk_levels = {"Baixo": 0, "Moderado": 0, "Alto": 0, "Crítico": 0}
    who_compliant = 0
    
    for i in range(num_patients):
        registration_date = generate_registration_date()
        
        patient_data = generate_patient()
        
        result = create_patient_with_evaluation(patient_data, registration_date)
        
        if result:
            patient, evaluation = result
            created_patients.append(patient)
            
            if evaluation:
                created_evaluations.append(evaluation)
                
                risk_level = evaluation.get('sedentary_risk_level', 'Baixo')
                if risk_level in risk_levels:
                    risk_levels[risk_level] += 1
                
                if evaluation.get('who_compliance', False):
                    who_compliant += 1
        
        if (i + 1) % 10 == 0:
            print(f"Progress: {i + 1}/{num_patients} patients created")
    
    print("\n" + "="*60)
    print("📊 FINAL STATISTICS")
    print("="*60)
    print(f"Total patients created: {len(created_patients)}")
    print(f"Total evaluations created: {len(created_evaluations)}")
    
    if created_evaluations:
        print(f"WHO compliant: {who_compliant}/{len(created_evaluations)} ({who_compliant/len(created_evaluations)*100:.1f}%)")
        
        print("\nSedentary Risk Distribution:")
        for risk, count in risk_levels.items():
            percentage = count/len(created_evaluations)*100
            print(f"  {risk}: {count} ({percentage:.1f}%)")
    else:
        print("⚠️ No evaluations were created. Check API endpoint and data.")
    
    print("\nDataset generation completed!")
    
    return created_patients, created_evaluations


def main():
    """Main function"""
    print("🏃 PHYSICAL ACTIVITY DATA GENERATOR")
    print("="*50)
    
    try:
        cleanup_existing_data()
        
        patients, evaluations = generate_complete_dataset(NUM_PATIENTS)
        
        print(f"\n🎉 Successfully created {len(patients)} patients and {len(evaluations)} evaluations!")
        print("The physical activity dashboard is now ready for testing.")
        
    except KeyboardInterrupt:
        print("\n⚠️ Operation cancelled by user")
    except Exception as e:
        print(f"\nError: {e}")
        raise


if __name__ == "__main__":
    main()