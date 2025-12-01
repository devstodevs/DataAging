from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.ivcf.ivcf_patient import (
    IVCFPatientCreate,
    IVCFPatientUpdate,
    IVCFPatientResponse,
    IVCFPatientWithEvaluations
)
from services.ivcf.ivcf_patient_service import IVCFPatientService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/ivcf-patients/", response_model=IVCFPatientResponse, status_code=status.HTTP_201_CREATED)
def create_ivcf_patient(
    patient: IVCFPatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo paciente IVCF.
    
    **Corpo da Requisição:**
    - nome_completo: Nome completo
    - cpf: CPF (11-14 caracteres)
    - idade: Idade (mínimo 60)
    - telefone: Número de telefone (opcional)
    - bairro: Bairro
    - unidade_saude_id: ID da unidade de saúde
    - data_cadastro: Data de cadastro (padrão: hoje)
    
    **Retorna:**
    - Dados do paciente criado
    
    **Raises:**
    - 409: CPF já existe
    - 404: Unidade de saúde não encontrada
    - 422: Erro de validação
    """
    return IVCFPatientService.create_ivcf_patient(db, patient)


@router.get("/ivcf-patients/", response_model=List[IVCFPatientResponse])
def list_ivcf_patients(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros para retornar"),
    active_only: bool = Query(True, description="Filtrar apenas pacientes ativos"),
    bairro: Optional[str] = Query(None, description="Filtrar por bairro"),
    unidade_saude_id: Optional[int] = Query(None, description="Filtrar por ID da unidade de saúde"),
    idade_min: Optional[int] = Query(None, ge=60, description="Filtro de idade mínima"),
    idade_max: Optional[int] = Query(None, le=120, description="Filtro de idade máxima"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todos os pacientes IVCF com paginação e filtros.
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (padrão: 0)
    - limit: Número máximo de registros para retornar (padrão: 100, máximo: 100)
    - active_only: Filtrar apenas pacientes ativos (padrão: True)
    - bairro: Filtrar por bairro
    - unidade_saude_id: Filtrar por ID da unidade de saúde
    - idade_min: Filtro de idade mínima (mínimo: 60)
    - idade_max: Filtro de idade máxima (máximo: 120)
    
    **Retorna:**
    - Lista de pacientes
    """
    return IVCFPatientService.get_all_ivcf_patients(
        db, skip, limit, active_only, bairro, unidade_saude_id, idade_min, idade_max
    )


@router.get("/ivcf-patients/{patient_id}", response_model=IVCFPatientResponse)
def get_ivcf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém um paciente IVCF específico por ID.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Dados do paciente
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    return IVCFPatientService.get_ivcf_patient_by_id(db, patient_id)


@router.get("/ivcf-patients/{patient_id}/evaluation", response_model=IVCFPatientWithEvaluations)
def get_patient_with_evaluations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém um paciente com todas as suas avaliações.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Dados do paciente com avaliações
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    patient = IVCFPatientService.get_ivcf_patient_by_id(db, patient_id)
    evaluations = IVCFPatientService.get_patient_evaluations(db, patient_id)
    
    # Convert evaluations to dictionaries for serialization
    evaluations_data = []
    for evaluation in evaluations:
        eval_dict = {
            "id": evaluation.id,
            "patient_id": evaluation.patient_id,
            "data_avaliacao": evaluation.data_avaliacao,
            "pontuacao_total": evaluation.pontuacao_total,
            "classificacao": evaluation.classificacao,
            "dominio_idade": evaluation.dominio_idade,
            "dominio_comorbidades": evaluation.dominio_comorbidades,
            "dominio_comunicacao": evaluation.dominio_comunicacao,
            "dominio_mobilidade": evaluation.dominio_mobilidade,
            "dominio_humor": evaluation.dominio_humor,
            "dominio_cognicao": evaluation.dominio_cognicao,
            "dominio_avd": evaluation.dominio_avd,
            "dominio_autopercepcao": evaluation.dominio_autopercepcao,
            "comorbidades": evaluation.comorbidades,
            "observacoes": evaluation.observacoes
        }
        evaluations_data.append(eval_dict)
    
    # Convert patient to response format
    patient_data = {
        "id": patient.id,
        "nome_completo": patient.nome_completo,
        "cpf": patient.cpf,
        "idade": patient.idade,
        "telefone": patient.telefone,
        "bairro": patient.bairro,
        "unidade_saude_id": patient.unidade_saude_id,
        "data_cadastro": patient.data_cadastro,
        "ativo": patient.ativo,
        "evaluations": evaluations_data
    }
    
    return IVCFPatientWithEvaluations(**patient_data)


@router.get("/ivcf-patients/region/{regiao}", response_model=List[IVCFPatientResponse])
def get_patients_by_region(
    regiao: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém pacientes por região.
    
    **Parâmetros de Caminho:**
    - regiao: Nome da região
    
    **Retorna:**
    - Lista de pacientes na região
    """
    return IVCFPatientService.get_patients_by_region(db, regiao)


@router.get("/ivcf-patients/age-range/{age_range}", response_model=List[IVCFPatientResponse])
def get_patients_by_age_range(
    age_range: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém pacientes por faixa etária.
    
    **Parâmetros de Caminho:**
    - age_range: Faixa etária (60-70, 71-80, 81+)
    
    **Retorna:**
    - Lista de pacientes na faixa etária
    
    **Raises:**
    - 422: Faixa etária inválida
    """
    valid_ranges = ["60-70", "71-80", "81+"]
    if age_range not in valid_ranges:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Faixa etária inválida. Use: {', '.join(valid_ranges)}"
        )
    
    return IVCFPatientService.get_patients_by_age_range(db, age_range)


@router.get("/ivcf-patients/stats/count")
def get_patients_count(
    active_only: bool = Query(True, description="Contar apenas pacientes ativos"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém o total de pacientes.
    
    **Parâmetros de Query:**
    - active_only: Contar apenas pacientes ativos (padrão: True)
    
    **Retorna:**
    - Total de pacientes
    """
    count = IVCFPatientService.count_patients(db, active_only)
    return {"total_patients": count}


@router.put("/ivcf-patients/{patient_id}", response_model=IVCFPatientResponse)
def update_ivcf_patient(
    patient_id: int,
    patient_update: IVCFPatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza um paciente IVCF existente.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo do paciente para atualizar (todos opcionais)
    
    **Retorna:**
    - Dados do paciente atualizado
    
    **Raises:**
    - 404: Paciente não encontrado
    - 409: CPF já existe (se atualizando CPF)
    - 404: Unidade de saúde não encontrada (se atualizando unidade de saúde)
    """
    return IVCFPatientService.update_ivcf_patient(db, patient_id, patient_update)


@router.delete("/ivcf-patients/{patient_id}", status_code=status.HTTP_200_OK)
def delete_ivcf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta um paciente IVCF (exclusão lógica).
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente para deletar
    
    **Retorna:**
    - Mensagem de sucesso
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    IVCFPatientService.delete_ivcf_patient(db, patient_id)
    return {"detail": "Paciente deletado"}
