import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	price: { type: Number },
	url: { type: String },
	detail: { type: String },
	time: { type: Date, default: Date.now() },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
