const router = require('express').Router()
const categoryController = require('../controllers/category.controller')

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.post('/create', categoryController.create)
router.put('/update/:id', categoryController.update)
router.delete('/delete/:id', categoryController.deleteCategory)

module.exports = router
