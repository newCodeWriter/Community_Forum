/** @format */

import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import axios from "axios";
import { useStateContext } from "../context/context";

const ChangeUser = ({ submit }) => {
	const [newUser, setNewUser] = useState("");
	const [userError, setUserError] = useState("");
	const [userTestError, setUserTestError] = useState(false);
	const [userOk, setUserOk] = useState("");
	const [disabled, setDisabled] = useState(true);

	const { user } = useStateContext();

	const checkuser = () => {
		const pattern = new RegExp(
			"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
		);
		const newName = newUser.trim().toLowerCase();
		const userTest = pattern.test(newName);
		if (userTest && newName !== user) {
			axios
				.get(`/check/${newName}`)
				.then((res) => {
					if (res.data === "ok") {
						setUserOk("This user is available.");
						setDisabled(false);
					} else {
						setUserError("This user is not available.");
					}
				})
				.catch((err) => console.log(err));
		} else if (newName === user) {
			setUserError("The name you entered matches your current user.");
		} else {
			setUserTestError(true);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		submit({ oldUser: user, newUser: newUser.trim().toLowerCase() });
		setNewUser("");
		setUserOk("");
		setDisabled(true);
	};

	const handleTextChange = (event) => {
		setNewUser(event.target.value);
		setUserError("");
		setUserOk("");
		setUserTestError(false);
		setDisabled(true);
	};

	return (
		<Form>
			<Form.Group className="mt-2">
				<Form.Label>Current user:</Form.Label>
				<Form.Control
					type="text"
					className="mb-3"
					placeholder={user}
					readOnly
				/>
			</Form.Group>
			<Form.Label>New user:</Form.Label>
			<InputGroup className="mb-1">
				<FormControl
					placeholder="New user"
					id="new_name"
					onChange={handleTextChange}
					value={newUser}
				/>
				<InputGroup.Append>
					<Button
						onClick={checkuser}
						title="check if user is available"
					>
						<i className="fas fa-search pl-2 pr-2"></i>
					</Button>
				</InputGroup.Append>
			</InputGroup>
			<div className="text-success small">{userOk}</div>
			<div className="text-danger small">{userError}</div>
			{userTestError && (
				<ul className="text-danger small errors">
					Your user must have:
					<li className="reg-error">At least four characters</li>
					<li className="reg-error">At least two letters</li>
					<li className="reg-error">No spaces</li>
				</ul>
			)}
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
export default ChangeUser;
