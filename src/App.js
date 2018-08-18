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
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');
    var infoWindowFocus = document.getElementById('parkInfoH2');

    if ((sidebar.style.width == '0px') && (infoWindow.style.width == '0px')) {
      var menu = document.getElementById('menu');
      menu.classList.toggle("change");
    }

    sidebar.style.width = '0';
    setTimeout(() => {
      infoWindowFocus.focus();
      (window.screen.width > 400)? infoWindow.style.width = '400px' : infoWindow.style.width = '100%';
    }, 600)

    this.state.parks.forEach((thePark) => {
      thePark.marker.setAnimation(null);
    })
    park.marker.setAnimation(window.google.maps.Animation.BOUNCE);

    this.setState({
      selectedPlace: park,
      showingInfoWindow: true
    })

    setTimeout(() => {
      this.tabFocus();
    }, 800)
  }

//----------------

  closeInfoWindow = () => {
  /* CloseInfoWindow, or GoBack() from infowindow.js */
  // Change back to sidebar
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');
    var sidebarFocus = document.getElementById('searchLabel');
    infoWindow.style.width = '0';

    setTimeout(() => {
      sidebarFocus.focus();
      (window.screen.width > 400)? sidebar.style.width = '400px' : sidebar.style.width = '100%';
    }, 600)
    this.setState({
      showingInfoWindow: false
    })
    setTimeout(() => {
      this.tabFocus();
    }, 800)
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

//----------------

  menuToggler = () => {
  /* Toggle if Sidebar/Infowindow is shown */
    var menu = document.getElementById('menu');
    menu.classList.toggle("change");
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');

    if (this.state.showingInfoWindow) {
      (infoWindow.style.width == '0px') ? (window.screen.width > 400)? infoWindow.style.width = '400px' : infoWindow.style.width = '100%' : infoWindow.style.width = '0px';
    }
    else {
      (sidebar.style.width == '0px') ? (window.screen.width > 400)? sidebar.style.width = '400px' : sidebar.style.width = '100%' : sidebar.style.width = '0px';
    }
    setTimeout(() => {
      this.tabFocus();
    }, 800)
  }

//----------------

  tabFocus = () => {
  /* Really shit code to make sure tabbing stays corrent. */
    var sidebar = document.getElementById('sidebar');
    var infoWindow = document.getElementById('infoWindow');
    var i,j,k,l;

    var locationField = document.getElementById('locationField');
    var locationFieldBtn = document.getElementById('locationFieldBtn');
    var locationFindBtn = document.getElementById('locationFindBtn');
    var searchField = document.getElementById('searchField');
    var sidebarListItems = document.getElementsByClassName('sidebarListItem');

    var backBtn = document.getElementById('backBtn');
    var parkInfoH2 = document.getElementById('parkInfoH2');
    var openHoursH2 = document.getElementById('openHoursH2');
    var reviewsH2 = document.getElementById('reviewsH2');
    var infoSpans = document.getElementsByClassName('infoSpan');
    var dayTimes = document.getElementsByClassName('dayTimes');
    var reviewItems = document.getElementsByClassName('reviewItem');

  // if both sidebar and infoWindow is not showing, make all tabIndex -1.
    if (sidebar.style.width == '0px' && infoWindow.style.width == '0px') {
      //sidebar
      locationField.tabIndex = -1;
      locationFieldBtn.tabIndex = -1;
      locationFindBtn.tabIndex = -1;
      searchField.tabIndex = -1;
      for (i = 0; i < sidebarListItems.length; i++) {
        sidebarListItems[i].tabIndex = -1;
      };
      //infoWindow
      backBtn.tabIndex = -1;
      parkInfoH2.tabIndex = -1;
      openHoursH2.tabIndex = -1;
      reviewsH2.tabIndex = -1;
      for (j = 0; j < infoSpans.length; j++) {
        infoSpans[j].tabIndex = -1;
      };
      for (k = 0; k < dayTimes.length; k++) {
        dayTimes[k].tabIndex = -1;
      };
      for (l = 0; l < reviewItems.length; l++) {
        reviewItems[l].tabIndex = -1;
      };
  // if sidebar hiding and infoWindow is up, then do this.
    } else if (sidebar.style.width == '0px') {
      //sidebar
      locationField.tabIndex = -1;
      locationFieldBtn.tabIndex = -1;
      locationFindBtn.tabIndex = -1;
      searchField.tabIndex = -1;
      for (i = 0; i < sidebarListItems.length; i++) {
        sidebarListItems[i].tabIndex = -1;
      };
      //infoWindow
      backBtn.tabIndex = 0;
      parkInfoH2.tabIndex = 0;
      openHoursH2.tabIndex = 0;
      reviewsH2.tabIndex = 0;
      for (j = 0; j < infoSpans.length; j++) {
        infoSpans[j].tabIndex = 0;
      };
      for (k = 0; k < dayTimes.length; k++) {
        dayTimes[k].tabIndex = 0;
      };
      for (l = 0; l < reviewItems.length; l++) {
        reviewItems[l].tabIndex = 0;
      };
  // else sidebar is up and infoWindow is hiding.
    } else {
      //sidebar
      locationField.tabIndex = 0;
      locationFieldBtn.tabIndex = 0;
      locationFindBtn.tabIndex = 0;
      searchField.tabIndex = 0;
      for (i = 0; i < sidebarListItems.length; i++) {
        sidebarListItems[i].tabIndex = 0;
      };
      //infoWindow
      backBtn.tabIndex = -1;
      parkInfoH2.tabIndex = -1;
      openHoursH2.tabIndex = -1;
      reviewsH2.tabIndex = -1;
      for (j = 0; j < infoSpans.length; j++) {
        infoSpans[j].tabIndex = -1;
      };
      for (k = 0; k < dayTimes.length; k++) {
        dayTimes[k].tabIndex = -1;
      };
      for (l = 0; l < reviewItems.length; l++) {
        reviewItems[l].tabIndex = -1;
      };
    }
  }

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <div className="App">
        <ParkHeader 
          //functions
          onMenuToggler={this.menuToggler}
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