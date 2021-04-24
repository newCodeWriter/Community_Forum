/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const auth = require("../middleware/authentication");

const categoryInfo = (req, res) => {
	const { category } = req.params;
	Question.find({ category: category })
		.populate({ path: "user", select: "username -_id" })
		.then((questions) => {
			res.status(200).send(questions);
		})
		.catch((err) => {
			throw err;
		});
};

const newQuestion = async (req, res) => {
	const { userId, category, question } = req.body;
	const date = new Date();
	const user = await User.findById(userId);
	const addQuestion = new Question({
		category: category,
		question: question,
		user: user._id,
		created: `${date.toDateString()} at ${date.toLocaleTimeString()}`,
	});
	if (!question.endsWith("?")) {
		return res.status(401).send("not a valid question");
	}
	addQuestion
		.save()
		.then(() => {
			user.questions.push(addQuestion._id);
			user.save()
			res.status(200).end();
		})
		.catch((err) => {
			throw err;
		});
};

const getPost = (req, res) => {
	const { questionId } = req.params;
	Question.findOne({ _id: questionId })
		.populate({ path: "user", select: "username -_id" })
		.populate({
			path: "answers",
			populate: { path: "user", select: "username -_id" },
		})
		.then((post) => {
			res.status(200).send(post);
		})
		.catch((err) => {
			throw err;
		});
};

const updateQuestion = async (req, res) => {
	const { questionId } = req.params;
	const { update } = req.body;
	const date = new Date();
	const question = await Question.findById(questionId);
	question.question = update;
	question.created = `${date.toDateString()} at ${date.toLocaleTimeString()}`;
	question
		.save()
		.then((updatedQuestion) => {
			const { question, user, created } = updatedQuestion;
			res.status(200).json({ question, user, created });
		})
		.catch((err) => {
			throw err;
		});
};

const deleteQuestion = (req, res) => {
	const { id } = req.params;
	Question.findByIdAndDelete(id)
		.then(() => {
			Answer.deleteMany({ question: id })
				.then(() => {
					res.json({ success: "question deleted" });
				})
				.catch((err) => {
					console.error(err);
				});
		})
		.catch((err) => {
			throw err;
		});
};

router.get("/category/:category", auth, categoryInfo);

router.get("/post/:questionId", auth, getPost);

router.post("/question", auth, newQuestion);

router.put("/update/question/:questionId", auth, updateQuestion);

router.delete("/delete/question/:id", auth, deleteQuestion);

module.exports = router;
