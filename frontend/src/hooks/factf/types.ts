import {
  type FACTFSummary,
  type FACTFCriticalPatientsResponse,
  type FACTFFatigueDistributionResponse,
  type FACTFMonthlyEvolutionResponse,
  type FACTFDomainDistributionResponse,
  type FACTFAllPatientsResponse,
  type FACTFPatient,
  type FACTFPatientList,
  type FACTFEvaluation,
  type FACTFFilters,
  type FACTFRadarChartData,
  type FACTFLineChartData,
  type FACTFBarChartData,
} from '../../types/factf';

export interface FACTFDataState {
  // Dashboard data
  summary: FACTFSummary | null;
  criticalPatients: FACTFCriticalPatientsResponse | null;
  fatigueDistribution: FACTFFatigueDistributionResponse | null;
  monthlyEvolution: FACTFMonthlyEvolutionResponse | null;
  domainDistribution: FACTFDomainDistributionResponse | null;
  allPatients: FACTFAllPatientsResponse | null;

  // CRUD data
  patients: FACTFPatientList[];
  selectedPatient: FACTFPatient | null;
  patientEvaluations: FACTFEvaluation[];
  selectedEvaluation: FACTFEvaluation | null;

  // Loading states
  loading: {
    summary: boolean;
    criticalPatients: boolean;
    fatigueDistribution: boolean;
    monthlyEvolution: boolean;
    domainDistribution: boolean;
    allPatients: boolean;
    patients: boolean;
    patientDetails: boolean;
    evaluations: boolean;
    evaluationDetails: boolean;
  };

  // Error states
  errors: {
    summary: string | null;
    criticalPatients: string | null;
    fatigueDistribution: string | null;
    monthlyEvolution: string | null;
    domainDistribution: string | null;
    allPatients: string | null;
    patients: string | null;
    patientDetails: string | null;
    evaluations: string | null;
    evaluationDetails: string | null;
  };

  // Filters
  filters: FACTFFilters;
}

export interface FACTFDataFetchers {
  // Dashboard fetchers
  fetchSummary: () => Promise<void>;
  fetchCriticalPatients: (minScore?: number) => Promise<void>;
  fetchFatigueDistribution: () => Promise<void>;
  fetchMonthlyEvolution: (monthsBack?: number) => Promise<void>;
  fetchDomainDistribution: () => Promise<void>;
  fetchPatientDomainDistribution: (patientId: number) => Promise<void>;
  fetchAllPatients: () => Promise<void>;

  // CRUD fetchers
  fetchPatients: (filters?: FACTFFilters) => Promise<void>;
  fetchPatient: (patientId: number) => Promise<void>;
  fetchPatientEvaluations: (patientId: number) => Promise<void>;
  fetchEvaluation: (evaluationId: number) => Promise<void>;

  // Refresh methods
  refetchAll: (filters?: FACTFFilters) => Promise<void>;
  refetchDashboard: () => Promise<void>;
}

// Processed data types for UI display
export interface ProcessedFACTFSummary {
  totalPatients: number;
  severeFatiguePercentage: string;
  criticalPatientsCount: number;
  averageTotalScore: string;
  monthlyGrowth: string;
  domainAverages: {
    physical: number;
    social: number;
    emotional: number;
    functional: number;
    fatigue: number;
  };
}

export interface ProcessedFACTFCriticalPatient {
  id: number;
  name: string;
  age: number;
  neighborhood: string;
  totalScore: string;
  fatigueScore: string;
  classification: string;
  evaluationDate: string;
  status: string;
}

export interface ProcessedFACTFFatigueDistribution {
  condition: string;
  'Sem Fadiga': number;
  'Fadiga Leve': number;
  'Fadiga Grave': number;
}

export interface ProcessedFACTFMonthlyEvolution {
  month: string;
  'Escore Total': number;
  'Subescala Fadiga': number;
  evaluationsCount: number;
}

export interface ProcessedFACTFDomainDistribution {
  domain: string;
  averageScore: number | undefined;
  maxScore: number;
  percentage: string;
}

export interface FACTFDataProcessors {
  // Data transformation methods
  getProcessedSummary: () => ProcessedFACTFSummary | null;
  getProcessedCriticalPatients: () => ProcessedFACTFCriticalPatient[];
  getProcessedFatigueDistribution: () => ProcessedFACTFFatigueDistribution[];
  getProcessedMonthlyEvolution: () => ProcessedFACTFMonthlyEvolution[];
  getProcessedDomainDistribution: () => ProcessedFACTFDomainDistribution[];

  // Chart data processors
  getRadarChartData: () => FACTFRadarChartData[];
  getLineChartData: () => FACTFLineChartData[];
  getBarChartData: () => FACTFBarChartData[];
}

export interface FACTFStateHelpers {
  // State management helpers
  setFilters: (filters: FACTFFilters) => void;
  clearErrors: () => void;
  clearSelectedPatient: () => void;
  clearSelectedEvaluation: () => void;

  // Computed properties
  isLoading: boolean;
  hasErrors: boolean;
  totalPatients: number;
  criticalPatientsCount: number;
}

export interface UseFACTFDataReturn extends 
  FACTFDataState,
  FACTFDataFetchers,
  FACTFDataProcessors,
  FACTFStateHelpers {}

export interface FACTFAsyncOperationHandler {
  <T>(
    operation: () => Promise<T>,
    loadingKey: keyof FACTFDataState['loading'],
    errorKey: keyof FACTFDataState['errors']
  ): Promise<T | null>;
}