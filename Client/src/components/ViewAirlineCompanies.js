import React, { Component } from 'react';
import axios from 'axios';
import config from './config/default.json';

class ViewAirlineCompanies extends Component {
    state = {
        airlineCompanies: [],
    };

    componentDidMount() {
        this.fetchAirlineCompanies();
    }

    fetchAirlineCompanies = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${config.render.url}/api/administrators/getAllAirlineCompanies`, { headers });
            const airlineCompanies = response.data;
            this.setState({ airlineCompanies });
        } catch (error) {
            console.error('Error fetching airline companies:', error);
        }
    };

    render() {
        const { airlineCompanies } = this.state;

        return (
            <div className="container" style={{ fontFamily: 'OpenSans', marginTop: '20px', marginBottom: '50px' }}>
            <h5 className="center-align" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>
                            View Airline Companies <i className="material-icons">flight_takeoff</i>
                        </h5>
                <div className="row">
                    {airlineCompanies.map((company) => (
                        <div key={company.id}  className="col s12 m6 l4">
                            <div className="card hoverable" style={{ border: '5px solid black', borderRadius: '20px', marginBottom: '20px'}}>
                                <div className="card-image" style={{backgroundColor:'white',borderRadius:'15px 15px 0 0',borderBottom:'4px solid black'}}>
                                    <img src={`/img/${company.name}.png`} alt={company.name} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', width: '100%', height: '200px',objectFit: 'contain' }} />
                                </div>
                                <span className="card-title card-title-view-airline" style={{ background: 'rgba(33, 150, 243, 0.7)', padding: '10px', borderRadius: '0 0 20px 20px' }}>
                                    {company.name}
                                </span>
                                <div className="card-content">
                                    <p style={{fontSize: '18px', fontWeight: '600'}}><strong style={{fontSize:'18px', fontWeight:'bolder'}}>ID:</strong> {company.id}</p>
                                    <p style={{fontSize: '18px', fontWeight: '600',display: 'inline-flex', alignItems: 'center'}}><strong style={{fontSize:'18px', fontWeight:'bolder'}}>Country:&nbsp;</strong> {company.country} &nbsp;<img src={`/img/${company.country}_flag.png`} alt={`${company.country} flag`} style={{ height: '20px' }} /></p>
                                    <p style={{fontSize: '18px', fontWeight: '600'}}><strong style={{fontSize:'18px', fontWeight:'bolder'}}>User ID:</strong> {company.user_id}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ViewAirlineCompanies;
