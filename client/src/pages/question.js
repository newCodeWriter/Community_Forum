/** @format */

import React from "react";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";
import { useStateContext } from "../context/context";
import axios from "axios";

const Question = () => {
	const [error, setError] = useState(false);
	const [question, setQuestion] = useState("");
	const { user } = useStateContext();
	const { subjectId } = useParams();
	const history = useHistory();

	const goBack = () => history.go(-1);

	const handleForm = async (event) => {
		event.preventDefault();
		const data = {
			user: user.id,
			category: subjectId,
			question: question,
		};
		if (question.endsWith("?") && question.length >= 10) {
			try {
				const response = await axios.post(`/api/questions/question`, data);
				if (response.status === 200) {
					goBack();
				}
			} catch (err) {
				if (err.response) {
					setError(true);
				} else {
					console.error(err.message);
				}
			}
		} else {
			setError(true);
		}
	};

	const handleTextChange = (event) => {
		setQuestion(event.target.value);
		setError(false);
	};

	return (
		<div className="set-width mx-auto">
			<form id="question_form">
				<div className="row mt-3 text-muted">
					<div className="col">
						{error && (
							<div className="mb-2 text-danger small">
								Your question must end with a "?" and be at least 10 characters
								long.
							</div>
						)}
						{user.name && (
							<label htmlFor="question" className="d-block">
								{`${user.name.toUpperCase()}, enter your question: `}
							</label>
						)}
						<textarea
							id="question"
							name="question"
							className="p-3 mb-4 w-100"
							value={question}
							onChange={handleTextChange}
							rows="7"
							cols="56"
							required
							autoFocus
						></textarea>
					</div>
				</div>
			</form>
			<Button
				form="question_form"
				variant="primary"
				type="submit"
				onClick={handleForm}
				className="p-2 mr-3"
			>
				Submit
			</Button>
			<Button
				variant="secondary"
				type="button"
				onClick={goBack}
				className="p-2"
			>
				Back to Questions
			</Button>
		</div>
	);
};

export default Question;
