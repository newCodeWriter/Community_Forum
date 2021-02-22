/** @format */

import React from 'react';
import axios from 'axios';

const Answer = ({ answer, user, modal, fetch }) => {
	const handleEdit = () => {
		modal({
			show: true,
			edit: true,
			answer: answer.response,
			answerId: answer.response_id,
		});
	};

	const handleDelete = () => {
		axios
			.delete(`/delete/answer/${answer.response_id}`)
			.then(fetch)
			.catch((err) => console.log(err));
	};

	return (
		<>
			{user !== `${answer.answer_user}` ? (
				<div className='row text-muted tryit'>
					<div className='col mt-2 tryit' value={answer.response}>
						{answer.response}
					</div>
				</div>
			) : (
				<>
					<div className='row'>
						<div className='col'>
							<i
								id={answer.response_id}
								className='fas fa-edit mt-2 small mr-2'
								onClick={handleEdit}
							></i>
							<i
								className={`fas fa-trash-alt ${answer.response_id}`}
								onClick={handleDelete}
							></i>
						</div>
					</div>
					<div className='row text-muted tryit'>
						<div
							value={answer.response}
							className='col mt-2 tryit'
						>
							{answer.response}
						</div>
					</div>
				</>
			)}
			{answer.answer_user ? (
				<>
					<div className='row'>
						<div className='font-weight-bold text-right small col'>
							answered {answer.response_date} by{' '}
							<span className='text-success'>{answer.answer_user}</span>
						</div>
					</div>
					<hr />
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default Answer;