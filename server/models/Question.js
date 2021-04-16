/** @format */

const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema({
	category: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		enum: [
			"algebra",
			"arithmetic",
			"calculus",
			"differential",
			"discrete",
			"geometry",
			"logic",
			"number",
			"statistics",
			"trigonometry",
		],
	},
	question: { type: String, required: true, trim: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date, required: true },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
