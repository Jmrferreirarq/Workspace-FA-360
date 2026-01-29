export interface ExtraService {
  id: string;
  label: string;
  description: string;
  type: 'fixed' | 'area_based' | 'quantity';
  basePrice?: number;
  pricePerUnit?: number;
  pricePerM2?: number;
}
