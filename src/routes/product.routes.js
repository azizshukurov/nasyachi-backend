const router = require('express').Router()
const productController = require('../controllers/product.controller')

router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.post('/create', productController.create)
router.put('/update/:id', productController.update)
router.delete('/delete/:id', productController.deleteProduct)

module.exports = router
