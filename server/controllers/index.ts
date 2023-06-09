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

import { Product, ProductStyles } from '../models/definitions';

/* GET Loader.io Token */
export const sendLoaderIoToken = (req: Request, res: Response): void => {
  res.send(process.env.LOADERIO_TOKEN);
};

/* GET All Products */
export const getProductsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const count = parseInt(req.query.count as string) || 5;

    const productsList: Product[] = await readProductsList(page, count);

    res.status(200).send(productsList);
  } catch (err) {
    res.status(500).send(err);
  }
};

/* GET One Product */
export const getOneProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const response = await readProductById(parseInt(product_id));

    if (response.length === 0) {
      res.status(404).send(`Product ${product_id} does not exist`);
    } else {
      const [JsonBuildObject] = response;

      const { jsonb_build_object: product }: { jsonb_build_object: Product } =
        JsonBuildObject;

      res.status(200).send(product);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/* GET Product Styles */
export const getProductStyles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const response = await readProductStyles(parseInt(product_id));

    if (response.length === 0) {
      res.status(404).send(`Product ${product_id} styles do not exist`);
    } else {
      const [JsonBuildObject] = response;
      const {
        jsonb_build_object: productStyles,
      }: { jsonb_build_object: ProductStyles } = JsonBuildObject;

      res.status(200).send(productStyles);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/* GET Related ProductIds */
export const getRelatedProductIds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const response = await readRelatedProoductIds(parseInt(product_id));

    if (response.length === 0) {
      res
        .status(404)
        .send(`Related products for Product: ${product_id} do not exist`);
    } else {
      const [arrayToJsonObject] = await readRelatedProoductIds(
        parseInt(product_id)
      );

      const relatedProductIds: number[] = [
        ...arrayToJsonObject['array_to_json'],
      ];

      res.status(200).send(relatedProductIds);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/* POST Create Product */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slogan, description, category, default_price } = req.body;
    const newProduct = {
      name: name as string,
      slogan: slogan as string,
      description: description as string,
      category: category as string,
      default_price: default_price as number,
    };

    const [createdProduct] = await createNewProduct(newProduct);

    if (createdProduct) {
      res.status(201).send(createdProduct.product_id.toString());
    } else {
      throw new Error(`Failed to create product: ${name}`);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/* PUT Update Product */
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const { name, slogan, description, category, default_price } = req.body;

    const [product] = await readProductById(parseInt(product_id as string));

    if (product) {
      const productToBeUpdated: Product = {
        product_id: parseInt(product_id as string),
        name: name as string,
        slogan: slogan as string,
        description: description as string,
        category: category as string,
        default_price: parseInt(default_price as string),
      };

      const [updatedProduct] = await updateProductById(productToBeUpdated);

      res.status(200).send(updatedProduct.product_id.toString());
    } else {
      throw new Error(`Product ${product_id} does not exist`);
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

/* DELETE Product */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const [deletedProduct] = await deleteProductById(parseInt(product_id));

    if (deletedProduct) {
      res.status(200).send(deletedProduct.product_id.toString());
    } else {
      throw new Error(`Product ${product_id} does not exist`);
    }
  } catch (err: any) {
    res.status(404).send(err.message);
  }
};
