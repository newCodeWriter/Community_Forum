/** @format */

import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import axios from "axios";
import validator from "validator";

const ChangeEmail = ({ update }) => {
	const [currentEmail, setCurrentEmail] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [currentEmailError, setCurrentEmailError] = useState("");
	const [newEmailError, setNewEmailError] = useState("");
	const [emailOk, setEmailOk] = useState("");
	const [disabled, setDisabled] = useState(true);

	const clearMessages = () => {
		setCurrentEmailError("");
		setNewEmailError("");
		setEmailOk("");
		setDisabled(true);
	};

	const handleNewEmail = (event) => {
		setNewEmail(event.target.value);
		clearMessages();
	};
	const handleCurrentEmail = (event) => {
		setCurrentEmail(event.target.value);
		clearMessages();
	};

	const checkEmail = async () => {
		const currentUserEmail = currentEmail.trim().toLowerCase();
		const newUserEmail = newEmail.trim().toLowerCase();
		const newEmailTest = validator.isEmail(newUserEmail);
		const currentEmailTest = validator.isEmail(currentUserEmail);
		if (currentEmailTest && newEmailTest && currentEmail !== newEmail) {
			try {
				const response = await axios.get(`/api/users/check/email`, {
					params: {
						email: newUserEmail,
					},
				});
				if (response.data === "ok") {
					setEmailOk("This email is available.");
					setDisabled(false);
				} else {
					setNewEmailError("This email is already registered.");
				}
			} catch (err) {
				console.error(err.message);
			}
		} else if (!currentEmail || !newEmail) {
			setNewEmailError("You must enter an email for each field.");
		} else if (!validator.isEmail(currentEmail)) {
			setCurrentEmailError("Please enter a valid email address.");
		} else if (!validator.isEmail(newEmail)) {
			setNewEmailError("Please enter a valid email address.");
		} else if (currentEmail === newEmail) {
			setNewEmailError("The email you entered matches your current email.");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const currentUserEmail = currentEmail.trim().toLowerCase();
		const newUserEmail = newEmail.trim().toLowerCase();
		try {
			const response = await axios.put(`/api/users/update/email`, {
				currentEmail: currentUserEmail,
				newEmail: newUserEmail,
			});
			if (response.data === "ok") {
				setNewEmail("");
				setCurrentEmail("");
				setEmailOk("");
				setDisabled(true);
				update();
			} else {
				setCurrentEmailError(
					`${response.data} Please correct and rerun search.`
				);
				setDisabled(true);
			}
		} catch (err) {
			console.error(err.message);
			setNewEmail("");
			setCurrentEmail("");
			setEmailOk("");
			setDisabled(true);
		}
	};

	return (
		<Form>
			<FormControl
				placeholder="Enter Current Email"
				id="currentEmail"
				onChange={handleCurrentEmail}
				value={currentEmail}
				className="mb-1 acct-form"
				type="email"
			/>
			{currentEmailError && (
				<div className="text-danger small mb-2">{currentEmailError}</div>
			)}
			<InputGroup className="mb-1">
				<FormControl
					placeholder="Search Email..."
					id="currentEmail"
					onChange={handleNewEmail}
					value={newEmail}
					type="email"
				/>
				<InputGroup.Append>
					<Button onClick={checkEmail} title="check if email is registered">
						<i className="fas fa-search pl-2 pr-2"></i>
					</Button>
				</InputGroup.Append>
			</InputGroup>
			<div className="text-success small">{emailOk}</div>
			<div className="text-danger small">{newEmailError}</div>
			<Button
				variant="primary"
				name="userBtn"
				type="button"
				className="mr-2 mt-4 p-2 mb-3"
				disabled={disabled}
				onClick={handleSubmit}
			>
				Submit
			</Button>
		</Form>
	);
};
export default ChangeEmail;
