import { singleUpload } from "./../middlewares/multer.js";
import express from "express";
// CONTROLLERS ----------------------------------------------------------------------------------------------
import { deleteProduct, getAdminProducts, getAllCategories, getLatestProduct, getSingleProduct, newProduct, updateProduct, } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// Create New Product - /api/v1/product/new -----------------------------------------------------------------------------
app.post("/new", adminOnly, singleUpload, newProduct);
// To get last 5 products - /api/v1/product/latest ----------------------------------------------------------------------
app.get("/latest", getLatestProduct);
// To get all unique Catrgories - api/v1/product/categories ---------------------------------------------------------------
app.get("/categories", getAllCategories);
// To get all Products - /api/v1/product/admin/products ------------------------------------------------------------------
app.get("/admin/products", adminOnly, getAdminProducts);
app
    .route("/:id")
    .get(getSingleProduct)
    .put(singleUpload, updateProduct)
    .delete(deleteProduct);
export default app;
