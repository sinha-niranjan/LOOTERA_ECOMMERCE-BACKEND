import { applyDiscount, newCoupon } from "../controllers/payment.js";
import { adminOnly } from "./../middlewares/auth.js";
import express from "express";

 

const app = express.Router();

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);


// route - /api/v1/payment/
app.get("/discount", applyDiscount)
 
export default app;
