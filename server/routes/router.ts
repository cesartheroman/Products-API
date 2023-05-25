import { Router } from 'express';

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

export const productsRouter = Router();

productsRouter.get('/list', getProductsList);

productsRouter.get('/:product_id', getOneProduct);

productsRouter.get('/:product_id/styles', getProductStyles);

productsRouter.get('/:product_id/related', getRelatedProductIds);

productsRouter.post('/', createProduct);

productsRouter.put('/:product_id', updateProduct);

productsRouter.delete('/:product_id', deleteProduct);

export const LoaderIoRouter = Router();

LoaderIoRouter.get('/', sendLoaderIoToken);
