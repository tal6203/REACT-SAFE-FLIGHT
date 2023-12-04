import React, { Component } from 'react';
import './toggle.css'


class DarkModeToggle extends Component {
  state = {
    isDarkMode: false,
  };

  toggleDarkMode = () => {
    const { isDarkMode } = this.state;
    this.setState({ isDarkMode: !isDarkMode });

    if (!isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  render() {

    return (
      <div className="switch">
      <label>
        <input type="checkbox" checked={this.state.isDarkMode} onChange={this.toggleDarkMode} />
        <span style={{ width: '40px', height: '25px' }} className="lever">
          <i style={{ display: 'inline-flex', alignItems: 'center' }} className={`Tiny material-icons ${this.state.isDarkMode ? 'moon-icon' : 'sun-icon'}`}>
            {this.state.isDarkMode ? 'nights_stay' : 'wb_sunny'}
          </i>
        </span>
        Dark Mode
      </label>
    </div>
    

    )
  }
}

export default DarkModeToggle;
