// @author: Bob Liang

import React from 'react';

export default class AddASpot extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          latitude: null,
          longitude: null,
        };
    }

    render(){
        return (
          <div id="add-a-spot">
              <h2>Add a spot:</h2> <br />

              <img id="location-pin" src="images/marker_small.png" alt="Location marker"/> <br /> <br />
              <div id="location-pin-text">(Drag the pin to the map)</div>
          </div>
        );
    }
};
