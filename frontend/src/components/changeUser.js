/** @format */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { copyState } from '../localStorage';

const ChangeUser = ({ submit }) => {
	const [state, setState] = useState({
		new_user: '',
		user_error: '',
		user_test_error: false,
		user_ok: '',
		disabled: true,
	});

	const { userName } = copyState().authentication;

	const checkUsername = () => {
		const user_patt = new RegExp(
			'^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$'
		);
		const newName = state.new_user.toLowerCase();
		const user_test = user_patt.test(newName);
		if (user_test && newName !== userName) {
			axios
				.get(`/check/${newName}`)
				.then((res) => {
					res.data === 'ok'
						? setState({
								...state,
								user_ok: 'This username is available.',
								disabled: false,
						  })
						: setState({
								...state,
								user_error: 'This username is not available.',
						  });
				})
				.catch((err) => console.log(err));
		} else if (newName === userName) {
			setState({
				...state,
				user_error: 'The name you entered matches your current username.',
			});
		} else {
			setState({
				...state,
				user_test_error: true,
			});
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		submit({ oldUser: userName, newUser: state.new_user.toLowerCase() });
		setState({
			...state,
			new_user: '',
			user_ok: '',
			disabled: true,
		});
	};

	const handleTextChange = (event) => {
		setState({
			new_user: event.target.value,
			user_error: '',
			user_ok: '',
			user_test_error: false,
			disabled: true,
		});
	};

	return (
		<Form>
			<Form.Group className='mt-2'>
				<Form.Label>Current Username:</Form.Label>
				<Form.Control
					type='text'
					className='mb-3'
					placeholder={userName}
					readOnly
				/>
			</Form.Group>
			<Form.Label>New Username:</Form.Label>
			<InputGroup className='mb-1'>
				<FormControl
					placeholder='New Username'
					id='new_name'
					onChange={handleTextChange}
					value={state.new_user}
				/>
				<InputGroup.Append>
					<Button
						onClick={checkUsername}
						title='check if username is available'
					>
						<i className='fas fa-search pl-2 pr-2'></i>
					</Button>
				</InputGroup.Append>
			</InputGroup>
			<div className='text-success small'>{state.user_ok}</div>
			<div className='text-danger small'>{state.user_error}</div>
			{state.user_test_error ? (
				<ul className='text-danger small errors'>
					Your username must have:
					<li className='reg-error'>At least four characters</li>
					<li className='reg-error'>At least two letters</li>
					<li className='reg-error'>No spaces</li>
				</ul>
			) : (
				<></>
			)}
			<Button
				variant='primary'
				name='userBtn'
				type='button'
				className='mr-2 mt-4 p-2 mb-3'
				disabled={state.disabled}
				onClick={handleSubmit}
			>
				Submit
			</Button>
		</Form>
	);
};
export default ChangeUser;
