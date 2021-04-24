/** @format */

import React, { useState } from "react";
import ChangeUser from "../components/changeUser";
import ChangePwd from "../components/changePwd";
import ChangeEmail from "../components/changeEmail";
import { Row, Col, Button } from "react-bootstrap";
import { useStateContext } from "../context/context";
import DeleteAccount from "../components/deleteAcct";

const Account = () => {
	const [nameChange, setNameChange] = useState(false);
	const [emailChange, setEmailChange] = useState(false);
	const [pwdChange, setPwdChange] = useState(false);
	const [deleteAcct, setDeleteAcct] = useState(false);
	const { user } = useStateContext();

	const editName = () => setNameChange(true);
	const editEmail = () => setEmailChange(true);
	const editPassword = () => setPwdChange(true);
	const editAccount = () => setDeleteAcct(true);
	const cancelNameEdit = () => setNameChange(false);
	const cancelEmailEdit = () => setEmailChange(false);
	const cancelPwdEdit = () => setPwdChange(false);
	const cancelDelete = () => setDeleteAcct(false);

	return (
		<div id="acct">
			<Row className="border-bottom mb-4 mr-1">
				<Col>
					<h3>Personal Info</h3>
				</Col>
			</Row>
			<Row id="profile-icon" className="mb-5">
				<i className="fas fa-user-circle fa-9x"></i>
			</Row>
			<Row className="mb-3 acct-font">
				<Col xs={4} sm={5} md={4} lg={3}>
					<Row>
						<Col xs={6}>
							<div>Username</div>
						</Col>
						<Col xs={6}>
							{!nameChange && (
								<i
									id={`editUsername`}
									className="fas fa-edit small ml-2"
									onClick={editName}
								></i>
							)}
							{nameChange && (
								<i
									id={`cancelPassword`}
									className="fas fa-times-circle ml-2"
									onClick={cancelNameEdit}
								></i>
							)}
						</Col>
					</Row>
				</Col>
				<Col xs={8} sm={7} md={8} lg={9}>
					<div className="border-bottom pb-1 text-muted">{user?.name}</div>
					{nameChange && <ChangeUser update={cancelNameEdit} />}
				</Col>
			</Row>
			<Row className="mb-3 acct-font">
				<Col xs={4} sm={5} md={4} lg={3}>
					<Row>
						<Col xs={6}>
							<div>Email</div>
						</Col>
						<Col xs={6}>
							{!emailChange && (
								<i
									id={`editEmail`}
									className="fas fa-edit small ml-2"
									onClick={editEmail}
								></i>
							)}
							{emailChange && (
								<i
									id={`cancelPassword`}
									className="fas fa-times-circle ml-2"
									onClick={cancelEmailEdit}
								></i>
							)}
						</Col>
					</Row>
				</Col>
				<Col xs={8} sm={7} md={8} lg={9}>
					{!emailChange && (
						<div className="border-bottom text-muted">*********</div>
					)}
					{emailChange && <ChangeEmail update={cancelEmailEdit} />}
				</Col>
			</Row>
			<Row className="mb-3 acct-font">
				<Col xs={4} sm={5} md={4} lg={3}>
					<Row>
						<Col xs={6}>
							<div>Password</div>
						</Col>
						<Col xs={6}>
							{!pwdChange && (
								<i
									id={`editPassword`}
									className="fas fa-edit small ml-2"
									onClick={editPassword}
								></i>
							)}
							{pwdChange && (
								<i
									id={`cancelPassword`}
									className="fas fa-times-circle ml-2"
									onClick={cancelPwdEdit}
								></i>
							)}
						</Col>
					</Row>
				</Col>
				<Col xs={8} sm={7} md={8} lg={9}>
					{!pwdChange && (
						<div className="border-bottom text-muted">*********</div>
					)}
					{pwdChange && <ChangePwd update={cancelPwdEdit} />}
				</Col>
			</Row>
			{!deleteAcct && (
				<Button variant="danger" className="mt-5" onClick={editAccount}>
					Delete Account
				</Button>
			)}
			{deleteAcct && <DeleteAccount update={cancelDelete}/>}
		</div>
	);
};
export default Account;
