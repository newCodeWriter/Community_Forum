/** @format */

const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const questionModel = require("../models/Question");
const answerModel = require("../models/Answer");
const validateRegistration = require("../validation/registration");
const validateLogin = require("../validation/login");

const getRegistration = (req, res) => {
	const { name, email, password } = req.body;
	const { errors, isValid } = validateRegistration(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	userModel
		.findOne({ username: name })
		.then((user) => {
			if (user) {
				return res.status(400).json({ name: "name already in use" });
			} else {
				userModel
					.findOne({ email: email }, "email")
					.then((user) => {
						if (user) {
							return res.status(400).json({ email: "email already in use" });
						} else {
							bcrypt.hash(password, 10, (err, hashPwd) => {
								if (err) throw err;
								const newUser = new userModel({
									username: name,
									email: email,
									password: hashPwd,
								});
								newUser.save();
								return res.status(200).json({ status: "success" });
							});
						}
					})
					.catch((err) => {
						res.status(400).json({ message: err.message });
					});
			}
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
};

const getLogin = (req, res) => {
	const { text, password } = req.body;
	const { errors, isValid } = validateLogin(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	userModel
		.find({ $or: [{ username: text }, { email: text }] })
		.select("username password")
		.then((user) => {
			if (!user.length) {
				return res
					.status(400)
					.json({ error: "username or email does not exist" });
			} else {
				const userId = user[0]._id;
				const userName = user[0].username;
				const userPwd = user[0].password;
				bcrypt.compare(password, userPwd, (error, match) => {
					if (match) {
						// create access token for user
						const userInfo = {
							name: userName,
							id: userId,
						};
						const accessToken = jwt.sign(
							userInfo,
							process.env.ACCESS_TOKEN_SECRET,
							{ expiresIn: 3600 }
						);
						return res.status(200).json({ token: accessToken });
					} else {
						return res.status(400).json({ password: "wrong password" });
					}
				});
			}
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
};

const checkName = (req, res) => {
	const { newName } = req.body;
	userModel
		.findOne({ username: newName })
		.select("username")
		.then((user) => {
			if (user) {
				return res.send("not available");
			} else {
				return res.send("ok");
			}
		})
		.catch((err) => {
			throw err;
		});
};

const checkEmail = (req, res) => {
	const { email } = req.body;
	userModel
		.findOne({ email: email })
		.select("email")
		.then((user) => {
			if (user) {
				return res.send("not available");
			} else {
				return res.send("ok");
			}
		})
		.catch((err) => {
			throw err;
		});
};

const updateUserName = async (req, res) => {
	const { id, name } = req.body;
	const user = await userModel.findById(id);
	user.username = name;
	user
		.save()
		.then((updatedUser) => {
			res.json({ message: "username updated", data: { user: updatedUser } });
		})
		.catch((err) => {
			throw err;
		});
};

const updateEmail = async (req, res) => {
	const { id, email } = req.body;
	const user = await userModel.findById(id);
	user.email = email;
	user
		.save()
		.then((updatedUser) => {
			res.json({ message: "email updated", data: { user: updatedUser } });
		})
		.catch((err) => {
			throw err;
		});
};

const updatePassword = async (req, res) => {
	const { id, oldPwd, newPwd } = req.body;
	const user = await userModel.findById(id);
	bcrypt.compare(oldPwd, user.password, (error, match) => {
		if (error) throw error;
		else {
			if (match) {
				bcrypt.hash(newPwd, 10, (err, hashPwd) => {
					if (err) throw err;
					user.password = hashPwd;
					user
						.save()
						.then((updatedUser) => {
							return res.json({
								message: "password updated",
								data: { user: updatedUser },
							});
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
	const { userId } = req.params;
	//  delete user
	const removeUser = await userModel.findByIdAndRemove(userId);
	// delete questions submitted by user
	const removeQuestions = await questionModel.deleteMany({ user: userId });
	// delete answers submitted by user
	const removeAnswers = await answerModel.deleteMany({ user: userId });
	Promise.all([removeUser, removeQuestions, removeAnswers])
		.then(res.json({ success: "user deleted" }))
		.catch((err) => {
			console.error(err);
		});
};

router.post("/register", getRegistration);
router.post("/login", getLogin);
router.get("/check/name", checkName);
router.get("/check/email", checkEmail);
router.put("/update/user", updateUserName);
router.put("/update/email", updateEmail);
router.put("/update/password", updatePassword);
router.delete("/delete/:userId", deleteUser);

module.exports = router;
