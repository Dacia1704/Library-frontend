export interface FineTableFilter {
  search?: string;
  status?: 'all' | 'pending' | 'paid' | 'waived';
  startDate?: string;
  endDate?: string;
}

export const DEFAULT_FINE_FILTER: FineTableFilter = {
  search: '',
  status: 'all',
  startDate: '',
  endDate: '',
};
