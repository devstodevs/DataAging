import { ivcfApiService } from '../../services/ivcfApi';
import { type IVCFFilters } from '../../types/ivcf';
import { type IVCFDataState, type LoadingKey, type AsyncOperation, type OnSuccessCallback } from './types';

export const createAsyncOperationHandler = (
  setState: React.Dispatch<React.SetStateAction<IVCFDataState>>
) => {
  return async <T>(
    key: LoadingKey,
    operation: AsyncOperation<T>,
    onSuccess: OnSuccessCallback<T>
  ) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: true },
      errors: { ...prev.errors, [key]: null },
    }));

    try {
      const data = await operation();
      onSuccess(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [key]: errorMessage },
      }));
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [key]: false },
      }));
    }
  };
};

export const createDataFetchers = (
  setState: React.Dispatch<React.SetStateAction<IVCFDataState>>,
  handleAsyncOperation: ReturnType<typeof createAsyncOperationHandler>
) => {
  const refetchSummary = async () => {
    await handleAsyncOperation(
      'summary',
      () => ivcfApiService.getSummary(),
      (data) => setState(prev => ({ ...prev, summary: data }))
    );
  };

  const refetchDomainDistribution = async (filters: IVCFFilters = {}) => {
    await handleAsyncOperation(
      'domainDistribution',
      () => ivcfApiService.getDomainDistribution(filters),
      (data) => setState(prev => ({ ...prev, domainDistribution: data }))
    );
  };

  const refetchRegionAverages = async (filters: Pick<IVCFFilters, 'period_from' | 'period_to'> = {}) => {
    await handleAsyncOperation(
      'regionAverages',
      () => ivcfApiService.getRegionAverages(filters),
      (data) => setState(prev => ({ ...prev, regionAverages: data }))
    );
  };

  const refetchMonthlyEvolution = async (monthsBack: number = 6) => {
    await handleAsyncOperation(
      'monthlyEvolution',
      () => ivcfApiService.getMonthlyEvolution(monthsBack, true), // Always use from_last_evaluation=true
      (data) => setState(prev => ({ ...prev, monthlyEvolution: data }))
    );
  };

  const refetchCriticalPatients = async (minimumScore: number = 20) => {
    await handleAsyncOperation(
      'criticalPatients',
      () => ivcfApiService.getCriticalPatients(minimumScore),
      (data) => setState(prev => ({ ...prev, criticalPatients: data }))
    );
  };

  const refetchAllPatients = async () => {
    await handleAsyncOperation(
      'allPatients',
      () => ivcfApiService.getAllPatients(),
      (data) => setState(prev => ({ ...prev, allPatients: data }))
    );
  };

  const refetchFragilePercentage = async (filters: IVCFFilters = {}) => {
    await handleAsyncOperation(
      'fragilePercentage',
      () => ivcfApiService.getFragilePercentage(filters),
      (data) => setState(prev => ({ ...prev, fragilePercentage: data }))
    );
  };

  const refetchCuritibaRegions = async () => {
    await handleAsyncOperation(
      'curitibaRegions',
      () => ivcfApiService.getCuritibaRegions(),
      (data) => setState(prev => ({ ...prev, curitibaRegions: data.regions }))
    );
  };

  const refetchAll = async (filters: IVCFFilters = {}) => {
    await Promise.all([
      refetchSummary(),
      refetchDomainDistribution(filters),
      refetchRegionAverages(filters),
      refetchMonthlyEvolution(),
      refetchCriticalPatients(),
      refetchAllPatients(),
      refetchFragilePercentage(filters),
      refetchCuritibaRegions(),
    ]);
  };

  return {
    refetchSummary,
    refetchDomainDistribution,
    refetchRegionAverages,
    refetchMonthlyEvolution,
    refetchCriticalPatients,
    refetchAllPatients,
    refetchFragilePercentage,
    refetchCuritibaRegions,
    refetchAll,
  };
};