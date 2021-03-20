/** @format */

import mongodb from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pkg from "mongodb";
dotenv.config();

const { ObjectId } = pkg;
const { MongoClient } = mongodb;

const setConnection = async () => {
	const url = "mongodb://localhost:27017";
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client
		.connect()
		.then(console.log("Connected to Mongo drive."))
		.catch((err) => console.log(`Error with Mongo drive: ${err}`));
	return client;
};

const subjects = [
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
];

export const getRegistration = async (reg) => {
	const { user, password } = reg;
	const hashPwd = await bcrypt.hash(password, 10);
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const cursor = coll
		.find({ username: user })
		.project({ _id: 0, username: 1 });
	const result = await cursor.count();
	return new Promise((resolve, reject) => {
		if (result > 0) resolve(409);
		else resolve(registerUser(user, hashPwd));
	})
		.catch((err) => `error with getRegistration(): ${err}`)
		.finally(() => {
			client.close();
		});
};

const registerUser = async (user, pwd) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const doc = { username: user, password: pwd };
	const result = await coll.insertOne(doc);
	return new Promise((resolve, reject) => {
		if (result) resolve(201);
	})
		.catch((err) => `error with registerUser(): ${err}`)
		.finally(() => client.close());
};

export const getLogin = async (log) => {
	const { username, password } = log;
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const cursor = coll.find({ username: username });
	const arr = await cursor.toArray();
	return new Promise((resolve, reject) => {
		if (arr.length === 0) resolve(400);
		else {
			const pwd = arr[0].password;
			const id = arr[0]._id;
			bcrypt.compare(password, pwd, (error, result) => {
				if (result) {
					// create access token for user
					const user_info = {
						name: username,
						id: id,
					};
					const accessToken = jwt.sign(
						user_info,
						process.env.ACCESS_TOKEN_SECRET,
						{ expiresIn: 2000 }
					);
					resolve(accessToken);
				} else resolve(404);
			});
		}
	})
		.catch((err) => `error with getLogin(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const categoryInfo = async (category) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const result = subjects.includes(category)
		? coll.findOne({ category: category })
		: null;
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with categoryInfo(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const newQuestion = async (que) => {
	const { user, category, question } = que;
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const filter = { category: category };
	const date = new Date();
	const doc = {
		$push: {
			questions: {
				question_id: ObjectId(),
				question: question,
				submit_user: user,
				question_date: `${date.toDateString()} at ${date.toLocaleTimeString()}`,
				responses: [],
			},
		},
	};
	const result = subjects.includes(category)
		? await coll.updateOne(filter, doc)
		: null;
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with newQuestion(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const newAnswer = async (ans) => {
	const { user, id, answer } = ans;
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const filter = { "questions.question_id": ObjectId(id) };
	const date = new Date();
	const doc = {
		$push: {
			"questions.$.responses": {
				response_id: ObjectId(),
				response: answer,
				answer_user: user,
				response_date: `${date.toDateString()} at ${date.toLocaleTimeString()}`,
			},
		},
	};
	const result = coll.updateOne(filter, doc);
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with newAnswer(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const getPost = async (que) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const cursor = coll.aggregate([
		{ $unwind: "$questions" },
		{
			$match: { "questions.question_id": ObjectId(que) },
		},
		{ $project: { _id: 0, questions: 1 } },
	]);
	const result = await cursor.next();
	return new Promise((resolve, reject) => {
		resolve(result.questions);
	})
		.catch((err) => `error with getPost(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const updateQuestion = async (que, data) => {
	const { update, category } = data;
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const date = new Date();
	const filter = {
		category: category,
		"questions.question_id": ObjectId(que),
	};
	const result = await coll.updateOne(filter, {
		$set: {
			"questions.$.question": update,
			"questions.$.question_date": `${date.toDateString()} at ${date.toLocaleTimeString()}`,
		},
	});
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with updateQuestion(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const updateAnswer = async (ans, data) => {
	const { update, category } = data;
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const date = new Date();
	const result = await coll.updateOne(
		{ category: category },
		{
			$set: {
				"questions.$[].responses.$[r].response": update,
				"questions.$[].responses.$[r].response_date": `${date.toDateString()} at ${date.toLocaleTimeString()}`,
			},
		},
		{ arrayFilters: [{ "r.response_id": ObjectId(ans) }] }
	);
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with updateAnswer(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const deleteQuestion = async (category, id) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const result = await coll.updateOne(
		{ category: category },
		{ $pull: { questions: { question_id: ObjectId(id) } } }
	);
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with deleteQuestion(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const deleteAnswer = async (category, id) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("questions");
	const result = await coll.updateOne(
		{ category: category },
		{
			$pull: {
				"questions.$[].responses": {
					response_id: ObjectId(id),
				},
			},
		}
	);
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with deleteAnswer(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const checkName = async (name) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const cursor = coll.find({ username: name });
	const result = await cursor.count();
	return new Promise((resolve, reject) => {
		if (result > 0) resolve("not available");
		else resolve("ok");
	})
		.catch((err) => `error with checkName(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const updateUser = async (name) => {
	const { newName, oldName } = name;
	const client = await setConnection();
	const userColl = client.db("nodejs").collection("users");
	const questionColl = client.db("nodejs").collection("questions");
	const updateUsername = await userColl.updateOne(
		{ username: oldName },
		{ $set: { username: newName } }
	);
	// update questions submitted by user
	const updateQuestions = await questionColl.updateMany(
		{},
		{ $set: { "questions.$[q].submit_user": newName } },
		{ arrayFilters: [{ "q.submit_user": oldName }] }
	);
	// update answers submitted by user
	const updateAnswers = await questionColl.updateMany(
		{},
		{ $set: { "questions.$[].responses.$[r].answer_user": newName } },
		{ arrayFilters: [{ "r.answer_user": oldName }] }
	);
	Promise.all([updateUsername, updateQuestions, updateAnswers])
		.catch((err) => `error with updateUser(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const updatePwd = async (pwd) => {
	const { oldPwd, newPwd, user } = pwd;
	const newHashPwd = await bcrypt.hash(newPwd, 10);
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const cursor = coll.find({ username: user }).project({ _id: 0, password: 1 });
	const result = await cursor.next();
	return new Promise((resolve, reject) => {
		const dbPwd = result.password;
		bcrypt.compare(oldPwd, dbPwd, (error, result) => {
			if (error) throw error;
			else {
				if (!result) resolve("wrong password");
				else resolve(setNewPwd(user, newHashPwd));
			}
		});
	})
		.catch((err) => `error with updatePwd(): ${err}`)
		.finally(() => {
			client.close();
		});
};

const setNewPwd = async (user, pwd) => {
	const client = await setConnection();
	const coll = client.db("nodejs").collection("users");
	const result = coll.updateOne(
		{ username: user },
		{ $set: { password: pwd } }
	);
	return new Promise((resolve, reject) => {
		resolve(result);
	})
		.catch((err) => `error with setNewPwd(): ${err}`)
		.finally(() => {
			client.close();
		});
};

export const deleteUser = async (user) => {
	const client = await setConnection();
	const userColl = client.db("nodejs").collection("users");
	const questionColl = client.db("nodejs").collection("questions");
	//  delete user
	const deleteUsername = await userColl.deleteOne({ username: user });
	// delete questions submitted by user
	const deleteQuestions = await questionColl.updateMany(
		{},
		{ $pull: { questions: { submit_user: user } } }
	);
	// delete answers submitted by user
	const deleteAnswers = await questionColl.updateMany(
		{},
		{
			$pull: {
				"questions.$[].responses": {
					answer_user: user,
				},
			},
		}
	);
	Promise.all([deleteUsername, deleteQuestions, deleteAnswers])
		.then(console.log(`user account, ${user}, has been deleted.`))
		.catch((err) => `error with deleteUser(): ${err}`)
		.finally(() => {
			client.close();
		});
};
