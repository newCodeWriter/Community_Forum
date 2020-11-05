import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { fetchAnswers, fetchCategoryInfo } from '../actions'
import axios from 'axios'
import { copyState } from '../localStorage'

class Post extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false, 
            show_question: false,
            error: '',
            mark_error: '',
            length_error: '',
            answers: [],
            username: copyState().authentication.userName,
            edit_btn: false,
            answer_id: null,
            answer_text: null, 
            redirect: false
        }
    }

    componentDidMount(){
        this.props.dispatch(fetchAnswers(this.props.match.params.questionId))
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            this.setState({answers: this.props.data[0]});
        }
    }

    handleClose = () => {
        this.setState({
            show: false,
            edit_btn: false, 
            show_question: false
        })
    }

    handleShow = () => this.setState({show: true})

    handleAnswer = () => {
        var text = document.getElementById('answer').value;
        var replace = text.replace(/(\r\n|\r)/gm,"\n");
        
        var data = {
            user: this.state.username,
            id: this.props.match.params.questionId,
            answer: replace
        }
        if(text.length >= 5){
            axios.post('/answer', data)
            // find a way to have the server return the new answer and then add it to this.state.answers
            .then(this.setState({show: false}))
            .then(this.props.dispatch(fetchAnswers(this.props.match.params.questionId)))
            .catch(err => console.log(err))
        }
        else{
            this.setState({error: 'You must enter at least 5 characters.'})
        }
    };

    handleTextChange = () => this.setState({
        error: '',
        mark_error: '',
        length_error: ''
    })

    handleEdit = (event) => {
        if(event.target.className.includes('open_question')){
            this.setState({ show_question: true })
        }
        else{
            this.setState({
                edit_btn: true,
                show: true, 
                answer_text: this.state.answers.filter(ans => ans.response_id === parseInt(event.target.id))
            })
        }
    }

    handleUpdateAnswer = async () => {
        var original = this.state.answer_text[0].response;
        var update = document.getElementById('updated_answer').value;
        var id = this.state.answer_text[0].response_id
        if(update.length >= 5 && original !== update){
            var replace = update.replace(/(\r\n|\r)/gm,"\n");
            var data = { update: replace }
            
            axios.put(`/update/answer/${id}`, data)
            .then(this.setState({show: false}))
            .then(this.props.dispatch(fetchAnswers(this.props.match.params.questionId)))
            .catch(err => console.log(err))
        }
        else if(original === update){
            this.setState({error: 'You have made no changes. Please update or press cancel.'})
        }
        else{
            this.setState({error: 'You must enter at least 5 characters.'})
        }
    }

    handleDelete = (event) => {
        if(event.target.className.includes('delete_question')){
            var question_id = this.props.match.params.questionId;
            axios.delete(`/delete/question/${question_id}`)
            .then(this.setState({redirect: true}))
            .then(this.props.dispatch(fetchCategoryInfo(this.props.match.params.subjectId)))
            .catch(err => console.log(err))
        }
        else{
            var answer_id = parseInt(event.target.className.replace('fas fa-trash-alt ', ''));
            var index = this.state.answers.findIndex(ans => ans.response_id === answer_id);
            var copy = this.state.answers.slice();
            copy.splice(index,1);
    
            axios.delete(`/delete/answer/${answer_id}`)
            .then(this.props.dispatch(fetchAnswers(this.props.match.params.questionId)))
            .catch(err => console.log(err))
        }
    }

    handleUpdateQuestion = () => {
        let original = this.state.answers[0].question
        let update = document.getElementById('updated_question').value; 
        let id = this.props.match.params.questionId;
        let data = { update: update }
        if(original === update){
            this.setState({
                error: 'You have made no changes. Please update or press cancel.',
                mark_error: '',
                length_error: ''
            })
        }
        else{
            if(update.endsWith('?') && update.length >= 10){
                axios.put(`/update/question/${id}`, data)
                .then(this.setState({show_question: false}))
                .then(this.props.dispatch(fetchAnswers(this.props.match.params.questionId)))
                .catch(console.error())
            }
            else if(!update.endsWith('?') && update.length < 10){
                this.setState({
                    error: '',
                    mark_error: 'Your question does not end with a "?"', 
                    length_error: 'Your question must be at least 10 characters long.'
                })
            }
            else if(!update.endsWith('?')){
                this.setState({
                    error: '',
                    mark_error: 'Your question does not end with a "?"', 
                    length_error: ''
                })
            }
            else{
                this.setState({
                    mark_error: '', 
                    length_error: 'Your question must be at least 10 characters long.'
                }) 
            }
        }
    }

    render(){
        if(this.state.redirect === true){
            return <Redirect to={`/home/${this.props.match.params.subjectId}`} />
        }
        else{
            return(
                <div className="set-width mx-auto">
                    {this.state.answers.length >= 1 && this.state.username === this.state.answers[0].submit_user
                    ? <div className="row">
                        <div className="col-12 col-lg-10">
                            <h4>{this.state.answers.length === 0 ? null : this.state.answers[0].question}</h4>
                            <div className="mq-font">Submitted by: <span className="text-primary">{this.state.answers.length === 0 ? null : this.state.answers[0].submit_user}</span>,&nbsp; 
                                {this.state.answers.length === 0 ? null : this.state.answers[0].question_date} 
                                <i className="fas fa-edit mt-2 small ml-2 mr-2 open_question" onClick={this.handleEdit}></i>
                                <i className="fas fa-trash-alt delete_question" onClick={this.handleDelete}></i>
                            </div>
                        </div>
                        <div id="answer-btn" className="col-12 col-lg-2 mt-3 mt-lg-0 text-primary text-right">
                            <Button variant="success" onClick={this.handleShow} type="button" className="p-2" title="Have an answer?">Answer</Button>
                        </div>
                    </div>
                    : <div className="row">
                        <div className="col-md-10">
                            <h3>{this.state.answers.length === 0 ? null : this.state.answers[0].question}</h3>
                            <div>Submitted by: <span className="text-primary">{this.state.answers.length === 0 ? null : this.state.answers[0].submit_user}</span>,&nbsp; 
                                {this.state.answers.length === 0 ? null : this.state.answers[0].question_date}
                            </div>
                        </div>
                        <div className="col-md-2 text-primary text-right">
                            <Button variant="success" onClick={this.handleShow} type="button" className="p-2" title="Have an answer?">Answer</Button>
                        </div>
                    </div>
                    }
                <div className="row mt-4 w-100">
                    {this.state.answers.length === 1 && this.state.answers[0].answer_user === undefined ? null : <div className="col mb-2">Answers:</div>}
                </div>
                {this.state.answers.map((answer) => (
                    <div key={`answer_${answer.response_id}`}>
                        {this.state.username !== `${answer.answer_user}` 
                        ? <div className="row text-muted tryit">
                            <div className="col mt-2 tryit" value={answer.response}>{answer.response}</div>
                        </div> 
                        : <div>
                            <div className="row">
                                <div className="col">
                                    <i id={answer.response_id} className="fas fa-edit mt-2 small mr-2" onClick={this.handleEdit}></i>
                                    <i className={`fas fa-trash-alt ${answer.response_id}`} onClick={this.handleDelete}></i>
                                </div>
                            </div>
                            <div className="row text-muted tryit">
                                <div id={`edit_${answer.response_id}`} value={answer.response} className="col mt-2 tryit">{answer.response}</div>
                            </div> 
                        </div>
                        }
                        {this.state.answers[0].answer_user === undefined ? null :
                            <div>
                                <div className="row">
                                    <div className="font-weight-bold text-right small col">answered {answer.response_date} by <span className="text-success">{answer.answer_user}</span></div>
                                </div><hr/>
                            </div>
                        }
                    </div>
                ))}
                {/* Answer Modal */}
                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Body>
                        {this.state.edit_btn && this.state.answers.length >= 1 
                        ? <div>
                            <label htmlFor="updated_answer" className="d-block mb-4">{this.state.answers.length === 0 ? null : this.state.answers[0].question}</label>
                            <div className="text-danger small mb-2">{this.state.error}</div>
                            <textarea id="updated_answer" name="updated_answer" defaultValue={this.state.answer_text[0].response} className="p-3 mb-4 w-100" onChange={this.handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                            <Button variant="primary" onClick={this.handleUpdateAnswer} name={this.state.answer_text[0].response_id} className="mr-3">Update</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                        </div>
                        : <div>
                            <label htmlFor="answer" className="d-block mb-4">{this.state.answers.length === 0 ? null : this.state.answers[0].question}</label>
                            <div className="text-danger small mb-2">{this.state.error}</div>
                            <textarea id="answer" name="answer" className="p-3 mb-4 w-100" onChange={this.handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                            <Button variant="primary" onClick={this.handleAnswer} className="mr-3">Submit</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                        </div>
                        }
                    </Modal.Body>
                </Modal>
                {/* Question Modal */}
                <Modal show={this.state.show_question} onHide={this.handleClose} centered>
                    <Modal.Body>
                        {this.state.answers.length >= 1 
                        ? <div>
                            <label htmlFor="updated_question" className="d-block mb-3">{this.state.answers[0].submit_user.toUpperCase()}, update your question:</label>
                            <div className="text-danger small">{this.state.error}</div>
                            <div className="text-danger small">{this.state.mark_error}</div>
                            <div className="text-danger small">{this.state.length_error}</div>
                            <textarea id="updated_question" name="updated_question" defaultValue={this.state.answers[0].question} className="p-3 mb-4 mt-2 w-100" onChange={this.handleTextChange} rows="7" cols="56" required autoFocus></textarea>
                            <Button variant="primary" onClick={this.handleUpdateQuestion} className="mr-3">Update</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                        </div>
                        : null
                        }
                    </Modal.Body>
                </Modal>
            </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    data: state.data_request
})

export default connect(mapStateToProps, null)(Post);