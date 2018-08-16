import React, { Component } from 'react';
import './App.css';

class ParkHeader extends Component {

/*******************************************
* Functions
*******************************************/
  menuToggler = () => {
  /* Toggle if Sidebar/Infowindow is shown */
    var menu = document.getElementById('menu');
    menu.classList.toggle("change");
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');

    if (this.props.showingInfoWindow) {
      (infoWindow.style.width == '0px') ? (window.screen.width > 400)? infoWindow.style.width = '400px' : infoWindow.style.width = '100%' : infoWindow.style.width = '0px';
    }
    else {
      (sidebar.style.width == '0px') ? (window.screen.width > 400)? sidebar.style.width = '400px' : sidebar.style.width = '100%' : sidebar.style.width = '0px';
    }
  }

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <div className="header">
        <div id="menu" className="menuContainer change" onClick={this.menuToggler} tabIndex="0">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <h1>Amusement Parks</h1>
      </div>
    )
  }
}

export default ParkHeader