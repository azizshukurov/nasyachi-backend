const router = require('express').Router()
const guarantorController = require('../controllers/guarantor.controllers')

router.get('/', guarantorController.getAll)
router.get('/:id', guarantorController.getOne)
router.post('/create', guarantorController.create)
router.put('/update/:id', guarantorController.update)
router.delete('/delete/:id', guarantorController.remove)

module.exports = router
