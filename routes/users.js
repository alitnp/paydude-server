import express from "express";
import jwt from "jsonwebtoken";
import config from "config";
import joi from "joi";
import passwordValidator from "password-validator";
import bcrypt from "bcrypt";

import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const validationResult = validate(req.body);
	if (validationResult !== true) return res.status(400).send(validationResult);

	const repeatedUser = await User.findOne({ email: req.body.email });
	if (repeatedUser)
		return res
			.status(400)
			.send("we already have a user with this email address");

	const user = new User(req.body);

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	const token = user.tokenGenerator();
	const result = await user.save();
	res.status(200).header("x-auth-token", token).send(result._id);
});

router.get("/", async (req, res) => {
	const token = req.header("x-auth-token");
	if (!token) return res.status(400).send("no token provided");

	try {
		const decode = jwt.verify(token, config.get("jwtsecret"));
		req.body.user = decode;
	} catch (error) {
		console.log(error);
	}

	if (!req.body.user.isAdmin) {
		return res.status(403).send("only admin users can access users list");
	}

	const users = await User.find();
	return res.status(200).send(users);
});

function validate(body) {
	const joiSschema = joi.object({
		username: joi.string().alphanum().min(4).max(24).required(),
		phoneNumber: joi.number().min(10).required(),
		email: joi.string().email().required(),
		password: joi.string(),
	});
	const result = joiSschema.validate(body, { abortEarly: false });

	if (result.error) return result.error.details[0].message;

	const passSchema = new passwordValidator();

	passSchema.is().min(8).is().max(100).has().uppercase().has().digits();

	if (passSchema.validate(body.password)) return true;

	return "password should be at least 8 characters and have one Uppercase letter and a digit.";
}

export default router;
