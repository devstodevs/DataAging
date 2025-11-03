"""
Utilitários para cálculo de pontuações FACT-F
"""
from typing import Dict, Any


def calculate_factf_scores(domain_scores: Dict[str, float]) -> Dict[str, Any]:
    """
    Calcula as pontuações totais e classificação do FACT-F
    
    Args:
        domain_scores: Dict com as pontuações dos domínios
            - bem_estar_fisico: 0-28
            - bem_estar_social: 0-28  
            - bem_estar_emocional: 0-24
            - bem_estar_funcional: 0-28
            - subescala_fadiga: 0-52
    
    Returns:
        Dict com pontuacao_total, pontuacao_fadiga e classificacao_fadiga
    """
    
    # Pontuação FACT-G (sem fadiga)
    factg_score = (
        domain_scores.get('bem_estar_fisico', 0) +
        domain_scores.get('bem_estar_social', 0) +
        domain_scores.get('bem_estar_emocional', 0) +
        domain_scores.get('bem_estar_funcional', 0)
    )
    
    # Subescala de fadiga
    fadiga_score = domain_scores.get('subescala_fadiga', 0)
    
    # Pontuação total FACT-F
    total_score = factg_score + fadiga_score
    
    # Classificação da fadiga baseada na subescala
    # Valores de referência (podem ser ajustados conforme literatura)
    if fadiga_score >= 44:
        classificacao = "Sem Fadiga"
    elif fadiga_score >= 30:
        classificacao = "Fadiga Leve"  
    else:
        classificacao = "Fadiga Grave"
    
    return {
        'pontuacao_total': total_score,
        'pontuacao_fadiga': fadiga_score,
        'classificacao_fadiga': classificacao
    }


def validate_domain_scores(domain_scores: Dict[str, float]) -> bool:
    """
    Valida se as pontuações dos domínios estão dentro dos limites
    """
    limits = {
        'bem_estar_fisico': (0, 28),
        'bem_estar_social': (0, 28),
        'bem_estar_emocional': (0, 24),
        'bem_estar_funcional': (0, 28),
        'subescala_fadiga': (0, 52)
    }
    
    for domain, score in domain_scores.items():
        if domain in limits:
            min_val, max_val = limits[domain]
            if not (min_val <= score <= max_val):
                return False
    
    return True