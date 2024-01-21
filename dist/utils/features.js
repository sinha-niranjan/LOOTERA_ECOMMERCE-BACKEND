import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
const url = "mongodb+srv://sinhaniranjankumar21534:sinhaniranjankumar21534@cluster0.jza7rkj.mongodb.net/?retryWrites=true&w=majority";
export const connectDB = () => {
    mongoose
        .connect(url, { dbName: "Ecommerce_typescript" })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            "latesProducts",
            "categories",
            "allProducts",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
