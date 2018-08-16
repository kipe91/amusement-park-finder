import React, { Component } from 'react';
import './App.css';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import userImg from './utils/youMarkerRed.png';

export class MapContainer extends Component {

/*******************************************
* Functions
*******************************************/
	onMarkerClick = (park) => {
	/* On clicked marker */
		var infoWindow = document.getElementById('infoWindow');
		infoWindow.style.color = 'lightblue';
		setTimeout(() => {
			infoWindow.style.color = '#fff';
		}, 500)
	    this.props.markerClick(park);
	}

	onMouseoverMarker = (props, marker) => {
	/* On mouse over marker */
		//console.log('hover');
	}

	onMouseleaveMarker = (props, marker) => {
	/* On mouse over marker */
		//console.log('out');
	}

	startMap = (mapProps, map) => {
	/* Sets map */
		this.props.onSetMap(map);
	}

/*******************************************
* Render part
*******************************************/
  render() {
    return (
    	<div className="googleMap-styles">
	    	<Map 
		      	google={this.props.google}
		      	zoom={7}
		      	className={'map'}
		      	initialCenter={this.props.userLocation}
		      	center={this.props.userLocation}
		      	onReady={this.startMap}
	        >
	 
	        <Marker
	            title={'Current location'}
	            position={this.props.userLocation}
	            icon={userImg}
	        />

	        {this.props.allParks.filter(park => park.name.toUpperCase().indexOf(this.props.query) > -1)
	        	.map((park, index) => {
	        	//Looping over parks and create marker
                return (
			        <Marker 
			        	key= {index}
			        	onClick={() => this.onMarkerClick(park)}
			        	onMouseover={this.onMouseoverMarker}
			        	onMouseout={this.onMouseleaveMarker}
			            title= {park.name}
			            position= {park.geometry.location}
			        />
		        )
            })}
	    	</Map>
    	</div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBuD62GkIdr3jLRi5E0_bIqIRoz9ZFQELk'
})(MapContainer)