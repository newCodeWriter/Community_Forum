/** @format */

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useStateContext } from "../context/context";

const PostModal = ({ open, close, type, update }) => {
	const [error, setError] = useState("");
	const [text, setText] = useState("");

	const { user } = useStateContext();

	const handleTextChange = (event) => {
		setText(event.target.value);
		setError("");
	};

	const handleClose = () => {
		close();
		setText("");
		setError("");
	};

	const handleAnswer = async () => {
		const answer = text.trim().replace(/(\r\n|\r)/gm, "\n");
		const data = {
			userId: user,
			questionId: type.answer.questionId,
			answer: answer,
		};
		if (text.length >= 5) {
			try {
				const response = await axios.post("/api/answers/answer", data);
				if (response.status === 200) {
					handleClose();
					update();
				}
			} catch (err) {
				console.error(err.message);
			}
		} else {
			setError("You must enter at least 5 characters.");
		}
	};

	const handleAnswerUpdate = async () => {
		const original = type.updateAnswer.answer;
		const update = text.trim();
		if (update.length >= 5 && original !== update) {
			const replace = update.replace(/(\r\n|\r)/gm, "\n");
			const data = { update: replace };

			try {
				const response = await axios.put(
					`/api/answers/update/answer/${answer.id}`,
					data
				);
				if (response.status === 200) {
					handleClose();
					update();
				}
			} catch (err) {
				console.error(err.message);
			}
		} else if (original === update) {
			setError("You have made no changes. Please update or press cancel.");
		} else {
			setError("You must enter at least 5 characters.");
		}
	};

	const handleQuestionUpdate = async () => {
		const original = type.question.question;
		const update = text.trim();
		const data = { update: update };
		if (original === update) {
			setError("You have made no changes. Please update or press cancel.");
		} else if (update.endsWith("?") && update.length >= 10) {
			try {
				const response = await axios.put(
					`/api/questions/update/question/${type.question.id}`,
					data
				);
				if (response.status === 200) {
					handleClose();
					update();
				}
			} catch (err) {
				console.error(err.message);
			}
		} else {
			setError(
				'Your question must end with a "?" and be at least 10 characters long.'
			);
		}
	};

	return (
		<Modal open={open} onHide={handleClose} centered>
			<Modal.Body>
				<>
					<label htmlFor="modal" className="d-block mb-3">
						{type.question && `Update your question:`}
						{type.answer && type.answer.question}
						{type.updateAnswer && type.updateAnswer.question}
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
					{type.question || type.updateAnswer ? (
						<Button
							variant="primary"
							onClick={
								type.question ? handleQuestionUpdate : handleAnswerUpdate
							}
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
