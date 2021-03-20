import decode from 'jwt-decode'

export const userAuth = {
    loggedIn: loggedIn,
    isTokenExpired: isTokenExpired,
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
            localStorage.clear();
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

export const copyState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };

export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      console.log(err)
    }
};