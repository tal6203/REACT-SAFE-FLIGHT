import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { setCountries } from './actions';
import config from './config/default.json';


class AddFlight extends Component {
    state = {
        id: 0,
        airlineCompany: this.props.username,
        originCountry: '',
        destinationCountry: '',
        departureTime: '',
        landingTime: '',
        remainingTickets: '',
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
            console.error('Error fetching countries:', error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSwapCountries = () => {
        this.setState((prevState) => ({
            originCountry: prevState.destinationCountry,
            destinationCountry: prevState.originCountry,
        }));
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { id, airlineCompany, originCountry, destinationCountry, departureTime, landingTime, remainingTickets } = this.state;

        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };


            const response = await axios.post(`${config.render.url}/api/flights/addFlightWithDetails`, {
                id,
                airlineCompany,
                originCountry,
                destinationCountry,
                departureTime,
                landingTime,
                remainingTickets,
            }, { headers });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Success',
                    text: 'Flight has been added successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    this.props.history.push(`/`);
                });
            }
        } catch (error) {
            console.error('Error adding flight:', error);
        }
    };

    render() {
        const { originCountry, destinationCountry, departureTime, landingTime, remainingTickets } = this.state;

        const { countries } = this.props;

        if (!countries) {
            return <div>Loading...</div>;
        }

        const destinationCountries = countries.filter(country => country.name !== originCountry);
        const originCountries = countries.filter(country => country.name !== destinationCountry);

        return (
            <div className="container" style={{ fontFamily: 'OpenSans', marginTop: '50px', marginBottom: '50px', maxWidth: '600px' }}>
                <div className="card  hoverable" style={{ borderRadius: '20px', border: '5px solid black' }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>Add Flight</h2>
                        <form className="add-flight" onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="input-field col s12 m5">
                                    <select
                                        id="originCountry"
                                        className="browser-default"
                                        name="originCountry"
                                        value={originCountry}
                                        onChange={this.handleInputChange}
                                        style={{ marginTop: '5px' }}
                                        required
                                    >
                                        <option value="" disabled>Select origin country</option>
                                        {originCountries.map((country) => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="active"><i className="material-icons tiny">public</i> Origin country:</label>
                                </div>
                                <div className="col s12 m2 center-align" style={{ marginTop: '25px' }}>
                                    <button className="btn" type='button' onClick={this.handleSwapCountries}>
                                        <i className="material-icons">swap_horiz</i>
                                    </button>
                                </div>
                                <div className="input-field col s12 m5">
                                    <select
                                        id="destinationCountry"
                                        className="browser-default"
                                        name="destinationCountry"
                                        value={destinationCountry}
                                        onChange={this.handleInputChange}
                                        style={{ marginTop: '5px' }}
                                        required
                                    >
                                        <option value="" disabled>Select destination country</option>
                                        {destinationCountries.map((country) => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="active"><i className="material-icons tiny">public</i> Destination country:</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m5">
                                    <input
                                        type="datetime-local"
                                        id="departureTime"
                                        name="departureTime"
                                        value={departureTime}
                                        onChange={this.handleInputChange}
                                        max={landingTime}
                                        required
                                    />
                                    <label className="active" htmlFor="departureTime"><i className="material-icons tiny">flight_takeoff</i> Departure Time:</label>
                                </div>
                                <div className="col s12 m2 center-align" style={{ marginTop: '25px' }}>
                                    <i className="material-icons">flight_takeoff</i>
                                </div>
                                <div className="input-field col s12 m5">
                                    <input
                                        type="datetime-local"
                                        id="landingTime"
                                        name="landingTime"
                                        value={landingTime}
                                        onChange={this.handleInputChange}
                                        min={departureTime}
                                        required
                                    />
                                    <label className="active" htmlFor="landingTime"><i className="material-icons tiny">flight_land</i> Landing Time:</label>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col s12'>
                                    <div className="input-field col s12 m6 offset-m3">
                                        <input
                                            type="number"
                                            id="remainingTickets"
                                            name="remainingTickets"
                                            value={remainingTickets}
                                            onChange={this.handleInputChange}
                                            min="50"
                                            required
                                        />
                                        <label className="active" htmlFor="remainingTickets">
                                            <i className="material-icons tiny">confirmation_number</i>
                                            Remaining Tickets:
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                            <div className='col s12 center-align'>
                                <button className="btn " type="submit">
                                    Add Flight
                                    <i className="material-icons right">add</i>
                                </button>
                            </div>
                        </div>
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
        countries: state.countries
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps,mapDispatchToProps)(AddFlight);
