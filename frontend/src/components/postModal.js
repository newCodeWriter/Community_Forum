/** @format */

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { copyState } from "../utils/localStorage";
import axios from "axios";

const PostModal = ({ show, answer, question, edit, close, update }) => {
	const [error, setError] = useState("");
	const [text, setText] = useState("");

	const { userName } = copyState().authentication;

	const handleTextChange = (event) => {
		setText(event.target.value);
		setError("");
	};

	const handleClose = () => {
		close();
		setText("");
		setError("");
	};

	const handleAnswer = () => {
		const response = text.trim().replace(/(\r\n|\r)/gm, "\n");
		const data = { user: userName, id: question.id, answer: response };
		if (text.length >= 5) {
			axios
				.post("/answer", data)
				.then(update())
				.then(handleClose)
				.catch((err) => setError(err));
		} else {
			setError("You must enter at least 5 characters.");
		}
	};

	const handleAnswerUpdate = () => {
		const original = answer.original;
		const updated = text.trim();
		if (updated.length >= 5 && original !== updated) {
			const replace = updated.replace(/(\r\n|\r)/gm, "\n");
			const data = { update: replace, category: question.category };

			axios
				.put(`/update/answer/${answer.id}`, data)
				.then(update())
				.then(handleClose)
				.catch((err) => setError(err));
		} else if (original === updated) {
			setError("You have made no changes. Please update or press cancel.");
		} else {
			setError("You must enter at least 5 characters.");
		}
	};

	const handleQuestionUpdate = () => {
		const original = question.question;
		const updated = text.trim();
		const data = { update: updated, category: question.category };
		if (original === updated) {
			setError("You have made no changes. Please update or press cancel.");
		} else if (updated.endsWith("?") && updated.length >= 10) {
			axios
				.put(`/update/question/${question.id}`, data)
				.then(update())
				.then(handleClose)
				.catch((err) => setError(err));
		} else {
			setError(
				'Your question must end with a "?" and be at least 10 characters long.'
			);
		}
	};

	return (
		<Modal show={show.que || show.ans} onHide={handleClose} centered>
			<Modal.Body>
				<>
					<label htmlFor="modal" className="d-block mb-3">
						{edit.que
							? `${question.user.toUpperCase()}, update your question:`
							: question.question}
					</label>
					<div className="text-danger small mb-2">{error}</div>
					<textarea
						id="post-modal"
						name="post-modal"
						value={text}
						className="p-3 mb-4 w-100"
						onChange={handleTextChange}
						rows="7"
						cols="56"
					></textarea>
					{edit.que || edit.ans ? (
						<Button
							variant="primary"
							onClick={edit.que ? handleQuestionUpdate : handleAnswerUpdate}
							className="mr-3"
						>
							Update
						</Button>
					) : (
						<Button variant="primary" onClick={handleAnswer} className="mr-3">
							Submit
						</Button>
					)}
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
				</>
			</Modal.Body>
		</Modal>
	);
};

export default PostModal;
