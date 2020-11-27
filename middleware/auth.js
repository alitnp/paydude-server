import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user.js";

export default async function (req, res, next) {
	if (!req.header("x-auth-token")) return res.status(401).send("login first");

	const decode = jwt.verify(
		req.header("x-auth-token"),
		config.get("jwtsecret")
	);
	const user = await User.findById(decode._id);

	if (!user) return res.status(401).send("login first");

	next();
}
