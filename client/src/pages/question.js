/** @format */

import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class Question extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			question: '',
		};
	}

	handleForm = (event) => {
		event.preventDefault();
		const text = this.state.question;
		const data = {
			user: "shay",
			category: this.props.match.params.subjectId,
			question: text,
		};
		if (text.endsWith('?') && text.length >= 10) {
			axios
				.post('/question', data)
				// .then(this.props.dispatch(fetchCategoryInfo(this.props.match.params.subjectId)))
				.then(this.props.history.go(-1))
				.catch(console.error());
		} else {
			this.setState({
				error:
					'Your question must end with a "?" and be at least 10 characters long.',
			});
		}
	};

	handleReturn = () => this.props.history.go(-1)


	handleTextChange = (event) => {
		this.setState({
			error: '',
			question: event.target.value,
		});
	};

	render() {
		return (
			<div className='set-width mx-auto'>
				<form id='question_form'>
					<div className='row mt-3 text-muted'>
						<div className='col'>
							<div className='mb-2 text-danger small'>{this.state.error}</div>
							<label htmlFor='question' className='d-block'>
								{'Shay'}, enter your question:
							</label>
							<textarea
								id='question'
								name='question'
								className='p-3 mb-4 w-100'
								value={this.state.question}
								onChange={this.handleTextChange}
								rows='7'
								cols='56'
								required
								autoFocus
							></textarea>
						</div>
					</div>
				</form>
				<Button
					form='question_form'
					variant='primary'
					type='submit'
					onClick={this.handleForm}
					className='p-2 mr-3'
				>
					Submit
				</Button>
				<Button
					variant='secondary'
					type='button'
					onClick={this.handleReturn}
					className='p-2'
				>
					Back to Questions
				</Button>
			</div>
		);
	}
}

export default Question;