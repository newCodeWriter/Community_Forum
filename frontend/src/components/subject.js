import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchCategoryInfo } from '../actions'

class Subject extends Component{
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            redirect: false
        }
    }

    componentDidMount(){
        this.props.dispatch(fetchCategoryInfo(this.props.match.params.subjectId));
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            this.setState({questions: this.props.data})
        }
    }
    
    render(){
        if(this.state.redirect === true){
            return <Redirect to={`${this.props.match.url}/question`}/>
        }
        else{
            return (
                <div className="set-width mx-auto">
                    <Button variant="primary" className="mb-4 pl-3 pr-3 pt-2 pb-2" onClick={()=> this.setState({redirect: true})}>New Question?</Button>
                    { this.state.questions.length === 0 
                    ? null
                    : this.state.questions[0].map( q => (
                        <Link key={`question_${q.question_id}`} to={`${this.props.match.url}/${q.question_id}`}>
                            <div id={q.question_id} className="border border-light bg-light d-block mb-3 p-3 subject-container shadow">
                                <div className="row">
                                    <div className="col-md-5 text-muted small">{q.date}</div>
                                    <div className="col-md-7 text-success text-right small q-user">by: {q.username}</div>
                                </div>
                                <div className="row mt-3 w-100">
                                    <div className="col">{q.new_question}</div>
                                </div>
                                <div className="row mt-2 text-muted" >
                                    <div className="col text-right small">Answers: {q.answers}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div> 
          )
        }
    }
}; 
const mapStateToProps = (state) => ({
    data: state.data_request
})

export default connect(mapStateToProps)(Subject);