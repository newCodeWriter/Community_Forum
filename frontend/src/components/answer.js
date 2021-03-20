/** @format */

import React from 'react';
import axios from 'axios';
import { copyState } from '../localStorage';

const Answer = ({ answer, modal, category, del }) => {
	const { userName } = copyState().authentication;

	const handleEdit = () => {
		modal({
			answer: answer.response,
			answerId: answer.response_id,
		});
	};

	const handleDelete = () => {
		axios
			.delete(`/delete/answer/${category}/${answer.response_id}`)
			.then(del())
			.catch((err) => console.log(err));
	};

	return (
		<>
			{userName !== answer.answer_user ? (
				<div className='row text-muted tryit'>
					<div className='col mt-2 tryit'>{answer.response}</div>
				</div>
			) : (
				<>
					<div className='row'>
						<div className='col'>
							<i
								id={`edit_${answer.response_id}`}
								className='fas fa-edit mt-2 small mr-2'
								onClick={handleEdit}
							></i>
							<i
								id={`delete_${answer.response_id}`}
								className={'fas fa-trash-alt'}
								onClick={handleDelete}
							></i>
						</div>
					</div>
					<div className='row text-muted tryit'>
						<div className='col mt-2 tryit'>{answer.response}</div>
					</div>
				</>
			)}
			{answer.answer_user && (
				<>
					<div className='row'>
						<div className='font-weight-bold text-right small col'>
							answered {answer.response_date} by{' '}
							<span className='text-success'>{answer.answer_user}</span>
						</div>
					</div>
					<hr />
				</>
			)}
		</>
	);
};

export default Answer;
