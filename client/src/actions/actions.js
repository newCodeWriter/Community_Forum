import { LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, FETCH_DATA_FOR_POST, UPDATE_USER, FETCH_DATA_FOR_CATEGORY } from '../constants/constants'
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
  localStorage.clear();
  return {
      type: LOGOUT_USER
  }
}

export function fetchCategoryData(data) {
  return{
    type: FETCH_DATA_FOR_CATEGORY,
    payload: data
  }
}
export function fetchPostData(data) {
	return {
		type: FETCH_DATA_FOR_POST,
		payload: data,
	};
}

export function fetchCategoryInfo(category){
  return async (dispatch) => {
    axios.get(`/category/${category}`)
    .then(res => {
        dispatch(fetchCategoryData(res.data))
      })
      .catch(err => console.log(err));
  };
}

export function fetchPostInfo(id){
  return async (dispatch) => {
    axios.get(`/post/${id}`)
    .then(res => {
        dispatch(fetchPostData(res.data))
    })
    .catch(err => console.log(err));
  };
}

export function changeUser(oldName, newName){
  return async (dispatch) => {
    let data = {
      oldName: oldName, 
      newName: newName
    }
    axios.put(`/update/user`, data)
    .then(dispatch(updateUser(newName)))
    .catch(err => console.log(err));
  };
}

export function updateUser(name) {
  return{
    type: UPDATE_USER,
    payload: name
  }
}