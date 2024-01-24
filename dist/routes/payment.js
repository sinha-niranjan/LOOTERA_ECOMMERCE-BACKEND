import { newCoupon } from "../controllers/payment.js";
import express from "express";
const app = express.Router();
// route - /api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
export default app;
