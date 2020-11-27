import express from "express";
import Products from "../models/product.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
	const { price } = await Products.findById(req.params.id);
	console.log(price);
});



export default router;
