import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { setCountries } from './actions';
import { connect } from 'react-redux';
import config from './config/default.json';

class AirlineCompanyRegisterForm extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        companyName: '',
        country: '',
        error: '',
        showPassword: false,
        isUsernameAvailable: true,
        isEmailAvailable: true,
        isCompanyNameAvailable: true,
        isPasswordCorrect: false,
    };

    componentDidMount() {
        const { countries } = this.props;
        if (!countries || countries.length === 0)
            this.fetchCountries();
    }

    fetchCountries = async () => {
        try {
            const response = await axios.get(`${config.render.url}/api/countries`);
            this.props.dispatch(setCountries(response.data));
        } catch (error) {
            console.log(error.message);
        }
    };

    checkUsernameAvailability = async () => {
        const { username } = this.state;

        try {
            if (username !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-username/${username}`);
                const isUsernameAvailable = response.data;

                this.setState({ isUsernameAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasSpecialCharacter = /[!@#$%^&*()_+{}:;<>,.?~\\-]/.test(newPassword);

        this.setState({
            password: newPassword,
            isPasswordCorrect: newPassword.length >= 6 && hasUppercase && hasLowercase && hasSpecialCharacter,
        });
    };


    checkEmailAvailability = async () => {
        const { email } = this.state;

        try {
            if (email !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-email/${email}`);
                const isEmailAvailable = response.data;

                this.setState({ isEmailAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    checkCompanyNameAvailability = async () => {
        const { companyName } = this.state;

        try {
            if (companyName !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-CompanyName/${companyName}`);
                const isCompanyNameAvailable = response.data;

                this.setState({ isCompanyNameAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });

        if (name === 'username') {
            const isUsernameLengthValid = value.length < 4 && value.length > 0;
            this.setState({ isUsernameLengthValid , isUsernameAvailable: true });
        }
        else if (name === 'email') {
            this.setState({ isEmailAvailable: true });
        }
        else if (name === 'companyName') {
            this.setState({ isCompanyNameAvailable: true });
        }
    };


    handlePasswordToggle = () => {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword,
        }));
    };

    handleReset = () => {
        this.setState({
            username: '',
            password: '',
            email: '',
            companyName: '',
            country: '',
            error: '',
            isUsernameLengthValid: false,
            showPassword: false,
            isUsernameAvailable: true,
            isEmailAvailable: true,
            isCompanyNameAvailable: true,
            isPasswordCorrect: false,
        });
    };


    handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, email, companyName, country } = this.state;

        try {
            const response = await axios.post(`${config.render.url}/api/auth/register/airline-company`, {
                user: {
                    username: username,
                    password: password,
                    email: email
                },
                airlineCompany: {
                    name: companyName,
                    country: country
                }
            });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Registration Successful',
                    text: 'You have successfully registered as an airline company.',
                    icon: 'success',
                }).then(() => {
                    this.props.history.push('/login');
                });
            }
        } catch (error) {
            this.setState({ error: `${error.response.data}` });
            console.log(error.message);
        }
    };

    render() {
        const { username, password, email, companyName, country, error, showPassword, isUsernameAvailable, isUsernameLengthValid, isCompanyNameAvailable, isEmailAvailable, isPasswordCorrect } = this.state;

        const { countries } = this.props;

        if (!countries) {
            return <div>Loading...</div>;
        }

        const shouldEnableSubmit = username !== '' && password !== '' &&
            email !== '' && companyName !== '' && country !== '' &&
            isUsernameAvailable && isEmailAvailable && isCompanyNameAvailable && isPasswordCorrect && !isUsernameLengthValid;

        return (
            <div className="container" style={{ alignItems: 'center', fontFamily: 'OpenSans', maxWidth: '100%', margin: '30px auto' }}>
                <form
                    className="card z-depth-5"
                    onSubmit={this.handleSubmit}
                    style={{
                        padding: '10px',
                        borderRadius: '20px',
                        border: '5px solid black',
                        maxWidth: '700px',  
                        width: '90%',       
                        margin: '0 auto',   
                    }}
                >
                    <h5 className="center-align" style={{ textDecoration: 'underline', letterSpacing: '1px' }}>Airline Company Registration</h5>
                    <div className="row">
                        <div className="input-field col s6">
                            <i className="material-icons prefix">account_circle</i>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                pattern="^[A-Za-z0-9_]+$"
                                title="Please enter a valid username (only letters, numbers, and underscores)."
                                value={username}
                                onChange={this.handleInputChange}
                                onBlur={this.checkUsernameAvailability}
                                autoComplete="username"
                                required
                            />
                            <label htmlFor="username">Username:</label>
                            {!isUsernameAvailable ? (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>Username is already taken. Please choose a different username.</span>
                            ) : isUsernameLengthValid && (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                    Username must be over 4 characters.
                                </span>
                            )}
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">lock</i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={this.handlePasswordChange}
                                autoComplete="new-password"
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            {password.length > 0 && (
                                <div className={`password-strength ${isPasswordCorrect ? 'strength-strong' : 'strength-weak'}`}>
                                    {isPasswordCorrect ? (
                                        <span style={{ color: '#198754', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bolder' }}>Strong</span>
                                    ) : (
                                        <span style={{ color: '#dc3545', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bolder' }}>Weak</span>
                                    )}
                                </div>
                            )}
                            <i
                                className={`material-icons toggle-password ${showPassword ? 'active' : ''}`}
                                onClick={this.handlePasswordToggle}
                                style={{ position: 'absolute', top: '30%', right: '10px', cursor: 'pointer' }}
                            >
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </i>
                        </div>
                    </div>
                    <div className="row">
                        <hr style={{ height: '1.5px', backgroundColor: 'grey' }} />
                        <div className="input-field col s6">
                            <i className="material-icons prefix">email</i>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                                onBlur={this.checkEmailAvailability}
                                required
                            />
                            <label htmlFor="email">Email:</label>
                            {!isEmailAvailable && (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                    Email is already registered. Please use a different email address.
                                </span>
                            )}
                        </div>
                        <div className="input-field col s6 " >
                            <i className="material-icons prefix">flight_takeon</i>

                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                pattern="^[A-Za-z0-9\s]*$"
                                title="Please enter a valid address (only letters, numbers, and spaces)."
                                value={companyName}
                                onChange={this.handleInputChange}
                                onBlur={this.checkCompanyNameAvailability}
                                required
                            />
                            <label htmlFor="companyName" >Company:</label>
                            {!isCompanyNameAvailable && (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                    This company name is taken. Register another company name.
                                </span>
                            )}
                        </div>
                    </div>
                    <hr style={{ height: '1.5px', backgroundColor: 'grey' ,  marginBottom: '20px' }} />
                    <div className="input-field" style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                        <select
                            id="country"
                            name="country"
                            className="browser-default"
                            value={country}
                            onChange={this.handleInputChange}
                             style={{width:'200px', fontSize: '14px',marginTop:'5px' }}
                            required
                        >
                            <option value="" disabled>Select Country</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                        <label htmlFor="country" className="active" style={{textAlign:'center',width:'100%'}} ><i className="material-icons tiny">public</i>Country:</label>
                    </div>
                    <div className="row center-align">
                        <div className="col s6">
                            <button className="btn btn-blue" type="submit"  style={{ display: 'inline-flex', alignItems: 'center' }} disabled={!shouldEnableSubmit}>
                                Register
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                        <div className="col s6">
                            <button className="btn" type="button"  style={{ display: 'inline-flex', alignItems: 'center' }} onClick={this.handleReset}>
                                Reset
                                <i className="material-icons right ">autorenew</i>
                            </button>
                        </div>
                    </div>
                    {error && <p className="red-text center-align">{error}</p>}
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AirlineCompanyRegisterForm));
