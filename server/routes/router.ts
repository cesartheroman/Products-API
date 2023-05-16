import { Router } from 'express';

import {
  getProductsList,
  getOneProduct,
  getProductStyles,
  getRelatedProductIds,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers';

const router = Router();

router.get('/list', getProductsList);

router.get('/:product_id', getOneProduct);

router.get('/:product_id/styles', getProductStyles);

router.get('/:product_id/related', getRelatedProductIds);

router.post('/', createProduct);

router.put('/:product_id', updateProduct);

router.delete('/:product_id', deleteProduct);

export default router;
