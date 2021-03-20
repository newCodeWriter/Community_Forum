/** @format */

import React, { useState } from "react";

const Login = ({ isDisabled, disableForm, loginUser, errors }) => {
	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");

	const handleUserInput = (event) => {
		setUser(event.target.value);
		errors.clear();
	};
	const handlePwdInput = (event) => {
		setPwd(event.target.value);
		errors.clear();
	};

	const handleLogin = (event) => {
		event.preventDefault();
		const data = {
			username: user.trim().toLowerCase(),
			password: pwd.trim(),
		};
		loginUser(data);
	};

	const switchToRegistration = () => {
		setUser("");
		setPwd("");
		disableForm(true);
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
						placeholder="Username"
						minLength="4"
						disabled={isDisabled}
						value={user}
					/>
				</div>
				{errors.user && (
					<div className="text-danger small errors">
						This user does not exist.
					</div>
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
				{errors.pwd && (
					<div className="text-danger small errors">
						You entered an incorrect password.
					</div>
				)}
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
