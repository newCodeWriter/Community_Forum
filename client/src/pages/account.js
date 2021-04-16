/** @format */

import React from 'react';
import { connect } from 'react-redux';
import { changeUser } from '../actions/actions';
import ChangeUser from '../components/changeUser';
import ChangePwd from '../components/changePwd';

const Account = ({ dispatch }) => {
	const handleUserChange = (child) => {
		dispatch(changeUser(child.oldUser, child.newUser));
	};

	return (
		<div id='acct-chg' >
			<h4 className='mb-3'>Change Username: </h4>
			<ChangeUser submit={handleUserChange} />
			<h4 className='mt-2 mb-3'>Change Password:</h4>
			<ChangePwd />
		</div>
	);
}
export default connect()(Account);
