import { type FACTFDataState, type FACTFDataProcessors } from './types';
import { type FACTFRadarChartData, type FACTFLineChartData, type FACTFBarChartData } from '../../types/factf';

export const createDataProcessors = (state: FACTFDataState): FACTFDataProcessors => ({
  getProcessedSummary: () => {
    if (!state.summary) return null;

    return {
      totalPatients: state.summary.total_patients,
      severeFatiguePercentage: `${state.summary.severe_fatigue_percentage}%`,
      criticalPatientsCount: state.summary.critical_patients_count,
      averageTotalScore: state.summary.average_total_score.toFixed(1),
      monthlyGrowth: `${state.summary.monthly_growth_percentage > 0 ? '+' : ''}${state.summary.monthly_growth_percentage}%`,
      domainAverages: state.summary.domain_averages,
    };
  },

  getProcessedCriticalPatients: () => {
    if (!state.criticalPatients) return [];

    return state.criticalPatients.critical_patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      neighborhood: patient.neighborhood,
      totalScore: patient.total_score.toFixed(1),
      fatigueScore: patient.fatigue_score.toFixed(1),
      classification: patient.classification,
      evaluationDate: new Date(patient.evaluation_date).toLocaleDateString('pt-BR'),
      status: patient.classification === 'Fadiga Grave' ? 'critical' : 'warning',
    }));
  },

  getProcessedFatigueDistribution: () => {
    if (!state.fatigueDistribution) return [];

    return state.fatigueDistribution.distribution.map(item => ({
      condition: item.condition,
      'Sem Fadiga': item.no_fatigue,
      'Fadiga Leve': item.mild_fatigue,
      'Fadiga Grave': item.severe_fatigue,
    }));
  },

  getProcessedMonthlyEvolution: () => {
    if (!state.monthlyEvolution) return [];

    return state.monthlyEvolution.evolution.map(item => ({
      month: item.month,
      'Escore Total': item.average_total_score,
      'Subescala Fadiga': item.average_fatigue_score,
      evaluationsCount: item.evaluations_count,
    }));
  },

  getProcessedDomainDistribution: () => {
    if (!state.domainDistribution) return [];

    return state.domainDistribution.domains.map(domain => ({
      domain: domain.domain,
      averageScore: domain.average_score,
      maxScore: domain.max_score,
      percentage: ((domain.average_score / domain.max_score) * 100).toFixed(1),
    }));
  },

  getRadarChartData: (): FACTFRadarChartData[] => {
    if (!state.domainDistribution) return [];

    return state.domainDistribution.domains.map(domain => ({
      domain: domain.domain,
      paciente: domain.patient_score || domain.average_score || 0,
      mediaRegional: domain.regional_average || domain.average_score || 0,
      fullMark: domain.max_score,
    }));
  },

  getLineChartData: (): FACTFLineChartData[] => {
    if (!state.monthlyEvolution) return [];

    return state.monthlyEvolution.evolution.map(item => ({
      month: item.month,
      escoreTotal: item.average_total_score,
      subscalaFadiga: item.average_fatigue_score,
    }));
  },

  getBarChartData: (): FACTFBarChartData[] => {
    if (!state.fatigueDistribution) return [];

    return state.fatigueDistribution.distribution.map(item => ({
      comorbidade: item.condition,
      semFadiga: item.no_fatigue,
      fadigaLeve: item.mild_fatigue,
      fadigaGrave: item.severe_fatigue,
    }));
  },
});