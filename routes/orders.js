import express from "express";
import Order from "../models/order.js";
import joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const result = validate(req.body);
	if (result !== true) return res.status(400).send(result);

	const token = req.header("x-auth-token");
	if (!token) return res.status(401).send("login first");

	const decode = jwt.verify(token, config.get("jwtsecret"));

	const user = await User.findById(decode._id);
	if (!user) return res.status(401).send("wrong token");

	const order = new Order({
		product: req.body.productId,
		user: decode._id,
		price: req.body.price || "",
		url: req.body.url || "",
		detail: req.body.detail || "",
	});
	const { _id } = await order.save();
	console.log(await Order.findById(_id).populate("product user"));
});

function validate(body) {
	const joiSschema = joi.object({
		productId: joi.string().alphanum().min(24).max(24).required(),
	});
	const result = joiSschema.validate(body, { abortEarly: false });

	if (result.error) return result.error.details[0].message;

	return true;
}

export default router;
