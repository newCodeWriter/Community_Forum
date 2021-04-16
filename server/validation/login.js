/** @format */

const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = (data) => {
	const errors = {};

	const validateText = (text, err) => {
		const trimText = validator.trim(text);
		if (trimText.includes("@")) {
			if (validator.isEmail(trimText)) {
				return trimText;
			}
			return (err["email"] = "Email is invalid");
		} else {
			const pattern = new RegExp(
				"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
			);
			if (pattern.test(trimText)) {
				return trimText;
			}
			return (err["name"] =
				"Username must be at least 4 characters with a minimum of 2 letters");
		}
	};

	const validatePwd = (pwd, err) => {
		const trimPwd = validator.trim(pwd);
		if (validator.isLength(trimPwd, { min: 6, max: 30 })) {
			return trimPwd;
		}
		return (err["password"] = "Password must be at least 6 characters");
	};

	data.text = data.text
		? validateText(data.text, errors)
		: (errors.email = "A username or an email is required");

	data.password = data.password
		? validatePwd(data.password, errors)
		: (errors.password = "Password field is required");

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
