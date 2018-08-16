import React, { Component } from 'react';
import './App.css';
import imgMarked from './utils/hover.marker-icon.png';
import MapContainer from './GoogleMap';
import SideBar from './Sidebar';
import InfoWindow from './InfoWindow';
import ParkHeader from './ParkHeader';

class App extends Component {

/*******************************************
* State's
*******************************************/
  state = {
    userLocation: {
      /*Sweden*/
      //lat: 58.63064,
      //lng: 12.29843
      /*Germany*/
      //lat: 50.736000,
      //lng: 10.237134
      /*USA, Miami*/
      lat: 26.040674,
      lng: -80.233292
    },
    parks: [],
    showingInfoWindow: false,
    selectedPlace: {},
    query: '',
    map: null,
    getInfoRequest: false,
    getImageRequest: false
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
  /* ItemClicked, show infoWinfow with correct park */
    if (!this.state.showingInfoWindow) {
      var sidebar = document.getElementById('sidebar');
      var infoWindow = document.getElementById('infoWindow');
      sidebar.style.width = '0';
      setTimeout(() => {
        (window.screen.width > 400)? infoWindow.style.width = '400px' : infoWindow.style.width = '100%';
      }, 600)
    }

    this.state.parks.forEach((thePark) => {
      thePark.marker.setAnimation(null);
    })
    park.marker.setAnimation(window.google.maps.Animation.BOUNCE);

    this.setState({
      selectedPlace: park,
      showingInfoWindow: true
    })
  }

//----------------

  closeInfoWindow = () => {
  /* CloseInfoWindow, or GoBack() from infowindow.js */
  // Change back to sidebar
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');
    infoWindow.style.width = '0';

    setTimeout(() => {
      (window.screen.width > 400)? sidebar.style.width = '400px' : sidebar.style.width = '100%';
    }, 600)
    this.setState({
      showingInfoWindow: false
    })
  }

//----------------

  setMap = (map) => {
  /* Sets the initinal map to have as referens */
    this.setState({ map: map});
    this.getParks();
  }

//----------------

  hideCurrentParks = () => {
    this.state.parks.forEach((park) => {
      park.marker.setMap(null);
    })
  }

//----------------

  getParks = () => {
  /* Find parks in selected area */
    var thiss = this;
    var placeRequest = {
        location: this.state.userLocation,
        type: ['amusement_park']
    };
    this.setState({getInfoRequest: false});
    this.setState({getImageRequest: false});

    this.hideCurrentParks();

    var service = new window.google.maps.places.PlacesService(this.state.map);
    service.textSearch(placeRequest, callback);

    function callback(results, status) {
      var memory = [];
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
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
      }

      updateState();
      function updateState() {
        if (thiss.state.getInfoRequest && thiss.state.getImageRequest) {
          console.log(memory);
          thiss.setState({ parks: memory });
          setTimeout(() => {
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
      .catch(err => console.log(err));
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
      
      park.marker.addListener('mouseover', () => park.marker.setIcon(imgMarked));
      park.marker.addListener('mouseout', () => park.marker.setIcon(null));
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
        <ParkHeader 
          //functions
          showingInfoWindow={this.state.showingInfoWindow}
        />

        <SideBar
          //functions
          onUpdateLocation={this.updateLocation}
          onGetUserLocation={this.getUserLocation}
          onListItemClick={this.ItemClicked}
          onHandleInput={this.updateQuery}
          //parks
          allParks={this.state.parks}
          query={this.state.query}
        />

        <InfoWindow
          //functions
          onGoBack={this.closeInfoWindow}
          //parks
          selectedPlace={this.state.selectedPlace}
        />

        <MapContainer
          //postition
          userLocation={this.state.userLocation}
          //functions
          onSetMap={this.setMap}
        />
      </div>
    );
  }
}

export default App;