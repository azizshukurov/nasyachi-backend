const router = require('express').Router()
const adminControllers = require('../controllers/admin.controller')

router.get('/addAdmin', adminControllers.addAdmin)
router.get('/', adminControllers.getAllUsers)
router.get('/:id', adminControllers.getOneUser)
router.post('/create', adminControllers.create)
router.put('/update/:id', adminControllers.updateUser)
router.delete('/delete/:id', adminControllers.deleteUser)

module.exports = router
