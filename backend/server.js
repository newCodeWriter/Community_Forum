/** @format */

import express from 'express';
import bodyParser from 'body-parser';
import {
	categoryInfo,
	getPost,
	newAnswer,
	newQuestion,
	updateQuestion,
	updateAnswer,
	deleteQuestion,
	deleteAnswer,
	getRegistration,
	getLogin,
	checkName,
	updateUser,
	updatePwd,
	deleteUser,
} from './db.js';

const port = 5000;
const app = express();

app.use(express.json()); // so that application can accept JSON
app.use(bodyParser.urlencoded({ extended: true })); //use body-parser as middleware to process form data sent in the body of a POST request

app.get('/category/:category', async (req, res) => {
	const data = await categoryInfo(req.params.category);
	res.send(data);
});

app.post('/question', async (req, res) => {
	const data = await newQuestion(req.body);
	res.send(data);
});

app.post('/answer', async (req, res) => {
	const data = await newAnswer(req.body);
	res.send(data);
});

app.get('/post/:questionId', async (req, res) => {
	const data = await getPost(req.params.questionId);
	res.send(data);
});

app.put('/update/question/:questionId', async (req, res) => {
	const data = await updateQuestion(req.params.questionId, req.body);
	res.send(data);
});

app.put('/update/answer/:answerId', async (req, res) => {
	const data = await updateAnswer(req.params.answerId, req.body);
	res.send(data);
});

app.delete('/delete/question/:questionId', async (req, res) => {
	const data = await deleteQuestion(req.params.questionId);
	res.send(data);
});

app.delete('/delete/answer/:answerId', async (req, res) => {
	const data = await deleteAnswer(req.params.answerId);
	res.send(data);
});

app.post('/register', async (req, res) => {
	const data = await getRegistration(req.body);
	res.sendStatus(data);
});

app.post('/login', async (req, res) => {
	const data = await getLogin(req.body);
	if (data === 400 || data === 404) res.sendStatus(data);
	else res.json({ accessToken: data });
});

app.get('/check/:newName', async (req, res) => {
	const data = await checkName(req.params.newName);
	res.send(data);
});

app.put('/update/user', async (req, res) => {
	const data = await updateUser(req.body);
	res.send(data);
});

app.put('/update/password', async (req, res) => {
	const data = await updatePwd(req.body);
	if (data === 1) {
		res.send('password changed');
	} else res.send('wrong password');
});

app.delete('/delete/:user', async (req, res) => {
	const data = await deleteUser(req.params.user);
	if (data === 1)
		console.log(`User account, ${req.params.user}, has been deleted`);
});

app.listen(port, () => {
	console.log('Express app listening on port ' + port);
});
