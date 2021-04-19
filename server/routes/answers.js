/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const newAnswer = async (req, res) => {
	const { userId, questionId, answer } = req.body;
	const date = new Date();
	const user = await User.findById(userId);
	const question = await Question.findById(questionId);
	const addAnswer = new Answer({
		question: question._id,
		answer: answer,
		user: user._id,
		created: `${date.toDateString()} at ${date.toLocaleTimeString()}`,
	});
	addAnswer
		.save()
		.then((answer) => {
			user.responses.push(addAnswer._id);
			res.status(200).send(
				answer
					.populate({
						path: "user",
						select: "username -_id",
					})
					.execPopulate()
			);
		})
		.catch((err) => {
			throw err;
		});
};

const updateAnswer = async (req, res) => {
	const { answerId } = req.params;
	const { update } = req.body;
	const date = new Date();
	const answer = await Answer.findById(answerId);
	answer.answer = update;
	answer.created = `${date.toDateString()} at ${date.toLocaleTimeString()}`;
	answer
		.save()
		.then((updatedAnswer) => {
			res
				.status(200)
				.send(
					updatedAnswer
						.populate({ path: "user", select: "username -_id" })
						.execPopulate()
				);
		})
		.catch((err) => {
			throw err;
		});
};

const deleteAnswer = async (req, res) => {
	const { id } = req.params;
	Answer
		.findByIdAndDelete(id)
		.then(() => {
			res.json({ success: "answer deleted" });
		})
		.catch((err) => {
			console.error(err.message);
		});
};

router.post("/answer", newAnswer);

router.put("/update/answer/:answerId", updateAnswer);

router.delete("/delete/answer/:id", deleteAnswer);

module.exports = router;
