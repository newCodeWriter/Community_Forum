/** @format */

const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = (data) => {
	const errors = {};

	const validateName = (name, err) => {
		const trimName = validator.trim(name);
		const pattern = new RegExp(
			"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
		);
		if (pattern.test(trimName)) {
			return trimName;
		}
		return (err["name"] =
			"Username must be at least 4 characters with a minimum of 2 letters");
	};

	const validateEmail = (email, err) => {
		const trimEmail = validator.trim(email);
		if (validator.isEmail(trimEmail)) {
			return trimEmail;
		}
		return (err["email"] = "Email is invalid");
	};

	const validatePwd = (pwd, err) => {
		const trimPwd = validator.trim(pwd);
		if (validator.isLength(trimPwd, { min: 8, max: 40 })) {
			return trimPwd;
		}
		return (err["password"] = "Password must be at least 6 characters");
	};

	data.name = data.name
		? validateName(data.name, errors)
		: (errors.name = "Name field is required");

	data.email = data.email
		? validateEmail(data.email, errors)
		: (errors.email = "Email field is required");

	data.password = data.password
		? validatePwd(data.password, errors)
		: (errors.password = "Password field is required");

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
