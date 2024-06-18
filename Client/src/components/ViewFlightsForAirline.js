import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCountries } from './actions';
import config from './config/default.json';

class ViewFlightsForAirline extends Component {
    state = {
        flights: [],
        editingFlightId: null,
        editedFlights: {
            airlineCompany: '',
            originCountry: '',
            destinationCountry: '',
            departureTime: '',
            landingTime: '',
            remainingTickets: null,
        },

    };

    componentDidMount() {
        const { countries } = this.props;

        this.fetchFlightsForAirline();
        if (!countries || countries.length === 0) this.fetchCountries();
    }

    fetchFlightsForAirline = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const { username } = this.props;

            const response = await axios.get(
                `${config.render.url}/api/airline-companies/getFlightDetailsByUsername/${username}`,
                {
                    headers,
                }
            );

            const flights = response.data;
            this.setState({ flights });
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    fetchCountries = async () => {
        try {
            const response = await axios.get(`${config.render.url}/api/countries`);
            const countries = response.data;
            this.props.dispatch(setCountries(countries));
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    handleEditFlight = (flightId) => {
        const editedFlight = this.state.flights.find((flight) => flight.id === flightId);
        this.setState({
            editingFlightId: flightId,
            editedFlights: { ...editedFlight },
        });

        // Open the modal using MaterializeCSS
        const modal = document.getElementById('editFlightModal');
        const modalInstance = window.M.Modal.init(modal);
        modalInstance.open();
    };

    handleEditChange = (column, event) => {
        const { editedFlights } = this.state;
        const value = event.target.value;

        this.setState({
            editedFlights: {
                ...editedFlights,
                [column]: value,
            },
        });
    };

    saveEditedFlight = async () => {
        const { editingFlightId, editedFlights } = this.state;
        const { username } = this.props;

        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.put(
                `${config.render.url}/api/airline-companies/UpdateFlightDetailsByUsernameByFlightId/${editingFlightId}/${username}`,
                editedFlights,
                { headers }
            );

            if (response.status === 200) {
                this.fetchFlightsForAirline();
                this.closeEditModal();
            }
        } catch (error) {
            console.error('Error updating flight:', error);
        }
    };

    closeEditModal = () => {
        this.setState({
            editingFlightId: null,
            editedFlights: {
                airlineCompany: '',
                originCountry: '',
                destinationCountry: '',
                departureTime: '',
                landingTime: '',
                remainingTickets: null,
            },
        });

        // Close the modal using MaterializeCSS
        const modal = document.getElementById('editFlightModal');
        window.M.Modal.init(modal).close();
    };

    handleSwapCountries = () => {
        const { editedFlights } = this.state;

        this.setState({
            editedFlights: {
                ...editedFlights,
                originCountry: editedFlights.destinationCountry,
                destinationCountry: editedFlights.originCountry,
            },
        });
    };



    render() {
        const { flights, editedFlights } = this.state;
        const { countries } = this.props;

        if (!countries) {
            return <div>Loading...</div>;
        }

        const destinationCountries = countries.filter((country) => country.name !== editedFlights.originCountry);
        const originCountries = countries.filter((country) => country.name !== editedFlights.destinationCountry);

        return (
            <div className="container" style={{ fontFamily: 'OpenSans', marginTop: '20px', marginBottom: '50px' }}>
                {flights.length === 0 ? (
                    <div className="row">
                        <div className="col s12 m6 offset-m3 l4 offset-l4">
                            <div className="card z-depth-5" style={{ marginBottom: '20px', border: '3px solid black', borderRadius: '15px', backgroundColor: '#f5f5f5' }}>
                                <div className="card-content center-align">
                                    <h4>No Flights Available</h4>
                                    <p style={{ color: '#757575' }}>Currently, there are no flights to display.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {flights.map((flight) => (
                            <div key={flight.id} className="col s12 m6 l4">
                                <div
                                    key={flight.id}
                                    className="card hoverable z-depth-5"
                                    style={{
                                        marginBottom: '20px',
                                        backgroundImage: 'url(/img/background-flghts.webp)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'right',
                                        border: '3px solid black',
                                    }}
                                >
                                    <div className="card-content">
                                        <span className="card-title">
                                            <span className="my-span">
                                                <strong>Flight ID: {flight.id}</strong>
                                            </span>
                                        </span>
                                        <p style={{ marginTop: '7px' }}>
                                            <span className="my-span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <strong>Origin Country:</strong> &nbsp;{flight.originCountry}
                                                &nbsp;<img src={`/img/${flight.originCountry}_flag.png`} alt={`${flight.originCountry} flag`} style={{ height: '20px' }} />
                                            </span>
                                        </p>
                                        <p style={{ marginTop: '7px' }}>
                                            <span className="my-span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                <strong>Destination Country:</strong> &nbsp;{flight.destinationCountry}
                                                &nbsp;<img src={`/img/${flight.destinationCountry}_flag.png`} alt={`${flight.destinationCountry} flag`} style={{ height: '20px' }} />
                                            </span>
                                        </p>
                                        <p style={{ marginTop: '7px' }}>
                                            <span className="my-span" >
                                                <strong>Departure Time:</strong> {flight.departureTime.replace('T', ' | ')}
                                            </span>
                                        </p>
                                        <p style={{ marginTop: '7px' }}>
                                            <span className="my-span">
                                                <strong>Landing Time:</strong> {flight.landingTime.replace('T', ' | ')}
                                            </span>
                                        </p>
                                        <p style={{ marginTop: '7px' }}>
                                            <span className="my-span">
                                                <strong>Remaining Tickets:</strong> {flight.remainingTickets}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="card-action center-align" style={{ backgroundColor: 'initial' }}>
                                        <button
                                            className="btn waves-effect waves-light blue "
                                            style={{ display: 'inline-flex', alignItems: 'center' }}
                                            onClick={() => this.handleEditFlight(flight.id)}
                                        >
                                            Edit &nbsp;<i className="material-icons">edit</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}

                <div id="editFlightModal" className="modal custom-modal">
                    <div className="modal-content">
                        <h4>Edit Flight</h4>
                        <div className="input-field">
                            <select
                                className="browser-default center"
                                value={editedFlights.originCountry}
                                onChange={(e) => this.handleEditChange('originCountry', e)}
                            >
                                <option value="" disabled>
                                    Select Origin Country
                                </option>
                                {originCountries.map((country) => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="originCountry" className="active">
                                <i className="material-icons tiny">public</i>&nbsp;Origin Country:
                            </label>
                        </div>
                        <button className="btn" type='button' onClick={this.handleSwapCountries}>
                            <i className="material-icons">import_export</i>
                        </button>
                        <div className="input-field">
                            <select
                                className="browser-default center"
                                value={editedFlights.destinationCountry}
                                onChange={(e) => this.handleEditChange('destinationCountry', e)}

                            >
                                <option value="" disabled>
                                    Select Destination Country
                                </option>
                                {destinationCountries.map((country) => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="destinationCountry" className="active">
                                <i className="material-icons tiny">public</i>&nbsp;Destination Country:
                            </label>
                        </div>
                        <div className="input-field" style={{marginTop:'20px'}}>
                            <input
                                type="datetime-local"
                                value={editedFlights.departureTime}
                                onChange={(e) => this.handleEditChange('departureTime', e)}
                                max={editedFlights.landingTime}
                            />
                            <label htmlFor="departureTime" className='active'><i className="material-icons tiny">flight_takeoff</i>&nbsp;
                                Departure Time:
                            </label>
                        </div>
                        <div className="input-field">
                            <input
                                type="datetime-local"
                                value={editedFlights.landingTime}
                                onChange={(e) => this.handleEditChange('landingTime', e)}
                                min={editedFlights.departureTime}
                            />
                            <label htmlFor="landingTime" className='active'><i className="material-icons tiny">flight_land</i>&nbsp;
                                Landing Time:
                            </label>
                        </div>
                        <div className="input-field">
                            <input
                                type="number"
                                value={editedFlights.remainingTickets !== null ? editedFlights.remainingTickets : ''}
                                min="0"
                                onChange={(e) => this.handleEditChange('remainingTickets', e)}
                            />
                            <label className="active" htmlFor="remainingTickets">
                                <i className="material-icons tiny">confirmation_number</i>&nbsp;
                                Remaining Tickets:
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <button className="modal-close btn waves-effect waves-light green" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '45%' }} onClick={this.saveEditedFlight}>
                                Save &nbsp;<i className="material-icons">save</i>
                            </button>
                            <button className="modal-close btn waves-effect waves-light red" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '45%' }} onClick={this.closeEditModal}>
                                Cancel &nbsp;<i className="material-icons">close</i>
                            </button>
                        </div>
                  
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username,
        countries: state.countries,
    };
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewFlightsForAirline);
