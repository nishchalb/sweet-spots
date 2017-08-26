// @author: Bob Liang

import { Component } from 'react';
import React from 'react';
import { render } from 'react-dom';
import Services from "../../services/index.js";
import NavBarWithoutSearch from "../Elements/NavBarWithoutSearch.jsx";
import {Button, ButtonToolbar, Row, Grid} from 'react-bootstrap';

export default class SpotDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spot: { reviews: [], location: {latitude: 0, longitude: 0}, reports:[] },
            reviewText: "",
            reviewStars: 5,
            userFavoriteSpots: [],
            userId: '',
            staticImgUrl:'',
            errorText:''
        };
        this.handleClickRating = this.handleClickRating.bind(this);
        this.handleChangeReview = this.handleChangeReview.bind(this);
    }

    componentDidMount() {
        var that = this;
        Services.user.getCurrentUser().then((resp) => {
            if (resp.content.loggedIn) {
                var userId = resp.content.userObject._id;
                that.setState({ userId: userId });
                this.updateUserFavorites(that.state.userId);
            }
        });
        this.updateSpotDetails();
    }

    /*
     * Get the spot details from the server and update this component's state
     */
    updateSpotDetails() {
        var that = this;
        var spots = Services.spot.getSpot(that.props.spotId).then((resp) => {
            that.setState({
                spot: resp.content.spot
            });
            var params = {
                center:resp.content.spot.location.latitude+', '+resp.content.spot.location.longitude,
                zoom: 20,
                size: '500x400',
                key:'AIzaSyCnwDHA_bSC94EDVWGUKzruh0GCa3IEHeI'
            };
            that.setState({staticImgUrl:'https://maps.googleapis.com/maps/api/staticmap?center='+params.center+'&zoom=18&size=500x400&key=AIzaSyCnwDHA_bSC94EDVWGUKzruh0GCa3IEHeI&markers=|'+params.center});
        });
    }

    /*
     * Update the current user's favorites from the server
     */
    updateUserFavorites() {
        var that = this;
        Services.user.getUserFavoriteSpots(that.state.userId).then((resp) => {
            var favorites = resp.content.favorites;
            that.setState({ userFavoriteSpots: favorites });
        });
    }
    //Handles a change in the review's rating by updating state
    handleClickRating(x) {
        this.setState({ reviewStars: x });
    }

    //Handles a change in the review's text by updating state
    handleChangeReview(event) {
        this.setState({ reviewText: event.target.value });
    }
    submitReview() {
        var that = this;
        Services.spot.createReviewForSpot(this.props.spotId, this.state.reviewText, this.state.reviewStars)
            .then((res) => {that.updateSpotDetails();})
            .catch((err) => { that.setState({errorText: err.error.err}); });
    }

    /*
     * Add a spot to the current user's favorites
     * @param {String} spotId - the id of the Spot of interest
     */
    favoriteSpot(spotId) {
        Services.spot.favoriteSpot(spotId).then((resp) => {
            this.updateUserFavorites();
        });
    }

    /*
     * Reports the spot
     */
    reportSpot() {
        Services.spot.reportSpot(this.props.spotId).then((resp) => {
            this.updateSpotDetails();
        }).catch((err) => { console.log(err); });
    }

    /*
     * Upvote or downvote a review
     * @param {ObjectId} reviewId - the id of a given review
     * @param {Boolean} upvote - true if upvote, false if downvote
     */
    upvoteReview(reviewId, upvote) {
        Services.review.upvoteReview(reviewId, upvote).then((resp) => {
            this.updateSpotDetails();
        });
    }

    render() {
        var spot = this.state.spot;
        var that = this;
        var favSpotsIds = this.state.userFavoriteSpots.map((e) => { return e._id });
        var disabled = this.state.userId.length==0;
        var reporters = spot.reports.length > 0 ? spot.reports.map((e) => {return e.reporter}) : [];
        var reportDisabled = reporters.length > 0 && reporters.indexOf(that.state.userId) > -1;

        function DeleteSpotButton(props) {
            var createDate = new Date(props.timestamp);
            var now = new Date();
            function deleteService(id) {
                Services.spot.deleteSpot(id).then(() => {window.location='/'});
            }
            var elapsed = (now - createDate)/(1000*60*60*24); // convert ms to days
            if (elapsed > 1) return null;
            return <Button bsStyle='danger' name='delete-spot' onClick={() => deleteService(props.spotId)}>Delete Spot</Button>
        }

        function Upvote(props) {
            if (props.disabled || (props.creatorId == that.state.userId)) return null;
            return <Button bsStyle="info" bsSize="small" name='upvote-review' onClick={() => that.upvoteReview(props.reviewId, true)}>Upvote</Button>
        }
        function Downvote(props){
            if (props.disabled || (props.creatorId == that.state.userId)) return null;
            return <Button bsStyle="warning" bsSize="small" name='downvote-review' onClick={() => that.upvoteReview(props.reviewId, false)}>Downvote</Button>
        }
        var reviews =
            spot.reviews.map((review) => (
                <div>
                    Rating: {review.rating} out of 5<br />
                <p>"{review.description}"</p>
                By <a href={"/profile/"+review.creator._id}>{review.creator.username}</a> (Rep: {review.creator.rep}) <br />
                Review Score: {review.score}<br />
                <ButtonToolbar>
                    <Upvote reviewId = {review._id} creatorId={review.creator._id} disabled={disabled}/>
                    <Downvote reviewId = {review._id} creatorId={review.creator._id} disabled={disabled}/>
                </ButtonToolbar>
                <hr />
                </div>
            ));
        return (
            <div>
                <NavBarWithoutSearch />
                <Grid>
                    <Row>
                        <div className="col-md-6">
                            <h1>{spot.title}</h1>
                            <img src={this.state.staticImgUrl} alt="closeup map"></img>
                            <DeleteSpotButton timestamp={spot.timestamp} spotId={spot._id}/>
                            <h5>Average Rating: {spot.rating} out of 5 </h5>
                            <ButtonToolbar>
                                {(favSpotsIds.indexOf(spot._id) == -1  && !disabled)&&
                                        <Button bsStyle="success"name='favorite-spot' onClick={() => this.favoriteSpot(spot._id)}>Favorite</Button>
                                }

                                {!disabled && !reportDisabled && 
                                        <Button bsStyle="danger" name='report-spot' onClick={() => this.reportSpot()}>Report</Button>
                                }
                            </ButtonToolbar>
                            <h6>Location: Lat: {spot.location.latitude} Long: {spot.location.longitude}</h6>
                            <br />
                            <h6>Created on {spot.timestamp}</h6>
                        </div>
                        <div className="col-md-6">
                            <h2>Reviews: </h2>
                            <hr />
                            {reviews}

                            {!disabled &&
                                    <div>
                                        <h4>Write a review:</h4>
                                        <span className="rating">
                                            <input type="radio" className="rating-input"
                                                id="rating-input-1-5" name="rating-input-1"
                                                onClick={() => this.handleClickRating(5)}></input>
                                            <label htmlFor="rating-input-1-5" className="rating-star"></label>
                                            <input type="radio" className="rating-input"
                                                id="rating-input-1-4" name="rating-input-1"
                                                onClick={() => this.handleClickRating(4)}></input>
                                            <label htmlFor="rating-input-1-4" className="rating-star"></label>
                                            <input type="radio" className="rating-input"
                                                id="rating-input-1-3" name="rating-input-1"
                                                onClick={() => this.handleClickRating(3)}></input>
                                            <label htmlFor="rating-input-1-3" className="rating-star"></label>
                                            <input type="radio" className="rating-input"
                                                id="rating-input-1-2" name="rating-input-1"
                                                onClick={() => this.handleClickRating(2)}></input>
                                            <label htmlFor="rating-input-1-2" className="rating-star"></label>
                                            <input type="radio" className="rating-input"
                                                id="rating-input-1-1" name="rating-input-1"
                                                onClick={() => this.handleClickRating(1)}></input>
                                            <label htmlFor="rating-input-1-1" className="rating-star"></label>
                                        </span> <br />
                                        <textarea rows="4" cols="40" onChange={this.handleChangeReview}>
                                        </textarea> <br />
                                        <Button bsStyle="primary" type="button" id="submit-new-review" onClick={() => {
                                            this.submitReview();
                                        } }>Submit review</Button>
                                    {this.state.errorText.length > 0 &&
                                            <div className='alert alert-danger'> Error: {this.state.errorText}<br /></div>
                                    }
                                </div>
                            }
                        </div>
                    </Row>
                </Grid>
            </div>
        )
    }
}
