import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { copyState } from '../localStorage';
import { changeUser, logout } from '../actions'

function ChangeAcct({ dispatch }){
    const [ state, setState ] = useState({
        pw_action: false,
        user_action: false, 
        delete_action: false,
        user_error: '',
        user_ok: '',
        pw_error: '', 
        pwd_test_error: false,
        disabled: true
    })

    let history = useHistory();

    const { userName } = copyState().authentication;

    function handleSelect(event){
        if(event.target.value === 'change password'){
            setState({
                pw_action: true,
                user_action: false, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: '',
                pwd_test_error: false,
                disabled: true
            })
        }
        else if(event.target.value === 'change username'){
            setState({
                pw_action: false,
                user_action: true, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: '',
                pwd_test_error: false,
                disabled: true
            })
        }
        else if(event.target.value === 'delete account'){
            setState({
                pw_action: false,
                user_action: false, 
                delete_action: true,
                user_error: '',
                user_ok: '',
                pw_error: '',
                pwd_test_error: false,
                disabled: true
            })
        }
        else{
            setState({
                pw_action: false,
                user_action: false, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: '', 
                pwd_test_error: false,
                disabled: true
            })
        }
    }

    function handleCheck(){
        const current_name = userName;
        const new_name = document.getElementById('new_name').value.toLowerCase();
        if(new_name !== current_name){
            axios.get(`/check/${new_name}`)
            .then(res => {
                if(res.data === 'ok'){
                    setState(prevState => {
                        return {
                            ...prevState, 
                            user_ok: 'This username is available.',
                            disabled: false 
                        };
                    });
                }
                else if(res.data === 'not available'){
                    setState(prevState => {
                        return {
                            ...prevState, 
                            user_error: 'This username is not available. Please try another.'
                        };
                    });
                }
            })
            .catch(err => console.error(err.message))
        }
        else if(new_name === current_name){
            setState(prevState => {
                return {
                    ...prevState, 
                    user_error: 'The name you entered matches your current username.'
                };
            });
        }
    }

    function handleSubmit(event){
        event.preventDefault();
        if(event.target.name === 'userBtn'){
            var newName = document.getElementById('new_name').value.toLowerCase();
            dispatch(changeUser(userName, newName));
            history.replace('/');
        }
        else if(event.target.name === 'pwdBtn'){
            const patt = new RegExp("(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}");
            const oldPwd = document.getElementById('oldPwd').value;
            var newPwd = document.getElementById('newPwd').value;
            var conPwd = document.getElementById('conPwd').value;
            const pwd_test = patt.test(newPwd);

            if(newPwd.length === 0 || oldPwd.length === 0 || conPwd.length === 0){
                setState(prevState => {
                    return {
                        ...prevState, 
                        pw_error: 'A value is required for each field.'
                    };
                });
            }
            else if(pwd_test && oldPwd !== newPwd && newPwd === conPwd){
                var update_pwd = {
                    user: userName,
                    old_pwd: oldPwd,
                    new_pwd: newPwd
                }
    
                axios.put(`/update/password`, update_pwd)
                .then(res => {
                    if(res.data === 'wrong password'){
                        setState(prevState => {
                            return {
                                ...prevState, 
                                pw_error: 'You have entered an incorrect password.'
                            };
                        });
                    }
                    else{
                        console.log(res.data)
                        document.getElementById('pwd-form').reset();
                    }
                })
                .catch(err => { console.log(err) })
            }
            else if(oldPwd === newPwd){
                setState(prevState => {
                    return {
                        ...prevState, 
                        pw_error: 'Your new password matches your old password. Please enter a new password.'
                    };
                });
            }
            else if(!pwd_test){
                setState(prevState => {
                    return {
                        ...prevState, 
                        pwd_test_error: true
                    };
                });
            }
            else{
                setState(prevState => {
                    return {
                        ...prevState, 
                        pw_error: 'Your passwords do not match.',
                    };
                });
            }
        }
        else if(event.target.name === 'delBtn'){
            axios.delete(`/delete/${userName}`)
            .then(dispatch(logout()))
            .then(window.location.reload())
            .catch(err => console.log(err))
        }
    }
   
    function handleTextChange(){
        const action = document.getElementById('actions').value;
        if(action === 'change username'){
            setState(prevState => {
                return {
                    ...prevState, 
                    user_error: '',
                    disabled: true
                };
            });
        }
        else if(action === 'change password'){
            setState(prevState => {
                return {
                    ...prevState, 
                    pw_error: '',
                    pwd_test_error: false
                };
            });
        }
    }

    return (
        <div id="acct-chg" className="w-100 ml-5">
            <h3 className="mb-4 acct-font">{userName.toUpperCase()}, select an action:</h3>
            <Form.Control as="select" custom className="mb-5 w-75" defaultValue="" onChange={handleSelect} id="actions">
                <option value="action"></option>
                <option value="change username">Change Username</option>
                <option value="change password">Change Password</option>
                <option value="delete account">Delete Account</option>
            </Form.Control>
            {state.user_action === true 
            ? <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Current Username:</Form.Label>
                    <Form.Control type="text" className="mb-3" placeholder={userName} readOnly />
                </Form.Group>
                <Form.Label>New Username:</Form.Label>
                <InputGroup className="mb-1">
                    <FormControl placeholder="New Username" id="new_name" onChange={handleTextChange} pattern="(?=.*[A-Za-z].*[A-Za-z]).{4,}" title="You must enter at least 4 characters with at least two letter characters."/>
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={handleCheck}>Check?</Button>
                    </InputGroup.Append>
                </InputGroup>
                <div className="text-success small">{state.user_ok}</div>
                <div className="text-danger small">{state.user_error}</div>
                <Button variant="primary" name="userBtn" type="button" className="mr-2 mt-4 p-2 mb-3" disabled={state.disabled} onClick={handleSubmit}>Submit</Button>
              </Form>
            : null
            }
            {state.pw_action === true 
            ? <Form id="pwd-form">
                <Form.Group>
                    <Form.Label>Current Password:</Form.Label>
                    <Form.Control type="password" id="oldPwd" className="mb-3" placeholder="Old Password" onChange={handleTextChange}/>
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control type="password" id="newPwd" className="mb-3" placeholder="New Password" onChange={handleTextChange}/>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control type="password" id="conPwd" placeholder="Confirm Password" onChange={handleTextChange}/>
                    <div className="text-danger small">{state.pw_error}</div>
                    {state.pwd_test_error 
                    ? <ul className="text-danger small errors">
                        Your new password must contain: 
                        <li className="pwd-error">At least eight characters</li>
                        <li className="pwd-error">At least one letter</li>
                        <li className="pwd-error">At least one number</li>
                        <li className="pwd-error">At least one special character</li>
                    </ul>
                    : <div></div>
                    }
                </Form.Group>
                <Button variant="primary" className="mt-3 mb-3" name="pwdBtn" type="button" onClick={handleSubmit}>Submit</Button>
              </Form>
            : null
            }
            {state.delete_action === true 
            ? <div>
                <h4 className="mb-4 acct-font">Are you sure you want to delete your account?</h4>
                <Button variant="danger" name="delBtn" type="button" className="mb-3" onClick={handleSubmit}>Confirm</Button>
              </div>
            : null
            }
        </div>
    )
}
export default connect()(ChangeAcct);