import mongoose from "mongoose";
import { invalidateCacheType } from "../types/type.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";


export const connectDB = (uri:string) => {
  mongoose
    .connect(uri, { dbName: "Ecommerce_typescript" })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
}: invalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
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
