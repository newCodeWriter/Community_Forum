import React, { Component } from 'react'
import { math } from '../constants'
import Button from 'react-bootstrap/Button'
// import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchCategoryInfo } from '../actions'
// import { userAuth } from '../checkAuth'




class Subject extends Component {
    constructor(props){
        super(props);
        this.state = {
            subject: math.find(({ id }) => id === this.props.match.params.subjectId),
            subjectInfo: []
        }
    }

    componentDidMount(){
        this.props.getInfo(this.props.match.params.subjectId)
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            this.setState({subjectInfo: this.props.data[0]});
        }
    }

    handleClick = () => {
        this.props.history.push(`${this.props.match.url}/post`)
    }

    render(){
        return (
            <div className="mt-5 w-75 mx-auto">
                <h2>{this.state.subject.name}</h2>
                <Button variant="primary" className="mb-4 pl-3 pr-3 pt-2 pb-2" onClick={()=>{this.props.history.push(`${this.props.match.url}/question`)}}>New Question?</Button>
                {this.state.subjectInfo.map((subject, key) => (
                    <div key={key} onClick={this.handleClick} className="border border-light bg-light d-block mb-3 p-3 subject-container">
                        <div className="row">
                            <div className="col-md-4 text-muted small">{subject.date}</div>
                            <div className="col-md-8 text-primary text-right">By: {subject.username}</div>
                        </div>
                        <div className="row mt-3 w-100">
                            <div className="col">{subject.new_question}</div>
                        </div>
                        <div className="row mt-2 text-muted">
                            <div className="col text-right">Answers: {subject.answers}</div>
                        </div>
                    </div>
                ))}
            </div> 
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data_request
})

const mapDispatchToProps = (dispatch) => ({
    getInfo: (category) => {
      dispatch(fetchCategoryInfo(category))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Subject);