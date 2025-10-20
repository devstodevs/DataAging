import {
  type IVCFSummary,
  type DomainDistributionResponse,
  type RegionAverageResponse,
  type MonthlyEvolutionResponse,
  type CriticalPatientsResponse,
  type FragileElderlyPercentageResponse,
  type IVCFFilters,
  type RadarChartData,
  type LineChartData,
} from '../../types/ivcf';

export interface IVCFDataState {
  summary: IVCFSummary | null;
  domainDistribution: DomainDistributionResponse | null;
  regionAverages: RegionAverageResponse | null;
  monthlyEvolution: MonthlyEvolutionResponse | null;
  criticalPatients: CriticalPatientsResponse | null;
  allPatients: CriticalPatientsResponse | null;
  fragilePercentage: FragileElderlyPercentageResponse | null;
  curitibaRegions: string[];
  
  loading: {
    summary: boolean;
    domainDistribution: boolean;
    regionAverages: boolean;
    monthlyEvolution: boolean;
    criticalPatients: boolean;
    allPatients: boolean;
    fragilePercentage: boolean;
    curitibaRegions: boolean;
  };
  
  errors: {
    summary: string | null;
    domainDistribution: string | null;
    regionAverages: string | null;
    monthlyEvolution: string | null;
    criticalPatients: string | null;
    allPatients: string | null;
    fragilePercentage: string | null;
    curitibaRegions: string | null;
  };
}

export interface IVCFDataActions {
  refetchSummary: () => Promise<void>;
  refetchDomainDistribution: (filters?: IVCFFilters) => Promise<void>;
  refetchRegionAverages: (filters?: Pick<IVCFFilters, 'period_from' | 'period_to'>) => Promise<void>;
  refetchMonthlyEvolution: (monthsBack?: number) => Promise<void>;
  refetchCriticalPatients: (minimumScore?: number) => Promise<void>;
  refetchAllPatients: () => Promise<void>;
  refetchFragilePercentage: (filters?: IVCFFilters) => Promise<void>;
  refetchAll: (filters?: IVCFFilters) => Promise<void>;
}

export interface IVCFDataHelpers {
  getRadarChartData: () => RadarChartData[];
  getLineChartData: () => LineChartData[];
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

export interface UseIVCFDataReturn extends IVCFDataState, IVCFDataActions, IVCFDataHelpers {}

export type LoadingKey = keyof IVCFDataState['loading'];
export type AsyncOperation<T> = () => Promise<T>;
export type OnSuccessCallback<T> = (data: T) => void;