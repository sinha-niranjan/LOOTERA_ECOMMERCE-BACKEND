import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/type.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityClass.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

// get latest created products  -------------------------------------------------------------------------------------------------------------------------------------------------
// Revalidate on New, Update ,Delete Product  && on New Order -------------------------------------------------------------------------------------------------------------------------------------

export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("latestProducts"))
    products = JSON.parse(myCache.get("latestProducts") as string);
  else {
    products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .limit(5);
    myCache.set("latestProducts", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// get all categories of products  -------------------------------------------------------------------------------------------------------------------------------------------------
// Revalidate on New, Update ,Delete Product  && on New Order -------------------------------------------------------------------------------------------------------------------------------------

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// get all products for admin route -------------------------------------------------------------------------------------------------------------------------------------------------
// Revalidate on New, Update ,Delete Product  && on New Order -------------------------------------------------------------------------------------------------------------------------------------

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("allProducts"))
    products = JSON.parse(myCache.get("allProducts") as string);
  else {
    products = await Product.find({});
    myCache.set("allProducts", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// Get product by id  -------------------------------------------------------------------------------------------------------------------------------------------------

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product${id}`)) {
    product = JSON.parse(myCache.get(`product${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    myCache.set(`product${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

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

    await invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully ",
    });
  }
);

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
  await invalidateCache({ product: true, productId: String(product._id) });

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
  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully ",
  });
});

// Admin all products  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (search) baseQuery.name = { $regex: search, $options: "i" };

    if (price) baseQuery.price = { $lte: Number(price) };

    if (category) baseQuery.category = category;

    const [products, filteredOnlyProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);
    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// For generate fake products -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\cf7f8f1e-acb0-458d-ba19-1fc3b2635a86.jpeg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ success: true });
// };

// generateRandomProducts(40);

// for delete Random products -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const deleteRandomProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ success: true });
// };

// deleteRandomProducts(2);
