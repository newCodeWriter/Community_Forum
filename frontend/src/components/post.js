/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import AnswerModal from './answerModal';
import QuestionModal from './questionModal';
import Answer from './answer';
import { fetchAnswers, fetchCategoryInfo } from '../actions';
import axios from 'axios';
import { copyState } from '../localStorage';

class Post extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show_ans: false,
			show_que: false,
			edit_ans: false,
			question: '',
			answer: '',
			answer_id: '',
			answers: [],
			username: copyState().authentication.userName,
			user_id: copyState().authentication.userId,
		};
	}

	componentDidMount() {
		axios
			.get(`/post/${this.props.match.params.questionId}`)
			.then((res) =>
				this.setState({ answers: res.data, question: res.data[0].question })
			)
			.catch((err) => console.log(err));
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) {
			this.setState({ answers: this.props.data });
		}
	}

	showAnswer = () => this.setState({ show_ans: true });

	handleAnswerModal = (childData) =>
		this.setState({
			show_ans: childData.show,
			edit_ans: childData.edit,
			answer: childData.answer,
			answer_id: childData.answerId,
		});

	closeAnswerModal = (childData) =>
		this.setState({
			show_ans: childData.show,
			show_que: childData.show,
			edit_ans: childData.edit,
		});

	showQuestion = () => this.setState({ show_que: true });

	closeQuestionModal = (childData) => this.setState({ show_que: childData });

	updateQuestion = (childData) => this.setState({ question: childData });

	deleteQuestion = () => {
		const question_id = this.props.match.params.questionId;
		axios
			.delete(`/delete/question/${question_id}`)
			.then(this.props.fetchCategoryInfo(this.props.match.params.subjectId))
			.then(this.props.history.goBack())
			.catch((err) => console.log(err));
	};

	render() {
		const {
			question,
			answer,
			answer_id,
			answers,
			username,
			user_id,
			show_que,
			show_ans,
			edit_ans,
		} = this.state;
		const { match, fetchAnswers } = this.props;
		return (
			<div className='set-width mx-auto'>
				<div className='row'>
					{answers.length ? (
						<div className='col-12 col-lg-10'>
							<h4>{question}</h4>
							<div className='mq-font'>
								Submitted by:{' '}
								<span className='text-primary'>{answers[0].submit_user} </span>
								{answers[0].question_date}
								{username === answers[0].submit_user ? (
									<>
										<i
											className='fas fa-edit mt-2 small ml-2 mr-2 open_question'
											onClick={this.showQuestion}
										></i>
										<i
											className='fas fa-trash-alt delete_question'
											onClick={this.deleteQuestion}
										></i>
									</>
								) : (
									<></>
								)}
							</div>
						</div>
					) : (
						<></>
					)}
					<div
						id='answer-btn'
						className='col-12 col-lg-2 mt-3 mt-lg-0 text-primary text-right'
					>
						<Button
							variant='success'
							onClick={this.showAnswer}
							type='button'
							className='p-2'
							title='Have an answer?'
						>
							Answer
						</Button>
					</div>
				</div>
				<div className='row mt-4 w-100'>
					{answers.length && answers[0].answer_user ? (
						<div className='col mb-2'>Answers:</div>
					) : (
						<></>
					)}
				</div>
				{answers.map((answer) => (
					<Answer
						key={`answer_${answer.response_id}`}
						answer={answer}
						user={username}
						modal={this.handleAnswerModal}
						fetch={() => fetchAnswers(match.params.questionId)}
					/>
				))}
				<AnswerModal
					show={show_ans}
					modal={this.closeAnswerModal}
					edit={edit_ans}
					question={question}
					questionId={match.params.questionId}
					answer={answer}
					answerId={answer_id}
					userId={user_id}
					fetch={() => fetchAnswers(match.params.questionId)}
				/>
				<QuestionModal
					show={show_que}
					modal={this.closeQuestionModal}
					question={question}
					questionId={match.params.questionId}
					answers={answers}
					update={this.updateQuestion}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	data: state.data_request,
});

const mapDispatchToProps = {
	fetchAnswers,
	fetchCategoryInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
