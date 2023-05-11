import { Router } from 'express';

import {
  getProductsList,
  getOneProduct,
  getProductStyles,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers';

const router = Router();

router.get('/list', getProductsList);

router.get('/:product_id', getOneProduct);

router.get('/:product_id/styles', getProductStyles);

router.get('/:product_id/related', getRelatedProducts);

router.post('/', createProduct);

router.put('/:product_id', updateProduct);

router.delete('/:product_id', deleteProduct);

export default router;
