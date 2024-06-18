import React, { Component } from 'react';
import './FlightSearchPage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCountries, setAirlines } from './actions'
import config from './config/default.json'
import CreditCardModal from './CreditCardModal';

class FlightSearchPage extends Component {
    state = {
        departureTime: '',
        originCountry: '',
        destinationCountry: '',
        selectedAirlines: [],
        flights: [],
        isLoading: false,
        showModal: false,
        currentFlightId: null,
    };

    async componentDidMount() {
        const { countries, airlines, setCountries, setAirlines } = this.props;
        // Check if countries and airlines are already fetched
        const elems = document.querySelectorAll('.materialboxed');
        window.M.Materialbox.init(elems, { inDuration: 275 });
        if (!countries || countries.length === 0) {
            try {
                const response = await axios.get(`${config.render.url}/api/countries`);
                const fetchedCountries = response.data;
                setCountries(fetchedCountries);
            } catch (error) {
                console.log(error.message);
            }
        }

        if (!airlines || airlines.length === 0) {
            try {
                const response = await axios.get(`${config.render.url}/api/auth/airlinesWithDetails`);
                const fetchedAirlines = response.data;
                setAirlines(fetchedAirlines);
            } catch (error) {
                console.log(error.message);
            }
        }
    }

   

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleCheckboxChange = (event, airlineId) => {
        const { selectedAirlines } = this.state;
        const isChecked = event.target.checked;

        if (isChecked) {
            this.setState({
                selectedAirlines: [...selectedAirlines, airlineId],
            });
        } else {
            this.setState({
                selectedAirlines: selectedAirlines.filter((id) => id !== airlineId),
            });
        }
    };

