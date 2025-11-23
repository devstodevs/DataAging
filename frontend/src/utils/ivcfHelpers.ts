import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formatar data para exibição
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateString;
  }
};

/**
 * Formatar data para API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Obter variante do badge baseada na classificação
 */
export const getBadgeVariant = (classification: string): 'default' | 'secondary' | 'destructive' | 'warning' | 'outline' => {
  switch (classification.toLowerCase()) {
    case 'frágil':
      return 'destructive';
    case 'em risco':
      return 'warning';
    case 'robusto':
      return 'default';
    default:
      return 'outline';
  }
};

/**
 * Obter cor para gráficos baseada na classificação
 */
export const getClassificationColor = (classification: string): string => {
  switch (classification.toLowerCase()) {
    case 'robusto':
      return '#22c55e'; // green-500
    case 'em risco':
    case 'risco':
      return '#f59e0b'; // amber-500
    case 'frágil':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

/**
 * Verificar se paciente é crítico baseado na pontuação
 */
export const isCriticalPatient = (score: number, threshold: number = 20): boolean => {
  return score >= threshold;
};

/**
 * Formatar pontuação para exibição
 */
export const formatScore = (score: number): string => {
  return score.toFixed(1);
};

/**
 * Formatar percentual para exibição
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Obter descrição da faixa etária
 */
export const getAgeRangeLabel = (ageRange: string): string => {
  switch (ageRange) {
    case '60-70':
      return '60-70 anos';
    case '71-80':
      return '71-80 anos';
    case '81+':
      return '81+ anos';
    default:
      return 'Todas as idades';
  }
};

/**
 * Obter descrição da classificação
 */
export const getClassificationLabel = (classification: string): string => {
  switch (classification.toLowerCase()) {
    case 'robusto':
      return 'Robusto';
    case 'em risco':
    case 'risk':
      return 'Em Risco';
    case 'frágil':
    case 'fragile':
      return 'Frágil';
    default:
      return classification;
  }
};

/**
 * Validar se a região é válida
 */
export const isValidRegion = (region: string, validRegions: string[]): boolean => {
  return validRegions.includes(region);
};

/**
 * Calcular estatísticas resumidas de um array de números
 */
export const calculateStats = (numbers: number[]) => {
  if (numbers.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0 };
  }

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const total = numbers.reduce((sum, num) => sum + num, 0);
  const avg = total / numbers.length;

  return { min, max, avg, total };
};

/**
 * Gerar cores para gráficos de radar
 */
export const generateRadarColors = (count: number): string[] => {
  const baseColors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
  ];

  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

/**
 * Processar dados para exportação
 */
export const prepareDataForExport = (data: Record<string, unknown>[], filename: string) => {
  const csvContent = convertToCSV(data);
  downloadCSV(csvContent, filename);
};

/**
 * Converter dados para CSV
 */
const convertToCSV = (data: Record<string, unknown>[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
};

/**
 * Fazer download de arquivo CSV
 */
const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Debounce para otimizar chamadas de API
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};