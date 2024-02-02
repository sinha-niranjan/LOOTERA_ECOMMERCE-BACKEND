import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";
import { myCache } from "../index.js";

// Get my Order ----------------------------------------------------------------------------------------------------------------------------------

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  let orders = [];

  if (myCache.has(`myOrders${user}`))
    orders = JSON.parse(myCache.get(`myOrders${user}`) as string);
  else {
    orders = await Order.find({ user });
    myCache.set(`myOrders${user}`, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get all Order ----------------------------------------------------------------------------------------------------------------------------------

export const allOrders = TryCatch(async (req, res, next) => {
  let orders = [];

  if (myCache.has(`allOrders`))
    orders = JSON.parse(myCache.get(`allOrders`) as string);
  else {
    orders = await Order.find().populate("user", "name");
    myCache.set(`allOrders`, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get all Order ----------------------------------------------------------------------------------------------------------------------------------

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let order;
  if (myCache.has(`order${id}`))
    order = JSON.parse(myCache.get(`order${id}`) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not Found ", 404));
    myCache.set(`order${id}`, JSON.stringify(order));
  }
  return res.status(200).json({
    success: true,
    order,
  });
});

// Create new order ----------------------------------------------------------------------------------------------------------------------------------------

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !subtotal || !tax || !total || !user || !orderItems) {
      return next(new ErrorHandler("Please enter all Fields", 400));
    }
    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: orderItems.map((i) => String(i.productId)),
    });
    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully ",
    });
  }
);

// Process  order ----------------------------------------------------------------------------------------------------------------------------------------

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

// Delete   order ----------------------------------------------------------------------------------------------------------------------------------------

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not Found", 404));

  await order.deleteOne();

  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
