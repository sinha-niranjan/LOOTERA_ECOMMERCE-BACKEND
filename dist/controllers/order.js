import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";
import { myCache } from "../app.js";
// Create new order ----------------------------------------------------------------------------------------------------------------------------------------
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
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
    await invalidateCache({ product: true, order: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully ",
    });
});
// Get my Order ----------------------------------------------------------------------------------------------------------------------------------
export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    let orders = [];
    if (myCache.has(`myOrders${user}`))
        orders = JSON.parse(myCache.get(`myOrders${user}`));
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
        orders = JSON.parse(myCache.get(`allOrders`));
    else {
        orders = await Order.find();
        myCache.set(`allOrders`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
