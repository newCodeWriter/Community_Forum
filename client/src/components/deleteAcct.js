/** @format */

import React from "react";
import Button from "react-bootstrap/Button";
import { useDispatchContext } from "../context/context";
import axios from "axios";

const DeleteAccount = ({ update }) => {
	const dispatch = useDispatchContext();
	const handleDelete = async () => {
		try {
			const response = await axios.delete(`/api/users/delete/user`);
			if (response.status === 200) {
				dispatch({ type: "LOGOUT_USER" });
				localStorage.removeItem("auth");
			}
		} catch (err) {
			console.error(err.message);
		}
	};
	const cancelDelete = () => update();

	return (
		<>
			<h5 className="mt-5 mb-4 acct-font">
				Are you sure you want to delete your account?
			</h5>
			<Button
				variant="danger"
				name="delBtn"
				className="mb-3"
				onClick={handleDelete}
			>
				Delete Account
			</Button>
			<Button
				variant="primary"
				name="cancelBtn"
				className="ml-3 mb-3"
				onClick={cancelDelete}
			>
				Cancel
			</Button>
		</>
	);
};
export default DeleteAccount;
