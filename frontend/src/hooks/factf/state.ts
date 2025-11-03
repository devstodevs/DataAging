import { type FACTFDataState, type FACTFStateHelpers } from './types';
import { type FACTFFilters } from '../../types/factf';

export const createInitialState = (): FACTFDataState => ({
  // Dashboard data
  summary: null,
  criticalPatients: null,
  fatigueDistribution: null,
  monthlyEvolution: null,
  domainDistribution: null,
  allPatients: null,

  // CRUD data
  patients: [],
  selectedPatient: null,
  patientEvaluations: [],
  selectedEvaluation: null,

  // Loading states
  loading: {
    summary: false,
    criticalPatients: false,
    fatigueDistribution: false,
    monthlyEvolution: false,
    domainDistribution: false,
    allPatients: false,
    patients: false,
    patientDetails: false,
    evaluations: false,
    evaluationDetails: false,
  },

  // Error states
  errors: {
    summary: null,
    criticalPatients: null,
    fatigueDistribution: null,
    monthlyEvolution: null,
    domainDistribution: null,
    allPatients: null,
    patients: null,
    patientDetails: null,
    evaluations: null,
    evaluationDetails: null,
  },

  // Filters
  filters: {},
});

export const createStateHelpers = (
  state: FACTFDataState,
  setState: React.Dispatch<React.SetStateAction<FACTFDataState>>
): FACTFStateHelpers => ({
  setFilters: (filters: FACTFFilters) => {
    setState(prev => ({ ...prev, filters }));
  },

  clearErrors: () => {
    setState(prev => ({
      ...prev,
      errors: {
        summary: null,
        criticalPatients: null,
        fatigueDistribution: null,
        monthlyEvolution: null,
        domainDistribution: null,
        allPatients: null,
        patients: null,
        patientDetails: null,
        evaluations: null,
        evaluationDetails: null,
      }
    }));
  },

  clearSelectedPatient: () => {
    setState(prev => ({ ...prev, selectedPatient: null }));
  },

  clearSelectedEvaluation: () => {
    setState(prev => ({ ...prev, selectedEvaluation: null }));
  },

  // Computed properties
  get isLoading() {
    return Object.values(state.loading).some(loading => loading);
  },

  get hasErrors() {
    return Object.values(state.errors).some(error => error !== null);
  },

  get totalPatients() {
    return state.summary?.total_patients || 0;
  },

  get criticalPatientsCount() {
    return state.summary?.critical_patients_count || 0;
  },
});