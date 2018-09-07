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
    var addressLocation = 'l=' + this.props.userLocation.lat +','+ this.props.userLocation.lng;
    var addressPark = 'p=' + this.props.selectedPlace.place_id;
    var placeChoosen;
    if (this.props.selectedPlace.place_id) {
      placeChoosen = true;
    } else {
      placeChoosen = false;
    }

    return (
      <nav className="navBar">
        <Link to={placeChoosen ? '/amusement-park-finder/?' + addressLocation +'&'+ addressPark : '/amusement-park-finder/?' + addressLocation}>
          <button className="navOption">
            <img src={settingsIconUrl} alt="Settings icon" className="navOptionIcon" /><p>Search</p>
          </button>
        </Link>
        <Link to={placeChoosen ? '/amusement-park-finder/list/?' + addressLocation +'&'+ addressPark : '/amusement-park-finder/list/?' + addressLocation}>
          <button className="navOption">
            <img src={listIconUrl} alt="List icon" className="navOptionIcon" /><p>List</p>
          </button>
        </Link>
        <Link to={placeChoosen ? '/amusement-park-finder/park/?' + addressLocation +'&'+ addressPark : '/amusement-park-finder/park/?' + addressLocation}>
          <button className="navOption">
            <img src={parkIconUrl} alt="Theme park icon" className="navOptionIcon" /><p>Park</p>
          </button>
        </Link>
        <Link to={placeChoosen ? '/amusement-park-finder/map/?' + addressLocation +'&'+ addressPark : '/amusement-park-finder/map/?' + addressLocation}>
          <button className="navOption">
            <img src={mapsIconUrl} alt="Maps icon" className="navOptionIcon" /><p>Map</p>
          </button>
        </Link>
      </nav>
    )
  }
}

export default NavBar