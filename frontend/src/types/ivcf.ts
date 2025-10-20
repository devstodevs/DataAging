export interface IVCFPatient {
  patient_id: number;
  nome_completo: string;
  idade: number;
  bairro: string;
  unidade_saude: string;
  pontuacao_total: number;
  classificacao: 'Robusto' | 'Em Risco' | 'Frágil';
  comorbidades: string;
  data_ultima_avaliacao: string;
}

export interface DomainScore {
  domain: string;
  average_score: number;
  min_score: number;
  max_score: number;
  patient_count: number;
}

export interface RegionAverage {
  regiao: string;
  bairro: string;
  average_score: number;
  patient_count: number;
  fragile_count: number;
  risk_count: number;
  robust_count: number;
}

export interface MonthlyEvolution {
  month: string;
  year: number;
  robust: number;
  risk: number;
  fragile: number;
  total: number;
}

export interface IVCFSummary {
  total_elderly: number;
  fragile_percentage: number;
  average_score: number;
  critical_patients_count: number;
}

export interface FragilePercentage {
  total_patients: number;
  fragile_patients: number;
  fragile_percentage: number;
  breakdown: {
    robust: number;
    risk: number;
    fragile: number;
  };
}

export interface IVCFFilters {
  period_from?: string;
  period_to?: string;
  age_range?: '60-70' | '71-80' | '81+';
  region?: string;
  health_unit_id?: number;
  classification?: 'Robusto' | 'Em Risco' | 'Frágil';
}

export interface DomainDistributionResponse {
  domains: DomainScore[];
  filters_applied: IVCFFilters;
  total_patients: number;
}

export interface RegionAverageResponse {
  regions: RegionAverage[];
  filters_applied: IVCFFilters;
  total_regions: number;
}

export interface MonthlyEvolutionResponse {
  evolution: MonthlyEvolution[];
  months_analyzed: number;
  total_evaluations: number;
}

export interface CriticalPatientsResponse {
  critical_patients: IVCFPatient[];
  total_critical: number;
  minimum_score_threshold: number;
}

export interface FragileElderlyPercentageResponse {
  percentage_data: FragilePercentage;
  filters_applied: IVCFFilters;
}

export interface RadarChartData {
  domain: string;
  score: number;
  fullMark: number;
}

export interface LineChartData {
  month: string;
  Robusto: number;
  Risco: number;
  Frágil: number;
  [key: string]: string | number;
}