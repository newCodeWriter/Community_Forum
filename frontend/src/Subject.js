import React, { Component } from 'react';

export default class Subject extends Component{
    constructor(props){
        super(props);
        this.state = {subject: [{'subject':'grape'}, {'subject':'purple'}]}
    }

    componentDidMount(){
        fetch('/user')
            .then(res => res.json())
            .then(resp => this.setState({subject: resp}))
        console.log(this.state.subject)
    }

    render(){
        return(
            <div>
                <button type="button">Get weather in Toronto</button>
                <h1>My favorite subject is: Math</h1>
                {this.state.subject.map(sub =>
                  <p key={sub.id}>{sub.username}</p>
                )}
            </div>
        );
    }
}


