import { Fine, FinePayment, FineSummary } from '@model/fine';
import { FinesFilterParams } from './fines-filter-bar/fines-filter-bar';

export interface FinesState {
  summary: FineSummary | null;
  fines: Fine[];
  filteredFines: Fine[];
  payments: FinePayment[];
  filters: FinesFilterParams;
  activeTab: 'fines' | 'history';
  isLoading: boolean;
  error: string | null;
}
