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
	created: { type: String, required: true },
	answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
