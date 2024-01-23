import express from "express";
import { allOrders, myOrders, newOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - /api/v1/order/new
app.post("/new", newOrder);
//  route - /api/v1/order/my
app.get("/my", myOrders);
// route - /api/v1/order/all
app.get("/all", adminOnly, allOrders);
export default app;
