import { type SedentaryRiskLevel } from '../types/physicalActivity';

/**
 * Formatar data para exibição
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formatar data para API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formatar horas sedentárias para exibição
 */
export const formatSedentaryHours = (hours: number): string => {
  if (hours === 0) return '0h';
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h${minutes}min`;
};

/**
 * Formatar minutos para exibição
 */
export const formatMinutes = (minutes: number): string => {
  if (minutes === 0) return '0min';
  if (minutes < 60) return `${minutes}min`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes}min`;
};

/**
 * Formatar porcentagem
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Obter variante do badge baseado no nível de risco sedentário
 */
export const getBadgeVariant = (riskLevel: SedentaryRiskLevel): "default" | "secondary" | "destructive" | "outline" => {
  switch (riskLevel) {
    case 'Baixo':
      return 'secondary';
    case 'Moderado':
      return 'outline';
    case 'Alto':
      return 'destructive';
    case 'Crítico':
      return 'destructive';
    default:
      return 'default';
  }
};

/**
 * Obter cor baseada no nível de risco sedentário
 */
export const getRiskColor = (riskLevel: SedentaryRiskLevel): string => {
  switch (riskLevel) {
    case 'Baixo':
      return '#4CAF50';
    case 'Moderado':
      return '#FF9800';
    case 'Alto':
      return '#FF5722';
    case 'Crítico':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

/**
 * Obter variante do badge para conformidade OMS
 */
export const getComplianceBadgeVariant = (isCompliant: boolean): "default" | "secondary" | "destructive" => {
  return isCompliant ? 'secondary' : 'destructive';
};

/**
 * Calcular conformidade com diretrizes da OMS
 */
export const calculateWHOCompliance = (moderateMinutes: number, vigorousMinutes: number): boolean => {
  return moderateMinutes >= 150 || vigorousMinutes >= 75;
};

/**
 * Calcular nível de risco sedentário
 */
export const calculateSedentaryRiskLevel = (sedentaryHours: number): SedentaryRiskLevel => {
  if (sedentaryHours < 6) return 'Baixo';
  if (sedentaryHours < 8) return 'Moderado';
  if (sedentaryHours <= 10) return 'Alto';
  return 'Crítico';
};

/**
 * Calcular minutos semanais de atividade
 */
export const calculateWeeklyMinutes = (minutesPerDay: number, daysPerWeek: number): number => {
  return minutesPerDay * daysPerWeek;
};

/**
 * Validar dados de atividade física
 */
export const validateActivityData = (data: {
  lightMinutes: number;
  lightDays: number;
  moderateMinutes: number;
  moderateDays: number;
  vigorousMinutes: number;
  vigorousDays: number;
  sedentaryHours: number;
  screenTimeHours: number;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar limites de atividade
  if (data.lightMinutes < 0 || data.lightMinutes > 480) {
    errors.push('Atividade leve deve estar entre 0 e 480 minutos por dia');
  }
  if (data.moderateMinutes < 0 || data.moderateMinutes > 300) {
    errors.push('Atividade moderada deve estar entre 0 e 300 minutos por dia');
  }
  if (data.vigorousMinutes < 0 || data.vigorousMinutes > 180) {
    errors.push('Atividade vigorosa deve estar entre 0 e 180 minutos por dia');
  }

  // Validar dias
  [data.lightDays, data.moderateDays, data.vigorousDays].forEach((days, index) => {
    const activities = ['leve', 'moderada', 'vigorosa'];
    if (days < 0 || days > 7) {
      errors.push(`Dias de atividade ${activities[index]} deve estar entre 0 e 7`);
    }
  });

  // Validar horas sedentárias
  if (data.sedentaryHours < 0 || data.sedentaryHours > 24) {
    errors.push('Horas sedentárias deve estar entre 0 e 24');
  }
  if (data.screenTimeHours < 0 || data.screenTimeHours > 24) {
    errors.push('Tempo de tela deve estar entre 0 e 24');
  }

  // Verificação básica de consistência temporal
  const maxDailyActivity = Math.max(
    data.lightMinutes + data.moderateMinutes + data.vigorousMinutes
  ) / 60;
  
  if (data.sedentaryHours + maxDailyActivity > 26) {
    errors.push('Soma de atividades e tempo sedentário excede limites razoáveis');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Preparar dados para exportação
 */
export const prepareDataForExport = (data: Record<string, unknown>[], filename: string): void => {
  try {
    // Converter para CSV
    if (data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar valores que contêm vírgulas ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
  }
};

/**
 * Obter texto descritivo para nível de risco
 */
export const getRiskDescription = (riskLevel: SedentaryRiskLevel): string => {
  switch (riskLevel) {
    case 'Baixo':
      return 'Comportamento sedentário dentro dos limites saudáveis';
    case 'Moderado':
      return 'Comportamento sedentário moderadamente elevado';
    case 'Alto':
      return 'Comportamento sedentário elevado - requer atenção';
    case 'Crítico':
      return 'Comportamento sedentário crítico - intervenção necessária';
    default:
      return 'Nível de risco não determinado';
  }
};

/**
 * Obter texto descritivo para conformidade OMS
 */
export const getComplianceDescription = (isCompliant: boolean): string => {
  return isCompliant 
    ? 'Atende às diretrizes da OMS para atividade física'
    : 'Não atende às diretrizes da OMS para atividade física';
};

interface PatientSummary {
  sedentary_hours_per_day?: number;
  who_compliance?: boolean;
  sedentary_risk_level?: SedentaryRiskLevel;
}

/**
 * Calcular estatísticas resumidas de um conjunto de pacientes
 */
export const calculateSummaryStats = (patients: PatientSummary[]) => {
  if (!patients || patients.length === 0) {
    return {
      totalPatients: 0,
      averageSedentaryHours: 0,
      compliancePercentage: 0,
      criticalCount: 0,
    };
  }

  const totalPatients = patients.length;
  const totalSedentaryHours = patients.reduce((sum, p) => sum + (p.sedentary_hours_per_day || 0), 0);
  const averageSedentaryHours = totalSedentaryHours / totalPatients;
  
  const compliantCount = patients.filter(p => p.who_compliance === true).length;
  const compliancePercentage = (compliantCount / totalPatients) * 100;
  
  const criticalCount = patients.filter(p => 
    p.sedentary_risk_level === 'Crítico' || p.sedentary_hours_per_day >= 10
  ).length;

  return {
    totalPatients,
    averageSedentaryHours: Math.round(averageSedentaryHours * 10) / 10,
    compliancePercentage: Math.round(compliancePercentage),
    criticalCount,
  };
};

interface FilterablePatient {
  idade?: number;
  age?: number;
  sedentary_risk_level?: SedentaryRiskLevel;
  who_compliance?: boolean;
  nome_completo?: string;
  patient_name?: string;
  cpf?: string;
}

/**
 * Filtrar pacientes por critérios
 */
export const filterPatients = (patients: FilterablePatient[], filters: {
  ageRange?: string;
  riskLevel?: string;
  compliance?: string;
  searchTerm?: string;
}) => {
  if (!patients) return [];

  return patients.filter(patient => {
    // Filtro por faixa etária
    if (filters.ageRange && filters.ageRange !== 'all') {
      const age = patient.idade || patient.age;
      if (filters.ageRange === '60-70' && (age < 60 || age > 70)) return false;
      if (filters.ageRange === '71-80' && (age < 71 || age > 80)) return false;
      if (filters.ageRange === '81+' && age < 81) return false;
    }

    // Filtro por nível de risco
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      if (patient.sedentary_risk_level !== filters.riskLevel) return false;
    }

    // Filtro por conformidade OMS
    if (filters.compliance && filters.compliance !== 'all') {
      const isCompliant = patient.who_compliance === true;
      if (filters.compliance === 'compliant' && !isCompliant) return false;
      if (filters.compliance === 'non-compliant' && isCompliant) return false;
    }

    // Filtro por termo de busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const name = (patient.nome_completo || patient.patient_name || '').toLowerCase();
      const cpf = (patient.cpf || '').replace(/\D/g, '');
      const searchCpf = filters.searchTerm.replace(/\D/g, '');
      
      if (!name.includes(searchLower) && !cpf.includes(searchCpf)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Ordenar pacientes por critério
 */
export const sortPatients = (patients: FilterablePatient[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  if (!patients) return [];

  return [...patients].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'name':
        valueA = (a.nome_completo || a.patient_name || '').toLowerCase();
        valueB = (b.nome_completo || b.patient_name || '').toLowerCase();
        break;
      case 'age':
        valueA = a.idade || a.age || 0;
        valueB = b.idade || b.age || 0;
        break;
      case 'sedentaryHours':
        valueA = a.sedentary_hours_per_day || 0;
        valueB = b.sedentary_hours_per_day || 0;
        break;
      case 'riskLevel': {
        const riskOrder = { 'Baixo': 1, 'Moderado': 2, 'Alto': 3, 'Crítico': 4 };
        valueA = riskOrder[a.sedentary_risk_level as SedentaryRiskLevel] || 0;
        valueB = riskOrder[b.sedentary_risk_level as SedentaryRiskLevel] || 0;
        break;
      }
      case 'compliance':
        valueA = a.who_compliance ? 1 : 0;
        valueB = b.who_compliance ? 1 : 0;
        break;
      default:
        return 0;
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};