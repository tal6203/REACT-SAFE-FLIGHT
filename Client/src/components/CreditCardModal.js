import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import './CreditCardModal.css';

class CreditCardModal extends Component {
    state = {
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        focused: '',
        isLoading: false,
        errors: {},
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
            this.setState({ [name]: lettersOnly });
        } else if (name === 'expiry') {
            let formattedExpiry = value.replace(/\D/g, '');
            if (formattedExpiry.length > 2) {
                formattedExpiry = formattedExpiry.slice(0, 2) + '/' + formattedExpiry.slice(2, 4);
            }
            this.setState({ [name]: formattedExpiry });
        } else if (name === 'number') {
            let formattedNumber = value.replace(/\D/g, '').slice(0, 16);
            formattedNumber = formattedNumber.replace(/(.{4})/g, '$1 ').trim();
            this.setState({ [name]: formattedNumber });
        } else if (name === 'cvc') {
            const formattedCVC = value.replace(/\D/g, '').slice(0, 4);
            this.setState({ [name]: formattedCVC });
        } else {
            this.setState({ [name]: value });
        }
    };

    handleInputFocus = (e) => {
        this.setState({ focused: e.target.name });
    };

    validateCardNumber = (number) => {
        const regex = new RegExp("^[0-9]{16}$");
        return regex.test(number.replace(/\s+/g, ''));
    };

    validateExpiryDate = (expiry) => {
        const regex = new RegExp("^(0[1-9]|1[0-2])/([0-9]{2})$");
        if (!regex.test(expiry)) return false;

        const parts = expiry.split('/');
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10) + 2000; // assume 20xx

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // getMonth() returns 0-based month
        const currentYear = now.getFullYear();

        return year > currentYear || (year === currentYear && month >= currentMonth);
    };

    validateCVC = (cvc) => {
        const regex = new RegExp("^[0-9]{3,4}$");
        return regex.test(cvc);
    };

    validateInputs = () => {
        const { number, name, expiry, cvc } = this.state;
        const errors = {};

        if (!this.validateCardNumber(number)) {
            errors.number = 'Invalid card number';
        }

        if (name.trim() === '') {
            errors.name = 'Name is required';
        }

        if (!this.validateExpiryDate(expiry)) {
            errors.expiry = 'Invalid expiry date';
        }

        if (!this.validateCVC(cvc)) {
            errors.cvc = 'Invalid CVC';
        }

        return errors;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validateInputs();

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        const { number, name, expiry, cvc } = this.state;

        // Encrypt the card details (simple simulation here, replace with actual encryption)
        const encryptedData = btoa(JSON.stringify({ number, name, expiry, cvc }));
        this.setState({ isLoading: true });

        // Simulate payment processing
        setTimeout(() => {
            this.setState({ isLoading: false });
            this.props.onPaymentSuccess(encryptedData);
        }, 2000);
    };

    render() {
        const { number, name, expiry, cvc, focused, isLoading, errors } = this.state;
        const { onClose } = this.props;

        return (
            <div className="modal-credit">
                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="modal-content-credit">
                            <h4>Enter Credit Card Details</h4>
                            <div className="row">
                                <div className="col s12 m12">
                                    <Cards
                                        number={number}
                                        name={name}
                                        expiry={expiry}
                                        cvc={cvc}
                                        focused={focused}
                                    />
                                </div>
                                <div className="col s12 m12">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="input-field">
                                            <input
                                                type="tel"
                                                name="number"
                                                value={number}
                                                onChange={this.handleInputChange}
                                                onFocus={this.handleInputFocus}
                                                required
                                            />
                                            <label htmlFor="number" className={number ? 'active' : ''}>Card Number</label>
                                            {errors.number && <span className="error">{errors.number}</span>}
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={this.handleInputChange}
                                                onFocus={this.handleInputFocus}
                                                required
                                            />
                                            <label htmlFor="name" className={name ? 'active' : ''}>Name on Card</label>
                                            {errors.name && <span className="error">{errors.name}</span>}
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={expiry}
                                                onChange={this.handleInputChange}
                                                onFocus={this.handleInputFocus}
                                                required
                                            />
                                            <label htmlFor="expiry" className={expiry ? 'active' : ''}>Expiry Date (MM/YY)</label>
                                            {errors.expiry && <span className="error">{errors.expiry}</span>}
                                        </div>
                                        <div className="input-field">
                                            <input
                                                type="tel"
                                                name="cvc"
                                                value={cvc}
                                                onChange={this.handleInputChange}
                                                onFocus={this.handleInputFocus}
                                                required
                                            />
                                            <label htmlFor="cvc" className={cvc ? 'active' : ''}>CVC</label>
                                            {errors.cvc && <span className="error">{errors.cvc}</span>}
                                        </div>
                                        <div className="modal-footer-credit">
                                            <button className="btn" type="submit">Submit Payment</button>
                                            <button className="btn red" type="button" onClick={onClose}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

CreditCardModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
};

export default CreditCardModal;
