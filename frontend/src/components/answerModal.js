/** @format */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const AnswerModal = ({
	show,
	answer,
	answerId,
	question,
	questionId,
	edit,
	modal,
	userId,
	fetch,
}) => {
	const [state, setState] = useState({
		error: '',
		text: '',
	});

	const handleTextChange = (event) =>
		setState({ ...state, error: '', text: event.target.value });

	const handleClose = () => {
		modal({ show: false, edit: false });
		setState({ error: '', text: '' });
	};

	const handleAnswer = () => {
		const replace = state.text.replace(/(\r\n|\r)/gm, '\n');

		const data = {
			user: userId,
			id: questionId,
			answer: replace,
		};
		if (state.text.length >= 5) {
			axios
				.post('/answer', data)
				.then(fetch)
				.then(handleClose)
				.catch((err) => setState({ ...state, error: err }));
		} else {
			setState({ ...state, error: 'You must enter at least 5 characters.' });
		}
	};

	const handleUpdate = () => {
		const original = answer;
		const update = state.text;
		if (update.length >= 5 && original !== update) {
			const replace = update.replace(/(\r\n|\r)/gm, '\n');
			const data = { update: replace };

			axios
				.put(`/update/answer/${answerId}`, data)
				.then(fetch)
				.then(handleClose)
				.catch((err) => setState({ ...state, error: err }));
		} else if (original === update) {
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

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Body>
				<>
					<label htmlFor='updated_answer' className='d-block mb-4'>
						{question}
					</label>
					<div className='text-danger small mb-2'>{state.error}</div>
					<textarea
						id='answer'
						name='answer'
						value={state.text}
						className='p-3 mb-4 w-100'
						onChange={handleTextChange}
						rows='7'
						cols='56'
						required
					></textarea>
					{edit ? (
						<Button variant='primary' onClick={handleUpdate} className='mr-3'>
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

export default AnswerModal;