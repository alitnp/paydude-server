import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user.js";

export default async function (req, res, next) {
	const decode = jwt.verify(
		req.header("x-auth-token"),
		config.get("jwtsecret")
	);
	const user = await User.findById(decode._id);

	if (!user.isAdmin) return res.status(403).send("unauthorized");

	next();
}
