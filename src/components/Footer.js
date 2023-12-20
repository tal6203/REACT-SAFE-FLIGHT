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
        <div className="col s12" style={{marginTop:'10px'}}>
          <span className="center-align">
            <a className="btn-floating" style={{ backgroundColor: '#3b5998', marginRight: '20px' }} rel="noreferrer" target="_blank" href="https://www.facebook.com/talxbad/">
              <i className="material-icons">facebook</i>
            </a>
            <a className="btn-floating" href={`tel:${phoneNumber}`} onClick={handlePhoneClick} style={{ backgroundColor: '#55acee' , marginRight: '20px' }} >
            <i className="material-icons">phone</i>
            </a>
            <a className="btn-floating" href={`mailto:${emailAddress}`} onClick={handleEmailClick}  style={{ backgroundColor: '#dd4b39', marginRight: '20px' }} >
            <i className="material-icons">email</i>
            </a>
            <a className="btn-floating" style={{ backgroundColor: '#0082ca', marginRight: '20px' }} rel="noreferrer" target="_blank" href="https://www.linkedin.com/in/tal-abutbul/">
              <i className="bi bi-linkedin"></i>
            </a>
            <a className="btn-floating" style={{  backgroundColor: '#ac2bac'}} rel="noreferrer" target="_blank" href="https://github.com/tal6203">
            <i className="bi bi-github"></i> 
            </a>
          </span>
        </div>
      </div>
    </div>

    <span style={{fontWeight:'bold'}} className="bg-dark text-center p-3">
    © {new Date().getFullYear()} SAFE FLIGHT. All rights reserved.
    </span>
  </footer>
  );
}

export default Footer;
