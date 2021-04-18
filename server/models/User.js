/** @format */

const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const { Schema } = mongoose;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "username field is required"],
		trim: true,
		lowercase: true,
		minLength: [4, "username must be at least 4 characters"],
	},
	email: {
		type: String,
		required: [true, "email field is required"],
		trim: true,
		lowercase: true,
		validate: [
			validate({
				validator: "isEmail",
				message: "email is invalid",
			}),
		],
	},
	password: {
		type: String,
		required: [true, "password field is required"],
		trim: true,
	},
	questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
	responses: [{ type: Schema.Types.ObjectId, ref: "Answer" }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
