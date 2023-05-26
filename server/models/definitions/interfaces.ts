export interface Features {
  feature: string;
  value: string;
}

export interface Product {
  product_id: number;
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: number;
  features?: Features[];
}

export interface NewProduct {
  name: string;
  slogan: string;
  description: string;
  category: string;
  default_price: number;
  features: Features[];
}

export interface ArrayToJsonObject {
  array_to_json: number[];
}