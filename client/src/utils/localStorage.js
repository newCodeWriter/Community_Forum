/** @format */

import decode from "jwt-decode";

const isTokenExpired = (token) => {
	if (token) {
		const decoded = decode(token);
		if (decoded.exp > Date.now() / 1000) {
			return false;
		} else {
			localStorage.removeItem("token");
			return true;
		}
	}
};

export const token = localStorage.getItem("token");

export const loggedIn = !!token && !isTokenExpired(token);

export const tokenDetails = token
	? {
			id: decode(token).id,
			name: decode(token).name,
			email: decode(token).email,
	  }
	: {};
