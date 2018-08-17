import React, { Component } from 'react';
import './App.css';

class ParkHeader extends Component {

/*******************************************
* Functions
*******************************************/

  menuPressed = (event) => {
  /* Key pressed on menu */
    var key = event.keyCode;
    if (key == 13 || key == 32) {
      this.props.onMenuToggler();
    }
  }

/*******************************************
* Render part
*******************************************/
  render() {
    return (
      <div className="header">
        <div id="menu" className="menuContainer change" onClick={this.props.onMenuToggler} onKeyDown={(event) => this.menuPressed(event)} tabIndex="0" aria-label="Toggle menu" role='button'>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <h1>Amusement Parks</h1>
      </div>
    )
  }
}

export default ParkHeader