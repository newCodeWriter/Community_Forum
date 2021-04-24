/** @format */

import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import axios from "axios";
import { useStateContext, useDispatchContext } from "../context/context";

const ChangeUser = ({ update }) => {
	const [newUser, setNewUser] = useState("");
	const [userError, setUserError] = useState("");
	const [userTestError, setUserTestError] = useState(false);
	const [userOk, setUserOk] = useState("");
	const [disabled, setDisabled] = useState(true);

	const { user } = useStateContext();
	const dispatch = useDispatchContext();

	const checkUser = async () => {
		const pattern = new RegExp(
			"^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$"
		);
		const newName = newUser.trim().toLowerCase();
		const userTest = pattern.test(newName);
		if (userTest && newName !== user.name) {
			try {
				const response = await axios.get(`/api/users/check/name`, {
					params: { newName: newName },
				});
				if (response.data === "ok") {
					setUserOk("This user is available.");
					setDisabled(false);
				} else {
					setUserError("This user is not available.");
				}
			} catch (err) {
				console.error(err.message);
			}
		} else if (newName === user.name) {
			setUserError("The name you entered matches your current name.");
		} else {
			setUserTestError(true);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const newName = newUser.trim().toLowerCase();
		const data = { name: newName };
		try {
			const response = await axios.put(`/api/users/update/user`, data);
			if (response.status === 200) {
				dispatch({ type: "UPDATE_USER", payload: data });
				setNewUser("");
				setUserOk("");
				setDisabled(true);
				update();
			}
		} catch (err) {
			console.error(err.message);
			setNewUser("");
			setUserOk("");
			setDisabled(true);
		}
	};

	const handleTextChange = (event) => {
		setNewUser(event.target.value);
		setUserError("");
		setUserOk("");
		setUserTestError(false);
		setDisabled(true);
	};

	return (
		<Form className="mt-1">
			<InputGroup className="mb-1">
				<FormControl
					placeholder="Search username..."
					id="newName"
					onChange={handleTextChange}
					value={newUser}
				/>
				<InputGroup.Append>
					<Button onClick={checkUser} title="check if user is available">
						<i className="fas fa-search pl-2 pr-2"></i>
					</Button>
				</InputGroup.Append>
			</InputGroup>
			<div className="text-success small">{userOk}</div>
			<div className="text-danger small">{userError}</div>
			{userTestError && (
				<ul className="text-danger small errors">
					Your username must have:
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
