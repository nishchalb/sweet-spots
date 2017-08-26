// @author: Bob Liang and Nishchal Bhandari

import { Component } from 'react';
import React from 'react';
import AddASpot from "../Elements/AddASpot.jsx";
import AddASpotForm from "../Elements/AddASpotForm.jsx";
import NavBar from "../Elements/NavBar.jsx";
import SearchResults from "../Elements/SearchResults.jsx";
import SweetSpotsMap from "../Elements/SweetSpotsMap.jsx";
import Services from "../../services/index.js";
export default class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      addSpotView: true,
      addASpotFormView: false,
      searchResultsView: false,
      addMarkerLatLng: {},
      listResults: [],
      mapRequiresRefocus: false,
      addSpotError: '',
      currentSearch: '',
      showLoginError:false,
      currentHover:''
    };
  }

  componentDidMount() {
    this.getAllSpots();
    this.updateSpotsTimerID = setInterval(
      () => this.updateSpots(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.updateSpotsTimerID);
  }

  //updates the displayed spots
  updateSpots() {
    if (!this.state.searchResultsView) {
      this.getAllSpots();
      this.setState({currentSearch:''});
    }
  }

  /*
   * To be called by other components when the map has been refocused
   */
    mapHasBeenRefocused() {
      this.setState({mapRequiresRefocus: false});
    }

  /*
   * Update the state to reflect that the AddSpotForm view is active
   */
    changeToAddSpotForm() {
      var that = this;
      this.setState({
        addSpotView: false,
        addASpotFormView: true,
        searchResultsView: false
      });
    }

    // Sends a request to the server to add a spot given the specified fields
    addSpot(state) {
      var that = this;
      var addMarkerLatLng = this.state.addMarkerLatLng;
      Services.spot.createSpot(state.name,
        {latitude: addMarkerLatLng.lat,
          longitude: addMarkerLatLng.lng},
        state.floor, state.category, state.reviewText, state.reviewStars).then((res) => {
          var spot = res.content.spot;
          this.setState({addSpotError:''});
          window.location = '/spots/'+spot._id+'/details';
      }).catch((err) => {
              console.log(err);
              if (err.error.err) {
                this.setState({addSpotError:err.error.err});
              } else {
                this.setState({addSpotError:'Unknown error'});
              }
            });
    }

  // Executes search and updates map view and displays results
  executeSearch(label, minLatitude, maxLatitude, minLongitude, maxLongitude, refocus) {
    var that = this;
    var refocus = (refocus === undefined) ? true: refocus; // Default refocus to true
    if (label.length == 0) return; //Don't allow empty searches
    Services.spot.getSpotsByTag(label).then((resp) => {
      var labelSpots = resp.content.spots;
      if (minLatitude && maxLatitude && minLongitude && maxLongitude) {
        Services.spot.getSpotsByLocation(JSON.stringify({
          minLatitude: minLatitude,
          maxLatitude: maxLatitude,
          minLongitude: minLongitude,
          maxLongitude: maxLongitude
        })).then((resp) => {
          var locationSpots = resp.content.spots;
          // Get intersection between two
          // var finalSpots = labelSpots.filter(function(e) {
          //   return locationSpots.indexOf(e) > -1;
          // });
          if (!locationSpots) {
            locationSpots = [];
          }
          var locationSpotIds = locationSpots.map((e) => {return e._id});
          var finalSpots = labelSpots.filter((e) => {return locationSpotIds.indexOf(e._id) >-1});

          // Then, update the state
          that.setState({
            listResults: (typeof finalSpots === 'undefined') ? [] : finalSpots,
            addSpotView:false,
            addASpotFormView:false,
            searchResultsView:true,
            mapRequiresRefocus:refocus,
            currentSearch: label
          });
        })
          .catch((err) => {
            that.setState({
              listResults: [],
              addSpotView:false,
              addASpotFormView:false,
              searchResultsView:true,
              mapRequiresRefocus:refocus,
              currentSearch: label
            });
          });
      } else {
        that.setState({
          listResults: (typeof labelSpots === 'undefined')? [] : labelSpots,
          addSpotView:false,
          addASpotFormView:false,
          searchResultsView:true,
          mapRequiresRefocus:refocus,
          currentSearch: label
        });
      }
    });
  }

  //Simply returns all of the spots. Used when at home page
  getAllSpots() {
    var that = this;
    return Services.spot.getAllSpots().then((resp) => {
      that.setState({
        listResults: resp.content.spots
      });
    });
  }

  /*
   * Update the add marker's LatLng
   */
  handleAddMarkerChange(lat, lng) {
    this.setState({
      addMarkerLatLng:{lat: lat, lng: lng}
    });
  }
  /*
   * Update the list results
   */
  handleListResultsChange(results) {
    this.setState({
      listResults: results
    });
  }

  // Sets the state of the current spot hovered over to the given spotId
  setCurrentHover(spotId) {
    this.setState({currentHover: spotId});
  }

  render(){
    var addASpot = this.state.addSpotView;
    var addASpotForm = this.state.addASpotFormView;
    var searchResults = this.state.searchResultsView;
    return (
      <div onMouseMove={this.mouseMove}>
        <NavBar executeSearch={this.executeSearch.bind(this)} addASpotFormView={addASpotForm}/>
        <div id="left-main-div">
          {addASpot ?
              (<AddASpot onMouseDown = {this.mouseDown}/>) : null}
              {addASpotForm ?
                  (<AddASpotForm onClick={this.addSpot.bind(this)} error={this.state.addSpotError}/>) : null }
                  {searchResults ?
                      (<SearchResults spots={this.state.listResults} handleListResultsChange={this.handleListResultsChange.bind(this)} setHover={this.setCurrentHover.bind(this)}/>) : null}
                    </div>
                    <div id="map-div">
                      <SweetSpotsMap  spots={this.state.listResults} addSpotAllowed={addASpot} changeToAddSpotForm={this.changeToAddSpotForm.bind(this)} handleAddMarkerChange={this.handleAddMarkerChange.bind(this)} mapRequiresRefocus={this.state.mapRequiresRefocus} mapHasBeenRefocused={this.mapHasBeenRefocused.bind(this)} allowExecuteSearch={searchResults} executeSearch={this.executeSearch.bind(this)} currentSearch={this.state.currentSearch} currentHover={this.state.currentHover}/>
                    </div>
                  </div>
    )
  }
}
