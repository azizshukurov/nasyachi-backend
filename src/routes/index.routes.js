const router = require('express').Router()
const adminRouter = require('./admin.routes')
const clientRouter = require('./client.routes.js')
const upload = require('../utils/upload.js')

router.use('/client', clientRouter)
router.use('/admin', adminRouter)

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
