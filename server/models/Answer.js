/** @format */

const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
	category: { type: String, required: true, trim: true, lowercase: true },
	questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
	answer: { type: String, required: true, trim: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	date: { type: Date, required: true },
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
