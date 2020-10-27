import decode from 'jwt-decode'

export const userAuth = {
    loggedIn: loggedIn,
    isTokenExpired: isTokenExpired,
    getUser: getUser,
    getToken: getToken
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

function getToken(){
    return localStorage.getItem('token')
}

function getUser(){
    const token = userAuth.getToken();
    return decode(token).name
}