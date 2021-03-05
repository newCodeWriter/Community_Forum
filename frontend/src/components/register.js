/** @format */

import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ confirm, isDisabled, disableForm }) => {
	const [state, setState] = useState({
		reg_user: '',
		reg_pwd1: '',
		reg_pwd2: '',
		reg_user_error: false,
		reg_user_test_error: false,
		reg_pwd_test_error: false,
		reg_pwd_match_error: false,
	});

	const resetState = () => {
		setState({
			reg_user: '',
			reg_pwd1: '',
			reg_pwd2: '',
			reg_user_error: false,
			reg_user_test_error: false,
			reg_pwd_test_error: false,
			reg_pwd_match_error: false,
		});
	};

	const handleInputChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value,
			reg_user_error: false,
			reg_user_test_error: false,
			reg_pwd_test_error: false,
			reg_pwd_match_error: false,
		});
	};

	const checkPwd = () => {
		const pwd_patt = new RegExp(
			'(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}'
		);
		const pwd_test = pwd_patt.test(state.reg_pwd1);
		return pwd_test ? true : false;
	};

	const checkUsername = () => {
		const user_patt = new RegExp(
			'^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9@$!%*#?&]{4,}$'
		);
		const user_test = user_patt.test(state.reg_user);
		return user_test ? true : false;
	};

	const handleRegister = (event) => {
		event.preventDefault();
		if (checkUsername() && checkPwd() && state.reg_pwd1 === state.reg_pwd2) {
			const new_user = {
				user: state.reg_user,
				password: state.reg_pwd1,
			};
			axios
				.post(`/register`, new_user)
				.then((res) => {
					if (res.status === 201) {
						resetState();
						confirm('You are now registered. Please log in.');
					}
				})
				.catch((err) => {
					err.response.status === 409
						? setState({ ...state, reg_user_error: true })
						: console.log(err);
				});
		} else if (!checkUsername()) {
			setState({ ...state, reg_user_test_error: true });
		} else if (!checkPwd()) {
			setState({ ...state, reg_pwd_test_error: true });
		} else {
			setState({ ...state, reg_pwd_match_error: true });
		}
	};

	const switchToLogin = () => {
		resetState();
		disableForm(true);
	};

	const reg_disabled = isDisabled ? true : false;
	const reg_style = {
		cursor: isDisabled ? 'not-allowed' : 'pointer',
		display: isDisabled ? 'none' : 'block',
	};

	return (
		<div className='col-sm-6 d-sm-block border-right pl-4 pr-4 reg-container'>
			<form onSubmit={handleRegister} id='register-form'>
				<h4 className='mb-4'>Register</h4>
				<div className='input-group'>
					<input
						type='text'
						className='form-control reg'
						name='reg_user'
						id='reg_user'
						value={state.reg_user}
						placeholder='Username'
						onChange={handleInputChange}
						disabled={reg_disabled}
					/>
				</div>
				{state.reg_user_test_error ? (
					<ul className='text-danger small errors'>
						Your username must have:
						<li className='reg-error'>At least four characters</li>
						<li className='reg-error'>At least two letters</li>
						<li className='reg-error'>No spaces</li>
					</ul>
				) : (
					<></>
				)}
				{state.reg_user_error ? (
					<div className='text-danger small errors'>
						This user already exists. Please try another username.
					</div>
				) : (
					<></>
				)}
				<div className='input-group mt-3'>
					<input
						type='password'
						className='form-control reg'
						name='reg_pwd1'
						id='reg_pwd1'
						value={state.reg_pwd1}
						placeholder='Password'
						onChange={handleInputChange}
						disabled={reg_disabled}
					/>
				</div>
				{state.reg_pwd_test_error ? (
					<ul className='text-danger small errors'>
						Your password must contain:
						<li className='reg-error'>At least eight characters</li>
						<li className='reg-error'>At least one letter</li>
						<li className='reg-error'>At least one number</li>
						<li className='reg-error'>At least one special character</li>
					</ul>
				) : (
					<></>
				)}
				<div className='input-group mt-3'>
					<input
						type='password'
						className='form-control reg'
						name='reg_pwd2'
						id='reg_pwd2'
						value={state.reg_pwd2}
						placeholder='Confirm Password'
						onChange={handleInputChange}
						disabled={reg_disabled}
					/>
				</div>
				{state.reg_pwd_match_error ? (
					<div className='text-danger small errors'>
						Your passwords do not match.
					</div>
				) : (
					<></>
				)}
				<div className='form-check mt-2'>
					<label htmlFor='terms' className='form-check-label small'>
						<input
							type='checkbox'
							name='terms'
							id='terms'
							className='form-check-input reg'
							disabled={reg_disabled}
							checked={isDisabled ? false : null}
							required
						/>
						I agree to the Terms and Conditions and Privacy Policy
					</label>
				</div>
				<button
					type='submit'
					className='btn btn-success mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg'
					disabled={reg_disabled}
				>
					Register <i className='fas fa-user-plus'></i>
				</button>
				<div
					className='small text-right text-success mb-3'
					id='has-acct'
					onClick={switchToLogin}
					style={reg_style}
				>
					Have an account? Log In
				</div>
			</form>
		</div>
	);
};

export default Register;
