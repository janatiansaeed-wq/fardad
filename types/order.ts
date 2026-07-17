import { Product } from "./product";

export interface OrderItem {

  product: Product;

  quantity: number;

  price: number;

}

export interface Order {

  id: string;

  customerId: string;

  items: OrderItem[];

  totalPrice: number;

  status:
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  createdAt: Date;

  updatedAt: Date;

}