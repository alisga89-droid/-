
export interface PerfumeOil {
  id: string;
  name: string;
  company: string;
  category: string;
  currentWeight: number; // in grams
  purchasePricePerGram: number;
  salePricePerGram: number;
  macerationDate?: string;
  macerationPercentage?: number;
  addedDate: string;
}

export interface SaleItem {
  oilId: string;
  oilName: string;
  weightSold: number;
  priceAtSale: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
}

export interface Company {
  id: string;
  name: string;
}
