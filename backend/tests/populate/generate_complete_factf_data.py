#!/usr/bin/env python3
"""
Complete FACT-F Data Generator
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
NUM_PATIENTS = 50 

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

CANCER_DIAGNOSES = [
    "Câncer de mama",
    "Câncer de próstata", 
    "Câncer de pulmão",
    "Câncer colorretal",
    "Linfoma de Hodgkin",
    "Linfoma não-Hodgkin",
    "Leucemia linfocítica crônica",
    "Câncer de ovário",
    "Câncer de estômago",
    "Câncer de fígado",
    "Câncer de pâncreas",
    "Câncer de rim",
    "Câncer de bexiga",
    "Melanoma",
    "Câncer de tireoide",
    "Câncer de cabeça e pescoço",
    "Sarcoma de partes moles",
    "Câncer de esôfago",
    "Câncer de colo do útero",
    "Câncer de endométrio"
]

COMORBIDITIES = [
    "Hipertensão arterial sistêmica",
    "Diabetes mellitus tipo 2",
    "Cardiopatia isquêmica",
    "Insuficiência cardíaca",
    "Neuropatia periférica",
    "Osteoporose",
    "Depressão",
    "Ansiedade",
    "Insônia",
    "Neuropatia induzida por quimioterapia",
    "Mucosite",
    "Xerostomia",
    "Linfedema",
    "Trombose venosa profunda",
    "Anemia",
    "Neutropenia",
    "Disfunção renal leve",
    "Hepatotoxicidade leve"
]

TREATMENTS = [
    "Quimioterapia adjuvante",
    "Radioterapia",
    "Hormonioterapia",
    "Imunoterapia",
    "Terapia alvo",
    "Quimioterapia paliativa",
    "Cuidados de suporte",
    "Seguimento oncológico",
    "Reabilitação pós-cirúrgica",
    "Controle da dor",
    "Fisioterapia oncológica",
    "Suporte nutricional",
    "Acompanhamento psico-oncológico"
]

PROFESSIONALS = [
    "Dr. Carlos Silva",
    "Dra. Maria Santos", 
    "Dr. João Oliveira",
    "Dra. Ana Costa",
    "Dr. Pedro Almeida",
    "Dra. Lucia Ferreira",
    "Dr. Roberto Lima",
    "Dra. Patricia Rocha",
    "Dr. Fernando Souza",
    "Dra. Carla Mendes"
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

def generate_email(name: str):
    """Generate email based on name"""
    first_name = name.split()[0].lower()
    last_name = name.split()[-1].lower()
    domains = ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com"]
    return f"{first_name}.{last_name}@{random.choice(domains)}"

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
    """Generate FACT-F domain scores based on target classification"""
    if target_classification == "Sem Fadiga":
        bem_estar_fisico = random.uniform(20, 28)     
        bem_estar_social = random.uniform(20, 28)      
        bem_estar_emocional = random.uniform(18, 24)   
        bem_estar_funcional = random.uniform(20, 28)   
        subescala_fadiga = random.uniform(44, 52)    
    elif target_classification == "Fadiga Leve":
        bem_estar_fisico = random.uniform(12, 22)
        bem_estar_social = random.uniform(12, 22)
        bem_estar_emocional = random.uniform(10, 18)
        bem_estar_funcional = random.uniform(12, 22)
        subescala_fadiga = random.uniform(30, 43)
    else:  
        bem_estar_fisico = random.uniform(4, 16)
        bem_estar_social = random.uniform(4, 16)
        bem_estar_emocional = random.uniform(2, 12)
        bem_estar_funcional = random.uniform(4, 16)
        subescala_fadiga = random.uniform(8, 29)
    
    return {
        "bem_estar_fisico": round(bem_estar_fisico, 1),
        "bem_estar_social": round(bem_estar_social, 1),
        "bem_estar_emocional": round(bem_estar_emocional, 1),
        "bem_estar_funcional": round(bem_estar_funcional, 1),
        "subescala_fadiga": round(subescala_fadiga, 1)
    }

def get_classification_from_fatigue_score(fatigue_score: float) -> str:
    """Get classification based on fatigue subscale score"""
    if fatigue_score >= 44:
        return "Sem Fadiga"
    elif fatigue_score >= 30:
        return "Fadiga Leve"
    else:
        return "Fadiga Grave"

def generate_comorbidities(classification: str) -> str:
    """Generate realistic comorbidities based on classification"""
    if classification == "Sem Fadiga":
        num_comorbidities = random.randint(0, 2)
    elif classification == "Fadiga Leve":
        num_comorbidities = random.randint(1, 3)
    else:  
        num_comorbidities = random.randint(2, 5)
    
    if num_comorbidities == 0:
        return "Nenhuma comorbidade conhecida"
    
    selected = random.sample(COMORBIDITIES, min(num_comorbidities, len(COMORBIDITIES)))
    return ", ".join(selected)

def generate_patient(classification: str = None):
    """Generate a single fake FACT-F patient"""
    age = random.randint(18, 85) 
    registration_date = generate_registration_date()
    name = fake.name()
    
    if classification:
        comorbidities = generate_comorbidities(classification)
    else:
        temp_classification = random.choices(
            ["Sem Fadiga", "Fadiga Leve", "Fadiga Grave"],
            weights=[0.25, 0.50, 0.25]
        )[0]
        comorbidities = generate_comorbidities(temp_classification)
    
    patient = {
        "nome_completo": name,
        "cpf": generate_cpf(),
        "idade": age,
        "telefone": generate_phone(),
        "email": generate_email(name),
        "bairro": random.choice(CURITIBA_NEIGHBORHOODS),
        "unidade_saude_id": random.choice(HEALTH_UNIT_IDS),
        "diagnostico_principal": random.choice(CANCER_DIAGNOSES),
        "comorbidades": comorbidities,
        "tratamento_atual": random.choice(TREATMENTS),
        "data_cadastro": registration_date.isoformat()
    }
    
    return patient, registration_date

def generate_evaluation(patient_id: int, registration_date: date):
    """Generate a FACT-F evaluation for a patient"""
    classification_weights = [
        ("Sem Fadiga", 0.25),    
        ("Fadiga Leve", 0.50),     
        ("Fadiga Grave", 0.25)   
    ]
    
    classification = random.choices(
        [c[0] for c in classification_weights],
        weights=[c[1] for c in classification_weights]
    )[0]
    
    domain_scores = generate_domain_scores(classification)
    
    total_score = (domain_scores["bem_estar_fisico"] + 
                  domain_scores["bem_estar_social"] + 
                  domain_scores["bem_estar_emocional"] + 
                  domain_scores["bem_estar_funcional"] + 
                  domain_scores["subescala_fadiga"])
    
    actual_classification = get_classification_from_fatigue_score(domain_scores["subescala_fadiga"])
    
    evaluation_date = generate_evaluation_date(registration_date)
    
    detailed_responses = {
        "physical_wellbeing": [4, 3, 4, 2, 3, 4, 1], 
        "social_wellbeing": [3, 4, 2, 3, 4, 2, 1],   
        "emotional_wellbeing": [2, 3, 4, 1, 2, 3],   
        "functional_wellbeing": [3, 2, 4, 3, 1, 2, 4], 
        "fatigue_subscale": [2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 3, 2, 1] 
    }
    
    evaluation = {
        "patient_id": patient_id,
        "data_avaliacao": evaluation_date.isoformat(),
        "bem_estar_fisico": domain_scores["bem_estar_fisico"],
        "bem_estar_social": domain_scores["bem_estar_social"],
        "bem_estar_emocional": domain_scores["bem_estar_emocional"],
        "bem_estar_funcional": domain_scores["bem_estar_funcional"],
        "subescala_fadiga": domain_scores["subescala_fadiga"],
        "respostas_detalhadas": json.dumps(detailed_responses),
        "observacoes": f"Avaliação FACT-F realizada em {evaluation_date.strftime('%d/%m/%Y')}. Paciente em {random.choice(['início', 'meio', 'final'])} do tratamento.",
        "profissional_responsavel": random.choice(PROFESSIONALS)
    }
    
    return evaluation, actual_classification

def make_api_request(method: str, endpoint: str, data: Dict = None):
    """Make API request with error handling"""
    url = f"{API_BASE_URL}/{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers={"Content-Type": "application/json"})
        elif method.upper() == "DELETE":
            response = requests.delete(url)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return None

def cleanup_existing_data():
    """Delete all existing FACT-F patients and evaluations"""
    print("🧹 Cleaning up existing FACT-F data...")
    
    response = make_api_request("GET", "factf-patients/")
    if not response or response.status_code != 200:
        print("❌ Failed to get existing FACT-F patients")
        return False
    
    patients = response.json()
    print(f"Found {len(patients)} existing FACT-F patients to delete")
    
    deleted_count = 0
    for patient in patients:
        response = make_api_request("DELETE", f"factf-patients/{patient['id']}")
        if response and response.status_code in [200, 204]:
            deleted_count += 1
            print(f"✅ Deleted FACT-F patient {patient['id']}: {patient['nome_completo']}")
        else:
            print(f"❌ Failed to delete FACT-F patient {patient['id']}: {patient['nome_completo']}")
    
    print(f"🗑️  Deleted {deleted_count} FACT-F patients")
    return True

def create_patient_with_evaluation(patient_data: Dict, registration_date: date):
    """Create a FACT-F patient and their evaluation"""
    response = make_api_request("POST", "factf-patients/", patient_data)
    if not response or response.status_code != 201:
        print(f"❌ Failed to create FACT-F patient: {patient_data['nome_completo']}")
        if response:
            print(f"   Status: {response.status_code}, Response: {response.text}")
        return None
    
    created_patient = response.json()
    patient_id = created_patient['id']
    print(f"✅ Created FACT-F patient {patient_id}: {patient_data['nome_completo']}")
    
    evaluation_data, classification = generate_evaluation(patient_id, registration_date)
    
    response = make_api_request("POST", f"factf-patients/{patient_id}/evaluations", evaluation_data)
    if not response or response.status_code != 201:
        print(f"❌ Failed to create FACT-F evaluation for patient {patient_id}")
        if response:
            print(f"   Status: {response.status_code}, Response: {response.text}")
        return created_patient
    
    created_evaluation = response.json()
    classification = created_evaluation['classificacao_fadiga']
    total_score = created_evaluation['pontuacao_total']
    fatigue_score = created_evaluation['pontuacao_fadiga']
    
    print(f"✅ Created FACT-F evaluation for patient {patient_id}: {classification} (Total: {total_score:.1f}, Fadiga: {fatigue_score:.1f})")
    
    return {
        "patient": created_patient,
        "evaluation": created_evaluation
    }

def generate_complete_dataset(num_patients: int = NUM_PATIENTS):
    """Generate complete FACT-F dataset with patients and single evaluations"""
    print(f"🚀 Starting complete FACT-F data generation...")
    print(f"Target: {num_patients} patients with one evaluation each")
    
    if not cleanup_existing_data():
        print("❌ Failed to cleanup existing FACT-F data")
        return False
    
    print(f"\n📊 Generating {num_patients} new FACT-F patients with single evaluations...")
    
    created_patients = []
    success_count = 0
    
    for i in range(num_patients):
        print(f"\n--- Creating FACT-F patient {i+1}/{num_patients} ---")
        
        patient_data, registration_date = generate_patient()
        
        result = create_patient_with_evaluation(patient_data, registration_date)
        if result:
            created_patients.append(result)
            success_count += 1
    
    print(f"\n📈 FACT-F Generation Complete!")
    print(f"✅ Successfully created: {success_count} patients with single evaluations")
    print(f"❌ Failed: {num_patients - success_count}")
    
    if created_patients:
        classifications = {}
        total_scores = []
        fatigue_scores = []
        
        for item in created_patients:
            if 'evaluation' in item:
                eval_data = item['evaluation']
                classification = eval_data['classificacao_fadiga']
                classifications[classification] = classifications.get(classification, 0) + 1
                total_scores.append(eval_data['pontuacao_total'])
                fatigue_scores.append(eval_data['pontuacao_fadiga'])
        
        print(f"\n📊 Fatigue Classification Distribution:")
        for classification, count in classifications.items():
            percentage = (count / len(created_patients)) * 100
            print(f"  {classification}: {count} patients ({percentage:.1f}%)")
        
        if total_scores:
            print(f"\n📈 Score Statistics:")
            print(f"  Average total score: {sum(total_scores) / len(total_scores):.1f}/136")
            print(f"  Total score range: {min(total_scores):.1f} - {max(total_scores):.1f}")
            print(f"  Average fatigue score: {sum(fatigue_scores) / len(fatigue_scores):.1f}/52")
            print(f"  Fatigue score range: {min(fatigue_scores):.1f} - {max(fatigue_scores):.1f}")
    
    return success_count > 0

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate complete FACT-F dataset with patients and evaluations")
    parser.add_argument("-n", "--num-patients", type=int, default=NUM_PATIENTS,
                       help=f"Number of patients to generate (default: {NUM_PATIENTS})")
    parser.add_argument("--no-cleanup", action="store_true",
                       help="Don't delete existing data before generating new data")
    
    args = parser.parse_args()
    
    if args.no_cleanup:
        print("⚠️  Skipping cleanup - new data will be added to existing FACT-F data")
    
    success = generate_complete_dataset(args.num_patients)
    
    if success:
        print(f"\n🎉 FACT-F dataset generation completed successfully!")
        print(f"🔍 Check your FACT-F dashboard to see the new data!")
        print(f"📋 Each patient has exactly one FACT-F evaluation.")
    else:
        print(f"\n💥 FACT-F dataset generation failed. Please check your API server.")