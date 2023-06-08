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
}

export interface ArrayToJsonObject {
  array_to_json: number[];
}

export interface JsonBuildObjectProductStyles {
  jsonb_build_object: ProductStyles;
}

export interface JsonBuildObjectProduct {
  jsonb_build_object: Product;
}

export interface ProductStyles {
  product_id: number;
  results: StylesAggregation[];
}

interface StylesAggregation {
  style_id: number;
  name: string;
  original_price: string;
  sale_price: number;
  ['default?']: number;
  photos: Photos[];
  skus: Skus;
}

interface Photos {
  thumbnail_url: string;
  url: string;
}

interface Skus {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
}
