import React, {Component} from 'react';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            fname: '',
            lname: '',
            email: '',
            comments: ''
        };
    }
    handleChange = (event) => {
        let name = event.target.name;
        let val = event.target.value; 
        this.setState({[name]: val});
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(`First Name: ${this.state.fname}\nLast Name: ${this.state.lname}\nE-mail: ${this.state.email}\nComments: ${this.state.comments}`)
        document.getElementById('my-form').reset();
    }
    render() {
        return (
            <div>
                <div className="bg-image"></div>
                <div className="home shadow-lg">
                    <div className="pt-3 pb-3 ml-4 mr-4">
                        <h1 className="text-center text-primary font-weight-bolder pt-4">MathQue</h1>
                        <h5 className="text-secondary mt-3 mb-5 text-center">Your source for solutions to your toughest math questions.</h5>
                        <div className="row pt-2">
                            {/* Registration Form */}
                            <div className="col border-right pl-4 pr-4">
                                <form action="#" id="register-form">
                                    <h4 className="mb-4">Register</h4>
                                    <div className="input-group">
                                        <input type="text" className="form-control reg" name="username" id="username" placeholder="Username" minlength="4" required disabled />
                                    </div>
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="pwd1" id="pwd1" placeholder="Password" minlength="8" required disabled />
                                    </div>
                                    <div className="input-group mt-3">
                                        <input type="password" className="form-control reg" name="pwd2" id="pwd2" placeholder="Confirm Password" minlength="8" required disabled />
                                    </div>
                                    <div className="form-check mt-2">
                                        <label for="terms" className="form-check-label small">
                                            <input type="checkbox" name="remember" id="terms" className="form-check-input reg" disabled />
                                            I agree to the Terms and Conditions and Privacy Policy
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-danger mt-3 mb-3 pl-4 pr-4 pt-2 pb-2 d-block ml-auto reg" disabled>Register <i className="fas fa-user-plus"></i></button>
                                    <div className="small text-right text-danger mb-3" id="has-acct">Already have an account? Log In</div>
                                </form>
                            </div>
                            {/* Login Form */}
                            <div className="col pl-4 pr-4">
                                <form action="#" id="login-form">
                                    <h4 className="mb-4">Log In</h4>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-user"></i></div>
                                        </div>
                                        <input type="text" className="form-control log" name="user" id="user" placeholder="Username" minlength="4" required />
                                    </div>
                                    <div className="input-group mt-3">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text bg-primary text-light"><i className="fas fa-key"></i></div>
                                        </div>
                                        <input type="password" className="form-control log" name="pwd" id="pwd" placeholder="Password" minlength="8" required />
                                    </div>
                                    <div className="form-check mt-2">
                                        <label for="remember" className="form-check-label small">
                                            <input type="checkbox" name="remember" id="remember" className="form-check-input log" value="" />Remember me |
                                            <div id="forgot" className="log-link d-inline text-primary"> Forgot Password?</div>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-4 pl-4 pr-4 pt-2 pb-2 d-block ml-auto log">Login <i className="fas fa-sign-in-alt"></i></button>
                                    <div className="d-block text-right text-primary mt-3 small log-link" id="no-acct">Don't have an account?</div>
                                    <a href="/mother">Say It More</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;