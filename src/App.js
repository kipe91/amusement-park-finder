import React, { Component } from 'react';
import './App.css';
import imgMarkerClicked from './utils/marker-icon-blue.png';
import MapContainer from './GoogleMap';
import FilterSearch from './SearchWindow';
import ListSection from './ListWindow';
import ParkInfoSection from './InfoWindow';
import SiteHeader from './components/SiteHeader';
import { Route } from 'react-router-dom';

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
    startPlaceID: null,
    startPlaceTrue: false,
    directionsTrue: false,
    //google services
    map: null,
    geocoder: null,
    service: null,
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

  componentDidMount() {
  /* Check if any info is provided in browser adress bar */
    var paramsString = window.location.search;
    var searchParams = new URLSearchParams(paramsString);
    var parkID = searchParams.get("p");
    var latLngLocation = searchParams.get("l");
    
    if ((latLngLocation !== "") && (latLngLocation !== null)) {
      var latLng = latLngLocation.split(",");
      var lat = latLng[0];
      var lng = latLng[1];
      if (lat && lng) {
        //this.setState({ userLocation: {lat, lng} });
      }

      if ((parkID !== "") && (parkID !== null)) {
        this.setState({startPlaceID: parkID, startPlaceTrue: true});
      }
    }
    else {
      this.getUserLocation(true);
    }
  }

//----------------

  updateLocation = (address) => {
  /* Updates location based on users input */
    var thiss = this;
    this.state.geocoder.geocode( { 'address': address}, function(results, status) {
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

  getUserLocation = (getParks) => {
  /* Set users location with info from geolocation */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          this.setState({ userLocation: {lat, lng} });
          if (!getParks) {
            this.getParks();
          }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
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

    if (this.state.directionsTrue) {
      this.calcRoute(); //to hide old directions
    }
  }

//----------------

  setMap = (map) => {
  /* Sets the initinal map and starts first visit functions */
    this.setState({ map: map});
    this.setState({ geocoder: new window.google.maps.Geocoder() });
    this.setState({ service: new window.google.maps.places.PlacesService(this.state.map) });
    this.setState({ directionsService: new window.google.maps.DirectionsService() });
    this.setState({ directionsDisplay: new window.google.maps.DirectionsRenderer({suppressMarkers: true}) });
    this.state.directionsDisplay.setMap(map);

    this.getParks();
  }

//----------------

  calcRoute= () => {
  /* Shows driving directions on map */
    if (this.state.selectedPlace.geometry) {
      var directionDistance = document.getElementById('directionDistance');
      var directionDuration = document.getElementById('directionDuration');
      if (this.state.directionsTrue) {
        this.state.directionsDisplay.setMap(null);
        this.setState({ directionsTrue: false});
        directionDistance.innerHTML = '';
        directionDuration.innerHTML = '';
      }
      else {
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
            directionDistance.innerHTML = '<br />Distance: ' + result.routes[0].legs[0].distance.text;
            directionDuration.innerHTML = '<br />Duration: ' + result.routes[0].legs[0].duration.text;
            this.state.directionsDisplay.setMap(this.state.map);
            this.state.directionsDisplay.setDirections(result);
            this.setState({ directionsTrue: true });
          }
        });
      }
    }
  }

//----------------

  startPark = () => {
  /* Sets the initinal park if any */
    var startRequest = {
      placeId: this.state.startPlaceID,
      fields: ['name', 'geometry', 'opening_hours', 'website', 'formatted_address', 'formatted_phone_number', 'review']
    };
    this.state.service.getDetails(startRequest, (place, status) => {
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({ selectedPlace: place });
        this.createMarker([place]);
        this.state.selectedPlace.marker.setIcon(imgMarkerClicked);
      } else {
        console.log('error loading first place, see status: ' + status);
      }
    });
    this.setState({ startPlaceTrue: false });
  }

//----------------

  hideCurrentParks = () => {
    this.state.parks.forEach((park) => {
      park.marker.setMap(null);
    })
  }

//----------------

  resetErrorState = () => {
    this.setState({getInfoRequest: false, getImageRequest: false, unsplashError: false, googlePlacesError: false});
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
    this.state.service.textSearch(placeRequest, callback);

    function callback(results, status) {
      var memory = [];
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        thiss.hideCurrentParks();
        // for each result, add some emty variables.
        for (var i = 0; i < results.length; i++) {
          results[i].photo = '';
          results[i].opening_hours = '';
          results[i].website = '';
          results[i].formatted_phone_number = '';
          results[i].reviews = '';
          memory.push(results[i]);
          // if params true on first visit, check if place is in list search.
          if (thiss.state.startPlaceTrue) {
            if (results[i].place_id === thiss.state.startPlaceID) {
              thiss.setState({ selectedPlace: results[i] });
            }
          }
        }

        // get more information and create marker.
        thiss.getImages(memory);
        thiss.getFullInfo(memory);
        thiss.createMarker(memory);

        // if params on first visit, do this..
        if (thiss.state.startPlaceTrue) {
          if (thiss.state.selectedPlace.place_id) {
            thiss.state.selectedPlace.marker.setIcon(imgMarkerClicked);
            thiss.setState({ startPlaceTrue: false });
          } else {
            thiss.startPark();
          }
        }
      } else if (status == window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        thiss.setState({googlePlacesError: 'Zero Results, test one more time.'});
      } else {
        thiss.setState({googlePlacesError: 'Problem with connecting to google servers.. try again later.'});
      }

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
      updateState();
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
    parks.forEach((park) => {
      var infoRequest = {
        placeId: park.place_id,
        fields: ['opening_hours', 'website', 'formatted_phone_number', 'review']
      };
      this.state.service.getDetails(infoRequest, callback);

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
      <div className="App">
        <SiteHeader 
          //state
          userLocation={this.state.userLocation}
          selectedPlace={this.state.selectedPlace}
          //functions
          onMenuToggler={this.menuToggler}
        />

        <Route exact path="/amusement-park-finder/" render={() => (
          <FilterSearch
            //functions
            onUpdateLocation={this.updateLocation}
            onGetUserLocation={this.getUserLocation}
          />
        )}/>

        <Route path="/amusement-park-finder/list" render={() => (
          <ListSection
            //state
            userLocation={this.state.userLocation}
            selectedPlace={this.state.selectedPlace}
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

        <Route path="/amusement-park-finder/park" render={() => (
          <ParkInfoSection
            //functions
            onCalcRoute={this.calcRoute}
            //props
            selectedPlace={this.state.selectedPlace}
            directionsTrue={this.state.directionsTrue}
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
    );
  }
}

export default App;