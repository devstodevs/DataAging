import { type IVCFDataState } from './types';

export const createInitialState = (): IVCFDataState => ({
  summary: null,
  domainDistribution: null,
  regionAverages: null,
  monthlyEvolution: null,
  criticalPatients: null,
  allPatients: null,
  fragilePercentage: null,
  curitibaRegions: [],
  loading: {
    summary: false,
    domainDistribution: false,
    regionAverages: false,
    monthlyEvolution: false,
    criticalPatients: false,
    allPatients: false,
    fragilePercentage: false,
    curitibaRegions: false,
  },
  errors: {
    summary: null,
    domainDistribution: null,
    regionAverages: null,
    monthlyEvolution: null,
    criticalPatients: null,
    allPatients: null,
    fragilePercentage: null,
    curitibaRegions: null,
  },
});

export const createStateHelpers = (state: IVCFDataState) => ({
  isAnyLoading: Object.values(state.loading).some(loading => loading),
  hasAnyError: Object.values(state.errors).some(error => error !== null),
});