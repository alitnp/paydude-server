import express from "express";

import { rates } from "../models/currency.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const ratesList = await rates();

	res.send("ok");
});

export default router;
