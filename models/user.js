import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
	username: { type: String, required: true, min: 4, max: 25 },
	phoneNumber:{type:Number,required:true},
	email: { type: String, required: true },
	password: { type: String, required: true, min: 8, max: 250 },
	isAdmin: { type: Boolean, default: false },
});

userSchema.methods.tokenGenerator = function () {
	return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, "1qazXSW@");
};


const User = mongoose.model("User", userSchema);

export default User;
