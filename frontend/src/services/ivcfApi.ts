import {
  type IVCFSummary,
  type DomainDistributionResponse,
  type RegionAverageResponse,
  type MonthlyEvolutionResponse,
  type CriticalPatientsResponse,
  type FragileElderlyPercentageResponse,
  type IVCFFilters,
} from '../types/ivcf';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class IVCFApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private buildQueryParams(filters: IVCFFilters): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getSummary(): Promise<IVCFSummary> {
    const response = await fetch(`${API_BASE_URL}/ivcf-dashboard/ivcf-summary`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<IVCFSummary>(response);
  }

  async getDomainDistribution(filters: IVCFFilters = {}): Promise<DomainDistributionResponse> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/ivcf-dashboard/ivcf-by-domain${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<DomainDistributionResponse>(response);
  }

  async getRegionAverages(filters: Pick<IVCFFilters, 'period_from' | 'period_to'> = {}): Promise<RegionAverageResponse> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/ivcf-dashboard/ivcf-by-region${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<RegionAverageResponse>(response);
  }

  async getMonthlyEvolution(monthsBack: number = 6, fromLastEvaluation: boolean = false): Promise<MonthlyEvolutionResponse> {
    const params = new URLSearchParams({
      months_back: monthsBack.toString(),
      from_last_evaluation: fromLastEvaluation.toString()
    });

    const response = await fetch(`${API_BASE_URL}/ivcf-dashboard/ivcf-evolution?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<MonthlyEvolutionResponse>(response);
  }

  async getCriticalPatients(minimumScore: number = 20): Promise<CriticalPatientsResponse> {
    const response = await fetch(`${API_BASE_URL}/ivcf-dashboard/critical-patients?pontuacao_minima=${minimumScore}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CriticalPatientsResponse>(response);
  }

  // Todos os pacientes
  async getAllPatients(): Promise<CriticalPatientsResponse> {
    const response = await fetch(`${API_BASE_URL}/ivcf-dashboard/all-patients`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CriticalPatientsResponse>(response);
  }

  async getFragilePercentage(filters: IVCFFilters = {}): Promise<FragileElderlyPercentageResponse> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/ivcf-dashboard/fragile-percentage${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FragileElderlyPercentageResponse>(response);
  }

  async getCuritibaRegions(): Promise<{ regions: string[] }> {
    const response = await fetch(`${API_BASE_URL}/ivcf-dashboard/curitiba-regions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ regions: string[] }>(response);
  }

  async validateFilters(filters: {
    region?: string;
    age_range?: string;
    classification?: string;
  }): Promise<{ valid: boolean; errors: string[] }> {
    const queryParams = this.buildQueryParams(filters as Record<string, string | number | boolean | undefined>);
    const url = `${API_BASE_URL}/ivcf-dashboard/validate-filters${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ valid: boolean; errors: string[] }>(response);
  }
}

export const ivcfApiService = new IVCFApiService();