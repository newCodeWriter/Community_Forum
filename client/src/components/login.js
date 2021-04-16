/** @format */

import React, { useState } from "react";
import { useDispatchContext } from "../context/context";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = ({ isDisabled, disableForm }) => {
	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [userError, setUserError] = useState("");
	const [pwdError, setPwdError] = useState("");

	const dispatch = useDispatchContext();
	const history = useHistory();

	const handleUserInput = (event) => {
		setUser(event.target.value);
		setUserError("");
	};
	const handlePwdInput = (event) => {
		setPwd(event.target.value);
		setPwdError("");
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		const text = user.trim().toLowerCase();
		const password = pwd.trim();
		if (text.length >= 4 && password.length >= 8) {
			const data = {
				text: text,
				password: password,
			};
			try {
				const response = await axios.post(`/api/users/login`, data);
				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
					await dispatch({ type: "LOGIN_USER_SUCCESS", payload: response.data });
					history.push("/home");
				} else {
					if (response.data.text) {
						setUserError(response.data.text);
					} else if (response.data.password) {
						setPwdError(response.data.password);
					} else if (response.data.error) {
						console.error(response.data.error);
					}
					dispatch({ type: "LOGIN_USER_FAILURE" });
				}
			} catch (err) {
				console.error(err);
			}
		} else {
			if (text.length < 4) {
				setUserError("This field must have at least 4 characters");
			} else if (password.length < 8) {
				setPwdError("This field must have at least 8 characters");
			}
		}
	};

	const switchToRegistration = () => {
		setUser("");
		setPwd("");
		setUserError("");
		setPwdError("");
		disableForm();
	};

	const loginStyle = { cursor: isDisabled ? "not-allowed" : "pointer" };

	return (
		<div className="col-12 col-sm-6 pl-5 pr-5 pl-sm-4 pr-sm-4">
			<form onSubmit={handleLogin} id="login-form">
				<h4 className="mb-4">Log In</h4>
				<div className="input-group">
					<div className="input-group-prepend">
						<div className="input-group-text bg-primary text-light">
							<i className="fas fa-user"></i>
						</div>
					</div>
					<input
						type="text"
						className="form-control log"
						onChange={handleUserInput}
						name="logUser"
						id="logUser"
						placeholder="Username or Email"
						minLength="4"
						disabled={isDisabled}
						value={user}
					/>
				</div>
				{userError && (
					<div className="text-danger small errors">{userError}</div>
				)}
				<div className="input-group mt-3">
					<div className="input-group-prepend">
						<div className="input-group-text bg-primary text-light">
							<i className="fas fa-key"></i>
						</div>
					</div>
					<input
						type="password"
						className="form-control log"
						onChange={handlePwdInput}
						name="logPwd"
						id="logPwd"
						placeholder="Password"
						minLength="8"
						disabled={isDisabled}
						value={pwd}
					/>
				</div>
				{pwdError && <div className="text-danger small errors">{pwdError}</div>}
				<button
					type="submit"
					className="btn btn-primary mt-4 pl-4 pr-4 pt-2 pb-2 d-block ml-auto log"
					disabled={isDisabled}
				>
					Login <i className="fas fa-sign-in-alt"></i>
				</button>
				<div className="d-none d-sm-block text-right">
					<div
						className="d-inline-block text-primary mt-3 small log-link"
						id="no-acct"
						onClick={switchToRegistration}
						style={loginStyle}
					>
						Don't have an account?
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
