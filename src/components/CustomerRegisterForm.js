import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import config from './config/default.json';


class CustomerRegisterForm extends Component {
    state = {
        user: {
            username: '',
            password: '',
            email: '',
        },
        customer: {
            firstName: '',
            lastName: '',
            address: '',
            phoneNo: '',
            creditCardNo: '',
        },
        error: '',
        isUsernameLengthValid: false,
        isUsernameAvailable: true,
        isPasswordCorrect: false,
        isEmailAvailable: true,
        isPhoneAvailable: true,
        isCreditCardAvailable: true,
    };

    handlePasswordToggle = (field) => {
        this.setState((prevState) => ({
            [field]: {
                ...prevState[field],
                showPassword: !prevState[field].showPassword
            }
        }));
    };


    handleInputChange = (e, target) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            [target]: {
                ...prevState[target],
                [name]: value,
            }
        }));

        if (name === 'username') {
            const isUsernameLengthValid = value.length < 4 && value.length > 0;
            this.setState({ isUsernameLengthValid , isUsernameAvailable: true });
        }
        else if (name === 'email') {
            this.setState({ isEmailAvailable: true });
        }
        else if (name === 'phoneNo') {
            this.setState({ isPhoneAvailable: true });
        }
        else if (name === 'creditCardNo') {
            this.setState({ isCreditCardAvailable: true });
        }
    };

    checkUsernameAvailability = async () => {
        const { user } = this.state;

        try {
            if (user.username !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-username/${user.username}`);
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


        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                password: newPassword,
            },
            isPasswordCorrect: newPassword.length >= 6 && hasUppercase && hasLowercase && hasSpecialCharacter
        }));
    }

    checkEmailAvailability = async () => {
        const { user } = this.state;

        try {
            if (user.email !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-email/${user.email}`);
                const isEmailAvailable = response.data;

                this.setState({ isEmailAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    checkPhoneAvailability = async () => {
        const { customer } = this.state;

        try {
            if (customer.phoneNo !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-phone/${customer.phoneNo}`);
                const isPhoneAvailable = response.data;

                this.setState({ isPhoneAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    checkCreditCardAvailability = async () => {
        const { customer } = this.state;

        try {
            if (customer.creditCardNo !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-creditCard/${customer.creditCardNo}`);
                const isCreditCardAvailable = response.data;

                this.setState({ isCreditCardAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    formatPhoneNumber = (value) => {
        const phoneNumberWithoutDashes = value.replace(/\D+/g, '');
        let formattedPhoneNumber = '';

        if (phoneNumberWithoutDashes.length > 0) {
            formattedPhoneNumber += phoneNumberWithoutDashes.substring(0, 3);
        }
        if (phoneNumberWithoutDashes.length > 3) {
            formattedPhoneNumber += '-' + phoneNumberWithoutDashes.substring(3, 6);
        }
        if (phoneNumberWithoutDashes.length > 6) {
            formattedPhoneNumber += '-' + phoneNumberWithoutDashes.substring(6, 10);
        }

        return formattedPhoneNumber;
    };


    formatCreditCardNumber = (value) => {
        const formattedCreditCardNumber = value.replace(/\D+/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
        return formattedCreditCardNumber;
    };

    handleReset = () => {
        this.setState({
            user: {
                username: '',
                password: '',
                email: '',
            },
            customer: {
                firstName: '',
                lastName: '',
                address: '',
                phoneNo: '',
                creditCardNo: '',
            },
            error: '',
            isUsernameLengthValid: false,
            isUsernameAvailable: true,
            isPasswordCorrect: false,
            isEmailAvailable: true,
            isPhoneAvailable: true,
            isCreditCardAvailable: true,
        });
    };


    handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, email } = this.state.user;
        const { firstName, lastName, address, phoneNo, creditCardNo } = this.state.customer;

        const maxPhoneLength = 12;
        const maxCreditCardLength = 19;

        if (phoneNo.length !== maxPhoneLength) {
            this.setState({ error: 'Please enter a full phone number.' });
            return;
        }
        else if (creditCardNo.length !== maxCreditCardLength) {
            this.setState({ error: 'Please enter a full credit card number.' });
            return;
        }
        else {
            this.setState({ error: '' });
        }

        try {
            const response = await axios.post(`${config.render.url}/api/auth/register/customer`, {
                user: {
                    username: username,
                    password: password,
                    email: email,
                },
                customer: {
                    first_name: firstName,
                    last_name: lastName,
                    address: address,
                    phone_no: phoneNo,
                    credit_card_no: creditCardNo,

                }
            });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Registration Successful',
                    text: 'You have successfully registered as a customer.',
                    icon: 'success',
                }).then(() => {
                    this.props.history.push('/login');
                });
            }
        } catch (error) {
            this.setState((prevState) => ({
                ...prevState,
                error: `${error.response.data}`,
            }));
        }
    };

    render() {
        const { user, customer, isUsernameAvailable, isUsernameLengthValid, isEmailAvailable, isPhoneAvailable, isCreditCardAvailable, isPasswordCorrect, error } = this.state;

        const shouldEnableSubmit = user.username !== '' && user.password !== '' &&
            user.email !== '' && customer.firstName !== '' && customer.lastName !== '' &&
            customer.address !== '' && customer.phoneNo !== '' && customer.creditCardNo !== '' &&
            isUsernameAvailable && isEmailAvailable && isPhoneAvailable && isCreditCardAvailable && isPasswordCorrect && !isUsernameLengthValid;


        return (
            <div className="container" style={{ fontFamily: "OpenSans", maxWidth: '100%', margin: '30px auto' }}>
                <form
                    className="card z-depth-5"
                    onSubmit={this.handleSubmit}
                    style={{
                        padding: '5px',
                        borderRadius: '20px',
                        border: '5px solid black',
                        maxWidth: '700px',  
                        width: '90%',       
                        margin: '0 auto',   
                    }}
                >
                    <h5 className="center-align" style={{ textDecoration: 'underline', letterSpacing: '1px' }}>Customer Registration</h5>
                    <div className="row">
                        <div className="input-field col s6">
                            <i className="material-icons prefix">account_circle</i>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                pattern="^[A-Za-z0-9_]+$"
                                title="Please enter a valid username (only letters, numbers, and underscores)."
                                value={user.username}
                                onChange={(e) => this.handleInputChange(e, 'user')}
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
                                type={user.showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={(e) => this.handlePasswordChange(e, 'user')}
                                autoComplete="new-password"
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <div className="password-strength">
                                {user.password.length > 0 && (
                                    <div className={`password-strength ${isPasswordCorrect ? 'strength-strong' : 'strength-weak'}`}>
                                        {isPasswordCorrect ? <span style={{ color: '#198754', fontFamily: 'monospace', fontSize: '20px', fontWeight: 'bolder' }}>Strong</span> : <span style={{ color: '#dc3545', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bolder' }}>Weak</span>}
                                    </div>
                                )}
                            </div>
                            <i
                                className={`material-icons toggle-password ${user.showPassword ? 'active' : ''}`}
                                onClick={() => this.handlePasswordToggle('user')}
                                style={{ position: 'absolute', top: '20%', right: '10px', cursor: 'pointer' }}
                            >
                                {user.showPassword ? 'visibility' : 'visibility_off'}
                            </i>
                        </div>
                    </div>
                    <hr style={{ height: '1.5px', backgroundColor: 'grey' }} />
                    <div className="row">
                        <div className="input-field col s6">
                            <i className="material-icons prefix">person</i>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                pattern="[A-Za-z]+"
                                title="Please enter only letters."
                                value={customer.firstName}
                                onChange={(e) => this.handleInputChange(e, 'customer')}
                                required
                            />
                            <label htmlFor="firstName">First Name:</label>
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">person</i>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                pattern="[A-Za-z]+"
                                title="Please enter only letters."
                                value={customer.lastName}
                                onChange={(e) => this.handleInputChange(e, 'customer')}
                                required
                            />
                            <label htmlFor="lastName">Last Name:</label>
                        </div>

                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <i className="material-icons prefix">location_on</i>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={customer.address}
                                onChange={(e) => this.handleInputChange(e, 'customer')}
                                required
                            />
                            <label htmlFor="address">Address:</label>
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">email</i>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={(e) => this.handleInputChange(e, 'user')}
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
                    </div>
                    <div className="row">
                        <hr style={{ height: '1.5px', backgroundColor: 'grey' }} />
                        <div className="input-field col s6">
                            <i className="material-icons prefix">phone</i>
                            <input
                                type="text"
                                id="phoneNo"
                                name="phoneNo"
                                pattern="^\d{3}-\d{3}-\d{4}$"
                                title="Please enter a valid phone number in the format: xxx-xxx-xxxx"
                                value={this.formatPhoneNumber(customer.phoneNo)}
                                maxLength={12}
                                onChange={(e) => this.handleInputChange(e, 'customer')}
                                onBlur={this.checkPhoneAvailability}
                                required
                            />
                            <label htmlFor="phoneNo">Phone:</label>
                            {!isPhoneAvailable && (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                    Phone number is already registered. Please use a different phone number.
                                </span>
                            )}
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">credit_card</i>
                            <input
                                type="text"
                                id="creditCardNo"
                                name="creditCardNo"
                                pattern="^\d{4}-\d{4}-\d{4}-\d{4}$"
                                title="Please enter a valid credit card number in the format: xxxx-xxxx-xxxx-xxxx"
                                value={this.formatCreditCardNumber(customer.creditCardNo)}
                                maxLength={19}
                                onChange={(e) => this.handleInputChange(e, 'customer')}
                                onBlur={this.checkCreditCardAvailability}
                                required
                            />
                            <label htmlFor="creditCardNo">Credit Card:</label>
                            {!isCreditCardAvailable && (
                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                    Credit Card is already associated with another account. Please use a different credit card.
                                </span>
                            )}
                        </div>
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
                    {error && <p style={{ fontFamily: 'monospace', letterSpacing: '1px' }} className="red-text center-align">{error}</p>}
                </form>
            </div>

        );
    }
}

export default withRouter(CustomerRegisterForm);
