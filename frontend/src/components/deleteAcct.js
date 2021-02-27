/** @format */

import React from 'react';
import Button from 'react-bootstrap/Button';

const DeleteAccount = ({ del }) => {

	const handleSubmit = () => del();

	return (
		<>
			<h5 className='mb-4 acct-font'>
				Are you sure you want to delete your account?
			</h5>
			<Button
				variant='danger'
				name='delBtn'
				type='button'
				className='mb-3'
				onClick={handleSubmit}
			>
				Delete Account
			</Button>
		</>
	);
};
export default DeleteAccount;
