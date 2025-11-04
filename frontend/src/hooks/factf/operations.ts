import { type FACTFDataState, type FACTFDataFetchers, type FACTFAsyncOperationHandler } from './types';
import { type FACTFFilters } from '../../types/factf';
import { factfApiService } from '../../services/factfApi';

export const createAsyncOperationHandler = (
  setState: React.Dispatch<React.SetStateAction<FACTFDataState>>
): FACTFAsyncOperationHandler => {
  return async <T>(
    operation: () => Promise<T>,
    loadingKey: keyof FACTFDataState['loading'],
    errorKey: keyof FACTFDataState['errors']
  ): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [loadingKey]: true },
      errors: { ...prev.errors, [errorKey]: null }
    }));

    try {
      const result = await operation();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [errorKey]: errorMessage }
      }));
      return null;
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: false }
      }));
    }
  };
};

export const createDataFetchers = (
  setState: React.Dispatch<React.SetStateAction<FACTFDataState>>,
  handleAsyncOperation: FACTFAsyncOperationHandler
): FACTFDataFetchers => ({
  // Dashboard fetchers
  fetchSummary: async () => {
    const result = await handleAsyncOperation(
      () => factfApiService.getSummary(),
      'summary',
      'summary'
    );
    if (result) {
      setState(prev => ({ ...prev, summary: result }));
    }
  },

  fetchCriticalPatients: async (minScore = 30.0) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getCriticalPatients(minScore),
      'criticalPatients',
      'criticalPatients'
    );
    if (result) {
      setState(prev => ({ ...prev, criticalPatients: result }));
    }
  },

  fetchFatigueDistribution: async () => {
    const result = await handleAsyncOperation(
      () => factfApiService.getFatigueDistribution(),
      'fatigueDistribution',
      'fatigueDistribution'
    );
    if (result) {
      setState(prev => ({ ...prev, fatigueDistribution: result }));
    }
  },

  fetchMonthlyEvolution: async (monthsBack = 12) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getMonthlyEvolution(monthsBack),
      'monthlyEvolution',
      'monthlyEvolution'
    );
    if (result) {
      setState(prev => ({ ...prev, monthlyEvolution: result }));
    }
  },

  fetchDomainDistribution: async () => {
    const result = await handleAsyncOperation(
      () => factfApiService.getDomainDistribution(),
      'domainDistribution',
      'domainDistribution'
    );
    if (result) {
      setState(prev => ({ ...prev, domainDistribution: result }));
    }
  },

  fetchPatientDomainDistribution: async (patientId: number) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getPatientDomainDistribution(patientId),
      'domainDistribution',
      'domainDistribution'
    );
    if (result) {
      setState(prev => ({ ...prev, domainDistribution: result }));
    }
  },

  fetchAllPatients: async () => {
    const result = await handleAsyncOperation(
      () => factfApiService.getAllPatients(),
      'allPatients',
      'allPatients'
    );
    if (result) {
      setState(prev => ({ ...prev, allPatients: result }));
    }
  },

  // CRUD fetchers
  fetchPatients: async (filters: FACTFFilters = {}) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getPatients(filters),
      'patients',
      'patients'
    );
    if (result) {
      setState(prev => ({ ...prev, patients: result }));
    }
  },

  fetchPatient: async (patientId: number) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getPatient(patientId),
      'patientDetails',
      'patientDetails'
    );
    if (result) {
      setState(prev => ({ ...prev, selectedPatient: result }));
    }
  },

  fetchPatientEvaluations: async (patientId: number) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getPatientEvaluations(patientId),
      'evaluations',
      'evaluations'
    );
    if (result) {
      setState(prev => ({ ...prev, patientEvaluations: result }));
    }
  },

  fetchEvaluation: async (evaluationId: number) => {
    const result = await handleAsyncOperation(
      () => factfApiService.getEvaluation(evaluationId),
      'evaluationDetails',
      'evaluationDetails'
    );
    if (result) {
      setState(prev => ({ ...prev, selectedEvaluation: result }));
    }
  },

  // Refresh methods
  refetchAll: async (filters: FACTFFilters = {}) => {
    const fetchers = createDataFetchers(setState, handleAsyncOperation);
    
    await Promise.all([
      fetchers.fetchSummary(),
      fetchers.fetchCriticalPatients(),
      fetchers.fetchFatigueDistribution(),
      fetchers.fetchMonthlyEvolution(),
      fetchers.fetchDomainDistribution(),
      fetchers.fetchAllPatients(),
      fetchers.fetchPatients(filters),
    ]);
  },

  refetchDashboard: async () => {
    const fetchers = createDataFetchers(setState, handleAsyncOperation);
    
    await Promise.all([
      fetchers.fetchSummary(),
      fetchers.fetchCriticalPatients(),
      fetchers.fetchFatigueDistribution(),
      fetchers.fetchMonthlyEvolution(),
      fetchers.fetchDomainDistribution(),
      fetchers.fetchAllPatients(),
    ]);
  },
});