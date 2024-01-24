import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utilityClass.js";
// Create new Coupon -----------------------------------------------------------------------------------------------------------------------------------------
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new ErrorHandler("Please enter both Coupon and Amount ", 400));
    await Coupon.create({ code: coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created Successfully `,
    });
});
// Apply Discount --------------------------------------------------------------------------------------------------------------------------------------------
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    const discount = await Coupon.findOne({ code: coupon });
    if (!discount)
        return next(new ErrorHandler("Invalide coupon code ", 400));
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created Successfully `,
    });
});
