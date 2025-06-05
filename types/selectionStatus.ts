export type SelectionStatus = 'pending' | 'shortlisted' | 'rejected';

export const statusOptions: { label: string; value: SelectionStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Rejected', value: 'rejected' },
];