    handleSwapCountries = () => {
        this.setState((prevState) => ({
            originCountry: prevState.destinationCountry,
            destinationCountry: prevState.originCountry,
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { departureTime, originCountry, destinationCountry, selectedAirlines } = this.state;
        const airlineIdList = selectedAirlines.join(',');

        try {
            this.setState({ isLoading: true, hasResults: false });

            const response = await axios.get(`${config.render.url}/api/auth/search/${departureTime}`, {
                params: {
                    originCountry: originCountry,
                    destinationCountry: destinationCountry,
                    airlineIdList: airlineIdList,
                },
            });


            setTimeout(() => {
                this.setState({ flights: response.data, isLoading: false }, () => {
                    const elems = document.querySelectorAll('.materialboxed');
                    window.M.Materialbox.init(elems, { inDuration: 275 });
                });
                this.scrollToTable();
            }, 3000);
        } catch (error) {
            this.setState({ isLoading: false });
        }
    };

    scrollToTable = () => {
        if (this.tableRef) {
            this.tableRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    purchaseTicket = (flightId) => {
        this.setState({ showModal: true, currentFlightId: flightId });
    };

    handlePaymentSuccess = async () => {
        try {
            this.setState({ showModal: false });
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // // Create the ticket purchase payload
            const ticketData = {
                flightId: this.state.currentFlightId,
            };

            // Make the request to add the ticket
            const addTicketResponse = await axios.post(`${config.render.url}/api/customers/addTicketByUsername/${username}`, ticketData, { headers });

            if (addTicketResponse.status === 201) {
                const updatedFlights = this.state.flights.map((flight) => {
                    if (flight.id === this.state.currentFlightId) {
                        return { ...flight, remainingTickets: flight.remainingTickets - 1 };
                    }
                    return flight;
                });

                this.setState({ flights: updatedFlights });
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: 'Your payment has been processed successfully.',
                });
            }
        } catch (error) {
            console.error('Error purchasing ticket:', error.response.data);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Cannot purchase a ticket for the same flight twice.',
            });
        }
    };

    handleModalClose = () => {
        this.setState({ showModal: false });
    };

    handleClear = () => {
        // Clear the search form and results
        this.setState({
            departureTime: '',
            originCountry: '',
            destinationCountry: '',
            selectedAirlines: [],
            flights: [],
            isLoading: false,
        });
    };

    render() {
        const { departureTime, originCountry, destinationCountry, selectedAirlines, flights, isLoading, showModal  } = this.state;

        const { countries, airlines } = this.props;

        if (!countries || !airlines) {
            return (
                <div className="loading-spinner-a">
                    <div className="loading-spinner-page"></div>
                </div>
            );
        }

        const destinationCountries = countries.filter((country) => country.name !== originCountry);
        const originCountries = countries.filter((country) => country.name !== destinationCountry);

        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const userRole = parseInt(localStorage.getItem('userRole'));

        return (
            <div className="container search" style={{ fontFamily: 'OpenSans', margin: '30px auto' }}>
                <div className="row">
                    <div className="col s12">
                        <form className="card z-depth-5" onSubmit={this.handleSubmit} style={{ padding: '20px', fontFamily: 'OpenSans', border: '5px solid black', maxWidth: '700px', margin: '0 auto' }}>
                            <h5 className="center-align" style={{fontWeight:'bolder'}}>Flight Search</h5>
                            <div className="row">
                                <div className="col s12 center-align">
                                    <div className="input-field col s6 offset-s3" style={{padding:'5px'}}>
                                        <i className="material-icons prefix">event</i>
                                        <input
                                            type="date"
                                            id="departureTime"
                                            name="departureTime"
                                            value={departureTime}
                                            onChange={this.handleInputChange}
                                            required
                                        />
                                        <label htmlFor="departureTime" className='custom-departure-label'><i className="material-icons tiny">flight_takeoff</i> Departure Time</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m6 l5">
                                    <select
                                        id="originCountry"
                                        name="originCountry"
                                        className="browser-default"
                                        style={{ marginTop: '5px' }}
                                        value={originCountry}
                                        onChange={this.handleInputChange}
                                    >
                                        <option value="">Select Origin Country</option>
                                        {originCountries.map((country) => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="originCountry" className="active">
                                        <i className="material-icons tiny">public</i>Origin Country:
                                    </label>
                                </div>
                                <div className="col s12 m12 l2 center-align" style={{ marginTop: '25px' }}>
                                    <button className="btn" type='button' onClick={this.handleSwapCountries}>
                                        <i className="material-icons">swap_horiz</i>
                                    </button>
                                </div>
                                <div className="input-field col s12 m6 l5">
                                    <select
                                        id="destinationCountry"
                                        name="destinationCountry"
                                        className="browser-default"
                                        style={{ marginTop: '5px' }}
                                        value={destinationCountry}
                                        onChange={this.handleInputChange}
                                    >
                                        <option value="">Select Destination Country</option>
                                        {destinationCountries.map((country) => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="destinationCountry" className="active">
                                        <i className="material-icons tiny">public</i>Destination Country:
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12">
                                    <p>Select Airlines:</p>
                                    {airlines.map((airline) => (
                                        <label key={airline.id} style={{}}>
                                            <input
                                                type="checkbox"
                                                name="selectedAirlines"
                                                value={airline.id}
                                                checked={selectedAirlines.includes(airline.id)}
                                                onChange={(event) => this.handleCheckboxChange(event, airline.id)}
                                            />
                                            <span style={{ paddingLeft: '22px', paddingRight: '20px' }}>{airline.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="row center-align">
                                <div className="col s12 m6">
                                    <button className="btn" type="submit">
                                        Search Flights
                                        <i className="material-icons right">search</i>
                                    </button>
                                </div>
                                <div className="col s12 m6 space-btn">
                                    <button className="btn" type="button" onClick={this.handleClear}>
                                        Clear Search
                                        <i className="material-icons right">loop</i>
                                    </button>
                                </div>
                            </div>

                        </form>
                        {isLoading ? (
                            <div className="loading-modal">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <div className="card z-depth-3" style={{ padding: '10px', fontFamily: 'OpenSans', marginTop: '20px', border: '5px solid black', overflowX: 'auto' }}>
                                {flights && flights.length > 0 ? (
                                    <div className="card-content">
                                        <h6 className="center-align" style={{ fontSize: '30px', textDecoration: 'underline', fontFamily: 'OpenSans' }}>search results:</h6>
                                        <div className="row">
                                            {flights.map((flight) => (
                                                <div key={flight.id} className="col s12 m6">
                                                    <div className="card hoverable z-depth-3">
                                                        <div className="card-image">
                                                            <img className="materialboxed" style={{ width: '100%', height: '200px', objectFit: 'cover', border: '4px solid black' }} src={`./img/${flight.destinationCountry}.jpg`} alt={flight.destinationCountry} />
                                                        </div>
                                                        <span className="card-title" style={{ background: 'rgba(33, 150, 243, 0.7)', padding: '10px', borderRadius: '0 0 20px 20px', color: 'white', display: 'inline-flex', alignItems: 'center' }}>{flight.airlineCompany}&nbsp;&nbsp;&nbsp;&nbsp; <img style={{ height: '40px' }} src={`./img/${flight.airlineCompany}.png`} alt={flight.airlineCompany} /></span>
                                                        <div className="card-content">
                                                            <div className="row">
                                                                <div className="col s12">
                                                                    <p>
                                                                        <strong>Flight ID:</strong> {flight.id}<br />
                                                                        <strong>Origin Country:</strong>&nbsp;{flight.originCountry}&nbsp;<span style={{display: 'inline-flex', alignItems: 'center'}}><img src={`./img/${flight.originCountry}_flag.png`} alt={`${flight.originCountry} flag`} style={{ height: '15px' }} /></span><br />
                                                                        <strong>Destination Country:</strong>&nbsp;{flight.destinationCountry}&nbsp;<span style={{display: 'inline-flex', alignItems: 'center'}}><img src={`./img/${flight.destinationCountry}_flag.png`} alt={`${flight.destinationCountry} flag`} style={{ height: '15px' }} /></span><br />
                                                                        <strong>Departure Time:</strong> {flight.departureTime.replace('T', ' | ')}<br />
                                                                        <strong>Landing Time:</strong> {flight.landingTime.replace('T', ' | ')}<br />
                                                                        <strong>Remaining Tickets:</strong> {flight.remainingTickets}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isLoggedIn && userRole === 1 ? (
                                                            <div className="card-action" >
                                                                {flight.remainingTickets > 0 ? (
                                                                    <button className="btn waves-effect waves-light btn-purchase" style={{ display: 'inline-flex', alignItems: 'center' }} onClick={() => this.purchaseTicket(flight.id)}>Purchase &nbsp;<i className="material-icons">shopping_cart</i></button>
                                                                ) : (
                                                                    <button style={{ pointerEvents: 'none' }} className='btn waves-effect red'>Fully Booked</button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="card-action">
                                                                <p style={{ fontWeight: 'bold', fontSize: '18px', color: 'red' }}>Only customers can purchase tickets.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="center-align">
                                        <p style={{fontWeight:'bolder',fontSize:'18px'}}>No flights available for the selected criteria.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="scroll-top-button" onClick={this.scrollToTop}>
                    <button className="btn ">
                        <i className="material-icons">arrow_upward</i>
                    </button>
                </div>
                {showModal && (
                    <CreditCardModal
                        onClose={this.handleModalClose}
                        onPaymentSuccess={this.handlePaymentSuccess}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries,
        airlines: state.airlines,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setCountries: (countries) => dispatch(setCountries(countries)),
    setAirlines: (airlines) => dispatch(setAirlines(airlines)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FlightSearchPage);
