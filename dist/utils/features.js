import mongoose from "mongoose";
import { myCache } from "../index.js";
import { Product } from "../models/product.js";
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "Ecommerce_typescript" })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const invalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latestProducts",
            "categories",
            "allProducts",
        ];
        if (typeof productId === "string")
            productKeys.push(`product${productId}`);
        if (typeof productId === "object") {
            productId?.forEach((i) => {
                productKeys.push(`product${i}`);
            });
        }
        myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "allOrders",
            `myOrders${userId}`,
            `order${orderId}`,
        ];
        myCache.del(ordersKeys);
    }
    if (admin) {
        myCache.del([
            "adminStats",
            "adminPieCharts",
            "adminBarCharts",
            "adminLineCharts",
        ]);
    }
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product  not Found !");
        product.stock -= order.quantity;
        await product.save();
    }
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return Number(thisMonth) * 100;
    const percent = (Number(thisMonth) / Number(lastMonth)) * 100;
    return Number(percent.toFixed(0));
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromises = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromises);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property] : 1;
        }
    });
    return data;
};
