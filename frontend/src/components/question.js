import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { copyState } from '../localStorage'
import { fetchCategoryInfo } from '../actions'

function Question({ match, dispatch }){
    const [ error, setError ] = useState({
        mark: '',
        length: ''
    })

    const history = useHistory();

    const { userName, userId } = copyState().authentication

    function handleForm(event){
        event.preventDefault();
        let text = document.getElementById('question').value; 
        let user_id = userId;
        let data = {
            user: user_id, 
            category: match.params.subjectId, 
            question: text
        }
        if(text.endsWith('?') && text.length >= 10){
            axios.post('/question', data)
            .then(history.goBack())
            .then(dispatch(fetchCategoryInfo(match.params.subjectId)))
            .catch(console.error())
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
        <div className="set-width mx-auto">
            <form id="question_form">
                <div className="row mt-3 text-muted">
                    <div className="col">
                        <div className="text-danger small">{error.mark}</div>
                        <div className="mb-2 text-danger small">{error.length}</div>
                        <label htmlFor="question" className="d-block">{userName.toUpperCase()}, enter your question:</label>
                        <textarea id="question" name="question" className="p-3 mb-4 w-100" onChange={handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                    </div>
                </div>
            </form>
            <Button form="question_form" variant="primary" type="submit" onClick={handleForm} className="p-2 mr-3">Submit</Button>
            <Button variant="secondary" type="button" onClick={handleReturn} className="p-2">Back to Questions</Button>
        </div>
    )
}
export default connect()(Question)