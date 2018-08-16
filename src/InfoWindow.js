import React, { Component } from 'react';
import './App.css';
import noImage from './utils/placeholder.jpg';
import goBackBtn from './utils/back-arrow-white.png';

class InfoWindow extends Component {

/*******************************************
* Functions
*******************************************/
  goBack = () => {
  /* Change from infoWindow to Sidebar in App.js */
    this.props.onGoBack();
  }

/*******************************************
* Render part
*******************************************/
	render() {

    const openTimes = this.props.selectedPlace.opening_hours;
    const reviews = this.props.selectedPlace.reviews;
    let image;
    if (this.props.selectedPlace.photo) {
      image = this.props.selectedPlace.photo.urls.regular;
    } else {
      image = noImage;
    }

    return (
      <div id="infoWindow" className="infoWindow">
        <button className="backBtn" tabIndex="0" onClick={this.goBack}><img id='backBtnImg' alt='' src={goBackBtn}/>Back to list</button>
        <div className="infoWindow-image">
          <img src={image} alt={'Amusement park ' + this.props.selectedPlace.name} />
          <p className="unsplashFoto">Photo from <i>unsplash.com</i></p>
        </div>
        <div className="infoWindow-info">
          <h2 tabIndex="0">Park information:</h2>
          <p className="information">
            <span tabIndex="0"><strong>Name: </strong><i>{this.props.selectedPlace.name}</i></span><br />
            <span tabIndex="0"><strong>Adress: </strong><i>{this.props.selectedPlace.formatted_address}</i></span><br />
            <span tabIndex="0"><strong>Phone: </strong><i>{this.props.selectedPlace.formatted_phone_number}</i></span><br />
            <span tabIndex="0"><strong>Website: </strong><a href={this.props.selectedPlace.website} target="_blank">{this.props.selectedPlace.website}</a></span><br />
            <span tabIndex="0"><strong>Total rating: </strong><i>{this.props.selectedPlace.rating}</i></span>
          </p>
          <h2 tabIndex="0">Opening hours: </h2>
            {openTimes ? (
              <ul className="timeList">
                {this.props.selectedPlace.opening_hours.weekday_text.map((day, index) => {
                  return (
                    <li tabIndex="0" key={index}> {day} </li>
                  )
                })}
              </ul>
            ) : (
              <ul className="timeList"><li><i>Sorry, no times available here</i></li></ul>
            )}
          <h2 tabIndex="0">Reviews:</h2>
          {reviews ? (
            <ul className="reviewList">
              {this.props.selectedPlace.reviews.map((review, index) => {
                return (
                  <li tabIndex="0" key={index}>
                    <div className="reviewInfo">
                      <span className="reviewName">- {review.author_name}</span><br />
                      <span className="reviewRating">- {review.rating} star(s)</span>
                      <span className="reviewTime">- {review.relative_time_description}</span>
                    </div>
                    <p className="reviewText">{review.text}</p>
                  </li>
                )
              })}
            </ul>
          ) : (
            <ul className="reviewList"><li><i>Sorry, no reviews</i></li></ul>
          )}
        </div>
      </div>
    );
  }
}

export default InfoWindow;
