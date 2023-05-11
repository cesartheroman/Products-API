import { Request, Response } from 'express';
import {
  queryProductsList,
  queryProduct,
  queryProductStyles,
  queryRelatedProoducts,
  queryNewProduct,
  queryDeleteProduct,
} from '../models';

//GET All Products
export const getProductsList = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || undefined;
  const count = Number(req.query.count) || undefined;

  try {
    const productsList = await queryProductsList(page, count);

    res.status(200).send(productsList);
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET One Product
export const getOneProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const product = await queryProduct(parseInt(product_id));

    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET Product Styles
export const getProductStyles = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET Related Products
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};

//POST Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};

//PUT Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};

//DELETE Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).send(err);
  }
};
