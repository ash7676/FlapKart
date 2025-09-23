const models = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const { getPagination } = require("../utils/helper");
const { default: mongoose, Mongoose } = require("mongoose");
//create
const createProduct = async function (req, res, next) {
  try {
    const { name, description, stock, price } = req.body;
    const newProduct = await models.products.create({
      name,
      description,
      stock,
      price,
    });
    return successResponse(res, "product added to inventory", {
      product: newProduct,
    });
  } catch (err) {
    next(err);
  }
};
//get one

const getProduct = async function (req, res, next) {
  try {
    const prodId = req.query.id;
    const product = await models.products.findOne({
      _id:  new mongoose.Types.ObjectId(prodId),
    });
    if (!product) return errorResponse(res, "product does not exist", {}, 404);
    return successResponse(res, "product retrieved successfully", {
      productInfo: product,
    });
  } catch (err) {
    next(err);
  }
};
const listProducts = async function (req, res, next) {
  try {
    const { page =1, size = 10 } = req.query;
    const { offset, limit } = getPagination(page, size);
    const products = await models.products.find().skip(offset).limit(limit);
    return successResponse(res,"products retrieved successfully",{products})
  } catch (err) {
    next(err)
  }
};
//update one
const updateProduct = async function (req, res, next) {
  try {
    const productId = req.body.id;
    const updated = await models.products.findOneAndUpdate(
      { _id: productId },
      { $set: req.body },
      { new: true }
    );
    return successResponse(res, "product updated successfully", {
      updatedProduct: updated,
    });
  } catch (err) {
    next(err);
  }
};
//delete one
const deleteProduct = async function (req, res, next) {
  try {
    const prodId = req.body.id;
    console.log("prodId---",prodId)
    const deleteProduct = await models.products.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(prodId),
    });
    if (!deleteProduct) {
      return errorResponse(res, "no such product exists", {}, 404);
    }
    return successResponse(res, "product deleted successfully", {
      product: deleteProduct,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { createProduct, getProduct,listProducts, updateProduct, deleteProduct };
