"""Utility functions for the application"""

def format_cpf(cpf: str) -> str:
    """
    Format CPF to XXX.XXX.XXX-XX pattern.
    
    Args:
        cpf: CPF string (digits only)
        
    Returns:
        Formatted CPF string
    """
    cpf = ''.join(filter(str.isdigit, cpf))
    if len(cpf) != 11:
        return cpf
    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"


def validate_cpf(cpf: str) -> bool:
    """
    Validate CPF using the check digit algorithm.
    
    Args:
        cpf: CPF string
        
    Returns:
        True if valid, False otherwise
    """
    cpf = ''.join(filter(str.isdigit, cpf))
    
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False
    
    # Calculate first check digit
    sum_digits = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digit1 = 11 - (sum_digits % 11)
    digit1 = 0 if digit1 > 9 else digit1
    
    if int(cpf[9]) != digit1:
        return False
    
    # Calculate second check digit
    sum_digits = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digit2 = 11 - (sum_digits % 11)
    digit2 = 0 if digit2 > 9 else digit2
    
    return int(cpf[10]) == digit2
