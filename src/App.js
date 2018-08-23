import React, { Component } from 'react';
import './App.css';
import imgMarkerClicked from './utils/marker-icon-blue.png';
import MapContainer from './GoogleMap';
import FilterSearch from './SearchWindow';
import ListSection from './ListWindow';
import ParkInfoSection from './InfoWindow';
import SiteHeader from './components/SiteHeader';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {

/*******************************************
* State's
*******************************************/
  state = {
    //places
    userLocation: {
      /*USA, Miami*/
      lat: 26.040674,
      lng: -80.233292
    },
    parks: [],
    //what to show
    selectedPlace: {},
    query: '',
    //google services
    map: null,
    directionsService: null,
    directionsDisplay: null,
    //requests
    getInfoRequest: false,
    getImageRequest: false,
    unsplashError: false,
    googlePlacesError: false
  }

/*******************************************
* Functions
*******************************************/

  updateLocation = (address) => {
  /* Updates location based on users input */
    var thiss = this;
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        var result = results[0].geometry.location;
        var lat = result.lat();
        var lng = result.lng();
        thiss.setState({ userLocation: {lat, lng} });
        thiss.getParks();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

//----------------

  getUserLocation = (position) => {
  /* Set users location with info from geolocation */
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    this.setState({ userLocation: {lat, lng} });

    document.getElementById('locationField').value = lat +', '+ lng;

    this.getParks();
  }

//----------------

  ItemClicked = (park) => {
    this.state.parks.forEach((thePark) => {
      thePark.marker.setIcon(null);
    });
    park.marker.setIcon(imgMarkerClicked);

    this.setState({
      selectedPlace: park
    });
  }

//----------------

  setMap = (map) => {
  /* Sets the initinal map to have as referens */
    this.setState({ map: map});
    this.setState({ directionsService: new window.google.maps.DirectionsService() });
    this.setState({ directionsDisplay: new window.google.maps.DirectionsRenderer({suppressMarkers: true}) });
    this.state.directionsDisplay.setMap(map);
  }

//----------------

  calcRoute= () => {
    if (this.state.selectedPlace.geometry) {
      var start = this.state.userLocation;
      var end = this.state.selectedPlace.geometry.location;
      var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.METRIC
      };
      this.state.directionsService.route(request, (result, status) => {
        if (status == 'OK') {
          var directionDistance = document.getElementById('directionDistance');
          var directionDuration = document.getElementById('directionDuration');
          directionDistance.innerHTML = '<br />Distance: ' + result.routes[0].legs[0].distance.text;
          directionDuration.innerHTML = '<br />Duration: ' + result.routes[0].legs[0].duration.text;
          this.state.directionsDisplay.setDirections(result);
        }
      });
    }
  }

//----------------

  hideCurrentParks = () => {
    this.state.parks.forEach((park) => {
      park.marker.setMap(null);
    })
  }

//----------------

  resetErrorState = () => {
    this.setState({getInfoRequest: false});
    this.setState({getImageRequest: false});
    this.setState({unsplashError: false})
    this.setState({googlePlacesError: false})
  }

//----------------

  getParks = () => {
  /* Find parks in selected area */
    var thiss = this;
    var placeRequest = {
        location: this.state.userLocation,
        type: ['amusement_park']
    };
    this.resetErrorState();

    var service = new window.google.maps.places.PlacesService(this.state.map);
    service.textSearch(placeRequest, callback);

    function callback(results, status) {
      var memory = [];
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        thiss.hideCurrentParks();
        for (var i = 0; i < results.length; i++) {
          results[i].photo = '';
          results[i].opening_hours = '';
          results[i].website = '';
          results[i].formatted_phone_number = '';
          results[i].reviews = '';
          memory.push(results[i]);
        }
        thiss.getImages(memory);
        thiss.getFullInfo(memory);
        thiss.createMarker(memory);
      } else if (status == window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        thiss.setState({googlePlacesError: 'Zero Results, test one more time.'});
      } else {
        thiss.setState({googlePlacesError: 'Problem with connecting to google servers.. try again later.'});
      }

      updateState();
      function updateState() {
        //check if info and image request has been sent, else check again in 0.5s
        if (thiss.state.getInfoRequest && thiss.state.getImageRequest) {
          thiss.setState({ parks: memory });
          setTimeout(() => {
            //refresh with fetch info (could set some loop here too, but nah..)
            thiss.setState({ parks: thiss.state.parks });
          }, 1000)
        } else {
          setTimeout(() => {
            updateState();
          }, 500)
        }
      }

    }
  }

