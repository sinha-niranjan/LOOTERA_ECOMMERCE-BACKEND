import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody, SearchRequestQuery } from "../types/type.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityClass.js";
import { rm } from "fs";

// Create new product  -------------------------------------------------------------------------------------------------------------------------------------------------

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

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
  }
);

// get latest created products  -------------------------------------------------------------------------------------------------------------------------------------------------

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

// get all categories of products  -------------------------------------------------------------------------------------------------------------------------------------------------

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------------------

export const getAdminProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({});

  return res.status(200).json({
    success: true,
    products,
  });
});

// Get product by id  -------------------------------------------------------------------------------------------------------------------------------------------------

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  return res.status(200).json({
    success: true,
    product,
  });
});

// Update product by id ----------------------------------------------------------------------------------------------------------------------------------------------------

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid product Id", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old photo Deleted");
    });
    product.photo = photo?.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully ",
  });
});

// delete product by id  ------------------------------------------------------------------------------------------------------------------------------------------------------

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Invalid product Id", 404));

  rm(product.photo!, () => {
    console.log("Product photo deleted !");
  });

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully ",
  });
});

// Admin all products  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, catrgory, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = process.env.PRODUCT_PER_PAGE;

    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  }
);
