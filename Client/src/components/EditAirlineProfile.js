import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { setCountries } from './actions';
import config from './config/default.json';

class EditAirlineProfile extends Component {
    state = {
        id: null,
        airlineName: '',
        selectedCountry: '',
        user_id: null,
        isCompanyNameAvailable: true,
        initialairlineName: '',
        isSubmitDisabled: false,
    };

    componentDidMount() {
        this.fetchData();
    }

    checkCompanyNameAvailability = async () => {
        const { airlineName, initialairlineName } = this.state;



        try {
            if (airlineName !== "" && initialairlineName !== airlineName) {
                const response = await axios.get(`${config.render.url}/api/auth/check-CompanyName/${airlineName}`);
                const isCompanyNameAvailable = response.data;

                this.setState({ isCompanyNameAvailable, isSubmitDisabled: !isCompanyNameAvailable });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    fetchData = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const { username, countries } = this.props;

            const response = await axios.get(`${config.render.url}/api/airline-companies/getAirlineCompanyShowAllDetailsByUsername/${username}`, { headers });


            this.setState({
                id: response.data.id,
                airlineName: response.data.name,
                selectedCountry: response.data.country,
                user_id: response.data.user_id,
                initialairlineName: response.data.name
            });
            if (!countries || countries.length === 0)
                await this.fetchCountries();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

        this.setState({
            [name]: value,
        });


        if (name === 'airlineName') {
            this.setState({ isCompanyNameAvailable: true });
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { id, airlineName, selectedCountry, user_id } = this.state;
        const { username } = this.props;

        try {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const updatedData = {
                id: id,
                name: airlineName,
                country: selectedCountry,
                user_id: user_id
            };

            const response = await axios.put(
                `${config.render.url}/api/airline-companies/UpdateAirlineWithDetails/${username}/${id}`,
                updatedData,
                { headers }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Profile has been updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    this.props.history.push(`/airline-company/profile/edit/${username}`);
                });
            }
        } catch (error) {
            console.error('Error updating airline details:', error);
        }
    };

    render() {
        const { countries } = this.props;

        if (!countries) {
            return <div>Loading...</div>;
        }

        const { airlineName, selectedCountry, isCompanyNameAvailable, isSubmitDisabled } = this.state;

        return (
            <div className="container"  style={{ marginTop: '30px', width: '100%', maxWidth: '600px', fontFamily: 'OpenSans' ,padding:'20px' }}>
                <div className="card  hoverable" style={{ borderRadius: '20px', border: '5px solid black'  }}>
                    <div className="card-content">
                        <h2 className="card-title" style={{ fontWeight: 'bolder', textDecoration: 'underline' }}>Edit Airline Profile</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="input-field col s12 m6">
                                    <input
                                        type="text"
                                        id="airlineName"
                                        name="airlineName"
                                        pattern="^[A-Za-z0-9\s]*$"
                                        title="Please enter a valid address (only letters, numbers, and spaces)."
                                        value={airlineName}
                                        onChange={this.handleInputChange}
                                        onBlur={this.checkCompanyNameAvailability}
                                        required
                                    />
                                    <label htmlFor="airlineName" className="active">Airline Name  <i className="material-icons">airline_seat_flat</i></label>
                                    {!isCompanyNameAvailable && (
                                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'red' }}>
                                            This company name is taken. Register another company name.
                                        </span>
                                    )}
                                </div>


                                <div className="input-field col s12 m6">
                                    <select
                                        id="country"
                                        className="browser-default"
                                        name="selectedCountry"
                                        value={selectedCountry}
                                        onChange={this.handleInputChange}
                                        style={{ marginTop: '10px' }}
                                        required
                                    >
                                        <option value="" disabled>Select a country</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="country" className="active">Country  <i className="material-icons">public</i></label>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col s12">
                                    <button className="btn" style={{ backgroundColor: '#28a745' }} type="submit" disabled={isSubmitDisabled}>
                                        Save
                                        <i className="material-icons right">save</i>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAirlineProfile);
