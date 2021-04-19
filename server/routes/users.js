/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const validateRegistration = require("../validation/registration");
const validateLogin = require("../validation/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/authentication");

const getRegistration = (req, res) => {
	const { name, email, password } = req.body;
	const { errors, isValid } = validateRegistration(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ username: name })
		.then((user) => {
			if (user) {
				return res.status(409).json({ userExist: "username already in use" });
			} else {
				User.findOne({ email }, "email")
					.then((user) => {
						if (user) {
							return res
								.status(409)
								.json({ emailExist: "email already in use" });
						} else {
							bcrypt.hash(password, 10, (err, hashPwd) => {
								if (err) throw err;
								const newUser = new User({
									username: name,
									email,
									password: hashPwd,
								});
								newUser
									.save()
									.then((user) => {
										const userInfo = { id: user._id, name: user.username };
										// create access token
										const token = jwt.sign(
											userInfo,
											process.env.ACCESS_TOKEN_SECRET,
											{ expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
										);
										res.cookie("token", token, {
											httpOnly: true,
											maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000,
											secure: process.env.NODE_ENV === "production",
											sameSite: "strict",
										});
										res.status(201).json({ user: { ...userInfo } });
									})
									.catch((err) => {
										res.status(502).json({ error: err.message });
									});
							});
						}
					})
					.catch((err) => {
						res.status(502).json({ error: err.message });
					});
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err.message });
		});
};

const getLogin = (req, res) => {
	const { text, password } = req.body;
	const { errors, isValid } = validateLogin(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.find({ $or: [{ username: text }, { email: text }] })
		.select("username password email")
		.then((user) => {
			if (!user.length) {
				return res
					.status(404)
					.json({ text: "username or email does not exist" });
			} else {
				const userPwd = user[0].password;
				bcrypt.compare(password, userPwd, (error, match) => {
					if (match) {
						const userInfo = { id: user[0]._id, name: user[0].username };
						// create access token
						const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
						// create cookies
						res.cookie("token", token, {
							httpOnly: true,
							maxAge: process.env.ACCESS_TOKEN_EXPIRATION * 1000,
							secure: process.env.NODE_ENV === "production",
							sameSite: "strict",
						});
						res.status(200).json({ user: { ...userInfo } });
					} else {
						return res.status(404).json({ password: "wrong password" });
					}
				});
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err.message });
		});
};

const checkName = (req, res) => {
	const { newName } = req.body;
	User.findOne({ username: newName })
		.select("username")
		.then((user) => {
			if (user) {
				return res.send("not available");
			} else {
				return res.send("ok");
			}
		});
};

const checkEmail = (req, res) => {
	const { email } = req.body;
	User.findOne({ email: email })
		.select("email")
		.then((user) => {
			if (user) {
				return res.send("not available");
			} else {
				return res.send("ok");
			}
		});
};

const updateUserName = (req, res) => {
	const { name } = req.body;
	const user = response.locals.user;
	user.username = name;
	user
		.save()
		.then((updatedUser) => {
			const { _id, username, email } = updatedUser;
			res.json({
				success: "username updated",
				user: { id: _id, username, email },
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err.message });
		});
};

const updateEmail = (req, res) => {
	const { email } = req.body;
	const user = res.locals.user;
	user.email = email;
	user
		.save()
		.then((updatedUser) => {
			const { _id, username, email } = updatedUser;
			res.status(200).json({
				success: "email updated",
				user: { id: _id, username, email },
			});
		})
		.catch((err) => {
			res.status(400).json({ error: err.message });
		});
};

const updatePassword = (req, res) => {
	const { oldPwd, newPwd } = req.body;
	const user = res.locals.user;
	bcrypt.compare(oldPwd, user.password, (error, match) => {
		if (error) throw error;
		else {
			if (match) {
				bcrypt.hash(newPwd, 10, (err, hashPwd) => {
					if (err) throw err;
					user.password = hashPwd;
					user
						.save()
						.then(() => {
							return res.status(200);
						})
						.catch((err) => {
							throw err;
						});
				});
			}
			return res.status(400).send("wrong password");
		}
	});
};

const deleteUser = async (req, res) => {
	const userId = res.locals.user._id;
	//  delete user
	const removeUser = await User.findByIdAndDelete(userId);
	// delete questions submitted by user
	const removeQuestions = await Question.deleteMany({ user: userId });
	// delete answers submitted by user
	const removeAnswers = await Answer.deleteMany({ user: userId });
	Promise.all([removeUser, removeQuestions, removeAnswers])
		.then(() => {
			logout();
		})
		.catch((err) => {
			console.error(err.message);
		});
};

const logout = (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});
	res.redirect("/");
};

const authorized = (req, res) => {
	const { _id, username } = res.locals.user;
	return res.json({ user: { id: _id, name: username } });
};

router.post("/register", getRegistration);
router.post("/login", getLogin);
router.get("/check/name", auth, checkName);
router.get("/check/email", auth, checkEmail);
router.put("/update/user", auth, updateUserName);
router.put("/update/email", auth, updateEmail);
router.put("/update/password", auth, updatePassword);
router.delete("/delete/user", auth, deleteUser);
router.get("/logout", logout);
router.get("/token", auth, authorized);

module.exports = router;
