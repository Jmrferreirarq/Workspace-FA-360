export const getVatRateLabel = (vatRate?: number | null) => {
  if (vatRate === 0.06) return '6%';
  if (vatRate === 0.23) return '23%';
  return 'taxa legal';
};

export const formatEur = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);
