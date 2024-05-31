import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class HomePage extends Component {
    render() {
        return (
            <div style={{ fontFamily: 'OpenSans', fontSize: '32px', fontWeight: 'bolder' }} className="homepage">
                <div className="container">
                    <h2 className="center-align" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bolder',
                    }}>
                        <i className="medium material-icons" style={{ color: "gold" }}>star</i> Welcome to Safe Flight!
                        <i className="medium material-icons" style={{ color: "gold" }}>star</i>
                    </h2>
                    <div className="row">
                        <div className="col s12 m6">
                            <p className="center-align">
                                Discover exciting flight options and plan your next adventure.
                            </p>
                            <p className="center-align">
                                <span>Want to search for comparable flights? </span>
                                <NavLink to="/flights" className="btn" style={{ fontSize: '24px' }}>
                                    View Flights
                                </NavLink>
                            </p>
                        </div>
                        <div style={{ marginTop: '20px' }} className="col s12 m6 flight-animation-container">
                            <img
                                src='./img/flight-gif.gif'
                                alt="Flight Animation"
                                className="flight-animation"
                                style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '50%', border: '5px solid black' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
