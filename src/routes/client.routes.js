const router = require('express').Router()
const clientController = require('../controllers/client.controllers')

router.get('/', clientController.getAllClient)
router.get('/:id', clientController.getOneClient)
router.post('/create', clientController.createClient)
router.put('/update/:id', clientController.updateClient)
router.delete('/delete/:id', clientController.deleteClient)

module.exports = router
