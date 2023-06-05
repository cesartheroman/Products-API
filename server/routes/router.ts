import { Router } from 'express';
import { query, param, body } from 'express-validator';
import handleInputErrors from '../../utils/middleware';

import {
  getProductsList,
  getOneProduct,
  getProductStyles,
  getRelatedProductIds,
  createProduct,
  updateProduct,
  deleteProduct,
  sendLoaderIoToken,
} from '../controllers';

export const LoaderIoRouter = Router();

LoaderIoRouter.get('/', sendLoaderIoToken);

export const productsRouter = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *     Product:
 *      type: object
 *      required:
        - product_id
        properties:
 *          product_id:
 *              type: integer
 *              format: int64
 *              description: Product id
 *          name:
 *              type: string
 *              description: Product name
 *          slogan:
 *              type: string
 *              description: Product slogan
 *          description:
 *              type: string
 *              description: Product description
 *          category:
 *              type: string
 *              description: Product category
 *          default_price:
 *              type: integer
 *              description: Product default price
 *     Example Product:
 *          id: 1
 *          name: Camo Onesie
 *          slogan: Blend in to your crowd
 *          _description: The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings
 *          category: Jackets
 *          default_price: 140
 *          type: Product
 */

/**
 * @swagger
 * /products/list:
 *  get:
 *     summary: Retrieves the list of products.
 *     parameters:
 *      - in: query
 *        name: page
 *        description: Selects the page of results to return. Default 1.
 *        required: false
 *        type: integer
 *      - in: query
 *        name: count
 *        description: Specifies how many results per page to return. Default 5.
 *        required: false
 *        type: integer
 *     description: Get all products
 *     responses:
 *      200:
 *         description: Success
 *      500:
 *         description: Internal Server Error
 */

productsRouter.get(
  '/list',
  [
    query('page').optional().isNumeric(),
    query('count').optional().isNumeric(),
    handleInputErrors,
  ],
  getProductsList
);

/**
 * @swagger
 * /products/{product_id}:
 *  get:
 *     summary: Returns all product level information for a specified product id.
 *     parameters:
 *      - in: path
 *        name: product_id
 *        description: Required ID of the Product requested
 *        required: true
 *        type: integer
 *     description: Get product by ID
 *     responses:
 *      200:
 *         description: Success
 *      500:
 *         description: Internal Server Error
 */

productsRouter.get(
  '/:product_id',
  [param('product_id').exists().isNumeric(), handleInputErrors],
  getOneProduct
);

/**
 * @swagger
 * /products/{product_id}/styles:
 *  get:
 *     summary: Returns the all styles available for the given product.
 *     parameters:
 *      - in: path
 *        name: product_id
 *        description: Required ID of the Product requested
 *        required: true
 *        type: integer
 *     description: Get Product Styles
 *     responses:
 *      200:
 *         description: Success
 *      500:
 *         description: Internal Server Error
 */

productsRouter.get(
  '/:product_id/styles',
  [param('product_id').exists().isNumeric(), handleInputErrors],
  getProductStyles
);

/**
 * @swagger
 * /products/{product_id}/related:
 *  get:
 *     summary: Returns the id's of products related to the product specified.
 *     parameters:
 *      - in: path
 *        name: product_id
 *        description: Required ID of the Product requested
 *        required: true
 *        type: integer
 *     description: Get Related Product IDs
 *     responses:
 *      200:
 *         description: Success
 *      500:
 *         description: Internal Server Error
 */

productsRouter.get(
  '/:product_id/related',
  [param('product_id').exists().isNumeric(), handleInputErrors],
  getRelatedProductIds
);

/**
 * @swagger
 * /products:
 *  post:
 *     summary: Creates a new Product
 *     requestBody:
 *          description: A JSON object containing product information
 *          content:
 *             application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/Product'
 *                 example:
 *                    name: Corene Slacks
 *                    slogan: Maiores reprehenderit asperiores et enim.
 *                    description: Totam sit perspiciatis. Nihil ex tempore fuga cumque est expedita corporis. Provident voluptatem explicabo ut culpa quia praesentium ex cupiditate perferendis. Aut et doloribus et beatae veritatis vel. Dolorem sequi vero est eaque qui veniam est. Id quas esse laboriosam.
 *                    category: Slacks
 *                    default_price: 638
 *     description: Created a new product
 *     responses:
 *      201:
 *         description: Product successfully created
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product/properties/product_id'
 *      500:
 *         description: Internal Server Error
 */

productsRouter.post(
  '/',
  [
    body('name').isString(),
    body('slogan').isString(),
    body('description').isString(),
    body('category').isString(),
    body('default_price').isNumeric(),
    handleInputErrors,
  ],
  createProduct
);

/**
 * @swagger
 * /products/{product_id}:
 *  put:
 *     summary: Updates a Product by id.
 *     parameters:
 *      - in: path
 *        name: product_id
 *        description: Required ID of the Product requested
 *        required: true
 *        type: integer
 *     requestBody:
 *          description: A JSON object containing product information
 *          content:
 *             application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/Product'
 *                 example:
 *                    name: Corene Slacks
 *                    slogan: Maiores reprehenderit asperiores et enim.
 *                    description: Totam sit perspiciatis. Nihil ex tempore fuga cumque est expedita corporis. Provident voluptatem explicabo ut culpa quia praesentium ex cupiditate perferendis. Aut et doloribus et beatae veritatis vel. Dolorem sequi vero est eaque qui veniam est. Id quas esse laboriosam.
 *                    category: Slacks
 *                    default_price: 638
 *     description: Updates a product
 *     responses:
 *      200:
 *         description: Product successfully updated
 *      500:
 *         description: Internal Server Error
 */

productsRouter.put(
  '/:product_id',
  [param('product_id').exists().isNumeric(), handleInputErrors],
  updateProduct
);

/**
 * @swagger
 * /products/{product_id}:
 *  delete:
 *     summary: Deletes a Product by id.
 *     parameters:
 *      - in: path
 *        name: product_id
 *        description: Required ID of the Product requested
 *        required: true
 *        type: integer
 *     description: Deletes a product
 *     responses:
 *      20:
 *         description: Product successfully updated
 *      500:
 *         description: Internal Server Error
 */

productsRouter.delete(
  '/:product_id',
  [param('product_id').exists().isNumeric(), handleInputErrors],
  deleteProduct
);
