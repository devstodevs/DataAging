import { useCallback } from 'react';
import { type RadarChartData, type LineChartData } from '../../types/ivcf';
import { type IVCFDataState } from './types';

export const createDataProcessors = (state: IVCFDataState) => {
  const getRadarChartData = useCallback((): RadarChartData[] => {
    if (!state.domainDistribution?.domains) return [];
    
    return state.domainDistribution.domains.map(domain => ({
      domain: domain.domain,
      score: domain.average_score,
      fullMark: 8, // Escala de 2 a 8 para médias dos domínios
    }));
  }, [state.domainDistribution]);

  const getLineChartData = useCallback((): LineChartData[] => {
    if (!state.monthlyEvolution?.evolution) return [];
    
    return state.monthlyEvolution.evolution.map(month => ({
      month: month.month,
      Robusto: month.robust,
      Risco: month.risk,
      Frágil: month.fragile,
    }));
  }, [state.monthlyEvolution]);

  return {
    getRadarChartData,
    getLineChartData,
  };
};