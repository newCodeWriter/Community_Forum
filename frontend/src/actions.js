import { LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, FETCH_DATA, GET_AUTH } from './constants'
import axios from 'axios'

export const loginUser = (loginData) => {
   return async (dispatch) => {
    axios
      .post(`/login`, loginData)
      .then(res => {
        dispatch(loginUserSuccess(res.data.accessToken))
      })
      .catch(err => {
        dispatch(loginUserFailure(err))
        console.log(err)
      });
  }; 
};

export function loginUserSuccess(token) {
  localStorage.setItem('token', token);
  return{
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserFailure(error) {
  localStorage.removeItem('token');
  return{
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status
    }
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
      type: LOGOUT_USER
  }
}

export function fetchDataRequest(token) {

  return dispatch => {
    return axios.get(`/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      dispatch(fetchData(res.data));
      console.log(res.data);
    })
    .catch(error => {
      dispatch(loginUserFailure(error));
      console.log(error);
    })
  }
}

export const fetchData = data => ({
  type: FETCH_DATA,
  payload: {
    data: data
  }
})

export const getAuthorization = () => ({
  type: GET_AUTH
})