import React, { Component } from 'react';
import './../App.css';
import settingsIconUrl from './../utils/settings_icon_white.png';
import listIconUrl from './../utils/list_icon_white.png';
import parkIconUrl from './../utils/ThemePark_Icon_white.png';
import mapsIconUrl from './../utils/googleMap_icon_white.png';
import { Link } from 'react-router-dom';

class NavBar extends Component {

/*******************************************
* Functions
*******************************************/

keyPressed = (event) => {
  /* Key pressed on menu */
    var key = event.keyCode;
    if (key == 13 || key == 32) {
      this.props.onMenuToggler();
    }
  }

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <nav className="navBar">
        <Link to={'/start'}>
          <button className="navOption">
            <img src={settingsIconUrl} alt="Settings icon" className="navOptionIcon" /><p>Search</p>
          </button>
        </Link>
        <Link to={'/list'}>
          <button className="navOption">
            <img src={listIconUrl} alt="List icon" className="navOptionIcon" /><p>List</p>
          </button>
        </Link>
        <Link to={'/park'}>
          <button className="navOption">
            <img src={parkIconUrl} alt="Theme park icon" className="navOptionIcon" /><p>Park</p>
          </button>
        </Link>
        <Link to={'/map'}>
          <button className="navOption">
            <img src={mapsIconUrl} alt="Maps icon" className="navOptionIcon" /><p>Map</p>
          </button>
        </Link>
      </nav>
    )
  }
}

export default NavBar