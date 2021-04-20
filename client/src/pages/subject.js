/** @format */

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link, useHistory, useRouteMatch, useParams } from "react-router-dom";
import axios from "axios";

const Subject = () => {
	const [questions, setQuestions] = useState([]);
	const history = useHistory();
	const { subjectId } = useParams();
	const { url } = useRouteMatch();

	const fetchQuestions = async () => {
		try {
			const response = await axios.get(`/api/questions/category/${subjectId}`);
			setQuestions([...response.data]);
		} catch (err) {
			console.error(err);
		}
	};
	const newQuestion = () => history.push(`${url}/question`);

	useEffect(() => {
		fetchQuestions();
	}, [subjectId]);

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
				<Link
					key={`question_${q._id}`}
					to={`${url}/${q._id}`}
				>
					<div
						id={q._id}
						className="border border-light bg-light d-block mb-3 p-3 subject-container shadow"
					>
						<div className="row">
							<div className="col-md-5 text-muted small">{q.created}</div>
							<div className="col-md-7 text-success text-right small q-user">
								by: {q.user.username}
							</div>
						</div>
						<div className="row mt-3 w-100">
							<div className="col">{q.question}</div>
						</div>
						<div className="row mt-2 text-muted">
							<div className="col text-right small">
								Answers: {q.answers.length}
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default Subject;
