import { LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, FETCH_DATA, GET_AUTH } from './constants'
import axios from 'axios'

let counter = 1

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
      status: error.response.status,
      attempts: counter++
    }
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
      type: LOGOUT_USER
  }
}

export function fetchData(data) {
  return{
    type: FETCH_DATA,
    payload: data
  }
}

export function fetchCategoryInfo(category){
  return async (dispatch) => {
    axios.get(`/category/${category}`)
    .then(res => {
        dispatch(fetchData(res.data))
      })
      .catch(err => console.log(err));
  };
}

export function fetchAnswers(id){
  return async (dispatch) => {
    axios.get(`/post/${id}`)
    .then(res => {
        dispatch(fetchData(res.data))
      })
      .catch(err => console.log(err));
  };
}

export const getAuthorization = () => ({
  type: GET_AUTH
})

export function changeUser(old_name, new_name){
  return async (dispatch) => {
    let data = {
      old_name: old_name, 
      new_name: new_name
    }
    axios.put(`/update/user`, data)
    .then(dispatch(fetchData(new_name)))
    .catch(err => console.log(err));
  };
}