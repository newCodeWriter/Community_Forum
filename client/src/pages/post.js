/** @format */

import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import PostModal from "../components/postModal";
import Answer from "../components/answer";
import axios from "axios";

class Post extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: { ans: false, que: false },
			edit: { ans: false, que: false },
			question: {},
			answers: [],
			answer: { id: "", original: "" },
		};
	}

	componentDidMount() {
		axios
			.get(`/post/${this.props.match.params.questionId}`)
			.then((res) => {
				const {
					question_id,
					question,
					submit_user,
					question_date,
					responses,
				} = res.data;
				this.setState({
					answers: responses,
					question: {
						id: question_id,
						question: question,
						user: submit_user,
						date: question_date,
						category: this.props.match.params.subjectId,
					},
				});
			})
			.catch((err) => console.log(err));
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) {
			const { question, question_date, responses } = this.props.data;
			this.setState({
				answers: responses,
				question: {
					...this.state.question,
					question: question,
					date: question_date,
				},
			});
		}
	}

	showAnswer = () =>
		this.setState({
			show: { ...this.state.show, ans: true },
		});

	showQuestion = () => {
		this.setState({
			show: { ...this.state.show, que: true },
			edit: { ...this.state.edit, que: true },
		});
	};

	openModalToUpdateAnswer = (childData) =>
		this.setState({
			show: { ...this.state.show, ans: true },
			edit: { ...this.state.edit, ans: true },
			answer: {
				...this.state.answer,
				id: childData.answerId,
				original: childData.answer,
			},
		});

	closeModal = () =>
		this.setState({
			show: { ...this.state.show, ans: false, que: false },
			edit: { ...this.state.edit, ans: false, que: false },
		});

	deleteQuestion = () => {
		const { id, category } = this.state.question;
		axios
			.delete(`/delete/question/${category}/${id}`)
			.then(this.props.history.goBack())
			.catch((err) => console.log(err));
	};

	handleUpdate = () => {
		this.props.fetch(this.state.question.id);
	};

	render() {
		const { question, answers, answer, edit, show } = this.state;
		return (
			<div className="set-width mx-auto">
				<div className="row">
					<div className="col-12 col-lg-10">
						<h4>{question.question}</h4>
						<div className="mq-font small font-weight-bold">
							Submitted by:{" "}
							<span className="text-primary">{question.user}</span>
							{`, ${question.date}`}
							{"userName" === question.user && (
								<>
									<i
										className="fas fa-edit mt-2 small ml-2 mr-2 open_question"
										onClick={this.showQuestion}
									></i>
									<i
										className="fas fa-trash-alt delete_question"
										onClick={this.deleteQuestion}
									></i>
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
							onClick={this.showAnswer}
							type="button"
							className="p-2"
							title="Have an answer?"
						>
							Answer
						</Button>
					</div>
				</div>
				<div className="row mt-4 w-100">
					{answers.length ? <div className="col mb-2">Answers:</div> : null}
				</div>
				{answers.map((answer) => (
					<Answer
						key={`answer_${answer.response_id}`}
						answer={answer}
						modal={this.openModalToUpdateAnswer}
						category={question.category}
						del={this.handleUpdate}
					/>
				))}
				<PostModal
					show={show}
					edit={edit}
					close={this.closeModal}
					question={question}
					answer={answer}
					update={this.handleUpdate}
				/>
			</div>
		);
	}
}

// const mapStateToProps = (state) => ({
// 	data: state.postDataRequest,
// });

// const mapDispatchToProps = (dispatch) => {
// 	return { fetch: (id) => dispatch(fetchPostInfo(id)) };
// };

export default Post;
