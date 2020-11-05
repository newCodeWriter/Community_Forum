import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../actions'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            show: false,
            reg_user: '',
            reg_pwd1: '',
            reg_pwd2: '',
            reg_confirmed: false,
            reg_user_error: false,
            reg_pwd_error: false,
            reg_pwd_test_error: false,
            reg_pwd_match_error: false,
            log_user_error: false,
            log_pwd_error: false,
            log_user: '',
            log_pwd: ''
        };
        this.handleLogin = this.handleLogin.bind(this)
    }

    componentDidUpdate(prevProps) {
        if(this.props.attempts !== prevProps.attempts) {
          if(this.props.status === 400){
            this.setState({log_user_error: true})
          }
          else {
            this.setState({log_pwd_error: true})
          }
        }
    }
    
    handleInputChange = (event) => {

        const target = event.target;
        const name = target.name;
        const val = target.type === 'checkbox' ? target.checked : target.value; 
        
        this.setState({[name]: val});
        this.setState({
            reg_user_error: false, 
            reg_pwd_test_error: false, 
            reg_pwd_match_error: false, 
            log_user_error: false, 
            log_pwd_error: false, 
            reg_confirmed: false
        })
    }

    handleRegister = (event) => {
        event.preventDefault();
        const patt = new RegExp("(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}");
        const pwd_test = patt.test(this.state.reg_pwd1);
        if(pwd_test && this.state.reg_pwd1 === this.state.reg_pwd2){
            var new_user = {
                user: this.state.reg_user,
                password: this.state.reg_pwd1
            }

            axios.post(`/register`, new_user)
            .then(res => {
                if(res.status === 201){
                    this.setState({reg_confirmed: 'You are now registered. Please log in.'})
                    document.getElementById('register-form').reset();
                }
                else{
                    console.log(res.status)
                }
            })
            .catch(err => {
                if(err.response.status === 409){
                    this.setState({reg_user_error: 'This user already exists. Please try another username.'})
                }
                else{
                    console.log(err)
                }
            })
        }
        else if(!pwd_test && this.state.reg_pwd1 !== this.state.reg_pwd2){
            this.setState({reg_pwd_match_error: true});
            this.setState({reg_pwd_test_error: true});
        }
        else if(!pwd_test){
            this.setState({reg_pwd_test_error: true});
        }
        else{
            this.setState({reg_pwd_match_error: true});
        }
    }

    handleLogin = (event) => {
        event.preventDefault();
        var data = {
            username: this.state.log_user, 
            password: this.state.log_pwd
        }
        this.props.dispatch(loginUser(data));
    }

    handleClick = (event) => {
        const loginForm = document.getElementById('login-form');
        const regForm = document.getElementById('register-form');
        if(event.target.id === 'log-mobile'){
            this.setState({
                active: !this.state.active,
                show: true,
                reg_user_error: false,
                reg_pwd_error: false,
                reg_pwd_test_error: false,
                reg_pwd_match_error: false,
                log_user_error: false,
                log_pwd_error: false,
            })
        }
        else{
            this.setState({
                active: !this.state.active,
                reg_user_error: false,
                reg_pwd_error: false,
                reg_pwd_test_error: false,
                reg_pwd_match_error: false,
                log_user_error: false,
                log_pwd_error: false,
            })
        }
        loginForm.reset();
        regForm.reset();
    }

    handleClose = () => {
        this.setState({
            active: !this.state.active,
            show: false,
            reg_user_error: false,
            reg_pwd_error: false,
            reg_pwd_test_error: false,
            reg_pwd_match_error: false,
            log_user_error: false,
            log_pwd_error: false,
        })
    }

    render() {
        let log_disabled = this.state.active ? false : true;
        let loginStyle = {cursor: this.state.active ? 'pointer' : 'not-allowed'};
        let reg_disabled = this.state.active ? true : false;
        let regStyle = {
            cursor: this.state.active ? 'not-allowed' : 'pointer',
            display: this.state.active ? 'none' : 'block'
        };

        return(
            <div>
                <div className="bg-image"></div>
                <div className="home shadow-lg">
                    <div className="pt-3 pb-3 ml-4 mr-4">
                        <h1 className="text-center text-primary font-weight-bolder pt-4">MathQue</h1>
                        <h5 className="text-secondary mt-3 mb-4 text-center source">Your source for solutions to your toughest math questions.</h5>
                        <div className="row text-success d-none d-sm-block text-center">{this.state.reg_confirmed}</div>
                        <div className="row pt-2">
                            {/* Registration Form */}
                            <div className="col-12 col-sm-6 d-none d-sm-block border-right pl-4 pr-4 reg-container">
                                <form onSubmit={this.handleRegister} id="register-form">
                                    <h4 className="mb-4">Register</h4>
                                    <div className="input-group">
                                        <input type="text" className="form-control reg" name="reg_user" id="reg_user" placeholder="Username" onChange={this.handleInputChange} minLength="4" required disabled={reg_disabled} />
                                    </div>
                                    {this.state.reg_user_error
                                    ? <div className="text-danger small errors">This user already exists. Please try another username.</div>
                                    : <div></div>
                                    }
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd1" id="reg_pwd1" placeholder="Password" onChange={this.handleInputChange} required disabled={reg_disabled} />
                                    </div>
                                    { this.state.reg_pwd_test_error 
                                    ? <ul className="text-danger small errors">
                                        Your password must contain: 
                                        <li className="reg-error">At least eight characters</li>
                                        <li className="reg-error">At least one letter</li>
                                        <li className="reg-error">At least one number</li>
                                        <li className="reg-error">At least one special character</li>
                                    </ul>
                                    : <div></div>
                                    }
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd2" id="reg_pwd2" placeholder="Confirm Password" onChange={this.handleInputChange} required disabled={reg_disabled} />
                                    </div>
                                    {this.state.reg_pwd_match_error
                                    ? <div className="text-danger small errors">Your passwords do not match.</div>
                                    : <div></div>
                                    }
                                    <div className="form-check mt-2">
                                        <label htmlFor="terms" className="form-check-label small">
                                            <input type="checkbox" name="terms" id="terms" className="form-check-input reg" onChange={this.handleInputChange} disabled={reg_disabled} required />
                                            I agree to the Terms and Conditions and Privacy Policy
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg" disabled={reg_disabled}>Register <i className="fas fa-user-plus"></i></button>
                                    <div className="small text-right text-success mb-3" id="has-acct" onClick={this.handleClick} style={regStyle}>Have an account? Log In</div>
                                </form>
                            </div>
                            {/* Login Form */}
                            <div className="col-12 col-sm-6 pl-5 pr-5 pl-sm-4 pr-sm-4">
                                <form onSubmit={this.handleLogin} id="login-form">
                                    <h4 className="mb-4">Log In</h4>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control log" onChange={this.handleInputChange} name="log_user" id="log_user" placeholder="Username" minLength="4" required disabled={log_disabled}/>
                                    </div>
                                    {this.state.log_user_error
                                    ? <div className="text-danger small errors">This user does not exist.</div>
                                    : <div></div>
                                    }
                                    <div className="input-group mt-3">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-key"></i></div>
                                        </div>
                                        <input type="password" className="form-control log" onChange={this.handleInputChange} name="log_pwd" id="log_pwd" placeholder="Password" minLength="8" required disabled={log_disabled}/>
                                    </div>
                                    {this.state.log_pwd_error
                                    ? <div className="text-danger small errors">You entered an incorrect password.</div>
                                    : <div></div>
                                    }
                                    <button type="submit" className="btn btn-primary mt-4 pl-4 pr-4 pt-2 pb-2 d-block ml-auto log" disabled={log_disabled}>Login <i className="fas fa-sign-in-alt"></i></button>
                                    <div className="d-none d-sm-block text-right"><div className="d-inline-block text-primary mt-3 small log-link" id="no-acct" onClick={this.handleClick} style={loginStyle}>Don't have an account?</div></div>
                                    {/* registration link for mobile devices */}
                                    <div className="d-block d-sm-none text-right"><div className="d-inline-block text-primary mt-3 small log-link" id="log-mobile" onClick={this.handleClick} style={loginStyle}>Don't have an account?</div></div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* modal registration form for mobile devices */}
                    <Modal show={this.state.show} onHide={this.handleClose} centered className="d-block d-sm-none">
                        <Modal.Body>
                            <div className="mt-2 pl-5 pr-5">
                                <h1 className="text-center text-primary font-weight-bolder pt-3">MathQue</h1>
                                <h5 className="text-secondary mt-3 mb-4 text-center source">Your source for solutions to your toughest math questions.</h5>
                                <div className="row text-success d-block d-sm-none text-center">{this.state.reg_confirmed}</div>
                                <form onSubmit={this.handleRegister} id="register-form">
                                    <h4 className="mb-4">Register</h4>
                                    <div className="input-group">
                                        <input type="text" className="form-control reg" name="reg_user" id="reg_user" placeholder="Username" onChange={this.handleInputChange} minLength="4" required disabled={reg_disabled} />
                                    </div>
                                    {this.state.reg_user_error
                                    ? <div className="text-danger small errors">This user already exists. Please try another username.</div>
                                    : <div></div>
                                    }
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd1" id="reg_pwd1" placeholder="Password" onChange={this.handleInputChange} required disabled={reg_disabled} />
                                    </div>
                                    { this.state.reg_pwd_test_error 
                                    ? <ul className="text-danger small errors">
                                        Your password must contain: 
                                        <li className="reg-error">At least eight characters</li>
                                        <li className="reg-error">At least one letter</li>
                                        <li className="reg-error">At least one number</li>
                                        <li className="reg-error">At least one special character</li>
                                    </ul>
                                    : <div></div>
                                    }
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd2" id="reg_pwd2" placeholder="Confirm Password" onChange={this.handleInputChange} required disabled={reg_disabled} />
                                    </div>
                                    {this.state.reg_pwd_match_error
                                    ? <div className="text-danger small errors">Your passwords do not match.</div>
                                    : <div></div>
                                    }
                                    <div className="form-check mt-2">
                                        <label htmlFor="terms" className="form-check-label small">
                                            <input type="checkbox" name="terms" id="terms" className="form-check-input reg" onChange={this.handleInputChange} disabled={reg_disabled} required />
                                            I agree to the Terms and Conditions and Privacy Policy
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg" disabled={reg_disabled}>Register <i className="fas fa-user-plus"></i></button>
                                    <div className="small text-right text-success mb-3" onClick={this.handleClose} style={regStyle}>Have an account? Log In</div>
                                </form>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => { 
    const { authentication } = state
    return{
        status: authentication.status,
        attempts: authentication.loginAttempts
    }
};
  
export default connect(mapStateToProps, null)(Login);