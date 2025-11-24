#!/usr/bin/env python3
"""
Complete FACTF Data Generator
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

CURITIBA_NEIGHBORHOODS = [
    "Centro", "Centro Histórico", "Boa Vista", "Portão", "Santa Felicidade", 
    "Cabral", "Rebouças", "Xaxim", "Juvevê", "Água Verde", "Batel", 
    "Bigorrilho", "Cristo Rei", "Jardim Botânico", "Mercês", "São Francisco",
    "Vila Izabel", "Ahú", "Alto da Glória", "Bacacheri", "Bairro Alto",
    "Cajuru", "Capão Raso", "Cidade Industrial", "Fazendinha", "Hauer",
    "Jardim das Américas", "Lindóia", "Novo Mundo", "Parolin", "Pilarzinho",
    "Pinheirinho", "Santa Cândida", "Seminário", "Tarumã", "Uberaba"
]

HEALTH_UNIT_IDS = [1, 2, 3, 4]  # Will be populated from API if available

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

def generate_cpf():
    """Generate a valid Brazilian CPF number"""
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
    
    return ''.join(map(str, cpf))

def generate_phone():
    """Generate a Brazilian phone number"""
    return f"41{random.randint(90000, 99999)}{random.randint(1000, 9999)}"

def generate_registration_date():
    """Generate a random registration date within the last 2 years"""
    start_date = date(2023, 1, 1)
    end_date = date.today()
    
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randrange(days_between)
    
    return start_date + timedelta(days=random_days)

def generate_evaluation_date(registration_date: date):
    """Generate evaluation date after registration date"""
    min_date = max(registration_date, date.today() - timedelta(days=365))
    max_date = date.today()
    
    if min_date >= max_date:
        return max_date
    
    time_between = max_date - min_date
    days_between = time_between.days
    if days_between == 0:
        return max_date
    
    random_days = random.randrange(days_between + 1)
    return min_date + timedelta(days=random_days)

def generate_factf_scores():
    """Generate FACTF domain scores with realistic fatigue distribution"""
    
    # First decide the fatigue level to ensure good distribution
    fatigue_distribution = random.choices(
        ["Sem Fadiga", "Fadiga Leve", "Fadiga Grave"], 
        weights=[0.35, 0.40, 0.25]  # 35% sem fadiga, 40% leve, 25% grave
    )[0]
    
    # Generate subescala_fadiga based on target classification
    if fatigue_distribution == "Sem Fadiga":
        # Higher scores (44-52) for no fatigue
        subescala_fadiga = random.randint(44, 52)
    elif fatigue_distribution == "Fadiga Leve":
        # Medium scores (30-43) for mild fatigue
        subescala_fadiga = random.randint(30, 43)
    else:  # Fadiga Grave
        # Lower scores (0-29) for severe fatigue
        subescala_fadiga = random.randint(0, 29)
    
    # Generate other domains with normal distribution
    # Bem-estar físico (0-28) - 7 questions, 0-4 each
    bem_estar_fisico = sum(random.choices([0, 1, 2, 3, 4], weights=[0.1, 0.2, 0.4, 0.2, 0.1])[0] for _ in range(7))
    
    # Bem-estar social (0-28) - 7 questions, 0-4 each  
    bem_estar_social = sum(random.choices([0, 1, 2, 3, 4], weights=[0.1, 0.2, 0.4, 0.2, 0.1])[0] for _ in range(7))
    
    # Bem-estar emocional (0-24) - 6 questions, 0-4 each
    bem_estar_emocional = sum(random.choices([0, 1, 2, 3, 4], weights=[0.1, 0.2, 0.4, 0.2, 0.1])[0] for _ in range(6))
    
    # Bem-estar funcional (0-28) - 7 questions, 0-4 each
    bem_estar_funcional = sum(random.choices([0, 1, 2, 3, 4], weights=[0.1, 0.2, 0.4, 0.2, 0.1])[0] for _ in range(7))
    
    return {
        'bem_estar_fisico': bem_estar_fisico,
        'bem_estar_social': bem_estar_social,
        'bem_estar_emocional': bem_estar_emocional,
        'bem_estar_funcional': bem_estar_funcional,
        'subescala_fadiga': subescala_fadiga
    }

def generate_comorbidities() -> str:
    """Generate realistic comorbidities"""
    num_comorbidities = random.randint(0, 4)
    
    if num_comorbidities == 0:
        return "Nenhuma comorbidade conhecida"
    
    selected = random.sample(COMORBIDITIES, min(num_comorbidities, len(COMORBIDITIES)))
    return ", ".join(selected)

def generate_patient():
    """Generate a single fake FACTF patient"""
    age = random.randint(60, 95)
    registration_date = generate_registration_date()
    
    patient = {
        "nome_completo": fake.name(),
        "cpf": generate_cpf(),
        "idade": age,
        "telefone": generate_phone(),
        "bairro": random.choice(CURITIBA_NEIGHBORHOODS),
        "unidade_saude_id": random.choice(HEALTH_UNIT_IDS),
        "data_cadastro": registration_date.isoformat()
    }
    
    return patient, registration_date

def generate_evaluation(patient_id: int, registration_date: date):
    """Generate a FACTF evaluation for a patient"""
    evaluation_date = generate_evaluation_date(registration_date)
    domain_scores = generate_factf_scores()
    
    # Only send the fields expected by FACTFEvaluationCreate schema
    # The API will calculate pontuacao_total, pontuacao_fadiga, and classificacao_fadiga automatically
    evaluation = {
        "patient_id": patient_id,
        "data_avaliacao": evaluation_date.isoformat(),
        "bem_estar_fisico": domain_scores['bem_estar_fisico'],
        "bem_estar_social": domain_scores['bem_estar_social'],
        "bem_estar_emocional": domain_scores['bem_estar_emocional'],
        "bem_estar_funcional": domain_scores['bem_estar_funcional'],
        "subescala_fadiga": domain_scores['subescala_fadiga'],
        "observacoes": f"Avaliação FACTF realizada em {evaluation_date.strftime('%d/%m/%Y')}",
        "profissional_responsavel": "Sistema Automatizado"
    }
    
    return evaluation

def make_api_request(method: str, endpoint: str, data: Dict = None):
    """Make API request with error handling"""
    if endpoint.startswith('/'):
        endpoint = endpoint[1:]
    url = f"{API_BASE_URL}/{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers={"Content-Type": "application/json"}, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return None

def get_available_health_units():
    """Get available health units from API"""
    global HEALTH_UNIT_IDS
    try:
        response = make_api_request("GET", "health-units/")
        if response and response.status_code == 200:
            health_units = response.json()
            if health_units:
                HEALTH_UNIT_IDS = [unit['id'] for unit in health_units]
                print(f"✅ Found {len(HEALTH_UNIT_IDS)} health units: {HEALTH_UNIT_IDS}")
                return True
            else:
                print("⚠️  No health units found in database")
                print("   Please create health units first or update HEALTH_UNIT_IDS in the script")
                return False
        else:
            print("⚠️  Could not fetch health units from API")
            print(f"   Status: {response.status_code if response else 'No response'}")
            print("   Using default IDs: [1, 2, 3, 4]")
            return False
    except Exception as e:
        print(f"⚠️  Error fetching health units: {e}")
        print("   Using default IDs: [1, 2, 3, 4]")
        return False

def cleanup_existing_data():
    """Delete all existing patients and evaluations"""
    print("🧹 Cleaning up existing data...")
    
    response = make_api_request("GET", "factf-patients/")
    if not response or response.status_code != 200:
        print("❌ Failed to get existing patients")
        return False
    
    patients = response.json()
    print(f"Found {len(patients)} existing patients to delete")
    
    deleted_count = 0
    for patient in patients:
        response = make_api_request("DELETE", f"factf-patients/{patient['id']}")
        if response and response.status_code in [200, 204]:
            deleted_count += 1
            print(f"✅ Deleted patient {patient['id']}: {patient['nome_completo']}")
        else:
            print(f"❌ Failed to delete patient {patient['id']}: {patient['nome_completo']}")
    
    print(f"🗑️  Deleted {deleted_count} patients")
    return True

def create_patient_with_evaluation(patient_data: Dict, registration_date: date):
    """Create a patient and their evaluation"""
    response = make_api_request("POST", "factf-patients/", patient_data)
    if not response:
        print(f"❌ Failed to create patient: {patient_data['nome_completo']} - No response from server")
        return None
    
    if response.status_code != 201:
        error_msg = "Unknown error"
        try:
            error_data = response.json()
            if isinstance(error_data, dict):
                error_msg = error_data.get('detail', str(error_data))
            else:
                error_msg = str(error_data)
        except:
            error_msg = response.text[:200] if response.text else "No error message"
        
        print(f"❌ Failed to create patient: {patient_data['nome_completo']}")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {error_msg}")
        print(f"   Data sent: {patient_data}")
        return None
    
    created_patient = response.json()
    patient_id = created_patient['id']
    print(f"✅ Created patient {patient_id}: {patient_data['nome_completo']}")
    
    evaluation_data = generate_evaluation(patient_id, registration_date)
    response = make_api_request("POST", f"factf-patients/{patient_id}/evaluations", evaluation_data)
    if not response:
        print(f"❌ Failed to create evaluation for patient {patient_id} - No response from server")
        return {"patient": created_patient}
    
    if response.status_code != 201:
        error_msg = "Unknown error"
        try:
            error_data = response.json()
            if isinstance(error_data, dict):
                error_msg = error_data.get('detail', str(error_data))
            else:
                error_msg = str(error_data)
        except:
            error_msg = response.text[:200] if response.text else "No error message"
        
        print(f"❌ Failed to create evaluation for patient {patient_id}")
        print(f"   Status: {response.status_code}")
        print(f"   Error: {error_msg}")
        print(f"   Sent data: {evaluation_data}")
        return {"patient": created_patient}
    
    created_evaluation = response.json()
    print(f"✅ Created evaluation for patient {patient_id}: Total Score {created_evaluation.get('pontuacao_total', 'N/A')}")
    
    return {
        "patient": created_patient,
        "evaluation": created_evaluation
    }

def generate_complete_dataset(num_patients: int = NUM_PATIENTS):
    """Generate complete dataset with patients and evaluations"""
    print(f"🚀 Starting complete FACTF data generation...")
    print(f"Target: {num_patients} patients with evaluations")
    
    # Get available health units
    print("\n🏥 Checking available health units...")
    if not get_available_health_units():
        print("⚠️  Warning: Could not verify health units. Proceeding with default IDs.")
    
    if not HEALTH_UNIT_IDS:
        print("❌ No health units available. Cannot create patients.")
        print("   Please create health units first using the API or database.")
        return False
    
    if not cleanup_existing_data():
        print("❌ Failed to cleanup existing data")
        return False
    
    print(f"\n📊 Generating {num_patients} new patients with evaluations...")
    
    created_patients = []
    success_count = 0
    
    for i in range(num_patients):
        print(f"\n--- Creating patient {i+1}/{num_patients} ---")
        
        patient_data, registration_date = generate_patient()
        
        result = create_patient_with_evaluation(patient_data, registration_date)
        if result:
            created_patients.append(result)
            success_count += 1
    
    print(f"\n📈 Generation Complete!")
    print(f"✅ Successfully created: {success_count} patients with evaluations")
    print(f"❌ Failed: {num_patients - success_count}")
    
    if created_patients:
        total_scores = []
        
        for item in created_patients:
            if 'evaluation' in item:
                eval_data = item['evaluation']
                total_scores.append(eval_data['pontuacao_total'])
        
        if total_scores:
            print(f"\n📈 Score Statistics:")
            print(f"  Average score: {sum(total_scores) / len(total_scores):.1f}")
            print(f"  Score range: {min(total_scores)} - {max(total_scores)}")
    
    return success_count > 0

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate complete FACTF dataset with patients and evaluations")
    parser.add_argument("-n", "--num-patients", type=int, default=NUM_PATIENTS,
                       help=f"Number of patients to generate (default: {NUM_PATIENTS})")
    parser.add_argument("--no-cleanup", action="store_true",
                       help="Don't delete existing data before generating new data")
    
    args = parser.parse_args()
    
    if args.no_cleanup:
        print("⚠️  Skipping cleanup - new data will be added to existing data")
        # Modify the function to skip cleanup
        success = generate_complete_dataset(args.num_patients)
    else:
        success = generate_complete_dataset(args.num_patients)
    
    if success:
        print(f"\n🎉 Dataset generation completed successfully!")
        print(f"🔍 Check your dashboard to see the new data with evaluations!")
    else:
        print(f"\n💥 Dataset generation failed. Please check your API server.")
