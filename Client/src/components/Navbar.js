import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { logout } from './actions';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import DarkModeToggle from './DarkModeToggle';
import config from './config/default.json';

class Navbar extends Component {
  state = {
    showUserActions: false,
  };

  componentDidMount() {
    this.initializeDropdown();
    this.initializeSidenav();
  }

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.initializeDropdown();
    }
  }

  initializeSidenav() {
    const sidenavOptions = {};
    const sidenavElems = document.querySelectorAll('.sidenav');

    if (window.M && typeof window.M.Sidenav === 'function') {
      window.M.Sidenav.init(sidenavElems, sidenavOptions);
    }
  }



  initializeDropdown() {
    window.$('.dropdown-trigger').dropdown({
      constrainWidth: false,
    });
  }

  toggleUserActions = () => {
    this.setState((prevState) => ({
      showUserActions: !prevState.showUserActions,
    }));
  };

  handleLogout = async () => {
    try {
      const response = await axios.post(`${config.render.url}/api/auth/logout`, null);

      if (response.status === 200) {
        // Show a confirmation dialog before proceeding with logout
        Swal.fire({
          title: 'Confirm Logout',
          text: 'Are you sure you want to log out?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, log out',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.props.dispatch(logout());
            window.history.pushState(null, null, '/');
            this.props.history.push('/login');
            Swal.fire({
              title: 'Logged Out',
              text: 'You have been logged out successfully!',
              icon: 'success'
            });
          }
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  handleGoBack = () => {
    this.props.history.goBack();
  };


  render() {
    const { loggedIn, username, userRole } = this.props; // Added userRole
    const { showUserActions } = this.state; // Added showUserActions



    return (
      <nav style={{ fontFamily: 'OpenSans', letterSpacing: '1px' }}>
        <div className="nav-wrapper">
          <NavLink to="/" className="brand-logo center" >
            <i className="Small material-icons">airplanemode_active</i>
            <span className="hide-on-small-only logo-text">safe flight</span>
             &nbsp;<i className="Small material-icons">airplanemode_active</i>
          </NavLink>
          <ul className="left hide-on-med-and-down">
            <li>
              <button className="btn" type='button' style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '20px', borderRadius: '20px', fontFamily: 'OpenSans' }} onClick={this.handleGoBack}>
                Go Back
                <i className="material-icons">arrow_back</i>
              </button>
            </li>
            <li>
              <NavLink to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>Home <i style={{marginRight: '10px' }} className="material-icons">home</i></NavLink>
            </li>
            <li>
              <NavLink to="/flights" style={{ display: 'inline-flex', alignItems: 'center' }}>Flight Search <i className="material-icons">search</i></NavLink>
            </li>
          </ul>
          <ul className="right hide-on-med-and-down">
            {loggedIn ? (
              <>
                <li>
                  <a
                    className="dropdown-trigger"
                    href="#!"
                    data-target="user-actions-dropdown"
                    onClick={this.toggleUserActions}
                    style={{ fontWeight: 'bolder', fontSize: '16px', textDecoration: 'underline' }}
                  >
                    Hello, {username}<i className="material-icons right">arrow_drop_down</i>
                  </a>
                </li>
                <li style={{ marginRight: '10px' }}>
                  <button className="btn waves-effect waves-light red" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'OpenSans' }} onClick={this.handleLogout}>Log out
                    <i className="material-icons right"  >exit_to_app</i>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" style={{ display: 'inline-flex', alignItems: 'center' }}>Login <i className="material-icons">login</i>
                  </NavLink>
                </li>
                <li >
                  <a className="dropdown-trigger" href="#!" data-target="register-dropdown">
                    Register<i className="material-icons right">arrow_drop_down</i>
                  </a>
                </li>

              </>
            )}
            <li style={{ marginRight: '20px' }}>
              <DarkModeToggle />
            </li>
          </ul>
          <ul id="mobile-links" className="sidenav" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontFamily: 'OpenSans' }}>
            {loggedIn ? (
              <li style={{ backgroundColor: ' #2196F3' }}>

                <a href='#!'><span style={{ color: 'white' }}>Hello, {username}</span></a>

              </li>
            ) : (<></>)}

            <li>
              <NavLink to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>Home &nbsp;<i className="material-icons">home</i></NavLink>
            </li>
            <li>
              <NavLink to="/flights" style={{ display: 'inline-flex', alignItems: 'center' }}>Flight Search <i className="material-icons">search</i> </NavLink>
            </li>


            {loggedIn ? (
              <>

                {userRole === 1 && (
                  <>
                    <li>
                      <NavLink to="/customer/flights">View your Flights</NavLink>
                    </li>
                    <li>
                      <NavLink to={`/customer/profile/${username}`}>Edit Profile</NavLink>
                    </li>
                  </>
                )}
                {userRole === 2 && (
                  <>
                    <li>
                      <NavLink to="/airline-company/flights">View your Flights</NavLink>
                    </li>
                    <li>
                      <NavLink to={`/airline-company/profile/edit/${username}`}>Edit Airline Profile</NavLink>
                    </li>
                    <li>
                      <NavLink to="/airline-company/add-flight">Add Flight</NavLink>
                    </li>
                  </>
                )}
                {userRole === 3 && (
                  <>
                    <li>
                      <NavLink to="/administrator/customers">View All Customers</NavLink>
                    </li>
                    <li>
                      <NavLink to="/administrator/airline-companies">View All Airline companies</NavLink>
                    </li>
                  </>
                )}
                <li style={{ marginTop: '270px' }}>
                  <button className="btn waves-effect waves-light red" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'OpenSans' }} onClick={this.handleLogout}>Log out
                    <i className="material-icons right"  >exit_to_app</i>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'OpenSans' }}>Login  <i className="material-icons">login</i></NavLink>
                </li>

                <li>
                  <NavLink to="/register/customer">
                    Register as a Customer
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register/airline-company">
                    Register Airline-Company
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register/administrator">
                    Register as an Administrator
                  </NavLink>
                </li>
              </>
            )}
            <li style={{ flex: '1' }}></li>
            <li><DarkModeToggle style={{ color: 'black' }} /></li>
            <li>
              <button className="btn waves-effect waves-light" style={{ display: 'inline-flex', alignItems: 'center' , borderRadius: '20px', fontFamily: 'OpenSans' }} onClick={this.handleGoBack}>
                Go Back
                <i className="material-icons">arrow_back</i>
              </button>
            </li>
          </ul>
          <a href="#!" data-target="mobile-links" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
        </div>
        <ul
          id="user-actions-dropdown"
          className={`dropdown-content ${showUserActions ? 'active' : ''}`}
          style={{ fontFamily: 'OpenSans', letterSpacing: '1px' }}
        >

          {userRole === 1 && (
            <>
              <li>
                <NavLink to="/customer/flights">View your Flights</NavLink>
              </li>
              <li>
                <NavLink to={`/customer/profile/${username}`}>Edit Profile</NavLink>
              </li>
            </>
          )}

          {userRole === 2 && (
            <>
              <li>
                <NavLink to="/airline-company/flights">View your Flights</NavLink>
              </li>
              <li>
                <NavLink to={`/airline-company/profile/edit/${username}`}>Edit Airline Profile</NavLink>
              </li>
              <li>
                <NavLink to="/airline-company/add-flight">Add Flight</NavLink>
              </li>
            </>
          )}
          {userRole === 3 && (
            <>
              <li>
                <NavLink to="/administrator/customers">View All Customers</NavLink>
              </li>
              <li>
                <NavLink to="/administrator/airline-companies">View All Airline companies</NavLink>
              </li>
            </>
          )}
        </ul>
        <ul id="register-dropdown" style={{ fontFamily: 'OpenSans', letterSpacing: '1px' }} className="dropdown-content">
          <li>
            <NavLink to="/register/customer">
              Register as a Customer <i className="material-icons right">person</i>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register/airline-company">
              Register Airline-Company <i className="material-icons right">airplanemode_active</i>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register/administrator">
              Register as an Administrator <i className="material-icons right">admin_panel_settings</i>
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    userRole: state.userRole, // Added userRole
  };
};

export default withRouter(connect(mapStateToProps)(Navbar));
