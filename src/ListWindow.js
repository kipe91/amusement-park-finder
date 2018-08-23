import React, { Component } from 'react';
import './App.css';
import sortBy from 'sort-by';
import { Link } from 'react-router-dom';
import noImage from './utils/placeholder.jpg';

class ListSection extends Component {

/*******************************************
* Functions
*******************************************/

  listItemPress = (event, park) => {
  /* Key pressed on list item */
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
      <aside className="listWindow">
        <div className="listWindow-list-area">
          <p id="searchLabel" className="listWindow-list-p">Parks in area:</p>
          <input id="searchField" className="searchField" onChange={(e) => this.handleInput(e.target.value)} type="search" aria-labelledby="searchLabel" placeholder="Filter parks by name.." />
          {this.props.googlePlacesError !== false &&
              <p className="listWindowErrorMessage">
                {this.props.googlePlacesError}
              </p>
            }
            {this.props.unsplashError &&
              <p className="listWindowErrorMessage">
                Request error, some/all images will not show.
              </p>
            }
          <ul className="listWindow-list">
            {this.props.allParks.sort(sortBy('-rating'))
              .filter(park => park.name.toUpperCase().indexOf(this.props.query) > -1)
              .map((park, index) => {
                return (
                  <Link to={'/park'} key={ index } onKeyDown={(event) => this.listItemPress(event, park)}>
                    <li className="listWindowListItem" onMouseOver={() => park.marker.setAnimation(window.google.maps.Animation.BOUNCE)} onMouseOut={() => park.marker.setAnimation(null)} onClick={() => this.props.onListItemClick(park)} tabIndex="0">
                      <img src={ park.photo ? park.photo.urls.small : noImage } alt={"Amusement park " + park.name} />
                      <div className="park-info">
                        <p>{park.name}</p>
                        <p>Rating: {park.rating}</p>
                      </div>
                    </li>
                  </Link>
                )
            })}
          </ul>
        </div>
      </aside>
    );
  }
}

export default ListSection;
