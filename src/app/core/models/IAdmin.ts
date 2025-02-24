export interface IOffer {
  _id?: string
  title: string;
  description: string;
  discount: number;
  isActive: boolean;
}

export interface ICoupon {
  couponId: string;
  discount: number;
  description: number;
  expirtyDate: string;
  minPurchaseAmt: number;
  maxPurchaseAmt: number;
  isActive: boolean
}
