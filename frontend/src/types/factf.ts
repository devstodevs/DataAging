// FACT-F Patient Types
export interface FACTFPatient {
    id: number;
    nome_completo: string;
    cpf: string;
    idade: number;
    telefone?: string;
    email?: string;
    bairro: string;
    unidade_saude_id: number;
    diagnostico_principal?: string;
    comorbidades?: string;
    tratamento_atual?: string;
    data_cadastro: string;
    ativo: boolean;
}

export interface FACTFPatientCreate {
    nome_completo: string;
    cpf: string;
    idade: number;
    telefone?: string;
    email?: string;
    bairro: string;
    unidade_saude_id: number;
    diagnostico_principal?: string;
    comorbidades?: string;
    tratamento_atual?: string;
    data_cadastro?: string;
}

export interface FACTFPatientUpdate {
    nome_completo?: string;
    telefone?: string;
    email?: string;
    bairro?: string;
    unidade_saude_id?: number;
    diagnostico_principal?: string;
    comorbidades?: string;
    tratamento_atual?: string;
    ativo?: boolean;
}

export interface FACTFPatientList {
    id: number;
    nome_completo: string;
    cpf: string;
    idade: number;
    bairro: string;
    data_cadastro: string;
    ativo: boolean;
    ultima_avaliacao?: string;
    pontuacao_ultima_avaliacao?: number;
    classificacao_fadiga?: FatigueClassification;
}

// FACT-F Evaluation Types
export interface FACTFEvaluation {
    id: number;
    patient_id: number;
    data_avaliacao: string;
    pontuacao_total: number;
    pontuacao_fadiga: number;
    classificacao_fadiga: FatigueClassification;
    bem_estar_fisico: number;
    bem_estar_social: number;
    bem_estar_emocional: number;
    bem_estar_funcional: number;
    subescala_fadiga: number;
    respostas_detalhadas?: string;
    observacoes?: string;
    profissional_responsavel?: string;
}

export interface FACTFEvaluationCreate {
    patient_id: number;
    data_avaliacao: string;
    bem_estar_fisico: number;
    bem_estar_social: number;
    bem_estar_emocional: number;
    bem_estar_funcional: number;
    subescala_fadiga: number;
    respostas_detalhadas?: string;
    observacoes?: string;
    profissional_responsavel?: string;
}

export interface FACTFEvaluationUpdate {
    data_avaliacao?: string;
    bem_estar_fisico?: number;
    bem_estar_social?: number;
    bem_estar_emocional?: number;
    bem_estar_funcional?: number;
    subescala_fadiga?: number;
    respostas_detalhadas?: string;
    observacoes?: string;
    profissional_responsavel?: string;
}

// FACT-F Specific Types
export type FatigueClassification = 'Sem Fadiga' | 'Fadiga Leve' | 'Fadiga Grave';

export interface FACTFDomainScores {
    bem_estar_fisico: number;
    bem_estar_social: number;
    bem_estar_emocional: number;
    bem_estar_funcional: number;
    subescala_fadiga: number;
}

export interface FACTFDomainLimits {
    bem_estar_fisico: { min: number; max: number };
    bem_estar_social: { min: number; max: number };
    bem_estar_emocional: { min: number; max: number };
    bem_estar_funcional: { min: number; max: number };
    subescala_fadiga: { min: number; max: number };
}

// Dashboard Types
export interface FACTFSummary {
    total_patients: number;
    severe_fatigue_percentage: number;
    critical_patients_count: number;
    average_total_score: number;
    monthly_growth_percentage: number;
    domain_averages: {
        physical: number;
        social: number;
        emotional: number;
        functional: number;
        fatigue: number;
    };
}

export interface FACTFCriticalPatient {
    id: number;
    name: string;
    age: number;
    neighborhood: string;
    total_score: number;
    fatigue_score: number;
    classification: FatigueClassification;
    evaluation_date: string;
}

export interface FACTFCriticalPatientsResponse {
    critical_patients: FACTFCriticalPatient[];
    count: number;
}

export interface FACTFFatigueDistribution {
    condition: string;
    no_fatigue: number;
    mild_fatigue: number;
    severe_fatigue: number;
}

export interface FACTFFatigueDistributionResponse {
    distribution: FACTFFatigueDistribution[];
}

export interface FACTFMonthlyEvolution {
    month: string;
    average_total_score: number;
    average_fatigue_score: number;
    evaluations_count: number;
}

export interface FACTFMonthlyEvolutionResponse {
    evolution: FACTFMonthlyEvolution[];
}

export interface FACTFDomainDistribution {
    domain: string;
    average_score?: number;
    patient_score?: number;
    regional_average?: number;
    max_score: number;
}

export interface FACTFDomainDistributionResponse {
    domains: FACTFDomainDistribution[];
}

export interface FACTFPatientSummary {
    id: number;
    name: string;
    age: number;
    last_score?: number;
    classification?: FatigueClassification;
    evaluation_date?: string;
}

export interface FACTFAllPatientsResponse {
    patients: FACTFPatientSummary[];
    total_count: number;
}

// Filter Types
export interface FACTFFilters {
    period_from?: string;
    period_to?: string;
    age_range?: '18-30' | '31-50' | '51-70' | '71+';
    bairro?: string;
    unidade_saude_id?: number;
    classificacao_fadiga?: FatigueClassification;
    diagnostico_principal?: string;
}

// Chart Data Types
export interface FACTFRadarChartData {
    domain: string;
    paciente: number;
    mediaRegional: number;
    fullMark: number;
}

export interface FACTFLineChartData {
    month: string;
    escoreTotal: number;
    subscalaFadiga: number;
    [key: string]: string | number;
}

export interface FACTFBarChartData {
    comorbidade: string;
    semFadiga: number;
    fadigaLeve: number;
    fadigaGrave: number;
}

// Form Types
export type FACTFPatientFormData = FACTFPatientCreate;

export type FACTFEvaluationFormData = Omit<FACTFEvaluationCreate, 'patient_id'>;

// API Response Types
export interface FACTFApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface FACTFPaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Constants
export const FACTF_DOMAIN_LIMITS: FACTFDomainLimits = {
    bem_estar_fisico: { min: 0, max: 28 },
    bem_estar_social: { min: 0, max: 28 },
    bem_estar_emocional: { min: 0, max: 24 },
    bem_estar_funcional: { min: 0, max: 28 },
    subescala_fadiga: { min: 0, max: 52 }
};

export const FATIGUE_CLASSIFICATIONS: FatigueClassification[] = [
    'Sem Fadiga',
    'Fadiga Leve',
    'Fadiga Grave'
];

export const AGE_RANGES = [
    { value: '18-30', label: '18-30 anos' },
    { value: '31-50', label: '31-50 anos' },
    { value: '51-70', label: '51-70 anos' },
    { value: '71+', label: '71+ anos' }
] as const;