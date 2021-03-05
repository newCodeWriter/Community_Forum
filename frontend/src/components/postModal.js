/** @format */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { copyState } from '../localStorage';
import axios from 'axios';

const PostModal = ({ show, answer, question, edit, close, update }) => {
	const [state, setState] = useState({
		error: '',
		text: '',
	});

	const { userName } = copyState().authentication;

	const handleTextChange = (event) =>
		setState({ ...state, error: '', text: event.target.value });

	const handleClose = () => {
		close();
		setState({ error: '', text: '' });
	};

	const handleAnswer = () => {
		const response = state.text.trim().replace(/(\r\n|\r)/gm, '\n');

		const data = {
			user: userName,
			id: question.id,
			answer: response,
		};
		if (state.text.length >= 5) {
			axios
				.post('/answer', data)
				.then(update())
				.then(handleClose)
				.catch((err) => setState({ ...state, error: err }));
		} else {
			setState({ ...state, error: 'You must enter at least 5 characters.' });
		}
	};

	const handleAnswerUpdate = () => {
		const original = answer.original;
		const updated = state.text.trim();
		if (updated.length >= 5 && original !== updated) {
			const replace = updated.replace(/(\r\n|\r)/gm, '\n');
			const data = { update: replace, category: question.category };

			axios
				.put(`/update/answer/${answer.id}`, data)
				.then(update())
				.then(handleClose)
				.catch((err) => setState({ ...state, error: err }));
		} else if (original === updated) {
			setState({
				...state,
				error: 'You have made no changes. Please update or press cancel.',
			});
		} else {
			setState({
				...state,
				error: 'You must enter at least 5 characters.',
			});
		}
	};

	const handleQuestionUpdate = () => {
		const original = question.question;
		const data = { update: state.text.trim(), category: question.category };
		if (original === state.text.trim()) {
			setState({
				...state,
				error: 'You have made no changes. Please update or press cancel.',
			});
		} else if (state.text.endsWith('?') && state.text.length >= 10) {
			axios
				.put(`/update/question/${question.id}`, data)
				.then(update())
				.then(handleClose)
				.catch((err) => setState({ error: err }));
		} else {
			setState({
				...state,
				error:
					'Your question must end with a "?" and be at least 10 characters long.',
			});
		}
	};

	return (
		<Modal show={show.que || show.ans} onHide={handleClose} centered>
			<Modal.Body>
				<>
					<label htmlFor='modal' className='d-block mb-3'>
						{edit.que
							? `${question.user.toUpperCase()}, update your question:`
							: question.question}
					</label>
					<div className='text-danger small mb-2'>{state.error}</div>
					<textarea
						id='post-modal'
						name='post-modal'
						value={state.text}
						className='p-3 mb-4 w-100'
						onChange={handleTextChange}
						rows='7'
						cols='56'
						required
					></textarea>
					{edit.que || edit.ans ? (
						<Button
							variant='primary'
							onClick={edit.que ? handleQuestionUpdate : handleAnswerUpdate}
							className='mr-3'
						>
							Update
						</Button>
					) : (
						<Button variant='primary' onClick={handleAnswer} className='mr-3'>
							Submit
						</Button>
					)}
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
				</>
			</Modal.Body>
		</Modal>
	);
};

export default PostModal;
