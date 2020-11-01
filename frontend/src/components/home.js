import React from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Route, Switch, NavLink } from "react-router-dom"
import Subject from './subject'
import Question from './question'
import Post from './post'
import { math } from '../constants'
import { connect } from 'react-redux'
import { logout } from '../actions'
import { userAuth } from '../checkAuth'
import { useHistory } from 'react-router-dom';

function Home({ userLogout, match }){

    let history = useHistory();

    function handleLogout(){
        userLogout();
        history.replace('/login');
    }
    
    return(
        <div>
            <Navbar bg="dark" variant="dark" className="pt-2 pb-2" sticky="top">
                <Nav className="mx-auto">
                    <Navbar.Brand href={`${match.url}`} id="math">MathQue</Navbar.Brand>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="home/"><i className="fas fa-user-alt"></i> Welcome, {userAuth.getUser().toUpperCase()}</Nav.Link>
                    <Button variant="primary" onClick={handleLogout}>Logout</Button>
                </Nav>
            </Navbar>
            <div className="row w-100">
                <div className="col-md-3">
                    <Nav className="flex-column flex-c">
                        {math.map(({ name, id }) => (
                            <NavLink key={id} to={`${match.url}/${id}`} activeClassName="active-link" className="pt-4 pb-4 pl-3 border-bottom">{name}</NavLink>
                        ))}
                    </Nav>
                </div>
                <div className="col-md-9">
                    <Switch>
                        <Route path={`${match.path}/:subjectId/question`} component={Question} />
                        <Route path={`${match.path}/:subjectId/:questionId`} component={Post} />
                        <Route path={`${match.path}/:subjectId`} component={Subject} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}


const mapDispatchToProps = (dispatch) => ({
    userLogout: () => {
      dispatch(logout())
    }
})

export default connect(null, mapDispatchToProps)(Home);

