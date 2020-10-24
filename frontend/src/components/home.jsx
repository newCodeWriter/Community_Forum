import React, {Component} from 'react';
import axios from 'axios'; 
import { userAuth } from './authenticate';
// import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            reg_user: '',
            reg_pwd1: '',
            reg_pwd2: '',
            reg_confirmed: '',
            reg_user_error: '',
            reg_pwd_error: '',
            log_user_error: '',
            log_pwd_error: '',
            login_confirmed: false,
            terms: false,
            log_user: '',
            log_pwd: ''
        };
    }
    handleInputChange = (event) => {

        const target = event.target
        const name = target.name;
        const val = target.type === 'checkbox' ? target.checked : target.value; 
        
        this.setState({[name]: val});
        this.setState({reg_user_error: '', reg_pwd_error: '', log_user_error: '', log_pwd_error: '', reg_confirmed: ''})
    }

    handleRegister = (event) => {
        event.preventDefault();
        
        if(this.state.reg_pwd1 === this.state.reg_pwd2){
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
        else{
            this.setState({reg_pwd_error: 'The two passwords do not match.'})
        }
    }

    handleLogin = (event) => {
        event.preventDefault();
        var username = this.state.log_user;
        var password = this.state.log_pwd;

        axios.post(`/login`, {username: username, password: password})
            .then(res => {
                if(res.data.accessToken){
                    userAuth.setToken(username, res.data.accessToken);
                    console.log('it is a success');
                    console.log(res);
                }
                else{
                    console.log(res)
                }
            })
            .catch(err => {
                if(err.response.status === 400){
                    this.setState({log_user_error: 'This user does not exist.'})
                }
                else if(err.response.status === 404){
                    this.setState({log_pwd_error: 'You entered an incorrect password.'}); 
                }
                else{
                    console.log(err.response.status)
                }
                document.getElementById('log_pwd').value = '';
            })
            // .then(document.getElementById('login-form').reset())
    }

    handleBaby = (event) => {
        event.preventDefault();
        // var username = this.state.log_user;

        // userAuth.getToken(username);
        
    }

    render() {
        // if(this.state.reg_confirmed){
        //     return(
        //         <div>
        //             <Redirect to="/test"/>
        //         </div>
        //     )
        // }
        // else{
            return(
                <div>
                <div className="bg-image"></div>
                <div className="home shadow-lg">
                    <div className="pt-3 pb-3 ml-4 mr-4">
                        <h1 className="text-center text-primary font-weight-bolder pt-4">MathQue</h1>
                        <h5 className="text-secondary mt-3 mb-5 text-center">Your source for solutions to your toughest math questions.</h5>
                        <div className="row text-success d-block text-center">{this.state.reg_confirmed}</div>
                        <div className="row pt-2">
                            {/* Registration Form */}
                            <div className="col border-right pl-4 pr-4">
                                <form onSubmit={this.handleRegister} id="register-form">
                                    <h4 className="mb-4">Register</h4>
                                    <div className="input-group">
                                        <input type="text" className="form-control reg" name="reg_user" id="reg_user" placeholder="Username" onChange={this.handleInputChange} minLength="4" required disabled />
                                    </div>
                                    <div className="text-danger small">{this.state.reg_user_error}</div>
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd1" id="reg_pwd1" placeholder="Password" onChange={this.handleInputChange} minLength="8" required disabled />
                                    </div>
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="reg_pwd2" id="reg_pwd2" placeholder="Confirm Password" onChange={this.handleInputChange} minLength="8" required disabled />
                                    </div>
                                    <div className="text-danger small">{this.state.reg_pwd_error}</div>
                                    <div className="form-check mt-2">
                                        <label htmlFor="terms" className="form-check-label small">
                                            <input type="checkbox" name="terms" id="terms" className="form-check-input reg" onChange={this.handleInputChange} disabled required />
                                            I agree to the Terms and Conditions and Privacy Policy
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-success mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg" disabled>Register <i className="fas fa-user-plus"></i></button>
                                    <div className="small text-right text-success mb-3" id="has-acct">Already have an account? Log In</div>
                                </form>
                            </div>
                            {/* Login Form */}
                            <div className="col pl-4 pr-4">
                                <form onSubmit={this.handleLogin} id="login-form">
                                    <h4 className="mb-4">Log In</h4>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control log" onChange={this.handleInputChange} name="log_user" id="log_user" placeholder="Username" minLength="4" required />
                                    </div>
                                    <div className="text-danger small">{this.state.log_user_error}</div>
                                    <div className="input-group mt-3">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-key"></i></div>
                                        </div>
                                        <input type="password" className="form-control log" onChange={this.handleInputChange} name="log_pwd" id="log_pwd" placeholder="Password" minLength="8" required />
                                    </div>
                                    <div className="text-danger small">{this.state.log_pwd_error}</div>
                                    <div className="form-check mt-2">
                                        <label htmlFor="remember" className="form-check-label small">
                                            <input type="checkbox" name="remember" id="remember" className="form-check-input log" value="" />Remember me |
                                            <div id="forgot" className="log-link d-inline text-primary"> Forgot Password?</div>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-4 pl-4 pr-4 pt-2 pb-2 d-block ml-auto log">Login <i className="fas fa-sign-in-alt"></i></button>
                                    <div className="d-block text-right text-primary mt-3 small log-link" id="no-acct">Don't have an account?</div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    // }
}

export default Home;