import { Request, Response } from 'express';

import {
  readProductsList,
  readProductById,
  readProductStyles,
  readRelatedProoductIds,
  createNewProduct,
  updateProductById,
  deleteProductById,
} from '../models';
import { Features } from '../models/definitions';

//GET All Products
export const getProductsList = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const count = Number(req.query.count) || 5;

  try {
    const productsList = await readProductsList(page, count);

    res.status(200).send(productsList);
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET One Product
export const getOneProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const response = await readProductById(parseInt(product_id));

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET Product Styles
export const getProductStyles = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const response = await readProductStyles(parseInt(product_id));

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

//GET Related Products
export const getRelatedProductIds = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const [arrayToJsonObject] = await readRelatedProoductIds(
      parseInt(product_id)
    );

    const relatedIds = [...arrayToJsonObject['array_to_json']];

    res.status(200).send(relatedIds);
  } catch (err) {
    res.status(500).send(err);
  }
};

//POST Create Product
export const createProduct = async (req: Request, res: Response) => {
  const { name, slogan, description, category, default_price, features } =
    req.query;

  try {
    const parsedFeatures: Features[] = JSON.parse(features as string);

    const newProduct = {
      name: name as string,
      slogan: slogan as string,
      description: description as string,
      category: category as string,
      default_price: parseInt(default_price as string),
      features: parsedFeatures,
    };

    const createdProduct = await createNewProduct(newProduct);

    res.status(201).send(createdProduct);
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
  const { product_id } = req.params;

  try {
    const deletedProduct = await deleteProductById(parseInt(product_id));

    res.status(200).send(deletedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
};
