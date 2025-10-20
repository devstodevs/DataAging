/**
 * Valida se um CPF é válido
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF for válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }
  
  return true;
}

/**
 * Formata um CPF para exibição
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Remove formatação do CPF
 * @param cpf - CPF com formatação
 * @returns CPF apenas com números
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}