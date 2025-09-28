const { default: mongoose } = require("mongoose");
const models = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const {
  PENDING,
  PAID,
  SHIPPED,
  DELIVERED,
  CANCELLED,
} = require("../constants/orderConstants");

const placeOrder = async function (req, res, next) {
  try {
    const userId = req.user?.id;
    const cartId = req.body?.cartId;

    //check if cartid is a valid object id
    if (!mongoose.Types.ObjectId.isValid(cartId))
      throw new Error("invalid cart id");

    const cart = await models.carts
      .findOne({
        _id: new mongoose.Types.ObjectId(cartId),
        userId: new mongoose.Types.ObjectId(userId),
      })
      .populate("items.productId");

    //if no cart exists
    if (!cart) return errorResponse(res, "cart not found!", {});
    if (!cart.items.length) return errorResponse(res, "cart is empty!", {});
    let totalOrderAmount = 0;

    //check if the user has a pending order, if yes throw response
    const hasPendingOrder = await models.orders.findOne({
      status: PENDING,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (hasPendingOrder)
      throw new Error(
        `the user has a pending order. orderId:${
          hasPendingOrder.toObject()._id
        }`
      );

    const cartItems = cart?.items.map((item) => {
      const prodId = item.productId._id;
      const name = item.productId.name;
      const price = item.productId?.price;
      if (!price) {
        return errorResponse(
          res,
          `price is missing for item : ${item.productId._id}`
        );
      }
      const quantity = item.quantity;
      const total = price * quantity;
      totalOrderAmount = totalOrderAmount + total;
      return {
        productId: prodId,
        name,
        price,
        quantity,
      };
    });

    const newOrder = await models.orders.create({
      userId,
      items: cartItems,
      totalAmount: totalOrderAmount,
      status: PENDING,
    });
    if (newOrder) {
      return successResponse(res, "order created", newOrder.toObject());
    } else {
      return errorResponse(res, "failed to create order", {});
    }
  } catch (err) {
    next(err);
  }
};

//after payment is success, the webhook needs to set order status as paid
const updateOrderStatus = async function (req, res, next) {
  try {
    const orderId = req.params.orderId;
    const userId = req.params.userId;
    const orderStatus = req.params.orderStatus;

    //check if order id valid obejct id
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return errorResponse(res, "invalid order id!", {});
    }

    //check if user id is valid object id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "invalid user id!", {});
    }

    //check order status
    const allowedStatuses = [PENDING, PAID, SHIPPED, DELIVERED, CANCELLED];
    if (!allowedStatuses.includes(orderStatus)) {
      return errorResponse(res, "invalid order status!", {});
    }

    ///update order status
    const updatedOrder = await models.orders.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(orderId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { $set: { status: orderStatus } },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return errorResponse(
        res,
        "failed to update the order/order not found",
        {}
      );
    }
    return successResponse(
      res,
      `order:${orderId} has been updated with status:-${updatedOrder.status}`,
      { updatedOrder }
    );
  } catch (err) {
    next(err);
  }
};

//NEED AN ORDER REVIEW API TO SHOW TOTAL PRICE, QUANTITY, TAX ,OTHER CHARGES
const viewOrder = function (req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  viewOrder,
  updateOrderStatus,
};
