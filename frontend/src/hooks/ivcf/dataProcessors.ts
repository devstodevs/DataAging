import { useCallback } from 'react';
import { type RadarChartData, type LineChartData, type IVCFFilters, type IVCFPatient } from '../../types/ivcf';
import { type IVCFDataState } from './types';

// Tipo interno para filtros que inclui "all"
interface InternalFilters extends Omit<IVCFFilters, 'age_range' | 'region' | 'classification'> {
  age_range?: '60-70' | '71-80' | '81+' | 'all';
  region?: string | 'all';
  classification?: 'Robusto' | 'Em Risco' | 'Frágil' | 'all';
}

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

  const getFilteredPatients = useCallback((filters: InternalFilters): IVCFPatient[] => {
    if (!state.allPatients?.critical_patients) return [];
    
    return state.allPatients.critical_patients.filter(patient => {
      // Filtro por período
      if (filters.period_from || filters.period_to) {
        const patientDate = new Date(patient.data_ultima_avaliacao);
        if (filters.period_from && patientDate < new Date(filters.period_from)) {
          return false;
        }
        if (filters.period_to && patientDate > new Date(filters.period_to)) {
          return false;
        }
      }
      
      // Filtro por faixa etária
      if (filters.age_range && filters.age_range !== 'all') {
        const age = patient.idade;
        switch (filters.age_range) {
          case '60-70':
            if (age < 60 || age > 70) return false;
            break;
          case '71-80':
            if (age < 71 || age > 80) return false;
            break;
          case '81+':
            if (age < 81) return false;
            break;
        }
      }
      
      // Filtro por região/bairro
      if (filters.region && filters.region !== 'all') {
        if (patient.bairro !== filters.region) return false;
      }
      
      // Filtro por classificação
      if (filters.classification && filters.classification !== 'all') {
        const classificationMap: Record<string, string> = {
          'fragile': 'Frágil',
          'risk': 'Em Risco',
          'robust': 'Robusto',
        };
        const targetClassification = classificationMap[filters.classification] || filters.classification;
        if (patient.classificacao !== targetClassification) return false;
      }
      
      return true;
    });
  }, [state.allPatients]);

  return {
    getRadarChartData,
    getLineChartData,
    getFilteredPatients,
  };
};