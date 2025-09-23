const { successResponse, errorResponse } = require("../utils/response");
const models = require("../models");
const { default: mongoose, model } = require("mongoose");

const addToCart = async function (req, res, next) {
  try {
    const { userId, productId } = req.body;

    const addAgain = await models.carts.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        "items.productId": new mongoose.Types.ObjectId(productId),
      },
      {
        $inc: { "items.$.quantity": 1 },
      },
      {
        new: true,
      }
    );

    if (addAgain) {
      return successResponse(res, "product added to cart!", { addAgain });
    }
    const newToCart = await models.carts
      .findOneAndUpdate(
        {
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          $push: {
            items: {
              productId: new mongoose.Types.ObjectId(productId),
              quantity: 1,
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      )
      .lean();
    if (newToCart) {
      return successResponse(res, "product added to cart!", { newToCart });
    }
  } catch (err) {
    next(err);
  }
};

const removeItem = async function (req, res, next) {
  try {
    const user = req.user;
    const { productId } = req.body;
    const removeItem = await models.carts.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(user.id),
        // "items.productId": new mongoose.Types.ObjectId(productId),
      },
      {
        $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } },
      },
      {
        new: true,
      }
    );
    if (!removeItem) {
      return errorResponse(res, "failed to remove", {}, 404);
    }
    return successResponse(res, "item removed successfully", {
      item: removeItem,
    });
  } catch (err) {
    next(err);
  }
};

const updateItemQty = async function (req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const updateQty = await models.carts.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(req.user.id),
        "items.productId": new mongoose.Types.ObjectId(productId),
      },
      {
        $set: { "items.$.quantity": quantity },
      },
      {
        new: true,
      }
    );
    if (!updateQty) {
      return errorResponse(res, "quantity update failed", {}, 400);
    }
    return successResponse(res, "quantity updated", { updateQty });
  } catch (err) {
    next(err);
  }
};

const viewCart = async function (req, res, next) {
  try {
    const { user } = req;

    const cart = await models.carts.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(user.id) },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $addFields: {
          "items.subTotal": {
            $multiply: ["$items.quantity", "$productDetails.price"],
          },
        },
      },
    ]);
    if (!cart) {
      return errorResponse(res, "no cart available", {}, 404);
    }
    return successResponse(res, "cart items listed successfully", { cart });
  } catch (err) {
    next(err);
  }
};

const checkoutCart = async function (req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //EMPTY THE USERS CART,REDUCE STOCK FROM PRODUCT TABLE
    const { user } = req;
    const { items } = await models.carts
      .findOne({ userId: new mongoose.Types.ObjectId(user.id) })
      .select({ items: 1 })
      .session(session);
    for (let i = 0; i <= items.length - 1; i++) {
      const product = await models.products.updateOne(
        {
          _id: new mongoose.Types.ObjectId(items[i].productId),
          stock: { $gte: items[i].quantity },
        },
        {
          $inc: { stock: -items[i].quantity },
        },
        {
          session,
        }
      );
      if (product.matchedCount === 0) {
        return errorResponse(
          res,
          "product is out of stock / available stock is less than requested quantity"
        );
      }
    }

    await models.carts.updateOne(
      { userId: new mongoose.Types.ObjectId(user.id) },
      {
        $set: { items: [] },
      },
      {
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res,"checkout completed",{});
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addToCart,
  removeItem,
  updateItemQty,
  viewCart,
  checkoutCart,
};
