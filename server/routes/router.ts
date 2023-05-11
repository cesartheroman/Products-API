import { Router } from 'express';

import {
  listProducts,
  getProduct,
  getProductStyles,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers';

const router = Router();

router.get('/products/list', listProducts);

router.get('/products/:product_id', getProduct);

router.get('/products/:product_id/styles', getProductStyles);

router.get('/products/:product_id/related', getRelatedProducts);

router.post('/products', createProduct);

router.put('/products/:product_id', updateProduct);

router.delete('/products/:product_id', deleteProduct);
