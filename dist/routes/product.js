import { singleUpload } from "./../middlewares/multer.js";
import express from "express";
// CONTROLLERS ----------------------------------------------------------------------------------------------
import { newProduct } from "../controllers/product.js";
const app = express.Router();
app.post("/new", singleUpload, newProduct);
export default app;
