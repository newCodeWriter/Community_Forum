/** @format */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { copyState } from '../localStorage';

const ChangePwd = () => {
	const [state, setState] = useState({
		oldPwd: '',
		newPwd: '',
		conPwd: '',
		pw_error: '',
		pwd_test_error: false,
	});

	const { userName } = copyState().authentication;

	const handleSubmit = (event) => {
		event.preventDefault();
		const oldPwd = state.oldPwd.toLowerCase();
		const newPwd = state.newPwd.toLowerCase();
		const conPwd = state.conPwd.toLowerCase();
		const patt = new RegExp('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}');
		const pwd_test = patt.test(state.newPwd);

		if (newPwd.length === 0 || oldPwd.length === 0 || conPwd.length === 0) {
			setState({
				...state,
				pw_error: 'A value is required for each field.',
			});
		} else if (pwd_test && oldPwd !== newPwd && newPwd === conPwd) {
			const update_pwd = {
				user: userName,
				old_pwd: oldPwd,
				new_pwd: newPwd,
			};

			axios
				.put(`/update/password`, update_pwd)
				.then((res) => {
					res.data === 'wrong password'
						? setState({
								...state,
								pw_error: 'You have entered an incorrect password.',
						  })
						: setState({
								...state,
								oldPwd: '',
								newPwd: '',
								conPwd: '',
						  });
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (!pwd_test) {
			setState({
				...state,
				pwd_test_error: true,
			});
		} else if (oldPwd === newPwd) {
			setState({
				...state,
				pw_error:
					'Your new password matches your old password. Please enter a new password.',
			});
		} else {
			setState({
				...state,
				pw_error: 'Your passwords do not match.',
			});
		}
	};

	const handleTextChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value,
			pw_error: '',
			pwd_test_error: false,
		});
	};

	return (
		<Form id='pwd-form'>
			<Form.Group>
				<Form.Label>Current Password:</Form.Label>
				<Form.Control
					type='password'
					name='oldPwd'
					id='oldPwd'
					className='mb-3'
					placeholder='Old Password'
					onChange={handleTextChange}
					value={state.oldPwd}
				/>
				<Form.Label>New Password:</Form.Label>
				<Form.Control
					type='password'
					name='newPwd'
					id='newPwd'
					className='mb-3'
					placeholder='New Password'
					onChange={handleTextChange}
					value={state.newPwd}
				/>
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control
					type='password'
					name='conPwd'
					id='conPwd'
					placeholder='Confirm Password'
					onChange={handleTextChange}
					value={state.conPwd}
				/>
				<div className='text-danger small'>{state.pw_error}</div>
				{state.pwd_test_error ? (
					<ul className='text-danger small errors'>
						Your new password must contain:
						<li className='pwd-error'>At least eight characters</li>
						<li className='pwd-error'>At least one letter</li>
						<li className='pwd-error'>At least one number</li>
						<li className='pwd-error'>At least one special character</li>
					</ul>
				) : (
					<></>
				)}
			</Form.Group>
			<Button
				variant='primary'
				className='mt-3 mb-3'
				name='pwdBtn'
				type='button'
				onClick={handleSubmit}
			>
				Submit
			</Button>
		</Form>
	);
};
export default ChangePwd;
