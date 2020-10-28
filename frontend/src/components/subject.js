import React from 'react'
import { math } from '../constants'
import Button from 'react-bootstrap/Button'

export default function Subject({match}){
    const subject = math.find(({ id }) => id === match.params.subjectId)

    return (
        <div className="mt-5">
            <h2>{subject.name}</h2>
            <Button variant="primary" className="mb-4 pl-3 pr-3 pt-2 pb-2">New Question?</Button>
            <div className="border border-light bg-light d-block mb-3 w-75 mx-auto p-3 subject-container">
                <div className="row">
                    <div className="col-md-4 text-muted">Date Time</div>
                    <div className="col-md-8 text-primary text-right">By: User</div>
                </div>
                <div className="row mt-3 w-100">
                    <div className="col">Questions Anyone?.....</div>
                </div>
                <div className="row mt-2 text-muted">
                    <div className="col text-right">No. of Answers</div>
                </div>
            </div>
        </div> 
    )
};