/** @format */

import mysql from 'mysql';
import config from './config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const setConnection = async () => {
	const conn = mysql.createConnection(config);
	conn.connect((err) => {
		if (err) {
			return console.error('error: ' + err.message);
		}
		console.log('Connected to the MySQL server.');
	});
	return conn;
};

const subjects = [
	'algebra',
	'arithmetic',
	'calculus',
	'differential',
	'discrete',
	'geometry',
	'logic',
	'number',
	'statistics',
	'trigonometry',
];

export const categoryInfo = async (category) => {
	const conn = await setConnection();
	const sql = `SELECT username, question_id, new_question, answers, DATE_FORMAT(question_date, "%b %e '%y at %l:%i %p") AS date FROM (SELECT question AS new_question, COUNT(response) AS answers FROM Questions LEFT JOIN Responses USING (question_id) WHERE category= ? GROUP BY question) dream INNER JOIN Questions ON dream.new_question = Questions.question INNER JOIN Users USING (user_id)`;
	return new Promise((resolve, reject) => {
		if (subjects.includes(category)) {
			conn.query(sql, [category], (err, rows) => {
				if (err) throw err;
				resolve(rows);
			});
		}
	})
		.catch((err) => `error with categoryInfo(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const newQuestion = async (que) => {
	const conn = await setConnection();
	const sql = `INSERT INTO Questions(user_id, category, question) VALUES(?, ?, ?)`;
	const { user, category, question } = que;
	return new Promise((resolve, reject) => {
		if (subjects.includes(category)) {
			conn.query(sql, [user, category, question], (err, result) => {
				if (err) throw err;
				resolve(1);
			});
		}
	})
		.catch((err) => `error with newQuestion(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const newAnswer = async (ans) => {
	const conn = await setConnection();
	const sql = `INSERT INTO Responses(user_id, question_id, response) VALUES(?, ?, ?) `;
	const { user, id, answer } = ans;
	return new Promise((resolve, reject) => {
		conn.query(sql, [user, id, answer], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with newAnswer(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const getPost = async (que) => {
	const conn = await setConnection();
	const sql = `SELECT submit_user, question_id, question, question_date, answer_user, response_id, response, response_date FROM (SELECT question_id, username AS submit_user, question, DATE_FORMAT(question_date,"%b %e '%y at %l:%i %p") AS question_date FROM Questions INNER JOIN Users USING (user_id) WHERE question_id = ?) AS user_question LEFT JOIN (SELECT question_id, username AS answer_user, id AS response_id, response, DATE_FORMAT(response_date, "%b %e '%y at %l:%i %p") AS response_date FROM Responses INNER JOIN Users USING (user_id) WHERE question_id = ?) AS answers USING (question_id);`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [que, que], (err, rows) => {
			if (err) throw err;
			resolve(rows);
		});
	})
		.catch((err) => `error with getPost(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const updateQuestion = async (que, data) => {
	const conn = await setConnection();
	const sql = `UPDATE Questions SET question = ? WHERE question_id = ?`;
	const { update } = data;
	return new Promise((resolve, reject) => {
		conn.query(sql, [update, que], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with updateQuestion(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const updateAnswer = async (ans, data) => {
	const conn = await setConnection();
	const sql = `UPDATE Responses SET response = ? WHERE id = ?`;
	const { update } = data;
	return new Promise((resolve, reject) => {
		conn.query(sql, [update, ans], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with updateAnswer(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const deleteQuestion = async (que) => {
	const conn = await setConnection();
	const sql = `DELETE FROM Questions WHERE question_id = ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [que], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with deleteQuestion(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const deleteAnswer = async (ans) => {
	const conn = await setConnection();
	const sql = `DELETE FROM Responses WHERE id = ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [ans], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with deleteAnswer(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const getRegistration = async (reg) => {
	const conn = await setConnection();
	const { user, password } = reg;
	const hashPwd = await bcrypt.hash(password, 10);
	const new_user = user.toLowerCase();
	const check_name = `SELECT username FROM Users WHERE username LIKE ?`;
	return new Promise((resolve, reject) => {
		conn.query(check_name, [user], (err, row) => {
			if (err) throw err;
			else {
				if (row.length > 0) resolve(409);
				else resolve(registerUser(new_user, hashPwd));
			}
		});
	})
		.catch((err) => `error with getRegistration(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

const registerUser = async (user, pwd) => {
	const conn = await setConnection();
	const insert = `INSERT INTO Users (username, password) VALUES(?,?)`;
	return new Promise((resolve, reject) => {
		conn.query(insert, [user, pwd], (err, row) => {
			if (err) throw err;
			else {
				console.log('New user id: ' + row.insertId);
				resolve(201);
			}
		});
	})
		.catch((err) => `error with registerUser(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const getLogin = async (log) => {
	const conn = await setConnection();
	const { username, password } = log;
	const sql = `SELECT * FROM Users WHERE username LIKE ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [username], (err, row) => {
			if (err) throw err;
			else {
				if (row.length === 0) resolve(400);
				else {
					const pwd = row[0].password;
					const id = row[0].user_id;
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
								{ expiresIn: 1500 }
							);
							resolve(accessToken);
						} else resolve(404);
					});
				}
			}
		});
	})
		.catch((err) => `error with getLogin(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const checkName = async (name) => {
	const conn = await setConnection();
	const sql = `SELECT username FROM Users WHERE username LIKE ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [name], (err, result) => {
			if (err) throw err;
			else {
				if (result.length === 1) resolve('not available');
				else resolve('ok');
			}
		});
	})
		.catch((err) => `error with checkName(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const updateUser = async (name) => {
	const conn = await setConnection();
	const { new_name, old_name } = name;
	const sql = `UPDATE Users SET username = ? WHERE username = ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [new_name, old_name], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with updateUser(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const updatePwd = async (pwd) => {
	const conn = await setConnection();
	const { old_pwd, new_pwd, user } = pwd;
	const pwd_query = `SELECT password FROM Users WHERE username = ?`;
	const new_hashPwd = await bcrypt.hash(new_pwd, 10);
	return new Promise((resolve, reject) => {
		conn.query(pwd_query, [user], (err, row) => {
			const db_pwd = row[0].password;
			if (err) throw err;
			else {
				bcrypt.compare(old_pwd, db_pwd, (error, result) => {
					if (error) throw error;
					else {
						if (!result) resolve(0);
						resolve(setNewPwd(user, new_hashPwd));
					}
				});
			}
		});
	})
		.catch((err) => `error with updatePwd(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

const setNewPwd = async (user, pwd) => {
	const conn = await setConnection();
	const update = `UPDATE Users SET password = ? WHERE username = ?`;
	return new Promise((resolve, reject) => {
		conn.query(update, [pwd, user], (err, result) => {
			resolve(1);
		});
	})
		.catch((err) => `error with setNewPwd(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};

export const deleteUser = async (user) => {
	const conn = await setConnection();
	const sql = `DELETE FROM Users WHERE username = ?`;
	return new Promise((resolve, reject) => {
		conn.query(sql, [user], (err, result) => {
			if (err) throw err;
			resolve(1);
		});
	})
		.catch((err) => `error with deleteUser(): ${err}`)
		.finally(() => {
			if (conn) conn.end();
		});
};
