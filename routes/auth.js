import express from "express";
import bcrypt from "bcrypt";
import joi from "joi";
import passwordValidator from "password-validator";

import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const validationResult = validate(req.body);
	if (validationResult !== true) return res.status(400).send(validationResult);

	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(404).send("theres no user with this email address");

	const result = await bcrypt.compare(req.body.password, user.password);
	if (!result) return res.status(400).send("wrong password");

	const token = user.tokenGenerator();
	return res.status(200).header("x-auth-token", token).send("logged in");
});

function validate(body) {
	const joiSschema = joi.object({
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
