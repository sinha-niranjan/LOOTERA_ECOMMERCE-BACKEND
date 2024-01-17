import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityClass.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add Photo", 400));
    if (!name || !price || !category || !stock) {
        rm(photo?.path, () => console.log("Deleted"));
        return next(new ErrorHandler("Please enter all Fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category?.toLowerCase(),
        photo: photo?.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product Created Successfully ",
    });
});
export const getLatestProduct = TryCatch(async (req, res, next) => {
    const products = await Product.find({})
        .sort({
        createdAt: -1,
    })
        .limit(5);
    return res.status(200).json({
        success: true,
        products,
    });
});
