import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddlware } from "./middlewares/error.js";
import NodeCache from "node-cache";
// Importing Routes ---------------------------------------------------------------------------------------------------------------------
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("Api is working on /api/v1"));
const port = 4000;
connectDB();
export const myCache = new NodeCache();
// Using Routes -------------------------------------------------------------------------------------------------------------------------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
// route to get static folder ----------------------------------------------------------------
app.use("/uploads", express.static("uploads"));
app.use(errorMiddlware);
app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
