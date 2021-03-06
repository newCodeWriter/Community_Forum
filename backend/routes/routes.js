/** @format */

import express from 'express';
import {
	getRegistration,
	getLogin,
	newQuestion,
	updateQuestion,
	deleteQuestion,
	newAnswer,
	updateAnswer,
	deleteAnswer,
	checkName,
	updateUser,
	updatePwd,
	deleteUser,
	categoryInfo,
	getPost,
} from '../mongo.js';
const router = express.Router();

router.get('/category/:category', async (req, res) => {
	const data = await categoryInfo(req.params.category);
	res.send(data.questions);
});

router.post('/question', async (req, res) => {
	const data = await newQuestion(req.body);
	res.send(data);
});

router.post('/answer', async (req, res) => {
	const data = await newAnswer(req.body);
	res.send(data);
});

router.get('/post/:questionId', async (req, res) => {
	const data = await getPost(req.params.questionId);
	res.send(data);
});

router.put('/update/question/:questionId', async (req, res) => {
	const data = await updateQuestion(req.params.questionId, req.body);
	res.send(data);
});

router.put('/update/answer/:answerId', async (req, res) => {
	const data = await updateAnswer(req.params.answerId, req.body);
	res.send(data);
});

router.delete('/delete/question/:category/:id', async (req, res) => {
	const data = await deleteQuestion(req.params.category, req.params.id);
	res.send(data);
});

router.delete('/delete/answer/:category/:id', async (req, res) => {
	const data = await deleteAnswer(req.params.category, req.params.id);
	res.send(data);
});

router.post('/register', async (req, res) => {
	const data = await getRegistration(req.body);
	res.sendStatus(data);
});

router.post('/login', async (req, res) => {
	const data = await getLogin(req.body);
	if (data === 400 || data === 404) res.sendStatus(data);
	else res.json({ accessToken: data });
});

router.get('/check/:newName', async (req, res) => {
	const data = await checkName(req.params.newName);
	res.send(data);
});

router.put('/update/user', async (req, res) => {
	await updateUser(req.body);
});

router.put('/update/password', async (req, res) => {
	const data = await updatePwd(req.body);
	res.send(data);
});

router.delete('/delete/:user', async (req, res) => {
	await deleteUser(req.params.user);
});

export { router };
