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
		this.props.onGetUserLocation();
	}

/*******************************************
* Render part
*******************************************/
	render() {
	    return (
	    	<aside className="searchSection">
	    		<h2>Welcome!</h2>
	    		<p>This site helps you with amusement parks around the world. 
	    		Find the closest one's to your location or in a specific place.</p>
	    		<p>Get information like address and phone or reviews about the parks.
	    		We can also show you the driving direction from you to the park.</p>

	      		<h3 id="positionLabel">Your location:</h3>
		    	<input id="locationField" className="locationField" type="text" aria-labelledby="positionLabel" onKeyDown={(event) => this.checkKeyPress(event)} placeholder="Ex: Stockholm, Sweden" />
		    	<button id="locationFieldBtn" onClick={this.updateLocation.bind(this)}>Go</button>
		    	<br />
		    	<button id="locationFindBtn" onClick={this.findLocation.bind(this)}>Get your location</button>
	    	</aside>
	    );
	}
}

export default FilterSearch;
