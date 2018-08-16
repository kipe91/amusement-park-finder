import React, { Component } from 'react';
import './App.css';
import sortBy from 'sort-by';
import noImage from './utils/placeholder.jpg';

class SideBar extends Component {

/*******************************************
* Functions
*******************************************/
  updateLocation(e) {
  /* Send textField 'adress' to App.js */
    e.preventDefault();
    var address = document.getElementById('locationField').value;
    this.props.onUpdateLocation(address);
  }

//----------------

  findLocation(e) {
  /* Find user location and update it */
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    var sidebar = this;

    function showPosition(position) { 
      sidebar.props.onGetUserLocation(position);
    }
  }

//----------------

  listItemClick = (park) => {
  /* List item clicked */
    this.props.onListItemClick(park);
  }

//----------------

  listItemPress = (event, park) => {
  /* List item, key pressed */
    var key = event.keyCode;
    if (key == 13 || key == 32) {
      this.props.onListItemClick(park);
    }
  }

//----------------

  handleInput = (input) => {
  /* Updates park filtering */
    var search = input.trim().toUpperCase();
    this.props.onHandleInput(search);
  }

/*******************************************
* Render part
*******************************************/
	render() {
    return (
      <div id="sidebar" className="sidebar">
        <div className="sidebar-inputs">
          <p>Your location:</p>
          <input id="locationField" className="locationField" type="text" placeholder="Ex: Stockholm, Sweden" />
          <button id="locationFieldBtn" onClick={this.updateLocation.bind(this)}>Go</button>
          <br />
          <button id="locationFindBtn" onClick={this.findLocation.bind(this)}>Get your location</button>
        </div>
        <div className="sidebar-list-area">
          <p className="sidebar-list-p">Parks in area:</p>
          <input className="searchField" onChange={(e) => this.handleInput(e.target.value)} type="search" placeholder="Search by name.." />
          <ul id="sidebar-list" ref="sidebarList" className="sidebar-list">
            {this.props.allParks.sort(sortBy('rating'))
              .reverse()
              .filter(park => park.name.toUpperCase().indexOf(this.props.query) > -1)
              .map((park, index) => {
                return (
                  <li key={ index } onClick={() => this.listItemClick(park)} onKeyDown={(event) => this.listItemPress(event, park)} tabIndex="0">
                    <img src={ park.photo ? park.photo.urls.small : noImage } alt={"Amusement park " + park.name} />
                    <div className="park-info">
                      <p>{park.name}</p>
                      <p>{park.rating}</p>
                    </div>
                  </li>
                )
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default SideBar;
