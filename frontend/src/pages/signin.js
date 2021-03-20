/** @format */

import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../actions/actions";
import Login from "../components/login";
import Register from "../components/register";

class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disableLogin: false,
			disableRegistration: true,
			regConfirmed: "",
			logUserError: false,
			logPwdError: false,
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.attempts !== prevProps.attempts) {
			if (this.props.status === 400) {
				this.setState({ logUserError: true });
			} else {
				this.setState({ logPwdError: true });
			}
		}
	}

	handleLoginErrors = () =>
		this.setState({ logUserError: false, logPwdError: false });

	disableLogin = () =>
		this.setState({
			disableLogin: true,
			disableRegistration: false,
			logUserError: false,
			logPwdError: false,
		});

	disableRegistration = () =>
		this.setState({
			disableLogin: false,
			disableRegistration: true,
			regConfirmed: "",
		});

	confirmRegistration = (childData) =>
		this.setState({ regConfirmed: childData });

	render() {
		const {
			disableRegistration,
			disableLogin,
			regConfirmed,
			logUserError,
			logPwdError,
		} = this.state;
		const loginErrors = {
			user: logUserError,
			pwd: logPwdError,
			clear: this.handleLoginErrors,
		};

		return (
			<>
				<div className="bg-image"></div>
				<div className="home shadow-lg">
					<div className="pt-3 pb-3 ml-4 mr-4">
						<h1 className="text-center text-primary font-weight-bolder pt-4">
							MathQue
						</h1>
						<h5 className="text-secondary mt-3 mb-4 text-center source">
							Your source for solutions to your toughest math questions.
						</h5>
						<div className="row text-success d-none d-sm-block text-center">
							{regConfirmed}
						</div>
						<div className="row pt-2">
							<Register
								confirm={this.confirmRegistration}
								isDisabled={disableRegistration}
								disableForm={this.disableRegistration}
							/>
							<Login
								isDisabled={disableLogin}
								disableForm={this.disableLogin}
								errors={loginErrors}
								loginUser={this.props.loginUser}
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
const mapDispatchToProps = {
	loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