//----------------

  getImages = (parks) => {
    parks.forEach((park) => {
      fetch('https://api.unsplash.com/search/photos?page=1&query=' + park.name, {
        headers: {
            Authorization: 'Client-ID c918fd3662c7972218da6442dd913ae9cdb8bf5308350fc56685801bc683a345'
        }
      }).then(response => response.json())
      .then((images) => {
        park.photo = images.results[0];
      })
      .catch((err) => {
        console.log(err);
        this.setState({unsplashError: true})
      });
    })
    this.setState({getImageRequest: true});
  }

//----------------

  getFullInfo = (parks) => {
    var service = new window.google.maps.places.PlacesService(this.state.map);

    parks.forEach((park) => {
      var infoRequest = {
        placeId: park.place_id,
        fields: ['opening_hours', 'website', 'formatted_phone_number', 'review']
      };
      service.getDetails(infoRequest, callback); 

      function callback(place, status) {
        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
          park.opening_hours = place.opening_hours;
          park.website = place.website;
          park.formatted_phone_number = place.formatted_phone_number;
          park.reviews = place.reviews;
        }
        //No else statement needed. If it fails then park.[info] will be empty.
      }
    })
    this.setState({getInfoRequest: true});
  }

//----------------

  createMarker = (parks) => {
    parks.forEach((park) => {
      park.marker = new window.google.maps.Marker({
        title: park.name,
        map: this.state.map,
        position: park.geometry.location,
        animation: window.google.maps.Animation.DROP
      });
      park.marker.addListener('mouseover', () => park.marker.setAnimation(window.google.maps.Animation.BOUNCE));
      park.marker.addListener('mouseout', () => park.marker.setAnimation(null));
      park.marker.addListener('click', () => this.ItemClicked(park));
    })
  }

//----------------

  updateQuery = (search) => {
  /* Updates park filtering */
    this.setState({query: search});
    this.state.parks.forEach((park) => {
      if (park.name.toUpperCase().indexOf(search) > -1) {
        park.marker.setMap(this.state.map);
      } else {
        park.marker.setMap(null);
      }
    })
  }

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <Router>
        <div className="App">
          <SiteHeader 
            //functions
            onMenuToggler={this.menuToggler}
          />

          <Route path="/start" render={() => (
            <FilterSearch
              //functions
              onUpdateLocation={this.updateLocation}
              onGetUserLocation={this.getUserLocation}
            />
          )}/>

          <Route path="/list" render={() => (
            <ListSection
              //functions
              onListItemClick={this.ItemClicked}
              onHandleInput={this.updateQuery}
              //parks
              allParks={this.state.parks}
              query={this.state.query}
              //errors
              unsplashError={this.state.unsplashError}
              googlePlacesError={this.state.googlePlacesError}
            />
          )}/>

          <Route path="/park" render={() => (
            <ParkInfoSection
              //functions
              onCalcRoute={this.calcRoute}
              //parks
              selectedPlace={this.state.selectedPlace}
            />
          )}/>

          <Route path="/" render={() => (
            <MapContainer
              //postition
              userLocation={this.state.userLocation}
              //functions
              onSetMap={this.setMap}
            />
          )}/>
        </div>
      </Router>
    );
  }
}

export default App;