const Categories = require('../models/Categories')

const getAll = async (req, res, next) => {
  try {
    const categories = await Categories.find()
    return res.status(200).json(categories)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const getOne = async (req, res, next) => {
  try {
    const category = await Categories.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.status(200).json(category)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { name } = req.body
    const category = await Categories.findOne({ name })

    if (category) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists by this name!',
      })
    }

    const newCategory = await Categories.create({ name })

    return res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: newCategory,
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { name } = req.body
    const category = await Categories.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found by this id!',
      })
    }

    await Categories.updateOne({ _id: req.params.id }, { name })

    return res.status(201).json({
      success: true,
      message: 'Category updated successfully!',
      data: category._id,
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Categories.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found by this id!',
      })
    }

    await Categories.findByIdAndDelete(req.params.id)

    return res.status(201).json({
      success: true,
      message: 'Category deleted successfully!',
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
  deleteCategory,
}