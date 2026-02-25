export const nodeColors = {
  branch: {
    bg: '#EEF2FF',
    border: '#6366F1',
    text: '#3730A3',
    slotActive: '#6366F1',
    slotInactive: '#E0E7FF',
  },
  extension: {
    bg: '#FFF7ED',
    border: '#F97316',
    text: '#9A3412',
    nibbleBg: '#FFEDD5',
  },
  leaf: {
    bg: '#F0FDF4',
    border: '#22C55E',
    text: '#166534',
    valueBg: '#DCFCE7',
  },
  hash: {
    bg: '#FEF2F2',
    border: '#EF4444',
    text: '#991B1B',
  },
  value: {
    bg: '#F5F3FF',
    border: '#8B5CF6',
    text: '#5B21B6',
  },
} as const;

export const edgeColors = {
  default: '#94A3B8',
  highlighted: '#6366F1',
  nibbleLabel: '#475569',
  nibbleBg: '#F1F5F9',
} as const;
