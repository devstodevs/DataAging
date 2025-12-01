import { type FatigueClassification, FACTF_DOMAIN_LIMITS, type FACTFPatientSummary, type FACTFFilters } from '../types/factf';

/**
 * Calculate fatigue classification based on fatigue subscale score
 */
export const calculateFatigueClassification = (fatigueScore: number): FatigueClassification => {
  if (fatigueScore >= 44) return 'Sem Fadiga';
  if (fatigueScore >= 30) return 'Fadiga Leve';
  return 'Fadiga Grave';
};

/**
 * Calculate total FACT-F score from domain scores
 */
export const calculateTotalScore = (domains: {
  bem_estar_fisico: number;
  bem_estar_social: number;
  bem_estar_emocional: number;
  bem_estar_funcional: number;
  subescala_fadiga: number;
}): number => {
  return domains.bem_estar_fisico + 
         domains.bem_estar_social + 
         domains.bem_estar_emocional + 
         domains.bem_estar_funcional + 
         domains.subescala_fadiga;
};

/**
 * Validate domain score is within allowed range
 */
export const validateDomainScore = (domain: keyof typeof FACTF_DOMAIN_LIMITS, score: number): boolean => {
  const limits = FACTF_DOMAIN_LIMITS[domain];
  return score >= limits.min && score <= limits.max;
};

/**
 * Validate all domain scores
 */
export const validateAllDomainScores = (domains: {
  bem_estar_fisico: number;
  bem_estar_social: number;
  bem_estar_emocional: number;
  bem_estar_funcional: number;
  subescala_fadiga: number;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  Object.entries(domains).forEach(([domain, score]) => {
    if (!validateDomainScore(domain as keyof typeof FACTF_DOMAIN_LIMITS, score)) {
      const limits = FACTF_DOMAIN_LIMITS[domain as keyof typeof FACTF_DOMAIN_LIMITS];
      errors.push(`${domain}: deve estar entre ${limits.min} e ${limits.max}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get classification color for UI display
 */
export const getClassificationColor = (classification: FatigueClassification): string => {
  switch (classification) {
    case 'Sem Fadiga':
      return 'text-green-600 bg-green-100';
    case 'Fadiga Leve':
      return 'text-yellow-600 bg-yellow-100';
    case 'Fadiga Grave':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get classification badge variant
 */
export const getClassificationVariant = (classification: FatigueClassification): 'default' | 'secondary' | 'destructive' => {
  switch (classification) {
    case 'Sem Fadiga':
      return 'default';
    case 'Fadiga Leve':
      return 'secondary';
    case 'Fadiga Grave':
      return 'destructive';
    default:
      return 'default';
  }
};

/**
 * Format score for display
 */
export const formatScore = (score: number, decimals: number = 1): string => {
  return score.toFixed(decimals);
};

/**
 * Calculate percentage of max score
 */
export const calculatePercentage = (score: number, maxScore: number): number => {
  return (score / maxScore) * 100;
};

/**
 * Get domain display name in Portuguese
 */
export const getDomainDisplayName = (domain: string): string => {
  const domainNames: Record<string, string> = {
    bem_estar_fisico: 'Bem-estar Físico',
    bem_estar_social: 'Bem-estar Social',
    bem_estar_emocional: 'Bem-estar Emocional',
    bem_estar_funcional: 'Bem-estar Funcional',
    subescala_fadiga: 'Subescala Fadiga',
  };

  return domainNames[domain] || domain;
};

/**
 * Parse age range filter
 */
export const parseAgeRange = (ageRange: string): { min: number; max?: number } => {
  switch (ageRange) {
    case '18-30':
      return { min: 18, max: 30 };
    case '31-50':
      return { min: 31, max: 50 };
    case '51-70':
      return { min: 51, max: 70 };
    case '71+':
      return { min: 71 };
    default:
      return { min: 18 };
  }
};

/**
 * Format date for API
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

/**
 * Check if patient has critical fatigue
 */
export const isCriticalFatigue = (fatigueScore: number, threshold: number = 30): boolean => {
  return fatigueScore < threshold;
};

/**
 * Get fatigue severity level (0-100 scale)
 */
export const getFatigueSeverityLevel = (fatigueScore: number): number => {
  // Invert the score since lower FACT-F fatigue scores mean more fatigue
  return Math.max(0, Math.min(100, ((52 - fatigueScore) / 52) * 100));
};

/**
 * Generate chart colors for fatigue classifications
 */
export const getFatigueChartColors = (): Record<string, string> => {
  return {
    'Sem Fadiga': '#10b981', // green-500
    'Fadiga Leve': '#f59e0b', // amber-500
    'Fadiga Grave': '#ef4444', // red-500
  };
};

/**
 * Validate CPF format (basic validation)
 */
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.length === 11;
};

/**
 * Format CPF for display
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Filter FACT-F patients based on selected filters
 */
export const filterFACTFPatients = (
  patients: FACTFPatientSummary[], 
  filters: FACTFFilters & { searchTerm?: string }
): FACTFPatientSummary[] => {
  if (!patients || !Array.isArray(patients)) return [];

  return patients.filter(patient => {
    // Filter by age range
    if (filters.age_range) {
      const age = patient.age;
      if (age === undefined || age === null) return true;
      
      const { min, max } = parseAgeRange(filters.age_range);
      if (min !== undefined && age < min) return false;
      if (max !== undefined && age > max) return false;
    }

    // Filter by fatigue classification
    if (filters.classificacao_fadiga) {
      if (patient.classification === undefined || patient.classification === null) {
        return true;
      }
      if (patient.classification !== filters.classificacao_fadiga) return false;
    }

    // Filter by search term (name)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const name = (patient.name || '').toLowerCase();
      
      if (!name.includes(searchLower)) {
        return false;
      }
    }

    // Filter by last evaluation date (if period filter is applied)
    if ((filters.period_from || filters.period_to) && patient.evaluation_date) {
      const evalDate = new Date(patient.evaluation_date);
      
      if (filters.period_from) {
        const fromDate = new Date(filters.period_from);
        if (evalDate < fromDate) return false;
      }
      
      if (filters.period_to) {
        const toDate = new Date(filters.period_to);
        toDate.setHours(23, 59, 59, 999);
        if (evalDate > toDate) return false;
      }
    }

    return true;
  });
};