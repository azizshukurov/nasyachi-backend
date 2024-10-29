const router = require('express').Router()
const adminControllers = require('../controllers/admin.controller')

router.get('/addAdmin', adminControllers.addAdmin)

module.exports = router
