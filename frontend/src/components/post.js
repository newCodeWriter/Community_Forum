import React, { useState } from 'react'
// import { math } from '../constants'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

export default function Post({match}){
    // const subject = math.find(({ id }) => id === match.params.subjectId)
    const [state, setState] = useState({
        show: false, 
        error: ''
    });

    const handleClose = () => setState({
        show: false,
        error: ''
    });

    const handleShow = () => setState({
        show: true,
        error: ''
    });

    const handleSubmit = () => {
        var text = document.getElementById('answer').value;
        if(text.length >= 5){
            axios.post('/answer', {answer: text})
            .then(window.location.reload())
            .catch(err => console.log(err))
        }
        else{
            setState({
                show: true,
                error: 'You must enter at least 5 characters.'
            })
        }
    };

    const handleTextChange = () => setState({
        show: true,
        error: ''
    });

    return (
        <div className="mt-5 w-75 mx-auto">
            <div className="row">
                <div className="col-md-8 text-muted">
                    <h3>Question text</h3>
                    <div>Submitted by: <span className="text-primary">User</span>, Date Time</div>
                </div>
                <div className="col-md-4 text-primary text-right">
                    <Button variant="outline-dark" onClick={handleShow} type="button" className="p-2" title="Have an answer?">Answer</Button>
                </div>
            </div>
            <div className="row mt-4 w-100">
                <div className="col">Answers:</div>
            </div>
            <div className="row mt-3 text-muted">
                <div className="col">Some Text Some Text Some Text</div>
            </div>
            <div className="row mt-1 font-weight-bold text-right small">
                <div className="col">answered date time by <span className="text-success">User</span></div>
            </div>
            {/* Modal */}
            <Modal show={state.show} onHide={handleClose} centered>
                <Modal.Body>
                    <label htmlFor="answer" className="d-block mb-4">Question Text?...</label>
                    <div className="text-danger small mb-2">{state.error}</div>
                    <textarea id="answer" name="answer" className="p-3 mb-4 w-100" onChange={handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                    <Button variant="primary" onClick={handleSubmit} className="mr-3">Submit</Button>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </div>
    )
};