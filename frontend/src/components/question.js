import React, { useState } from 'react'
// import { math } from '../constants'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { useHistory } from 'react-router-dom';

export default function Question({match}){
    // const subject = math.find(({ id }) => id === match.params.subjectId)
    const [ error, setError ] = useState({
        mark: '',
        length: ''
    })

    let history = useHistory();

    function handleForm(event){
        event.preventDefault();
        let text = document.getElementById('question').value; 
        if(text.endsWith('?') && text.length >= 10){
            axios.post('/question', {question: text})
            .then(history.replace('/home'))
            .catch(err => {
                console.log(err)
            })
        }
        else if(!text.endsWith('?') && text.length < 10){
            setError({mark: 'Your question does not end with a "?"', 
                    length: 'Your question must be at least 10 characters long.'})
        }
        else if(!text.endsWith('?')){
            setError({mark: 'Your question does not end with a "?"', 
                    length: ''})
        }
        else{
            setError({mark: '', 
            length: 'Your question must be at least 10 characters long.'}) 
        }

    }

    function handleReturn(){
        history.goBack()
    }
    function handleTextChange(){
        setError({mark: '', 
                length: ''})
    }


    return (
        <div className="mt-5 w-75 mx-auto">
            <form id="question_form">
                <div className="row mt-3 text-muted">
                    <div className="col">
                        <div className="text-danger small">{error.mark}</div>
                        <div className="mb-2 text-danger small">{error.length}</div>
                        <label htmlFor="question" className="d-block">User, enter your question:</label>
                        <textarea id="question" name="question" className="p-3 mb-4" onChange={handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                    </div>
                </div>
            </form>
            <Button form="question_form" variant="primary" type="submit" onClick={handleForm} className="p-2 mr-3">Submit Question</Button>
            <Button variant="secondary" type="button" onClick={handleReturn} className="p-2"><a>Back to Questions</a></Button>
        </div>
    )
};