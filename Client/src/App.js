import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import FlightSearchPage from './components/FlightSearchPage';
import LoginForm from './components/LoginForm';
import ViewFlightsForCustomer from './components/viewFlightsForCustomer';
import EditProfile from './components/EditProfile';
import ViewFlightsForAirline from './components/ViewFlightsForAirline';
import EditAirlineProfile from './components/EditAirlineProfile';
import AddFlight from './components/AddFlight';
import { connect } from 'react-redux';
import { loginSuccess } from './components/actions';
import ViewCustomers from './components/ViewCustomers';
import ViewAirlineCompanies from './components/ViewAirlineCompanies';
import CustomerRegisterForm from './components/CustomerRegisterForm';
import AirlineCompanyRegisterForm from './components/AirlineCompanyRegisterForm';
import AdministratorRegisterForm from './components/AdministratorRegisterForm';
import './DarkMode.css'




function App({ loggedIn, userRole, handleLogin }) {
  const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const storedUsername = localStorage.getItem('username');
  const storedUserRole = parseInt(localStorage.getItem('userRole'));

  if (storedLoggedIn && storedUsername && !isNaN(storedUserRole)) {
    handleLogin(storedUsername, storedUserRole);
  }



  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/flights" component={FlightSearchPage} />
          <Route
            exact
            path="/login"
            render={() => (loggedIn ? <Redirect to="/" /> : <LoginForm />)}
          />

          <Route exact path="/register/customer" render={() => (loggedIn ? <Redirect to="/" /> : <CustomerRegisterForm />)} />
          <Route exact path="/register/airline-company" render={() => (loggedIn ? <Redirect to="/" /> : <AirlineCompanyRegisterForm />)} />
          <Route exact path="/register/administrator" render={() => (loggedIn ? <Redirect to="/" /> : <AdministratorRegisterForm />)} />


          {userRole === 1 && (
            <>
              <Route exact path="/customer/flights" component={ViewFlightsForCustomer} />
              <Route path="/customer/profile/:username" component={EditProfile} />


              <Redirect from="/airline-company" to="/" />
              <Redirect from="/administrator" to="/" />
            </>
          )}


          {userRole === 2 && (
            <>
              <Route exact path="/airline-company/flights" component={ViewFlightsForAirline} />
              <Route exact path="/airline-company/profile/edit/:username" component={EditAirlineProfile} />
              <Route exact path="/airline-company/add-flight" component={AddFlight} />


              <Redirect from="/customer" to="/" />
              <Redirect from="/administrator" to="/" />
            </>
          )}


          {userRole === 3 && (
            <>
              <Route exact path="/administrator/customers" component={ViewCustomers} />
              <Route exact path="/administrator/airline-companies" component={ViewAirlineCompanies} />


              <Redirect from="/customer" to="/" />
              <Redirect from="/airline-company" to="/" />
            </>
          )}
        </header>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    userRole: state.userRole,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: (username, userRole) => dispatch(loginSuccess(username, userRole)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
