import express from "express";
import mongoose from "mongoose";

import homePage from "./routes/homePage.js";
import users from "./routes/users.js";
import auth from "./routes/auth.js";
import orders from "./routes/orders.js";
import products from "./routes/products.js";
import currencies from "./routes/currencies.js";

mongoose
	.connect("mongodb://localhost/paydude", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("connected to paydude database"))
	.catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use("/", homePage);
app.use("/api/users/", users);
app.use("/api/auth/", auth);
app.use("/api/products/", products);
app.use("/api/currencies/", currencies);
app.use("/api/orders", orders);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
