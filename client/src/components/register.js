/** @format */

import React, { useState } from "react";
import { useDispatchContext } from "../context/context";
import axios from "axios";
import validator from "validator";

const Register = ({ isDisabled, disableForm }) => {
	const [user, setUser] = useState("");
	const [email, setEmail] = useState("");
	const [pwd1, setPwd1] = useState("");
	const [pwd2, setPwd2] = useState("");
	const [userError, setUserError] = useState(false);
	const [userExistError, setUserExistError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [emailExistError, setEmailExistError] = useState(false);
	const [pwdTestError, setPwdTestError] = useState(false);
	const [pwdMatchError, setPwdMatchError] = useState(false);

	const dispatch = useDispatchContext();

	const handleUserInput = (event) => {
		setUser(event.target.value);
		setUserError(false);
		setUserExistError(false);
	};
	const handleEmailInput = (event) => {
		setEmail(event.target.value);
		setEmailError(false);
		setEmailExistError(false);
	};
	const handlePwdInput = (event) => {
		const target = event.target;
		target.name === "regPwd1" ? setPwd1(target.value) : setPwd2(target.value);
		setPwdTestError(false);
		setPwdMatchError(false);
	};

	const validName = () => {
		const userPattern = new RegExp(
			"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
		);
		return userPattern.test(user);
	};
	const validEmail = () => {
		return validator.isEmail(email);
	};
	const validPwd = () => {
		const pwdPattern = new RegExp(
			"(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}"
		);
		return pwdPattern.test(pwd1);
	};

	const handleRegister = async (event) => {
		event.preventDefault();
		if (validName() && validEmail() && validPwd() && pwd1 === pwd2) {
			const newUser = {
				name: user.trim().toLowerCase(),
				email: email.trim().toLowerCase(),
				password: pwd1.trim(),
			};
			try {
				const response = await axios.post(`api/users/register`, newUser);
				if (response.data.user) {
					dispatch({ type: "LOGIN_USER_SUCCESS", payload: response.data.user });
					localStorage.setItem(
						"auth",
						JSON.stringify({ user: response.data.user.name })
					);
				}
			} catch (err) {
				const { data } = err.response;
				if (err.response) {
					if (data.name) {
						setUserError(true);
					} else if (data.userExist) {
						setUserExistError(true);
					} else if (data.email) {
						setEmailError(true);
					} else if (data.emailExist) {
						setEmailExistError(true);
					} else if (data.password) {
						setPwdTestError(true);
					}
				} else {
					console.error(err.message);
				}
				dispatch({ type: "LOGIN_USER_FAILURE" });
			}
		} else {
			if (!validName()) {
				setUserError(true);
			} else if (!validEmail()) {
				setEmailError(true);
			} else if (!validPwd()) {
				setPwdTestError(true);
			} else {
				setPwdMatchError(true);
			}
		}
	};

	const switchToLogin = () => {
		setUser("");
		setEmail("");
		setPwd1("");
		setPwd2("");
		setUserError(false);
		setUserExistError(false);
		setEmailError(false);
		setEmailExistError(false);
		setPwdTestError(false);
		setPwdMatchError(false);
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
				{userError && (
					<ul className="text-danger small errors">
						Your username must have:
						<li className="reg-error">At least four characters</li>
						<li className="reg-error">At least two letters</li>
						<li className="reg-error">No spaces</li>
					</ul>
				)}
				{userExistError && (
					<div className="text-danger small errors">
						This user already exists. Please try another username.
					</div>
				)}
				<div className="input-group mt-3">
					<input
						type="email"
						className="form-control reg"
						name="regEmail"
						id="regEmail"
						value={email}
						placeholder="Email"
						onChange={handleEmailInput}
						disabled={isDisabled}
					/>
				</div>
				{emailError && (
					<div className="text-danger small errors">
						Please enter a valid email address.
					</div>
				)}
				{emailExistError && (
					<div className="text-danger small errors">
						This email is already registered.
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
				{pwdTestError && (
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
				{pwdMatchError && (
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
