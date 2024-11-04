const router = require('express').Router()
const orderController = require('../controllers/orders.controller')

router.get('/', orderController.getAll)
router.get('/:id', orderController.getOne)
router.post('/create', orderController.create)
router.post('/pay/monthly', orderController.payMonthlyOrder)
router.post('/pay/all-amount', orderController.payAllAmountOrder)

module.exports = router
