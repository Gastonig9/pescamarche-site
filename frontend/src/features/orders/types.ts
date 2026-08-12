export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  shippingMethod: string;
  shippingCost: number;
  total: number;
  notes?: string;
}

export interface Order extends CreateOrderPayload {
  _id: string;
  status: string;
  shippingStatus: string;
  createdAt: string;
}
