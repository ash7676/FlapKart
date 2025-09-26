const { default: mongoose } = require("mongoose");
const models = require("../models");
const { successResponse } = require("../utils/response");

const placeOrder = async function (req, res, next) {
  try {
    console.log("Req----", req);
    //user adds items to his/her cart
    //user places order for items -> status pending

    // proceeds to payment, if payment succed-> webhook updates order with status "paid"
    //if payment fail-> keep order status as -> "pending"

    //if payment placed successfully, empty the cart
    //if payment failed, keep items in cart

    const userId = req.user?.id;
    const cartId = req.body?.cartId;
    const cart = await models.carts
      .findOne({
        _id: new mongoose.Types.ObjectId(cartId),
        userId: new mongoose.Types.ObjectId(userId),
      })
      .populate("items.productId");
      let totalOrderAmount = 0;
    const cartItems = cart?.items.map((item) => {
      const prodId = item.productId._id;
      const name = item.productId.name;
      const price = item.productId.price;
      const quantity = item.quantity;
      const total =  price* quantity;
      totalOrderAmount =  totalOrderAmount + total;
      return {
        productId: prodId,
        name,
        price,
        quantity,
      };
    });
    const newOrder =  await models.orders.create({
        userId,
        items: cartItems,
        totalAmount: totalOrderAmount,
        status: 'pending',
    })
    if(newOrder) return successResponse(res,"order created",newOrder.toObject())
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
};
