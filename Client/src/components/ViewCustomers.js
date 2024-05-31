import React, { Component } from 'react';
import axios from 'axios';
import config from './config/default.json';

class ViewCustomers extends Component {
    state = {
        customers: [],
    };

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${config.render.url}/api/administrators/getAllCustomers`, { headers });
            const customers = response.data;
            this.setState({ customers });
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    render() {
        const { customers } = this.state;

        return (
            <div className="container" style={{ fontFamily: 'OpenSans', marginTop: '20px', marginBottom: '50px' }}>
                <h5 className="center-align" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>
                    View Customers <i className="material-icons">person</i>
                </h5>
                <div className="row">
                    {customers.map((customer) => (
                        <div key={customer.id} className="col s12 m6">
                            <div className="card hoverable" style={{
                                border: '5px solid black', borderRadius: '20px', marginBottom: '20px',
                                backgroundImage: 'url(/img/background-customer.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'
                            }}>
                                <div className="card-content">
                                    <h5 className="center-align my-span" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>
                                        Customer Details <i className="material-icons">person</i>
                                    </h5>
                                    <div className="row">
                                        <div className="col s12">
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}>Customer ID:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.id}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >person</i> First Name:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.first_name}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >person</i> Last Name:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.last_name}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >location_on</i> Address:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.address}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >phone</i> Phone:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.phone_no}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >credit_card</i> Credit Card:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.credit_card_no}</span></span></p>
                                            <p><span className='my-span' style={{ fontSize: '16px' }}><strong style={{ fontWeight: 'bolder' }}><i className="material-icons" >account_circle</i> User ID:</strong><span style={{ fontSize: '18px', fontWeight: '600' }}> {customer.user_id}</span></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        );
    }
}

export default ViewCustomers;
