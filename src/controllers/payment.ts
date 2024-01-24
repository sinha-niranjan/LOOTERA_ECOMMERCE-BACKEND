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

  if (!discount) return next(new ErrorHandler("Invalide coupon code ", 400));

  return res.status(201).json({
    success: true,
    discount: discount.amount,
  });
});

// get all Coupons --------------------------------------------------------------------------------------------------------------------------------------------

export const allCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(201).json({
    success: true,
    coupons,
  });
});

// Delete Coupons --------------------------------------------------------------------------------------------------------------------------------------------

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

  return res.status(201).json({
    success: true,
    message: ` Coupon ${coupon?.code} Deleted Successfully  `,
  });
});
