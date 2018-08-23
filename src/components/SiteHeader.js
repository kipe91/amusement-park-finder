import React, { Component } from 'react';
import './../App.css';
import NavBar from './NavBar';

class SiteHeader extends Component {

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <header className="header">
        <NavBar />
        <h1>Amusement Parks</h1>
      </header>
    )
  }
}

export default SiteHeader