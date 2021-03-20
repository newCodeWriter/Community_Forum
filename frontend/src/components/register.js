/** @format */

import React, { useState } from "react";
import axios from "axios";

const Register = ({ confirm, isDisabled, disableForm }) => {
	const [user, setUser] = useState("");
	const [pwd1, setPwd1] = useState("");
	const [pwd2, setPwd2] = useState("");
	const [userError, setUserError] = useState({ client: false, server: false });
	const [pwdError, setPwdError] = useState({ test: false, match: false });

	const resetState = () => {
		setUser("");
		setPwd1("");
		setPwd2("");
		setUserError({ client: false, server: false });
		setPwdError({ test: false, match: false });
	};

	const handleUserInput = (event) => {
		setUser(event.target.value);
		setUserError({ client: false, server: false });
	};
	const handlePwdInput = (event) => {
		const value = event.target.value;
		event.target.name === "regPwd1" ? setPwd1(value) : setPwd2(value);
		setPwdError({ test: false, match: false });
	};

	const checkUsername = () => {
		const userPattern = new RegExp(
			"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
		);
		return userPattern.test(user);
	};
	const checkPwd = () => {
		const pwdPattern = new RegExp(
			"(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}"
		);
		return pwdPattern.test(pwd1);
	};

	const handleRegister = (event) => {
		event.preventDefault();
		if (checkUsername() && checkPwd() && pwd1 === pwd2) {
			const newUser = {
				user: user.trim().toLowerCase(),
				password: pwd1.trim(),
			};
			axios
				.post(`/register`, newUser)
				.then((res) => {
					resetState();
					confirm("You are now registered. Please log in.");
				})
				.catch((err) => {
					err.response.status === 409
						? setUserError({ ...userError, server: true })
						: console.log(err);
				});
		} else if (!checkUsername()) {
			setUserError({ ...userError, client: true });
		} else if (!checkPwd()) {
			setPwdError({ ...pwdError, test: true });
		} else {
			setPwdError({ ...pwdError, match: true });
		}
	};

	const switchToLogin = () => {
		resetState();
		disableForm();
	};

	const regStyle = {
		cursor: isDisabled ? "not-allowed" : "pointer",
		display: isDisabled ? "none" : "block",
	};

	return (
		<div className="col-sm-6 d-sm-block border-right pl-4 pr-4 reg-container">
			<form onSubmit={handleRegister} id="register-form">
				<h4 className="mb-4">Register</h4>
				<div className="input-group">
					<input
						type="text"
						className="form-control reg"
						name="regUser"
						id="regUser"
						value={user}
						placeholder="Username"
						onChange={handleUserInput}
						disabled={isDisabled}
					/>
				</div>
				{userError.client && (
					<ul className="text-danger small errors">
						Your username must have:
						<li className="reg-error">At least four characters</li>
						<li className="reg-error">At least two letters</li>
						<li className="reg-error">No spaces</li>
					</ul>
				)}
				{userError.server && (
					<div className="text-danger small errors">
						This user already exists. Please try another username.
					</div>
				)}
				<div className="input-group mt-3">
					<input
						type="password"
						className="form-control reg"
						name="regPwd1"
						id="regPwd1"
						value={pwd1}
						placeholder="Password"
						onChange={handlePwdInput}
						disabled={isDisabled}
					/>
				</div>
				{pwdError.test && (
					<ul className="text-danger small errors">
						Your password must contain:
						<li className="reg-error">At least eight characters</li>
						<li className="reg-error">At least one letter</li>
						<li className="reg-error">At least one number</li>
						<li className="reg-error">At least one special character</li>
					</ul>
				)}
				<div className="input-group mt-3">
					<input
						type="password"
						className="form-control reg"
						name="regPwd2"
						id="regPwd2"
						value={pwd2}
						placeholder="Confirm Password"
						onChange={handlePwdInput}
						disabled={isDisabled}
					/>
				</div>
				{pwdError.match && (
					<div className="text-danger small errors">
						Your passwords do not match.
					</div>
				)}
				<div className="form-check mt-2">
					<label htmlFor="terms" className="form-check-label small">
						<input
							type="checkbox"
							name="terms"
							id="terms"
							className="form-check-input reg"
							disabled={isDisabled}
							checked={isDisabled ? false : null}
							required
						/>
						I agree to the Terms and Conditions and Privacy Policy
					</label>
				</div>
				<button
					type="submit"
					className="btn btn-success mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg"
					disabled={isDisabled}
				>
					Register <i className="fas fa-user-plus"></i>
				</button>
				<div
					className="small text-right text-success mb-3"
					id="has-acct"
					onClick={switchToLogin}
					style={regStyle}
				>
					Have an account? Log In
				</div>
			</form>
		</div>
	);
};

export default Register;
