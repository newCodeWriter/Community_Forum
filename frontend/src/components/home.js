import React from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Route, Switch, NavLink } from "react-router-dom"
import Dropdown from 'react-bootstrap/Dropdown'
import NavItem from 'react-bootstrap/NavItem'
import Subject from './subject'
import Question from './question'
import Post from './post'
import ChangeAcct from './changeAcct'
import { math } from '../constants'
import { connect } from 'react-redux'
import { fetchCategoryInfo, logout } from '../actions'
import { copyState } from '../localStorage'

function Home({ match, dispatch }){

    const { userName } = copyState().authentication

    function handleLogout(){
        dispatch(logout());
    }
    
    return(
        <div>
            <Navbar bg="dark" variant="dark" className="pt-2 pb-2" sticky="top">
                <Nav className="mx-auto">
                    <Navbar.Brand href={`${match.url}`} id="math">MathQue</Navbar.Brand>
                </Nav>
                <Nav className="ml-auto">
                    <Dropdown as={NavItem} className="mr-3">
                        <Dropdown.Toggle id="nav-dropdown"><i className="fas fa-user-alt"></i> Welcome, {userName.toUpperCase()}</Dropdown.Toggle>
                        <Dropdown.Menu className="mt-2">
                            <Dropdown.Item href={`${match.url}/account`}>Account</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="primary" onClick={handleLogout}>Logout</Button>
                </Nav>
            </Navbar>
            <div className="row w-100">
                <div className="col-md-3">
                    <Nav className="flex-column flex-c">
                        {math.map(({ name, id }) => (
                            <NavLink key={id} to={`${match.url}/${id}`}
                                activeClassName="active-link" 
                                className="pt-4 pb-4 pl-3 pr-3 border-bottom category-link" 
                                onClick={() => dispatch(fetchCategoryInfo(`${id}`))}>
                                {name} 
                            </NavLink>
                        ))}
                    </Nav>
                </div>
                <div className="col-md-9 mt-5">
                    <Switch>
                        <Route exact path={`${match.path}`} render={() => <h3 className="ml-5">Select a category to view its questions...</h3>} />
                        <Route path={`${match.path}/:subjectId/question`} component={Question} />
                        <Route path={`${match.path}/:subjectId/:questionId`} component={Post} />
                        <Route exact path={`${match.path}/account`} component={ChangeAcct} />
                        <Route path={`${match.path}/:subjectId`} component={Subject} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default connect()(Home);