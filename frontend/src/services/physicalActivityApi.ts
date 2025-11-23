import {
  type PhysicalActivitySummary,
  type PhysicalActivityCriticalPatient,
  type PhysicalActivityDistribution,
  type SedentaryByAge,
  type SedentaryTrend,
  type WHOCompliance,
  type PhysicalActivityPatientSummary,
  type PhysicalActivityPatient,
  type PhysicalActivityPatientCreate,
  type PhysicalActivityPatientUpdate,
  type PhysicalActivityPatientList,
  type PhysicalActivityEvaluation,
  type PhysicalActivityEvaluationCreate,
  type PhysicalActivityEvaluationUpdate,
  type PhysicalActivityFilters,
} from '../types/physicalActivity';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class PhysicalActivityApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private buildQueryParams(filters: Record<string, string | number | boolean | undefined>): string {
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
  async getSummary(): Promise<PhysicalActivitySummary> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/summary`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivitySummary>(response);
  }

  async getCriticalPatients(): Promise<PhysicalActivityCriticalPatient[]> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/critical-patients`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityCriticalPatient[]>(response);
  }

  async getActivityDistribution(): Promise<PhysicalActivityDistribution> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/activity-distribution`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityDistribution>(response);
  }

  async getSedentaryByAge(): Promise<SedentaryByAge[]> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/sedentary-by-age`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<SedentaryByAge[]>(response);
  }

  async getSedentaryTrend(months: number = 12): Promise<SedentaryTrend> {
    const params = new URLSearchParams({ months: months.toString() });
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/sedentary-trend?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<SedentaryTrend>(response);
  }

  async getWHOCompliance(): Promise<WHOCompliance> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/who-compliance`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<WHOCompliance>(response);
  }

  async getAllPatients(): Promise<PhysicalActivityPatientSummary[]> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-dashboard/all-patients`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityPatientSummary[]>(response);
  }

  // Patient CRUD Endpoints
  async createPatient(patientData: PhysicalActivityPatientCreate): Promise<PhysicalActivityPatient> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    return this.handleResponse<PhysicalActivityPatient>(response);
  }

  async getPatients(filters: PhysicalActivityFilters = {}): Promise<PhysicalActivityPatientList> {
    const queryParams = this.buildQueryParams(filters);
    const url = `${API_BASE_URL}/physical-activity-patients/${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityPatientList>(response);
  }

  async getPatient(patientId: number): Promise<PhysicalActivityPatient> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityPatient>(response);
  }

  async updatePatient(patientId: number, patientData: PhysicalActivityPatientUpdate): Promise<PhysicalActivityPatient> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    return this.handleResponse<PhysicalActivityPatient>(response);
  }

  async deletePatient(patientId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async getPatientEvaluations(patientId: number): Promise<PhysicalActivityEvaluation[]> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}/evaluations`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityEvaluation[]>(response);
  }

  // Evaluation CRUD Endpoints
  async createEvaluation(patientId: number, evaluationData: PhysicalActivityEvaluationCreate): Promise<PhysicalActivityEvaluation> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}/evaluations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    return this.handleResponse<PhysicalActivityEvaluation>(response);
  }

  async getEvaluation(evaluationId: number): Promise<PhysicalActivityEvaluation> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-evaluations/${evaluationId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityEvaluation>(response);
  }

  async updateEvaluation(evaluationId: number, evaluationData: PhysicalActivityEvaluationUpdate): Promise<PhysicalActivityEvaluation> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-evaluations/${evaluationId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });
    return this.handleResponse<PhysicalActivityEvaluation>(response);
  }

  async deleteEvaluation(evaluationId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-evaluations/${evaluationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
  }

  async getLatestPatientEvaluation(patientId: number): Promise<PhysicalActivityEvaluation | null> {
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}/evaluations/latest`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityEvaluation | null>(response);
  }

  async getPatientEvaluationsPaginated(
    patientId: number, 
    skip: number = 0, 
    limit: number = 100
  ): Promise<PhysicalActivityEvaluation[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE_URL}/physical-activity-patients/${patientId}/evaluations?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PhysicalActivityEvaluation[]>(response);
  }

  // Utility Methods
  static calculateWHOCompliance(moderateMinutes: number, vigorousMinutes: number): boolean {
    return moderateMinutes >= 150 || vigorousMinutes >= 75;
  }

  static calculateSedentaryRiskLevel(sedentaryHours: number): string {
    if (sedentaryHours < 6) return 'Baixo';
    if (sedentaryHours < 8) return 'Moderado';
    if (sedentaryHours <= 10) return 'Alto';
    return 'Crítico';
  }

  static calculateWeeklyMinutes(minutesPerDay: number, daysPerWeek: number): number {
    return minutesPerDay * daysPerWeek;
  }

  static validateActivityData(data: {
    lightMinutes: number;
    lightDays: number;
    moderateMinutes: number;
    moderateDays: number;
    vigorousMinutes: number;
    vigorousDays: number;
    sedentaryHours: number;
    screenTimeHours: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate activity limits
    if (data.lightMinutes < 0 || data.lightMinutes > 480) {
      errors.push('Atividade leve deve estar entre 0 e 480 minutos por dia');
    }
    if (data.moderateMinutes < 0 || data.moderateMinutes > 300) {
      errors.push('Atividade moderada deve estar entre 0 e 300 minutos por dia');
    }
    if (data.vigorousMinutes < 0 || data.vigorousMinutes > 180) {
      errors.push('Atividade vigorosa deve estar entre 0 e 180 minutos por dia');
    }

    // Validate days
    [data.lightDays, data.moderateDays, data.vigorousDays].forEach((days, index) => {
      const activities = ['leve', 'moderada', 'vigorosa'];
      if (days < 0 || days > 7) {
        errors.push(`Dias de atividade ${activities[index]} deve estar entre 0 e 7`);
      }
    });

    // Validate sedentary hours
    if (data.sedentaryHours < 0 || data.sedentaryHours > 24) {
      errors.push('Horas sedentárias deve estar entre 0 e 24');
    }
    if (data.screenTimeHours < 0 || data.screenTimeHours > 24) {
      errors.push('Tempo de tela deve estar entre 0 e 24');
    }

    // Basic time consistency check
    const maxDailyActivity = Math.max(
      data.lightMinutes + data.moderateMinutes + data.vigorousMinutes
    ) / 60;
    
    if (data.sedentaryHours + maxDailyActivity > 26) {
      errors.push('Soma de atividades e tempo sedentário excede limites razoáveis');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Helper method to format activity data for charts
  static formatActivityDataForChart(distribution: PhysicalActivityDistribution) {
    return [
      {
        name: distribution.light_activity.label,
        value: distribution.light_activity.average_weekly_minutes,
        color: distribution.light_activity.color
      },
      {
        name: distribution.moderate_activity.label,
        value: distribution.moderate_activity.average_weekly_minutes,
        color: distribution.moderate_activity.color
      },
      {
        name: distribution.vigorous_activity.label,
        value: distribution.vigorous_activity.average_weekly_minutes,
        color: distribution.vigorous_activity.color
      }
    ];
  }

  // Helper method to format sedentary trend data for charts
  static formatSedentaryTrendForChart(trend: SedentaryTrend) {
    const months = new Set([
      ...trend.diabetics.map(d => d.month),
      ...trend.hypertensives.map(h => h.month)
    ]);

    return Array.from(months).sort().map(month => {
      const diabeticData = trend.diabetics.find(d => d.month === month);
      const hypertensiveData = trend.hypertensives.find(h => h.month === month);

      return {
        month,
        diabetics: diabeticData?.average_sedentary_hours || 0,
        hypertensives: hypertensiveData?.average_sedentary_hours || 0
      };
    });
  }
}

export const physicalActivityApiService = new PhysicalActivityApiService();
export { PhysicalActivityApiService };