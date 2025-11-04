import {
  type FACTFSummary,
  type FACTFCriticalPatientsResponse,
  type FACTFFatigueDistributionResponse,
  type FACTFMonthlyEvolutionResponse,
  type FACTFDomainDistributionResponse,
  type FACTFAllPatientsResponse,
  type FACTFPatient,
  type FACTFPatientCreate,
  type FACTFPatientUpdate,
  type FACTFPatientList,
  type FACTFEvaluation,
  type FACTFEvaluationCreate,
  type FACTFEvaluationUpdate,
  type FACTFFilters,
} from '../types/factf';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class FACTFApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private buildQueryParams(filters: Record<string, any>): string {
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

  // Dashboard Endpoints
  async getSummary(): Promise<FACTFSummary> {
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/summary`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFSummary>(response);
  }

  async getCriticalPatients(minScore: number = 30.0): Promise<FACTFCriticalPatientsResponse> {
    const params = new URLSearchParams({ min_score: minScore.toString() });
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/critical-patients?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFCriticalPatientsResponse>(response);
  }

  async getFatigueDistribution(): Promise<FACTFFatigueDistributionResponse> {
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/fatigue-distribution`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFFatigueDistributionResponse>(response);
  }

  async getMonthlyEvolution(monthsBack: number = 12): Promise<FACTFMonthlyEvolutionResponse> {
    const params = new URLSearchParams({ months_back: monthsBack.toString() });
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/monthly-evolution?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFMonthlyEvolutionResponse>(response);
  }

  async getDomainDistribution(): Promise<FACTFDomainDistributionResponse> {
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/domain-distribution`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFDomainDistributionResponse>(response);
  }

  async getPatientDomainDistribution(patientId: number): Promise<FACTFDomainDistributionResponse> {
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/patient-domain-distribution/${patientId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFDomainDistributionResponse>(response);
  }

  async getAllPatients(): Promise<FACTFAllPatientsResponse> {
    const response = await fetch(`${API_BASE_URL}/factf-dashboard/all-patients`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFAllPatientsResponse>(response);
  }

  // Patient CRUD Endpoints
  async createPatient(patientData: FACTFPatientCreate): Promise<FACTFPatient> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    return this.handleResponse<FACTFPatient>(response);
  }

  async getPatients(filters: {
    skip?: number;
    limit?: number;
    active_only?: boolean;
    bairro?: string;
    unidade_saude_id?: number;
    idade_min?: number;
    idade_max?: number;
    classificacao_fadiga?: string;
  } = {}): Promise<FACTFPatientList[]> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/factf-patients/${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFPatientList[]>(response);
  }

  async getPatient(patientId: number): Promise<FACTFPatient> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFPatient>(response);
  }

  async updatePatient(patientId: number, patientData: FACTFPatientUpdate): Promise<FACTFPatient> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    return this.handleResponse<FACTFPatient>(response);
  }

  async deletePatient(patientId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async getPatientEvaluations(patientId: number): Promise<FACTFEvaluation[]> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}/evaluations`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFEvaluation[]>(response);
  }

  // Evaluation CRUD Endpoints
  async createEvaluation(patientId: number, evaluationData: FACTFEvaluationCreate): Promise<FACTFEvaluation> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}/evaluations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    return this.handleResponse<FACTFEvaluation>(response);
  }

  async getEvaluation(evaluationId: number): Promise<FACTFEvaluation> {
    const response = await fetch(`${API_BASE_URL}/factf-evaluations/${evaluationId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFEvaluation>(response);
  }

  async updateEvaluation(evaluationId: number, evaluationData: FACTFEvaluationUpdate): Promise<FACTFEvaluation> {
    const response = await fetch(`${API_BASE_URL}/factf-evaluations/${evaluationId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    return this.handleResponse<FACTFEvaluation>(response);
  }

  async deleteEvaluation(evaluationId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/factf-evaluations/${evaluationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async getLatestPatientEvaluation(patientId: number): Promise<FACTFEvaluation> {
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}/evaluations/latest`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFEvaluation>(response);
  }

  async getPatientEvaluationsPaginated(
    patientId: number, 
    skip: number = 0, 
    limit: number = 100
  ): Promise<FACTFEvaluation[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE_URL}/factf-patients/${patientId}/evaluations?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<FACTFEvaluation[]>(response);
  }

  // Utility Methods
  async validateFilters(filters: FACTFFilters): Promise<{ valid: boolean; errors: string[] }> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/factf-dashboard/validate-filters${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ valid: boolean; errors: string[] }>(response);
  }

  // Helper method to calculate fatigue classification
  static calculateFatigueClassification(fatigueScore: number): string {
    if (fatigueScore >= 44) return 'Sem Fadiga';
    if (fatigueScore >= 30) return 'Fadiga Leve';
    return 'Fadiga Grave';
  }

  // Helper method to calculate total FACT-F score
  static calculateTotalScore(domains: {
    bem_estar_fisico: number;
    bem_estar_social: number;
    bem_estar_emocional: number;
    bem_estar_funcional: number;
    subescala_fadiga: number;
  }): number {
    return domains.bem_estar_fisico + 
           domains.bem_estar_social + 
           domains.bem_estar_emocional + 
           domains.bem_estar_funcional + 
           domains.subescala_fadiga;
  }
}

export const factfApiService = new FACTFApiService();