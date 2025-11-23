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

export interface FACTFDataProcessors {
  // Data transformation methods
  getProcessedSummary: () => FACTFSummary | null;
  getProcessedCriticalPatients: () => FACTFCriticalPatientsResponse | null;
  getProcessedFatigueDistribution: () => FACTFFatigueDistributionResponse | null;
  getProcessedMonthlyEvolution: () => FACTFMonthlyEvolutionResponse | null;
  getProcessedDomainDistribution: () => FACTFDomainDistributionResponse | null;

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