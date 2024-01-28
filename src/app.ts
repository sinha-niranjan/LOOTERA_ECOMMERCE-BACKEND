import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddlware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import Stripe from "stripe";
import morgan from "morgan";
import cors from "cors";

// Importing Routes ---------------------------------------------------------------------------------------------------------------------

import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);

export const myCache = new NodeCache();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Api is working on /api/v1"));

// Using Routes -------------------------------------------------------------------------------------------------------------------------

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// route to get static folder ----------------------------------------------------------------

app.use("/uploads", express.static("uploads"));
app.use(errorMiddlware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
