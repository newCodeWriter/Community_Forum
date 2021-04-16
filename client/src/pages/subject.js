/** @format */

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Subject = ({ match }) => {
	const [questions, setQuestions] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await axios.get(`/category/${match.params.subjectId}`);
				setQuestions([...response.data]);
			} catch (err) {
				console.error(err);
			}
		};
		fetchQuestions();
	}, [match.params.subjectId]);

	const newQuestion = () => history.push(`${match.url}/question`);

	return (
		<div className="set-width mx-auto">
			<Button
				variant="primary"
				className="mb-4 pl-3 pr-3 pt-2 pb-2"
				onClick={newQuestion}
			>
				New Question?
			</Button>
			{questions.map((q) => (
				<Link key={`question_${q.question_id}`} to={`${match.url}/${q.question_id}`}>
					<div
						id={q.question_id}
						className="border border-light bg-light d-block mb-3 p-3 subject-container shadow"
					>
						<div className="row">
							<div className="col-md-5 text-muted small">{q.question_date}</div>
							<div className="col-md-7 text-success text-right small q-user">
								by: {q.submit_user}
							</div>
						</div>
						<div className="row mt-3 w-100">
							<div className="col">{q.question}</div>
						</div>
						<div className="row mt-2 text-muted">
							<div className="col text-right small">
								Answers: {q.responses.length}
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default Subject;
