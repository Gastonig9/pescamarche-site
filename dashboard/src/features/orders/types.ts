export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";

export type ShippingStatus = "pending" | "preparing" | "shipped" | "delivered";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  id?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    userId?: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  shippingStatus: ShippingStatus;
  status: OrderStatus;
  total: number;
  notes?: string;
  createdAt: string;
}

export interface UpdateOrderStatusInput {
  status?: OrderStatus;
  shippingStatus?: ShippingStatus;
}
