import React from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Route } from "react-router-dom"
import Subject from './subject'
import { math } from '../constants'
import { connect } from 'react-redux'
import { logout } from '../actions'
import { userAuth } from '../checkAuth'
import { useHistory } from 'react-router-dom';

function Home({ userLogout, match }){

    let history = useHistory();

    function handleLogout(){
        userLogout()
        history.push('/login');
    }
    
    return(
        <div>
            <Navbar bg="dark" variant="dark" className="pt-2 pb-2" sticky="top">
                <Nav className="mx-auto">
                    <Navbar.Brand href={`${match.url}`}>MathQue</Navbar.Brand>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="home/"><i className="fas fa-user-alt"></i> Welcome, {userAuth.getUser()}</Nav.Link>
                    <Button variant="primary" onClick={handleLogout}>Logout</Button>
                </Nav>
            </Navbar>
            <div className="row w-100">
                <div className="col-md-3">
                    <Nav className="flex-column flex-c">
                        {math.map(({ name, id }) => (
                            <Nav.Link key={id} href={`${match.url}/${id}`} className="pt-4 pb-4 border-bottom">{name}</Nav.Link>
                        ))}
                    </Nav>
                </div>
                <div className="col-md-9">
                    <Route path={`${match.path}/:subjectId`} component={Subject} />
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

