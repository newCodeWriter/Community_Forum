/** @format */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
	const { token } = req.cookies;
	if (!token) {
		return res.status(401).json({ error: "access denied, token missing" });
	}
	try {
		const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findOne({ _id: id });
		if (!user) {
			return res.status(401).json({ error: "user not found in database" });
		}
		res.locals.user = user;
		next();
	} catch (err) {
		res.status(401).json({ error: err.message });
	}
};

module.exports = authenticate;
