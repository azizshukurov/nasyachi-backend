const Products = require('../models/Products')

const getAll = async (req, res, next) => {
  try {
    const products = await Products.find()
    // .populate('Category')

    return res.status(200).json(products)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const getOne = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id)
    // .populate('Category')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const product = await Products.create({ ...req.body })

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found by this id!',
      })
    }

    await Products.updateOne({ _id: req.params.id }, { ...req.body })

    return res.status(201).json({
      success: true,
      message: 'Product updated successfully!',
      data: product._id,
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found by this id!',
      })
    }

    await Products.findByIdAndDelete(req.params.id)

    return res.status(201).json({
      success: true,
      message: 'Product deleted successfully!',
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deleteProduct,
}
