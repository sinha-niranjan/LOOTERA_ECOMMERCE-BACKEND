import {
  allCoupon,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "./../middlewares/auth.js";
import express from "express";

const app = express.Router();

// route - /api/v1/payment/create
app.post("/create",   createPaymentIntent);

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);

// route - /api/v1/payment/discount
app.get("/discount", applyDiscount);

// route - /api/v1/payment/coupoon/all
app.get("/coupon/all", adminOnly, allCoupon);

// route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
