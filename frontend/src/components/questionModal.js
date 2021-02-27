/** @format */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const QuestionModal = ({
	show,
	answers,
	question,
	questionId,
	modal,
	update,
}) => {
	const [state, setState] = useState({
		error: '',
		text: '',
	});

	const handleTextChange = (event) =>
		setState({ ...state, error: '', text: event.target.value });

	const handleClose = () => {
		modal(false);
		setState({ error: '', text: '' });
	};

	const handleUpdate = () => {
		const original = question;
		const data = { update: state.text.trim() };
		if (original === state.text.trim()) {
			setState({
				...state,
				error: 'You have made no changes. Please update or press cancel.',
			});
		} else if (state.text.endsWith('?') && state.text.length >= 10) {
			axios
				.put(`/update/question/${questionId}`, data)
				.then(update(state.text.trim()))
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
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Body>
				{answers.length ? (
					<>
						<label htmlFor='updated_question' className='d-block mb-3'>
							{answers[0].submit_user.toUpperCase()}, update your question:
						</label>
						<div className='text-danger small'>{state.error}</div>
						<textarea
							id='updated_question'
							name='updated_question'
							className='p-3 mb-4 mt-2 w-100'
							onChange={handleTextChange}
							rows='7'
							cols='56'
							required
							autoFocus
						></textarea>
						<Button variant='primary' onClick={handleUpdate} className='mr-3'>
							Update
						</Button>
						<Button variant='secondary' onClick={handleClose}>
							Cancel
						</Button>
					</>
				) : null}
			</Modal.Body>
		</Modal>
	);
};

export default QuestionModal;
