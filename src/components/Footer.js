import React from 'react';

const Footer = () => {
  const phoneNumber = '+972526812203'; 
  const emailAddress = 'tal6203@gmail.com'; 

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <footer className="App-footer">
      <div className="container">
        <div className="row">
          <div className="col s12 m6">
            <h5 className="white-text" style={{ textDecoration: 'underline' }}>About Us</h5>
            <p className="grey-text text-lighten-4">
              We are Safe Flight, guaranteeing that you will receive the newest flight updates, information about changes in flights, as well as a variety of airlines to choose from. And of course, all of this in the most convenient and user-friendly manner for you.
            </p>
          </div>
          <div className="col s12 m6 center-align">
            <h5 className="white-text" style={{ textDecoration: 'underline' }}>Contact Us</h5>
            <p className="grey-text text-lighten-4">
            <span style={{ display: 'flex', justifyContent:'center',marginBottom:'10px' }}>
              <i className="material-icons" onClick={handleEmailClick} style={{ cursor: 'pointer' }}>email</i>
              &nbsp;Email: <a href={`mailto:${emailAddress}`} onClick={handleEmailClick} style={{ color: 'white' }}>&nbsp;{emailAddress}</a><br />
            </span>
            <span style={{ display: 'flex', justifyContent:'center',marginBottom:'10px' }}>
              <i className="material-icons" onClick={handlePhoneClick} style={{ cursor: 'pointer' }}>phone</i>
              &nbsp;Phone: <a href={`tel:${phoneNumber}`} onClick={handlePhoneClick} style={{ color: 'white' }}>&nbsp;(+972) 52-681-2203</a><br />
            </span>
            <span style={{ display: 'flex', justifyContent:'center' }}>
              <i className="material-icons">link</i> &nbsp;Linkedin: <a href='https://www.linkedin.com/in/tal-abutbul' style={{ color: 'white' }}>&nbsp;www.linkedin.com/in/tal-abutbul</a>
            </span>
          </p>
          </div>
        </div>
      </div>
      <div className="darken-1">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <p className="center-align white-text" style={{ fontSize: '14px' }}>
                © {new Date().getFullYear()} SAFE FLIGHT. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
