import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginSuccess } from './actions';
import config from './config/default.json';



class LoginForm extends Component {

  state = {
    username: '',
    password: '',
    error: '',
    isSubmitDisabled: true,
    showPassword: false,
    isForgotPasswordModalOpen: false,
    forgotPasswordEmail: '',
    forgotPasswordError: '',
    isSending: false
  };

  componentDidMount() {
    const options = {
      inDuration: 300,
      outDuration: 200,
      opacity: 0.5,
      dismissible: true,
      responsiveThreshold: 992,
      onCloseEnd: () => {
        // Reset the form state when the modal is closed
        this.setState({
          forgotPasswordEmail: '', // Reset the email field
          forgotPasswordError: '', // Reset any error messages
        });
      }
    }
    const modalElement = document.getElementById('forgotPasswordModal');
    const modalInstance = window.M.Modal.init(modalElement, options);
    this.setState({ modalInstance });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.render.url}/api/auth/login`, {
        username: this.state.username,
        password: this.state.password,
      });


      if (response.data) {
        this.setState({ error: '' });
        const token = response.data.token; // Assuming the token is received in the response
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userRole', response.data.user.userRole);
        this.props.handleLogin(response.data.user.username, response.data.user.userRole);
        Swal.fire({
          title: `Hello, ${response.data.user.username}
           Login Successful`,
          text: 'You have successfully Login.',
          icon: 'success',
        }).then(() => {
          this.props.history.push('/login');
        });

      }
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: `${error.response.data}. Please try again.`,
        icon: 'error',
      });
    }
  };

  handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    this.setState({
      username: newUsername,
      isSubmitDisabled: !(newUsername.length >= 4) || this.state.password.length < 6
    });
  };


  handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    this.setState({
      password: newPassword,
      isSubmitDisabled: !(this.state.username.length >= 4) || !(newPassword.length >= 6)
    });
  };


  handleForgotPasswordEmailChange = (e) => {
    this.setState({ forgotPasswordEmail: e.target.value });
  };


  handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    this.setState({ isSending: true });

    try {
      const response = await axios.post(`${config.render.url}/api/auth/rest-password`, {
        email: this.state.forgotPasswordEmail
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'Password Reset Email Sent',
          text: 'A password reset email has been sent to the provided email address.',
          icon: 'success',
        }).then(() => {
          this.state.modalInstance.close();
        });;
      }
    } catch (error) {
      this.setState({
        forgotPasswordError: 'Error resetting password. Please try again later.',
      });
    } finally {
      this.setState({ isSending: false });
    }
  };

  render() {
    const { username, password, error, showPassword, isSubmitDisabled, forgotPasswordEmail, forgotPasswordError, isSending } = this.state;


    return (
      <div className="container" style={{ marginTop: '20px',fontFamily: "OpenSans" }}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <div className="card z-depth-5" style={{ padding: '5px', borderRadius: '20px', border: '5px solid black' }}>
            <div className="card-content">
              <h4 className="center-align" style={{ fontWeight: 'bold', textDecoration: 'underline', letterSpacing: '2px' }}>
                Login
              </h4>
              <form onSubmit={this.handleSubmit}>
                <div className="input-field">
                  <i className="material-icons prefix">person</i>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={this.handleUsernameChange}
                    autoComplete="username"
                    required
                  />
                  <label htmlFor="username">Username</label>
                  {username.length > 0 && username.length < 4 && (
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                      Username must be over 4 characters
                    </span>
                  )}
                </div>
                <div className="input-field">
                  <i className="material-icons prefix">lock</i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={this.handlePasswordChange}
                    autoComplete="current-password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                  {password.length > 0 && password.length < 6 && (
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                      Password must be at least 6 characters long.
                    </span>
                  )}
                  <i
                    className={`material-icons toggle-password ${showPassword ? 'active' : ''}`}
                    onClick={() => this.setState({ showPassword: !showPassword })}
                    style={{ position: 'absolute', top: '20%', right: '10px', cursor: 'pointer' }}
                  >
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </i>
                </div>
                <div className="row">
                  <div className="col s12">
                    <div className="center-align">
                      <a className="link-button modal-trigger" href="#forgotPasswordModal">
                        Forgot Password
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 center-align">
                    <span className='text-to-link' style={{fontSize:'16px'}}>If you have not registered as a customer? </span>
                    <NavLink className="link" style={{ textDecoration: 'underline',fontSize:'16px' }} to="/register/customer">
                      Click here
                    </NavLink>
                  </div>
                </div>
                <div className="center-align">
                  <button className="btn waves-effect waves-light" type="submit" disabled={isSubmitDisabled}>
                    Login
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </form>
              {error && (
                <p className="red-text center-align" style={{ letterSpacing: '1px' }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal" id="forgotPasswordModal">
        <div className="modal-content">
          <h4>Forgot Password</h4>
          <form onSubmit={this.handleForgotPasswordSubmit}>
            <div className="input-field">
              <i className="material-icons prefix">email</i>
              <input
                type="email"
                id="forgotPasswordEmail"
                value={forgotPasswordEmail}
                onChange={this.handleForgotPasswordEmailChange}
                required
              />
              <label htmlFor="forgotPasswordEmail">Enter your email</label>
            </div>
            {forgotPasswordError && (
              <p style={{ letterSpacing: '1px', fontFamily: 'monospace' }}>{forgotPasswordError}</p>
            )}
            <div className="center-align">
              <button className="btn waves-effect waves-light" type="submit" disabled={isSending}>
                {isSending ? (
                  <>
                    <div className="loading-modal">
                      <div className="loading-spinner"></div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <i className="material-icons left">send</i> Send
              </button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-teal btn-flat" disabled={isSending}>
            <i className="material-icons left">close</i> Close
          </button>
        </div>
      </div>
    </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: (username, userRole) => dispatch(loginSuccess(username, userRole)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(LoginForm));
