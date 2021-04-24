/** @format */

import React, { useState } from "react";
import { Button, FormControl, Form } from "react-bootstrap";
import axios from "axios";

const ChangePwd = ({ update }) => {
	const [currentPwd, setCurrentPwd] = useState("");
	const [newPwd, setNewPwd] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");
	const [pwdError, setPwdError] = useState("");
	const [pwdTestError, setPwdTestError] = useState(false);

	const handleCurrentPwd = (event) => {
		setCurrentPwd(event.target.value);
		setPwdError("");
	};
	const handleNewPwd = (event) => {
		setNewPwd(event.target.value);
		setPwdError("");
		setPwdTestError(false);
	};
	const handleConfirmPwd = (event) => {
		setConfirmPwd(event.target.value);
		setPwdError("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const currentPassword = currentPwd.trim();
		const newPassword = newPwd.trim();
		const confirmPassword = confirmPwd.trim();
		const pattern = new RegExp(
			"(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}"
		);
		const pwdTest = pattern.test(newPassword);

		if (!newPassword || !currentPassword || !confirmPassword) {
			setPwdError("A value is required for each field.");
		} else if (
			pwdTest &&
			currentPassword !== newPassword &&
			newPassword === confirmPassword
		) {
			const updatePwd = {
				currentPwd: currentPassword,
				newPwd: newPassword,
			};
			try {
				const response = await axios.put(`/api/users/update/password`, updatePwd);
				if (response.data === "wrong password") {
					setPwdError("You have entered an incorrect password.");
				} else {
					setCurrentPwd("");
					setNewPwd("");
					setConfirmPwd("");
					update();
				}
			} catch (err) {
				console.error(err.message);
			}
		} else if (!pwdTest) {
			setPwdTestError(true);
		} else if (currentPwd === newPwd) {
			setPwdError("Your new password matches your old password.");
		} else {
			setPwdError("Your passwords do not match.");
		}
	};

	return (
		<Form id="pwd-form">
			<FormControl
				placeholder="Enter Current Password"
				id="currentPassword"
				onChange={handleCurrentPwd}
				value={currentPwd}
				className="mb-1 acct-form"
				type="password"
			/>
			<FormControl
				placeholder="New Password"
				id="newPassword"
				onChange={handleNewPwd}
				value={newPwd}
				className="mb-1"
				type="password"
			/>
			<FormControl
				placeholder="Confirm Password"
				id="confirmPassword"
				onChange={handleConfirmPwd}
				value={confirmPwd}
				className="mb-1"
				type="password"
			/>
			<div className="text-danger small">{pwdError}</div>
			{pwdTestError && (
				<>
					<ul className="text-danger small errors">
						Your new password must contain:
						<li className="pwd-error">At least eight characters</li>
						<li className="pwd-error">At least one letter</li>
						<li className="pwd-error">At least one number</li>
						<li className="pwd-error">At least one special character</li>
					</ul>
				</>
			)}
			<Button
				variant="primary"
				className="mt-3 mb-3"
				name="pwdBtn"
				type="button"
				onClick={handleSubmit}
			>
				Submit
			</Button>
		</Form>
	);
};
export default ChangePwd;
