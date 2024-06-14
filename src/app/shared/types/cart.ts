import { Product } from './product';
export interface Cart {
    _id: string;
    userId: string;
    createdAt: string;
    total: {
      price: {
        current: number;
        beforeDiscount: number;
      };
      quantity: number;
      products: number;
    };
    products: CartProduct[];
  }

  export interface CartProduct {
    quantity: number;
    pricePerQuantity: number;
    beforeDiscountPrice: number;
    productId: string;
    details: Product | undefined;
  }
