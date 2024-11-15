const router = require('express').Router()
const adminRouter = require('./admin.routes')
const clientRouter = require('./client.routes.js')
const categoryRouter = require('./category.routes.js')
const productRouter = require('./product.routes.js')
const orderRouter = require('./orders.routes.js')
const guarantorRouter = require('./guarantor.routes.js')
const upload = require('../utils/upload.js')

router.use('/client', clientRouter)
router.use('/admin', adminRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/guarantor', guarantorRouter)
router.use('/order', orderRouter)

const uploadFile = upload.single('file')

router.post('/upload', async (req, res) => {
  uploadFile(req, res, (err) => {
    if (err) {
      console.log(err)

      return res.status(400).json({
        code: err.code,
        field: err.field,
        message: err.message.length ? err.message : err.data.message,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Upload successfully',
      data: `${req.file?.filename}`,
    })
  })
})

module.exports = router
