"""
CPF validation utilities
"""
import re


def validate_cpf(cpf: str) -> bool:
    """
    Validate Brazilian CPF number.
    
    Args:
        cpf: CPF string with or without formatting
        
    Returns:
        True if CPF is valid, False otherwise
    """
    cpf_clean = re.sub(r'\D', '', cpf)
    
    if len(cpf_clean) != 11:
        return False
    
    if cpf_clean == cpf_clean[0] * 11:
        return False
    
    sum_digits = sum(int(cpf_clean[i]) * (10 - i) for i in range(9))
    remainder = (sum_digits * 10) % 11
    if remainder in (10, 11):
        remainder = 0
    if remainder != int(cpf_clean[9]):
        return False
    
    sum_digits = sum(int(cpf_clean[i]) * (11 - i) for i in range(10))
    remainder = (sum_digits * 10) % 11
    if remainder in (10, 11):
        remainder = 0
    if remainder != int(cpf_clean[10]):
        return False
    
    return True


def clean_cpf(cpf: str) -> str:
    """
    Remove formatting from CPF.
    
    Args:
        cpf: CPF string with formatting
        
    Returns:
        CPF with only numbers
    """
    return re.sub(r'\D', '', cpf)


def format_cpf(cpf: str) -> str:
    """
    Format CPF for display.
    
    Args:
        cpf: CPF string without formatting
        
    Returns:
        Formatted CPF (xxx.xxx.xxx-xx)
    """
    cpf_clean = clean_cpf(cpf)
    if len(cpf_clean) == 11:
        return f"{cpf_clean[:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:]}"
    return cpf_clean