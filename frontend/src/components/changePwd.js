/** @format */

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { copyState } from "../localStorage";

const ChangePwd = () => {
	const [oldPwd, setOldPwd] = useState("");
	const [newPwd, setNewPwd] = useState("");
	const [confirmPwd, setConfirmPwd] = useState("");
	const [pwdError, setPwdError] = useState("");
	const [pwdTestError, setPwdTestError] = useState(false);

	const { userName } = copyState().authentication;

	const handleOldPwd = (event) => {
		setOldPwd(event.target.value);
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

	const handleSubmit = (event) => {
		event.preventDefault();
		const oldPassword = oldPwd.trim();
		const newPassword = newPwd.trim();
		const confirmPassword = confirmPwd.trim();
		const pattern = new RegExp(
			"(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}"
		);
		const pwdTest = pattern.test(newPassword);

		if (!newPassword || !oldPassword || !confirmPassword) {
			setPwdError("A value is required for each field.");
		} else if (
			pwdTest &&
			oldPassword !== newPassword &&
			newPassword === confirmPassword
		) {
			const updatePwd = {
				user: userName,
				oldPwd: oldPassword,
				newPwd: newPassword,
			};

			axios
				.put(`/update/password`, updatePwd)
				.then((res) => {
					if (res.data === "wrong password") {
						setPwdError("You have entered an incorrect password.");
					} else {
						setOldPwd("");
						setNewPwd("");
						setConfirmPwd("");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (!pwdTest) {
			setPwdTestError(true);
		} else if (oldPwd === newPwd) {
			setPwdError("Your new password matches your old password.");
		} else {
			setPwdError("Your passwords do not match.");
		}
	};

	return (
		<Form id="pwd-form">
			<Form.Group>
				<Form.Label>Current Password:</Form.Label>
				<Form.Control
					type="password"
					name="oldPwd"
					id="oldPwd"
					className="mb-3"
					placeholder="Old Password"
					onChange={handleOldPwd}
					value={oldPwd}
				/>
				<Form.Label>New Password:</Form.Label>
				<Form.Control
					type="password"
					name="newPwd"
					id="newPwd"
					className="mb-3"
					placeholder="New Password"
					onChange={handleNewPwd}
					value={newPwd}
				/>
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control
					type="password"
					name="conPwd"
					id="conPwd"
					placeholder="Confirm Password"
					onChange={handleConfirmPwd}
					value={confirmPwd}
				/>
				<div className="text-danger small">{pwdError}</div>
				{pwdTestError && (
					<ul className="text-danger small errors">
						Your new password must contain:
						<li className="pwd-error">At least eight characters</li>
						<li className="pwd-error">At least one letter</li>
						<li className="pwd-error">At least one number</li>
						<li className="pwd-error">At least one special character</li>
					</ul>
				)}
			</Form.Group>
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
