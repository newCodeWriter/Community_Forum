import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { userAuth } from '../checkAuth';

export default function ChangeAcct({match}){
    const [ state, setState ] = useState({
        pw_action: false,
        user_action: false, 
        delete_action: false,
        user_error: '',
        user_ok: '',
        pw_error: ''
    })

    let history = useHistory();

    function handleSelect(event){
        if(event.target.value === 'change password'){
            setState({
                pw_action: true,
                user_action: false, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
        else if(event.target.value === 'change username'){
            setState({
                pw_action: false,
                user_action: true, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
        else if(event.target.value === 'delete account'){
            setState({
                pw_action: false,
                user_action: false, 
                delete_action: true,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
        else{
            setState({
                pw_action: false,
                user_action: false, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
    }

    function handleCheck(){
        const current_name = userAuth.getUser();
        const new_name = document.getElementById('new_name').value.toLowerCase();
        if(new_name.length >= 4 && new_name !== current_name){
            axios.get(`/check/${new_name}`)
            .then(res => {
                if(res.data === 'ok'){
                    setState({
                        pw_action: false,
                        user_action: true, 
                        delete_action: false,
                        user_error: '',
                        user_ok: 'This username is available.',
                        pw_error: ''
                    })
                }
                else if(res.data === 'not available'){
                    setState({
                        pw_action: false,
                        user_action: true, 
                        delete_action: false,
                        user_error: 'This username is not available. Please try another.',
                        user_ok: '',
                        pw_error: ''
                    })
                }
            })
            .catch(err => console.error(err.message))
        }
        else if(new_name.length < 4){
            setState({
                pw_action: false,
                user_action: true, 
                delete_action: false,
                user_error: 'Username must be at least 4 characters.',
                user_ok: '',
                pw_error: ''
            })
        }
        else if(new_name === current_name){
            setState({
                pw_action: false,
                user_action: true, 
                delete_action: false,
                user_error: 'The name you entered matches your current username.',
                user_ok: '',
                pw_error: ''
            })
        }
    }
   

    // function handleReturn(){
    //     history.goBack()
    // }
    function handleTextChange(){
        const action = document.getElementById('actions').value;
        if(action === 'change username'){
            setState({
                pw_action: false,
                user_action: true, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
        else if(action === 'change password'){
            setState({
                pw_action: true,
                user_action: false, 
                delete_action: false,
                user_error: '',
                user_ok: '',
                pw_error: ''
            })
        }
    }

    return (
        <div className="w-50 ml-5">
            <h3 className="mb-4">{userAuth.getUser().toUpperCase()}, select an action:</h3>
            <Form.Control as="select" custom className="mb-5 w-50" defaultValue="" onChange={handleSelect} id="actions">
                <option value="action"></option>
                <option value="change username">Change Username</option>
                <option value="change password">Change Password</option>
                <option value="delete account">Delete Account</option>
            </Form.Control>
            {state.user_action === true 
            ? <Form>
                <Form.Group className="mt-2">
                    <Form.Label>Current Username:</Form.Label>
                    <Form.Control type="text" className="mb-3" placeholder={userAuth.getUser()} readOnly />
                </Form.Group>
                <Form.Label>New Username:</Form.Label>
                <InputGroup className="mb-1">
                    <FormControl placeholder="New Username" id="new_name" onChange={handleTextChange}/>
                    <InputGroup.Append>
                        <Button variant="secondary" onClick={handleCheck}>Check?</Button>
                    </InputGroup.Append>
                </InputGroup>
                <div className="text-success small">{state.user_ok}</div>
                <div className="text-danger small">{state.user_error}</div>
                <Button variant="primary" type="button" className="mr-2 mt-4 p-2">Submit</Button>
              </Form>
            : null
            }
            {state.pw_action === true 
            ? <Form>
                <Form.Group>
                    <Form.Label>Current Password:</Form.Label>
                    <Form.Control type="password" className="mb-3" placeholder="Old Password" onChange={handleTextChange}/>
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control type="password" className="mb-3" placeholder="New Password" onChange={handleTextChange}/>
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" onChange={handleTextChange}/>
                </Form.Group>
                <Button variant="primary" type="button">Submit</Button>
              </Form>
            : null
            }
            {state.delete_action === true 
            ? <div>
                <h4 className="mb-4">Are you sure you want to delete your account?</h4>
                <Button variant="danger" type="button" className="mr-3">Confirm</Button>
              </div>
            : null
            }
        </div>
    )
};