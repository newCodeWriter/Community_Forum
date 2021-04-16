/** @format */

import React, { useState } from "react";
import Login from "../components/login";
import Register from "../components/register";

const Signin = () => {
	const [disableLogin, setDisableLogin] = useState(false);
	const [disableRegister, setDisableRegister] = useState(true);

	const disableLoginForm = () => {
		setDisableLogin(true);
		setDisableRegister(false);
	};

	const disableRegistrationForm = () => {
		setDisableRegister(true);
		setDisableLogin(false);
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
					<div className="row pt-2">
						<Register
							isDisabled={disableRegister}
							disableForm={disableRegistrationForm}
						/>
						<Login isDisabled={disableLogin} disableForm={disableLoginForm} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Signin;
