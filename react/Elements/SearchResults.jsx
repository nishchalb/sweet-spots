// @author: Bob Liang

import React from 'react';
import {Panel} from 'react-bootstrap';

export default class SearchResults extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
      function ResultItem(props) {
        const title = (
          <h4><a href={'/spots/'+props.spotId+'/details'}>{props.title}</a></h4>
        );
        return (
          <Panel header={title} className='resultPanel'>
            <span>Category: {props.label} </span><br />
            <span>{props.rating}/5 Stars </span><br />
          </Panel>
        );
      }

        return (
          <div id="search-results" onMouseLeave={() => {this.props.setHover('')}}>
              <h3>Top Spots</h3>
              {this.props.spots.length === 0 ? "No spots found. Try searching for something else or zooming out on the map" : ""}
              {this.props.spots.map((spot) => (
                <div key={spot._id} onMouseEnter={() => {this.props.setHover(spot.title)}}>
                  <ResultItem rating={spot.rating} title={spot.title} location={spot.location} spotId={spot._id} label={spot.tag.label}/>
                </div>
              ))}
          </div>
        );
    }
};
