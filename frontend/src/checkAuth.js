import decode from 'jwt-decode'

export const userAuth = {
    loggedIn: loggedIn,
    isTokenExpired: isTokenExpired,
    getUser: getUser,
    getToken: getToken, 
    logout: logout
}

function loggedIn(){ 
    const token = userAuth.getToken();
    // token exists && is not expired
    return !!token && !userAuth.isTokenExpired(token)
}

function isTokenExpired(token) {
    try {
        const decoded = decode(token);
        if (decoded.exp > Date.now() / 1000) {
            return false
        }
        else
            return true
    }
    catch(err) {
        console.log(err)
        return false
    }
}

// function setToken(token_name, token){
//     localStorage.setItem(token_name, JSON.stringify(token))
// }

function getToken(){
    return localStorage.getItem('token')
}

function logout(){
    localStorage.removeItem('token')
    return console.log('You are now logged out.')
}

function getUser(){
    const token = userAuth.getToken();
    return decode(token).name
}