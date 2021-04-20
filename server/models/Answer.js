/** @format */

const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
	question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
	answer: {
		type: String,
		required: true,
		trim: true,
		minLength: [5, "answer must be at least 10 characters"],
	},
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	created: { type: String, required: true },
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
