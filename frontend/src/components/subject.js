import React from 'react'
import { math } from '../constants'

export default function Subject({match}){
    const subject = math.find(({ id }) => id === match.params.subjectId)

    return (
        <div>
            <h2>{subject.name}</h2>
        </div> 
  )
};