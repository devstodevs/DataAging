#!/usr/bin/env python3
"""
Complete IVCF Data Generator
This script cleans up existing data and creates new patients with evaluations for testing.
"""

import json
import random
from datetime import datetime, date, timedelta
from faker import Faker
import requests
from typing import List, Dict, Any

fake = Faker('pt_BR')

API_BASE_URL = "http://localhost:8001/api/v1"
NUM_PATIENTS = 50  # Number of patients to generate

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

def generate_domain_scores(target_classification: str):
    """Generate domain scores based on target classification"""
    if target_classification == "Robusto":
        return [random.randint(0, 2) for _ in range(8)]
    elif target_classification == "Em Risco":
        base_scores = [random.randint(1, 3) for _ in range(8)]
        total = sum(base_scores)
        while total < 13:
            idx = random.randint(0, 7)
            if base_scores[idx] < 3:
                base_scores[idx] += 1
                total += 1
        while total > 19:
            idx = random.randint(0, 7)
            if base_scores[idx] > 1:
                base_scores[idx] -= 1
                total -= 1
        return base_scores
    else:  
        base_scores = [random.randint(2, 5) for _ in range(8)]
        total = sum(base_scores)
        while total < 20:
            idx = random.randint(0, 7)
            if base_scores[idx] < 5:
                base_scores[idx] += 1
                total += 1
        return base_scores

def get_classification_from_score(score: int) -> str:
    """Get classification based on total score"""
    if score <= 12:
        return "Robusto"
    elif score <= 19:
        return "Em Risco"
    else:
        return "Frágil"

def generate_comorbidities(classification: str) -> str:
    """Generate realistic comorbidities based on classification"""
    if classification == "Robusto":
        num_comorbidities = random.randint(0, 2)
    elif classification == "Em Risco":
        num_comorbidities = random.randint(1, 3)
    else: 
        num_comorbidities = random.randint(2, 5)
    
    if num_comorbidities == 0:
        return "Nenhuma comorbidade conhecida"
    
    selected = random.sample(COMORBIDITIES, min(num_comorbidities, len(COMORBIDITIES)))
    return ", ".join(selected)

def generate_patient():
    """Generate a single fake IVCF patient"""
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
    """Generate an IVCF evaluation for a patient"""
    classification_weights = [
        ("Robusto", 0.3),      # 30% robust
        ("Em Risco", 0.45),    # 45% at risk  
        ("Frágil", 0.25)       # 25% fragile
    ]
    
    classification = random.choices(
        [c[0] for c in classification_weights],
        weights=[c[1] for c in classification_weights]
    )[0]
    
    domain_scores = generate_domain_scores(classification)
    total_score = sum(domain_scores)
    
    actual_classification = get_classification_from_score(total_score)
    
    evaluation_date = generate_evaluation_date(registration_date)
    comorbidities = generate_comorbidities(actual_classification)
    
    evaluation = {
        "patient_id": patient_id,
        "data_avaliacao": evaluation_date.isoformat(),
        "pontuacao_total": total_score,
        "classificacao": actual_classification,
        "dominio_idade": domain_scores[0],
        "dominio_comorbidades": domain_scores[1],
        "dominio_comunicacao": domain_scores[2],
        "dominio_mobilidade": domain_scores[3],
        "dominio_humor": domain_scores[4],
        "dominio_cognicao": domain_scores[5],
        "dominio_avd": domain_scores[6],
        "dominio_autopercepcao": domain_scores[7],
        "comorbidades": comorbidities,
        "observacoes": f"Avaliação IVCF-20 realizada em {evaluation_date.strftime('%d/%m/%Y')}"
    }
    
    return evaluation

def make_api_request(method: str, endpoint: str, data: Dict = None):
    """Make API request with error handling"""
    url = f"{API_BASE_URL}/{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        elif method.upper() == "DELETE":
            response = requests.delete(url)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return None

def cleanup_existing_data():
    """Delete all existing patients and evaluations"""
    print("🧹 Cleaning up existing data...")
    
    response = make_api_request("GET", "ivcf-patients/")
    if not response or response.status_code != 200:
        print("❌ Failed to get existing patients")
        return False
    
    patients = response.json()
    print(f"Found {len(patients)} existing patients to delete")
    
    deleted_count = 0
    for patient in patients:
        response = make_api_request("DELETE", f"ivcf-patients/{patient['id']}")
        if response and response.status_code in [200, 204]:
            deleted_count += 1
            print(f"✅ Deleted patient {patient['id']}: {patient['nome_completo']}")
        else:
            print(f"❌ Failed to delete patient {patient['id']}: {patient['nome_completo']}")
    
    print(f"🗑️  Deleted {deleted_count} patients")
    return True

def create_patient_with_evaluation(patient_data: Dict, registration_date: date):
    """Create a patient and their evaluation"""
    response = make_api_request("POST", "ivcf-patients/", patient_data)
    if not response or response.status_code != 201:
        print(f"❌ Failed to create patient: {patient_data['nome_completo']}")
        if response:
            print(f"   Status: {response.status_code}, Response: {response.text}")
        return None
    
    created_patient = response.json()
    patient_id = created_patient['id']
    print(f"✅ Created patient {patient_id}: {patient_data['nome_completo']}")
    
    evaluation_data = generate_evaluation(patient_id, registration_date)
    response = make_api_request("POST", "ivcf-evaluations/", evaluation_data)
    if not response or response.status_code != 201:
        print(f"❌ Failed to create evaluation for patient {patient_id}")
        if response:
            print(f"   Status: {response.status_code}, Response: {response.text}")
        return created_patient
    
    created_evaluation = response.json()
    print(f"✅ Created evaluation for patient {patient_id}: {evaluation_data['classificacao']} (Score: {evaluation_data['pontuacao_total']})")
    
    return {
        "patient": created_patient,
        "evaluation": created_evaluation
    }

def generate_complete_dataset(num_patients: int = NUM_PATIENTS):
    """Generate complete dataset with patients and evaluations"""
    print(f"🚀 Starting complete IVCF data generation...")
    print(f"Target: {num_patients} patients with evaluations")
    
    # Cleanup existing data
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
        classifications = {}
        total_scores = []
        
        for item in created_patients:
            if 'evaluation' in item:
                eval_data = item['evaluation']
                classification = eval_data['classificacao']
                classifications[classification] = classifications.get(classification, 0) + 1
                total_scores.append(eval_data['pontuacao_total'])
        
        print(f"\n📊 Classification Distribution:")
        for classification, count in classifications.items():
            percentage = (count / len(created_patients)) * 100
            print(f"  {classification}: {count} patients ({percentage:.1f}%)")
        
        if total_scores:
            print(f"\n📈 Score Statistics:")
            print(f"  Average score: {sum(total_scores) / len(total_scores):.1f}")
            print(f"  Score range: {min(total_scores)} - {max(total_scores)}")
    
    return success_count > 0

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate complete IVCF dataset with patients and evaluations")
    parser.add_argument("-n", "--num-patients", type=int, default=NUM_PATIENTS,
                       help=f"Number of patients to generate (default: {NUM_PATIENTS})")
    parser.add_argument("--no-cleanup", action="store_true",
                       help="Don't delete existing data before generating new data")
    
    args = parser.parse_args()
    
    if args.no_cleanup:
        print("⚠️  Skipping cleanup - new data will be added to existing data")
    
    success = generate_complete_dataset(args.num_patients)
    
    if success:
        print(f"\n🎉 Dataset generation completed successfully!")
        print(f"🔍 Check your dashboard to see the new data with evaluations!")
    else:
        print(f"\n💥 Dataset generation failed. Please check your API server.")