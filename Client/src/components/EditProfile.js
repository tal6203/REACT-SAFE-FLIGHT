import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import config from './config/default.json';


class EditProfile extends Component {
    state = {
        id: 0,
        firstName: "",
        lastName: "",
        address: "",
        phoneNo: "",
        creditCardNo: "",
        userId: 0,
        isPhoneAvailable: true,
        isCreditCardAvailable: true,
        initialPhoneNo: '',
        initialCreditCardNo: '',
        isSubmitDisabled: false,
        error: ''
    };

    componentDidMount() {
        this.fetchCustomerProfile();
    }



    fetchCustomerProfile = async () => {
        const { username } = this.props;
        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${config.render.url}/api/customers/ByUsername/${username}`, {
                headers,
            });
            const customerProfile = response.data;


            this.setState({
                id: customerProfile.id,
                firstName: customerProfile.first_name,
                lastName: customerProfile.last_name,
                address: customerProfile.address,
                phoneNo: customerProfile.phone_no,
                creditCardNo: customerProfile.credit_card_no,
                userId: customerProfile.user_id,
                initialPhoneNo: customerProfile.phone_no,
                initialCreditCardNo: customerProfile.credit_card_no
            });
        } catch (error) {
            console.error('Error fetching customer profile:', error);
        }
    };

    handleCreditCardChange = (e) => {
        const { value } = e.target;
        const formattedValue = value
            .replace(/\s+/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1-');

        this.setState({ creditCardNo: formattedValue });
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

    checkPhoneAvailability = async () => {
        const { phoneNo, initialPhoneNo } = this.state;

        try {
            if (phoneNo !== initialPhoneNo && phoneNo !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-phone/${phoneNo}`);
                const isPhoneAvailable = response.data;

                this.setState({ isPhoneAvailable, isSubmitDisabled: !isPhoneAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    checkCreditCardAvailability = async () => {
        const { creditCardNo, initialCreditCardNo } = this.state;

        try {
            if (creditCardNo !== initialCreditCardNo && creditCardNo !== "") {
                const response = await axios.get(`${config.render.url}/api/auth/check-creditCard/${creditCardNo}`);
                const isCreditCardAvailable = response.data;

                this.setState({ isCreditCardAvailable, isSubmitDisabled: !isCreditCardAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

        if (name === 'phoneNo') {
            this.setState({ isPhoneAvailable: true });
        }
        else if (name === 'creditCardNo') {
            this.setState({ isCreditCardAvailable: true });
        }
        else if (!this.state.isSubmitDisabled) {
            this.setState({ isSubmitDisabled: false });
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username } = this.props;
        const { id, firstName, lastName, address, phoneNo, creditCardNo, userId } = this.state;

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
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.put(`${config.render.url}/api/customers/${id}`, {
                firstName,
                lastName,
                address,
                phoneNo,
                creditCardNo,
                userId
            }, { headers });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Profile has been updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    this.props.history.push(`/customer/profile/${username}`);
                });
            }
        } catch (error) {
            this.setState({ error: error.response.data });
        }
    };

    render() {
        const { firstName, lastName, address, phoneNo, creditCardNo, error } = this.state;


        return (
            <div className="container" style={{ maxWidth: '100%', padding: '0 15px', marginTop: '30px', marginBottom: '30px' }}>
                <div className="card z-depth-5" style={{ borderRadius: '20px', border: '5px solid black', maxWidth: '700px', width: '90%', margin: '0 auto' }}>
                    <div className="card-content">
                        <span className="card-title" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>Edit Profile</span>
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <i className="material-icons prefix">person</i>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={firstName}
                                        onChange={this.handleInputChange}
                                        pattern="[A-Za-z]+"
                                        title="Please enter only letters."
                                        required
                                    />
                                    <label htmlFor="firstName" className="active">First Name</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <i className="material-icons prefix">person</i>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.handleInputChange}
                                        pattern="[A-Za-z]+"
                                        title="Please enter only letters."
                                        required
                                    />
                                    <label htmlFor="lastName" className="active">Last Name</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <i className="material-icons prefix">location_on</i>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={address}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <label htmlFor="address" className="active">Address</label>
                                </div>
                                <div className="input-field col s12 m6">
                                    <i className="material-icons prefix">phone</i>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phoneNo"
                                        pattern="^\d{3}-\d{3}-\d{4}$"
                                        title="Please enter a valid phone number in the format: xxx-xxx-xxxx"
                                        value={this.formatPhoneNumber(phoneNo)}
                                        maxLength={12}
                                        onChange={this.handleInputChange}
                                        onBlur={this.checkPhoneAvailability}
                                        required
                                    />
                                    <label htmlFor="phone" className="active">Phone</label>
                                    {!this.state.isPhoneAvailable && (
                                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                            Phone number is already registered. Please use a different phone number.
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m8 offset-m2 l6 offset-l3 center">
                                    <i className="material-icons prefix">credit_card</i>
                                    <input className='center'
                                        type="text"
                                        id="creditCard"
                                        name="creditCardNo"
                                        pattern="^\d{4}-\d{4}-\d{4}-\d{4}$"
                                        title="Please enter a valid credit card number in the format: xxxx-xxxx-xxxx-xxxx"
                                        value={creditCardNo}
                                        maxLength={19}
                                        onChange={this.handleCreditCardChange}
                                        onBlur={this.checkCreditCardAvailability}
                                        required
                                    />
                                    <label htmlFor="creditCard" className="active">Credit Card</label>
                                    {!this.state.isCreditCardAvailable && (
                                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                            Credit Card is already associated with another account. Please use a different credit card.
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="center-align">
                                <button className="btn" style={{ backgroundColor: '#28a745' }} type="submit" disabled={this.state.isSubmitDisabled}>
                                    Save Changes
                                    <i className="material-icons right">save</i>
                                </button>
                            </div>
                            {error && <p style={{ fontFamily: 'monospace', letterSpacing: '1px' }} className="red-text center-align">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
    };
};

export default withRouter(connect(mapStateToProps)(EditProfile));
