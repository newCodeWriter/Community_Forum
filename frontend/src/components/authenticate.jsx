// import React, {Component} from 'react';
// import axios from 'axios'; 
// import decode from 'jwt-decode';


export const userAuth = {
    // login: login,
    loggedIn: loggedIn,
    setToken: setToken,
    getToken: getToken, 
    logout: logout
}

// function login(username, password){
//     // Get a token from api server
//     return axios.post(`/login`, {username: username, password: password})
//             .then(res => {
//                 if(res.data.accessToken){
//                     userAuth.setToken(username, res.data.accessToken);
//                     console.log('it is a success');
//                     console.log(res);
//                 }
//                 else{
//                     console.log(res)
//                 }
//             })
//             .then(document.getElementById('login-form').reset())
//             .catch(err => {
//                 if(err.response.status === 400){
//                     console.log('This user does not exist.')
//                 }
//                 else if(err.response.status === 404){
//                     console.log('You entered an incorrect password.')
//                 }
//                 else{
//                     console.log(err.response.status)
//                 }
//             })
// };

function loggedIn(){
    // const token = this.getToken()
    // // token exists && is not expired
    // return !!token && !this.isTokenExpired(token)
    console.log('Does this work from here?')
}

function setToken(token_name, idToken){
    localStorage.setItem(token_name, idToken)
}

function getToken(user){
    return console.log(localStorage.getItem(user))
}

function logout(user){
    localStorage.removeItem(user)
}
