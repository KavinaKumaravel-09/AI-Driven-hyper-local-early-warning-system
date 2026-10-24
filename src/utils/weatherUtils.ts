import { RiskLevel } from '../types/weather';

export function getRiskBadgeClasses(risk: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
  accent: string;
} {
  switch (risk) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Low Risk',
        accent: '#10B981'
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'Moderate Risk',
        accent: '#F59E0B'
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        label: 'High Risk',
        accent: '#EA580C'
      };
    case 'VERY_HIGH':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        dot: 'bg-rose-600',
        label: 'Very High Risk',
        accent: '#E11D48'
      };
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}
