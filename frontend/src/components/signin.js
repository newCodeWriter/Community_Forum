/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import Login from './login';
import Register from './register';

class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disable_login: true,
			disable_registration: false,
			reg_confirmed: '',
			log_user_error: false,
			log_pwd_error: false,
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.attempts !== prevProps.attempts) {
			if (this.props.status === 400) {
				this.setState({ log_user_error: true });
			} else {
				this.setState({ log_pwd_error: true });
			}
		}
	}

	handleLoginErrors = () =>
		this.setState({ log_user_error: false, log_pwd_error: false });

	disableLogin = (childData) =>
		this.setState({
			disable_login: childData,
			disable_registration: !childData,
		});

	disableRegistration = (childData) =>
		this.setState({
			disable_login: !childData,
			disable_registration: childData,
            reg_confirmed: ''
		});

	confirmRegistration = (childData) =>
		this.setState({ reg_confirmed: childData });

	render() {
		const {
			disable_registration,
			disable_login,
			reg_confirmed,
			log_user_error,
			log_pwd_error,
		} = this.state;

		return (
			<>
				<div className='bg-image'></div>
				<div className='home shadow-lg'>
					<div className='pt-3 pb-3 ml-4 mr-4'>
						<h1 className='text-center text-primary font-weight-bolder pt-4'>
							MathQue
						</h1>
						<h5 className='text-secondary mt-3 mb-4 text-center source'>
							Your source for solutions to your toughest math questions.
						</h5>
						<div className='row text-success d-none d-sm-block text-center'>
							{reg_confirmed}
						</div>
						<div className='row pt-2'>
							<Register
								confirm={this.confirmRegistration}
								isDisabled={disable_registration}
								disableForm={this.disableRegistration}
							/>
							<Login
								isDisabled={disable_login}
								disableForm={this.disableLogin}
								userError={log_user_error}
								pwdError={log_pwd_error}
								clearError={this.handleLoginErrors}
                                loginUser={this.props.login}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const { status, loginAttempts } = state.authentication;
	return {
		status: status,
		attempts: loginAttempts,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		login: (data) => dispatch(loginUser(data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
