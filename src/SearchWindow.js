import React, { Component } from 'react';
import './App.css';

class FilterSearch extends Component {

/*******************************************
* Functions
*******************************************/

	checkKeyPress = (event) => {
	/* Key pressed in locationField */
		var key = event.keyCode;
	    if (key == 13 || key == 32) {
	    	this.updateLocation(event);
	    }
	}

//----------------
 
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

/*******************************************
* Render part
*******************************************/
	render() {
	    return (
	    	<aside className="searchSection">
	      		<p id="positionLabel">Your location:</p>
		    	<input id="locationField" className="locationField" type="text" aria-labelledby="positionLabel" onKeyDown={(event) => this.checkKeyPress(event)} placeholder="Ex: Stockholm, Sweden" />
		    	<button id="locationFieldBtn" onClick={this.updateLocation.bind(this)}>Go</button>
		    	<br />
		    	<button id="locationFindBtn" onClick={this.findLocation.bind(this)}>Get your location</button>
	    	</aside>
	    );
	}
}

export default FilterSearch;
