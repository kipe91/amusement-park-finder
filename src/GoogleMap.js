import React, { Component } from 'react';
import './App.css';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import userImg from './utils/youMarkerRed.png';

export class MapContainer extends Component {

/*******************************************
* Functions
*******************************************/

	componentDidMount() {
		window.addEventListener("unhandledrejection", function (event) {
			alert('Something went wrong.. please refresh if needed');
		});
	}

	startMap = (mapProps, map) => {
	/* Sets map */
	var styledMapType = new window.google.maps.StyledMapType(
		// Link to map styling: https://snazzymaps.com/style/14889/flat-pale
        [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}],
        {name: 'Styled Map'});

		map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

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
		      	zoom={9}
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
	    	</Map>
    	</div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBuD62GkIdr3jLRi5E0_bIqIRoz9ZFQELk'
})(MapContainer)