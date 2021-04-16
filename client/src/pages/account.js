/** @format */

import React from 'react';
import ChangeUser from '../components/changeUser';
import ChangePwd from '../components/changePwd';

const Account = () => {
	// const handleUserChange = (child) => {
	// 	dispatch(changeUser(child.oldUser, child.newUser));
	// };

	return (
		<div id='acct-chg' >
			<h4 className='mb-3'>Change Username: </h4>
			<ChangeUser />
			<h4 className='mt-2 mb-3'>Change Password:</h4>
			<ChangePwd />
		</div>
	);
}
export default Account;
