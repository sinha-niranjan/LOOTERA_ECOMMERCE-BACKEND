import { singleUpload } from "./../middlewares/multer.js";
import express from "express";

// CONTROLLERS ----------------------------------------------------------------------------------------------

import { getLatestProduct, newProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);

app.get("/latest",getLatestProduct)

export default app;
