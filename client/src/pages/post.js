/** @format */

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import PostModal from "../components/postModal";
import Answer from "../components/answer";
import { useParams, useHistory } from "react-router-dom";
import { useDispatchContext, useStateContext } from "../context/context";
import axios from "axios";

const Post = () => {
	const [question, setQuestion] = useState({});
	const [answers, setAnswers] = useState([]);
	const [modal, setModal] = useState(false);
	const [modalType, setModalType] = useState({});
	const { user, postData } = useStateContext();
	const dispatch = useDispatchContext();

	const { questionId } = useParams();
	const history = useHistory();

	const fetchAnswers = async () => {
		try {
			const response = await axios.get(`/api/questions/post/${questionId}`);
			if (response.status === 200) {
				const { answers, user, ...rest } = response.data;
				setQuestion({ ...rest, user: user.username });
				setAnswers(answers);
				dispatch({ type: "DATA_REQUEST", payload: response.data });
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		if (postData) {
			fetchAnswers();
			console.log("hit it");
		}
	}, [postData]);

	const showAnswer = () => {
		setModalType({
			answer: { questionId: question._id, question: question.question },
		});
		setModal(true);
	};

	const showQuestion = () => {
		setModalType({ question: { id: questionId, question: question.question } });
		setModal(true);
	};

	const showAnswerUpdate = (data) => {
		setModalType({ updateAnswer: { ...data, question: question.question } });
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
	};

	const deleteQuestion = async () => {
		try {
			const response = await axios.delete(
				`/api/questions/delete/question/${question.id}`
			);
			if (response.data.success) {
				history.goBack(-1);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const handleUpdate = () => fetchAnswers();

	return (
		<div className="set-width mx-auto">
			<div className="row">
				<div className="col-12 col-lg-10">
					<h4>{question.question}</h4>
					<div className="mq-font small font-weight-bold">
						Submitted by: <span className="text-primary">{question.user}</span>
						{`, ${question.created}`}
						{user.name === question.user && (
							<>
								<i
									className="fas fa-edit mt-2 small ml-2 mr-2"
									onClick={showQuestion}
								></i>
								<i className="fas fa-trash-alt" onClick={deleteQuestion}></i>
							</>
						)}
					</div>
				</div>
				<div
					id="answer-btn"
					className="col-12 col-lg-2 mt-3 mt-lg-0 text-primary text-right"
				>
					<Button
						variant="success"
						onClick={showAnswer}
						type="button"
						className="p-2"
						title="Have an answer?"
					>
						Answer
					</Button>
				</div>
			</div>
			<div className="row mt-4 w-100">
				{answers.length && <div className="col mb-2">Answers:</div>}
			</div>
			{answers.map((answer) => (
				<Answer
					key={`answer-${answer._id}`}
					answer={answer}
					modal={showAnswerUpdate}
					update={handleUpdate}
				/>
			))}
			<PostModal
				open={modal}
				close={closeModal}
				type={modalType}
				update={handleUpdate}
			/>
		</div>
	);
};

export default Post;
