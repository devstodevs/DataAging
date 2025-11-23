// Physical Activity Patient Types
export interface PhysicalActivityPatient {
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
    medicamentos_atuais?: string;
    data_cadastro: string;
    ativo: boolean;
}

export interface PhysicalActivityPatientCreate {
    nome_completo: string;
    cpf: string;
    idade: number;
    telefone?: string;
    email?: string;
    bairro: string;
    unidade_saude_id: number;
    diagnostico_principal?: string;
    comorbidades?: string;
    medicamentos_atuais?: string;
}

export interface PhysicalActivityPatientUpdate {
    nome_completo?: string;
    telefone?: string;
    email?: string;
    bairro?: string;
    unidade_saude_id?: number;
    diagnostico_principal?: string;
    comorbidades?: string;
    medicamentos_atuais?: string;
    ativo?: boolean;
}

export interface PhysicalActivityPatientList {
    patients: PhysicalActivityPatient[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// Physical Activity Evaluation Types
export interface PhysicalActivityEvaluation {
    id: number;
    patient_id: number;
    data_avaliacao: string;
    light_activity_minutes_per_day: number;
    light_activity_days_per_week: number;
    moderate_activity_minutes_per_day: number;
    moderate_activity_days_per_week: number;
    vigorous_activity_minutes_per_day: number;
    vigorous_activity_days_per_week: number;
    sedentary_hours_per_day: number;
    screen_time_hours_per_day: number;
    total_weekly_moderate_minutes: number;
    total_weekly_vigorous_minutes: number;
    who_compliance: boolean;
    sedentary_risk_level: SedentaryRiskLevel;
    respostas_detalhadas?: Record<string, unknown>;
    observacoes?: string;
    profissional_responsavel?: string;
}

export interface PhysicalActivityEvaluationCreate {
    data_avaliacao: string;
    light_activity_minutes_per_day: number;
    light_activity_days_per_week: number;
    moderate_activity_minutes_per_day: number;
    moderate_activity_days_per_week: number;
    vigorous_activity_minutes_per_day: number;
    vigorous_activity_days_per_week: number;
    sedentary_hours_per_day: number;
    screen_time_hours_per_day: number;
    respostas_detalhadas?: Record<string, unknown>;
    observacoes?: string;
    profissional_responsavel?: string;
}

export interface PhysicalActivityEvaluationUpdate {
    data_avaliacao?: string;
    light_activity_minutes_per_day?: number;
    light_activity_days_per_week?: number;
    moderate_activity_minutes_per_day?: number;
    moderate_activity_days_per_week?: number;
    vigorous_activity_minutes_per_day?: number;
    vigorous_activity_days_per_week?: number;
    sedentary_hours_per_day?: number;
    screen_time_hours_per_day?: number;
    respostas_detalhadas?: Record<string, unknown>;
    observacoes?: string;
    profissional_responsavel?: string;
}

// Physical Activity Specific Types
export type SedentaryRiskLevel = 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
export type ActivityIntensity = 'Leve' | 'Moderada' | 'Vigorosa';

export interface ActivityData {
    intensity: ActivityIntensity;
    minutes_per_day: number;
    days_per_week: number;
    total_weekly_minutes: number;
}

// Dashboard Types
export interface PhysicalActivitySummary {
    total_patients_evaluated: number;
    who_compliance_percentage: number;
    average_sedentary_hours: number;
    total_evaluations: number;
    compliant_patients: number;
}

export interface PhysicalActivityCriticalPatient {
    patient_id: number;
    patient_name: string;
    cpf: string;
    age: number;
    bairro: string;
    sedentary_hours_per_day: number;
    evaluation_date: string;
    who_compliance: boolean;
    health_unit?: string;
}

export interface PhysicalActivityDistribution {
    light_activity: {
        label: string;
        average_weekly_minutes: number;
        color: string;
    };
    moderate_activity: {
        label: string;
        average_weekly_minutes: number;
        color: string;
    };
    vigorous_activity: {
        label: string;
        average_weekly_minutes: number;
        color: string;
    };
}

export interface SedentaryByAge {
    age_range: string;
    average_sedentary_hours: number;
    patient_count: number;
    evaluated_count: number;
}

export interface SedentaryTrend {
    diabetics: Array<{
        month: string;
        average_sedentary_hours: number;
    }>;
    hypertensives: Array<{
        month: string;
        average_sedentary_hours: number;
    }>;
}

export interface WHOCompliance {
    compliant: {
        count: number;
        percentage: number;
        label: string;
    };
    non_compliant: {
        count: number;
        percentage: number;
        label: string;
    };
    total_evaluations: number;
}

export interface PhysicalActivityPatientSummary {
    id: number;
    nome_completo: string;
    cpf: string;
    idade: number;
    bairro: string;
    health_unit?: string;
    data_cadastro: string;
    has_evaluation: boolean;
    last_evaluation_date?: string;
    sedentary_hours_per_day?: number;
    sedentary_risk_level?: SedentaryRiskLevel;
    who_compliance?: boolean;
    total_weekly_moderate_minutes?: number;
    total_weekly_vigorous_minutes?: number;
}

// Filter Types
export interface PhysicalActivityFilters {
    page?: number;
    per_page?: number;
    active_only?: boolean;
    bairro?: string;
    unidade_saude_id?: number;
    idade_min?: number;
    idade_max?: number;
    period_from?: string;
    period_to?: string;
    sedentary_risk_level?: SedentaryRiskLevel;
    who_compliance?: boolean;
}

// Chart Data Types
export interface PhysicalActivityDonutChartData {
    name: string;
    value: number;
    color: string;
}

export interface PhysicalActivityBarChartData {
    age_range: string;
    average_sedentary_hours: number;
    patient_count: number;
}

export interface PhysicalActivityLineChartData {
    month: string;
    diabetics: number;
    hypertensives: number;
}

// Form Types
export type PhysicalActivityPatientFormData = PhysicalActivityPatientCreate;

export type PhysicalActivityEvaluationFormData = Omit<PhysicalActivityEvaluationCreate, 'patient_id'>;

// API Response Types
export interface PhysicalActivityApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PhysicalActivityPaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Constants
export const SEDENTARY_RISK_LEVELS: SedentaryRiskLevel[] = [
    'Baixo',
    'Moderado', 
    'Alto',
    'Crítico'
];

export const ACTIVITY_INTENSITIES: ActivityIntensity[] = [
    'Leve',
    'Moderada',
    'Vigorosa'
];

export const AGE_RANGES = [
    { value: '60-70', label: '60-70 anos' },
    { value: '71-80', label: '71-80 anos' },
    { value: '81+', label: '81+ anos' }
] as const;

export const SEDENTARY_RISK_COLORS = {
    'Baixo': '#4CAF50',
    'Moderado': '#FF9800', 
    'Alto': '#FF5722',
    'Crítico': '#F44336'
} as const;

export const ACTIVITY_COLORS = {
    'Leve': '#E3F2FD',
    'Moderada': '#2196F3',
    'Vigorosa': '#0D47A1'
} as const;

// Validation Constants
export const ACTIVITY_LIMITS = {
    light: { max_minutes: 480, max_days: 7 },
    moderate: { max_minutes: 300, max_days: 7 },
    vigorous: { max_minutes: 180, max_days: 7 }
} as const;

export const SEDENTARY_LIMITS = {
    max_hours: 24,
    critical_threshold: 10
} as const;

// WHO Guidelines
export const WHO_GUIDELINES = {
    moderate_minutes_per_week: 150,
    vigorous_minutes_per_week: 75
} as const;