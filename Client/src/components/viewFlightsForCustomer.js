import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import config from './config/default.json';
import Swal from 'sweetalert2';


class ViewFlightsForCustomer extends Component {
  state = {
    flights: [],
  };

  componentDidMount() {
    this.fetchFlights();
  }
  fetchFlights = async () => {
    const { username } = this.props;

    try {
      const token = localStorage.getItem('jwtToken');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${config.render.url}/api/flights/byUsername/${username}`, {
        headers,
      });

      const flights = response.data;

      this.setState({ flights });
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };


  cancelFlight = async (flightId) => {
    const { username } = this.props;

    try {
      // Show a confirmation alert before canceling the flight
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!',
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('jwtToken');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        await axios.delete(
          `${config.render.url}/api/customers/removeFlight/${flightId}/${username}`, { headers }
        );

        // Update the state to remove the canceled flight
        this.setState((prevState) => ({
          flights: prevState.flights.filter((flight) => flight.id !== flightId),
        }));

        Swal.fire('Canceled!', 'Your flight has been canceled.', 'success');
      }
    } catch (error) {
      console.error('Error canceling flight:', error);
      Swal.fire('Error!', 'An error occurred while canceling the flight.', 'error');
    }
  };

  render() {
    const { flights } = this.state;

    return (
      <div className="container" style={{ fontFamily: 'OpenSans' }}>
      <h5 style={{ fontWeight: 'bolder', textDecoration: 'underline', letterSpacing: '1px' }}>Your Purchased Flights</h5>
      <div className="row">
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight.id} className="col s12 m6">
              <div className="card z-depth-5" style={{ borderRadius: '10px', border: '5px solid black', overflow: 'hidden' }}>
                <div
                  className="card-image"
                  style={{
                    height: '200px',
                    backgroundImage: `url(/img/${flight.destinationCountry}.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom:'5px solid black'
                  }}
                >
                  
                </div>
                <span className="card-title" style={{ background: 'rgba(33, 150, 243, 0.7)', padding: '10px', borderRadius: '0 0 20px 20px',display: 'inline-flex', alignItems: 'center' }}>
                <strong>{flight.airlineCompany}</strong>&nbsp;&nbsp;&nbsp;&nbsp; <img src={`/img/${flight.airlineCompany}.png`} alt={flight.airlineCompany} style={{ height:'40px' }} />
                </span>
                <div className="card-content">
                  <p>
                    <span><strong>Flight ID:</strong> {flight.id}</span><br />
                    <span style={{display: 'inline-flex', alignItems: 'center'}}><strong>Origin Country:</strong> &nbsp;{flight.originCountry} &nbsp;<img src={`/img/${flight.originCountry}_flag.png`} alt={`${flight.originCountry} flag`} style={{ height: '20px' }} /></span><br />
                    <span style={{display: 'inline-flex', alignItems: 'center'}}><strong>Destination Country:</strong> &nbsp;{flight.destinationCountry}&nbsp; <img src={`/img/${flight.destinationCountry}_flag.png`} alt={`${flight.destinationCountry} flag`} style={{ height: '20px' }} /></span><br />
                    <span><strong>Departure Time:</strong> {flight.departureTime.replace('T', ' | ')}</span><br />
                    <span><strong>Landing Time:</strong> {flight.landingTime.replace('T', ' | ')}</span>
                  </p>
                </div>
                <div className="card-action center-align" style={{ backgroundColor: 'initial' }}>
                  <button
                    className="btn red lighten-1 waves-effect waves-light"
                    onClick={() => this.cancelFlight(flight.id)}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <span style={{ marginRight: '5px' }}>Cancel</span>
                    <i className="material-icons">cancel</i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You have not purchased any flights.</p>
        )}
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

export default connect(mapStateToProps)(ViewFlightsForCustomer);