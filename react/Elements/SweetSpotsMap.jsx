// @author: Nishchal Bhandari
import React from 'react';
import { withRouter } from 'react-router';
import Services from "../../services/index.js";

export default class SweetSpotsMap extends React.Component {
    constructor(props){
        super(props);
        this.state = {markers:[], addMarker:{}, canAddSpot:false};
    }

    /*
     * Clear undeeded markers from the map and remove them from the state
     */
    clearMarkers() {
        var newMarkers = [];
        var spotTitles = this.props.spots.map((e) => {return e.title});
        this.state.markers.forEach(function(m) {
            if (spotTitles.indexOf(m.getTitle()) == -1) {
                // delete the markers that aren't in spots
                m.setMap(null);
            } else {
                // Keep the ones that are
                newMarkers.push(m);
            }
        });

        this.setState({markers:newMarkers});
    }

    /*
     * React method that is called after the component initially mounts to the DOM
     */
    componentDidMount(){
        var that = this;
        // Define map settings
        const initialZoom = 18;
        const initialLat = 42.3592374;
        const initialLng = -71.0938239;
        const minZoom = 15.75; //The farthest zoomed out the map can be
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: initialLat, lng:initialLng},
            zoom: initialZoom
        });

        // Hiding default google PoIs
        map.setOptions({
            styles:[{
                featureType:'poi',
                elementType:'labels',
                stylers: [{visibility:'off'}]
            }]});
        that.markSpotsOnMap(map);

        // listener for updating search list component
        var listUpdater = google.maps.event.addListener(map, 'bounds_changed', function() {
            if (this.props.allowExecuteSearch) {
                // get map bounds
                var bounds = map.getBounds();
                var minLat = bounds.getSouthWest().lat();
                var maxLat = bounds.getNorthEast().lat();
                var minLng = bounds.getSouthWest().lng();
                var maxLng = bounds.getNorthEast().lng();
                this.props.executeSearch(this.props.currentSearch,
                    minLat,
                    maxLat,
                    minLng,
                    maxLng,
                    false);
            }
        }.bind(this));

        that.setState({listUpdater: listUpdater});

        // Logic for dragging marker to map
        var addSpotDiv = document.getElementById('location-pin');
        google.maps.event.addDomListener(addSpotDiv, 'dragstart', function(e) {
            that.setState({canAddSpot: true});
        });

        google.maps.event.addDomListener(addSpotDiv, 'dragend', function(e) {
            setTimeout(() => {that.setState({canAddSpot: false});}, 100);
        });

        map.addListener('mouseover', function(e) {
            if (that.state.canAddSpot) {
                var latLng = e.latLng;
                var marker = new google.maps.Marker({
                    position: latLng,
                    map:map,
                    draggable: true,
                    animation: google.maps.Animation.BOUNCE,
                    icon: 'images/blue_marker.png'
                });
                that.props.handleAddMarkerChange(marker.getPosition().lat(), marker.getPosition().lng());
                // Make the marker update parent state when moved
                marker.addListener('dragend', function() {
                    that.props.handleAddMarkerChange(marker.getPosition().lat(), marker.getPosition().lng());
                });
                // Change the parent's view
                that.props.changeToAddSpotForm();
            }
        });

        // add map to state
        this.setState({map: map});

        // Make the map update using server info
        this.updateMapTimerID = setInterval(
            () => this.updateMap(),
            5000
        );
        this.updateMapFastTimerID = setInterval(
            () => this.updateMapFast(),
            100
        );
    }



    /*
     * Perform various updates to the map to ensure it is consistent with component state
     */
    updateMap() {
        this.clearMarkers();
        this.markSpotsOnMap(this.state.map);
        if (this.props.mapRequiresRefocus) {
            this.fitMapToSpots(this.props.spots, this.state.map);
            this.props.mapHasBeenRefocused();
        }
    }

    /*
     * Updates that need to be performed often for the map
     */
    updateMapFast() {
        this.setCurrentHoverMarker();
    }

    /*
     * Updates the markers on the map so that if some are supposed to bounce, they do
     */
    setCurrentHoverMarker() {
        var that = this;
        this.state.markers.forEach(function (m) {
            if (m.getTitle() == that.props.currentHover) {
                m.setAnimation(google.maps.Animation.BOUNCE);
            } else if (m.getAnimation() != null) {
                m.setAnimation(null);
            }
        });
    }

    /*
     * React methods that are called when this component unmounts
     */
    componentWillUnmount() {
        clearInterval(this.updateMapTimerID);
        clearInterval(this.updateMapFastTimerID);
    }


    /*
     * Fit the bounds of a map to accomodate a list of spots
     *
     * @param {Spot[]} spots - the list of spots to accomodate
     * @param {google.maps.Map} map - the map
     */
    fitMapToSpots(spots, map) {
        this.state.listUpdater.remove();
        var bounds = new google.maps.LatLngBounds();
        spots.forEach(function(spot) {
            var latLng = {lat: spot.location.latitude, lng: spot.location.longitude};
            bounds.extend(latLng);
            map.fitBounds(bounds);
        });

        // Bounds changed, so update list view
        var listUpdater = google.maps.event.addListener(map, 'bounds_changed', function() {
            if (this.props.allowExecuteSearch) {
                // get map bounds
                var bounds = map.getBounds();
                var minLat = bounds.getSouthWest().lat();
                var maxLat = bounds.getNorthEast().lat();
                var minLng = bounds.getSouthWest().lng();
                var maxLng = bounds.getNorthEast().lng();
                this.props.executeSearch(this.props.currentSearch,
                    minLat,
                    maxLat,
                    minLng,
                    maxLng,
                    false);
            }
        }.bind(this));
        this.setState({listUpdater: listUpdater});
    }

    /*
     * Update the markers on the map to reflect the current state of Spots
     */
    markSpotsOnMap(map){
        var that = this;
        var markerTitles = this.state.markers.map((e) => {return e.getTitle()});
        var newMarkers = [];
        this.props.spots.forEach(function(spot) {
            if (markerTitles.indexOf(spot.title) == -1) {
                // Info windows for markers
                var infoWindow = new google.maps.InfoWindow({
                    content: '<h3 className="mapInfoWindow">'+spot.title+'</h3><hr/>'+
                    '<p>Category: '+spot.tag.label+'</p>'+
                    '<p>Avg. Rating: '+spot.rating + '/5 </p>'
                });
                var marker = new google.maps.Marker({
                    position: {lat:spot.location.latitude, lng:spot.location.longitude},
                    map: map,
                    title: spot.title
                });

                marker.addListener('click', function() {
                    var spotId = spot._id;
                    window.location = '/spots/'+spotId+'/details';
                });

                marker.addListener('mouseover', function() {
                    infoWindow.open(map, marker);
                });

                marker.addListener('mouseout', function() {
                    infoWindow.close();
                });
                newMarkers.push(marker);
            }
        });

        this.setState({markers: this.state.markers.concat(newMarkers)});
    }

    render(){
        const style = {
            margin:'0',
            padding:'0',
            height:'calc(100vh - 105px)',
            width:'calc(100% - 415px)'
        };
        return (
            <div style={style} id='map'></div>
        );
    }
};
