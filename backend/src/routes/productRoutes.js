

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockMovement,
} = require('../middlewares/validateProduct');


router.get('/', productController.getAllProducts);


router.get('/:id', productController.getProductById);


router.post('/', validateCreateProduct, productController.createProduct);


router.put('/:id', validateUpdateProduct, productController.updateProduct);


router.patch('/:id/stock', validateStockMovement, productController.updateStock);


router.delete('/:id', productController.deleteProduct);

module.exports = router;
