import mongoose from "mongoose";
import { OrderItemType, invalidateCacheType } from "../types/type.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "Ecommerce_typescript" })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latesProducts",
      "categories",
      "allProducts",
    ];

    if (typeof productId === "string") productKeys.push(`product${productId}`);
    if (typeof productId === "object") {
      productId?.forEach((i) => {
        productKeys.push(`product${i}`);
      });
    }
    myCache.del(productKeys);
  }
  if (order) {
    const ordersKeys: string[] = [
      "allOrders",
      `myOrders${userId}`,
      `order${orderId}`,
    ];

    myCache.del(ordersKeys);
  }

  if (admin) {
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product  not Found !");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: Number, lastMonth: Number) => {
  if (lastMonth === 0) return Number(thisMonth) * 100;
  const percent =
    ((Number(thisMonth) - Number(lastMonth)) / Number(lastMonth)) * 100;

  return percent.toFixed(0);
};
