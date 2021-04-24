/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const auth = require("../middleware/authentication");

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
			user.answers.push(answer._id);
			user.save();
			question.answers.push(answer._id);
			question.save();
			res.status(200).end();
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
		.then(() => {
			res.status(200).end();
		})
		.catch((err) => {
			console.error(err.message);
		});
};

const deleteAnswer = async (req, res) => {
	const { id } = req.params;
	Answer.findByIdAndDelete(id)
		.then(() => {
			res.json({ success: "answer deleted" });
		})
		.catch((err) => {
			console.error(err.message);
		});
};

router.post("/answer", auth, newAnswer);

router.put("/update/answer/:answerId", auth, updateAnswer);

router.delete("/delete/answer/:id", auth, deleteAnswer);

module.exports = router;
