/** @format */

import React from "react";
import { useStateContext } from "../context/context";
import axios from "axios";

const Answer = ({ answer, modal, update }) => {
	const { user } = useStateContext();

	const handleEdit = () => {
		modal({
			id: answer._id,
			answer: answer.answer,
		});
	};

	const handleDelete = async () => {
		try {
			const response = await axios.delete(
				`/api/answers/delete/answer/${answer._id}`
			);
			if (response.data.success) {
				update();
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<>
			{user.name !== answer.user.username ? (
				<div className="row text-muted tryit">
					<div className="col mt-2 tryit">{answer.answer}</div>
				</div>
			) : (
				<>
					<div className="row">
						<div className="col">
							<i
								id={`edit_${answer._id}`}
								className="fas fa-edit mt-2 small mr-2"
								onClick={handleEdit}
							></i>
							<i
								id={`delete_${answer._id}`}
								className={"fas fa-trash-alt"}
								onClick={handleDelete}
							></i>
						</div>
					</div>
					<div className="row text-muted tryit">
						<div className="col mt-2 tryit">{answer.answer}</div>
					</div>
				</>
			)}
			{answer.user && (
				<>
					<div className="row">
						<div className="font-weight-bold text-right small col">
							{`answered ${answer.created} by `}
							<span className="text-success">{answer.user.username}</span>
						</div>
					</div>
					<hr />
				</>
			)}
		</>
	);
};

export default Answer;
