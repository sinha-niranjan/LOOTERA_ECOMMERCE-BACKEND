import { stripe } from "../index.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utilityClass.js";

// Create new Coupon -----------------------------------------------------------------------------------------------------------------------------------------

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter   Amount ", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "INR",
    description: "for amazon-clone project",
    shipping: {
      name: "Random singh",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
  });
  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

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
