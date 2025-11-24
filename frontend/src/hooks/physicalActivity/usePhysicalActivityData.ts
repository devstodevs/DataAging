import { useState, useEffect, useCallback } from 'react';
import { physicalActivityApiService } from '../../services/physicalActivityApi';
import {
  type PhysicalActivitySummary,
  type PhysicalActivityCriticalPatient,
  type PhysicalActivityDistribution,
  type SedentaryByAge,
  type SedentaryTrend,
  type WHOCompliance,
  type PhysicalActivityPatientSummary,
} from '../../types/physicalActivity';

interface PhysicalActivityDashboardData {
  summary: PhysicalActivitySummary | null;
  criticalPatients: PhysicalActivityCriticalPatient[];
  activityDistribution: PhysicalActivityDistribution | null;
  sedentaryByAge: SedentaryByAge[];
  sedentaryTrend: SedentaryTrend | null;
  whoCompliance: WHOCompliance | null;
  allPatients: PhysicalActivityPatientSummary[];
}

interface PhysicalActivityDataState {
  data: PhysicalActivityDashboardData;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UsePhysicalActivityDataReturn extends PhysicalActivityDataState {
  refreshData: () => Promise<void>;
  refreshSummary: () => Promise<void>;
  refreshCriticalPatients: () => Promise<void>;
  refreshActivityDistribution: () => Promise<void>;
  refreshSedentaryByAge: () => Promise<void>;
  refreshSedentaryTrend: () => Promise<void>;
  refreshWHOCompliance: () => Promise<void>;
  refreshAllPatients: () => Promise<void>;
}

const initialData: PhysicalActivityDashboardData = {
  summary: null,
  criticalPatients: [],
  activityDistribution: null,
  sedentaryByAge: [],
  sedentaryTrend: null,
  whoCompliance: null,
  allPatients: [],
};

const initialState: PhysicalActivityDataState = {
  data: initialData,
  loading: false,
  error: null,
  lastUpdated: null,
};

export function usePhysicalActivityData(): UsePhysicalActivityDataReturn {
  const [state, setState] = useState<PhysicalActivityDataState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateData = useCallback((updates: Partial<PhysicalActivityDashboardData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      lastUpdated: new Date(),
      error: null,
    }));
  }, []);

  const refreshSummary = useCallback(async () => {
    try {
      setError(null);
      const summary = await physicalActivityApiService.getSummary();
      updateData({ summary });
    } catch (error) {
      console.error('Error fetching physical activity summary:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar resumo');
    }
  }, [setError, updateData]);

  const refreshCriticalPatients = useCallback(async () => {
    try {
      setError(null);
      const criticalPatients = await physicalActivityApiService.getCriticalPatients();
      updateData({ criticalPatients });
    } catch (error) {
      console.error('Error fetching critical patients:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar pacientes críticos');
    }
  }, [setError, updateData]);

  const refreshActivityDistribution = useCallback(async () => {
    try {
      setError(null);
      const activityDistribution = await physicalActivityApiService.getActivityDistribution();
      updateData({ activityDistribution });
    } catch (error) {
      console.error('Error fetching activity distribution:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar distribuição de atividades');
    }
  }, [setError, updateData]);

  const refreshSedentaryByAge = useCallback(async () => {
    try {
      setError(null);
      const sedentaryByAge = await physicalActivityApiService.getSedentaryByAge();
      updateData({ sedentaryByAge });
    } catch (error) {
      console.error('Error fetching sedentary by age:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados sedentários por idade');
    }
  }, [setError, updateData]);

  const refreshSedentaryTrend = useCallback(async () => {
    try {
      setError(null);
      const sedentaryTrend = await physicalActivityApiService.getSedentaryTrend();
      updateData({ sedentaryTrend });
    } catch (error) {
      console.error('Error fetching sedentary trend:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar tendência sedentária');
    }
  }, [setError, updateData]);

  const refreshWHOCompliance = useCallback(async () => {
    try {
      setError(null);
      const whoCompliance = await physicalActivityApiService.getWHOCompliance();
      updateData({ whoCompliance });
    } catch (error) {
      console.error('Error fetching WHO compliance:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar conformidade OMS');
    }
  }, [setError, updateData]);

  const refreshAllPatients = useCallback(async () => {
    try {
      setError(null);
      const allPatients = await physicalActivityApiService.getAllPatients();
      updateData({ allPatients });
    } catch (error) {
      console.error('Error fetching all patients:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar todos os pacientes');
    }
  }, [setError, updateData]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        summary,
        criticalPatients,
        activityDistribution,
        sedentaryByAge,
        sedentaryTrend,
        whoCompliance,
        allPatients,
      ] = await Promise.all([
        physicalActivityApiService.getSummary(),
        physicalActivityApiService.getCriticalPatients(),
        physicalActivityApiService.getActivityDistribution(),
        physicalActivityApiService.getSedentaryByAge(),
        physicalActivityApiService.getSedentaryTrend(),
        physicalActivityApiService.getWHOCompliance(),
        physicalActivityApiService.getAllPatients(),
      ]);

      setState(prev => ({
        ...prev,
        data: {
          summary,
          criticalPatients,
          activityDistribution,
          sedentaryByAge,
          sedentaryTrend,
          whoCompliance,
          allPatients,
        },
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error('Error refreshing physical activity data:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Load data on mount only
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  return {
    ...state,
    refreshData,
    refreshSummary,
    refreshCriticalPatients,
    refreshActivityDistribution,
    refreshSedentaryByAge,
    refreshSedentaryTrend,
    refreshWHOCompliance,
    refreshAllPatients,
  };
}