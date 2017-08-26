// @author: Bob Liang

import { Component } from 'react';
import React from 'react';
import Services from "../../services/index.js";
import {OverlayTrigger, Button, Grid, Row, Col, Clearfix, Popover} from 'react-bootstrap';
import NavBarWithoutSearch from "../Elements/NavBarWithoutSearch.jsx";

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
          spots: [],
          reviews: [],
          reviewToSpot: [],
          user: { rep: 0, favorites: [] },
        }
    }
    componentDidMount() {
      this.updateProfileDetails();
    }

    /*
     * Populates all of the state's fields with user's data returned from get request
     */
    updateProfileDetails() {
      var that = this;
      var spots = Services.spot.getSpotsByUser(that.props.userId).then((resp) => {
        that.setState({
          spots: resp.content.spots,
        });
      });
      var reviews = Services.review.getReviewsByUser(that.props.userId).then((resp) => {
        that.setState({
          reviews: resp.content.reviews,
        });
        var reviewToSpot = {};
        that.state.reviews.forEach((review) => {
          Services.spot.getSpotByReview(review._id).then((resp) => {
            reviewToSpot[review._id] = resp.content.spot;
            this.setState({
              reviewToSpot: reviewToSpot,
            })
          });
        });
      });
      var user = Services.user.getUser(that.props.userId).then((resp) => {
        that.setState({
          user: resp.content.user,
        });
      })
    }
    render(){
      var spots = this.state.spots;
      var reviews = this.state.reviews;
      var reviewToSpot = this.state.reviewToSpot;
      var rep = this.state.user.rep;
      var favorites = this.state.user.favorites;
      var username = this.state.user.username;

      const popover = (
        <Popover id='rep-popover' title="What's rep?" placement='bottom' positionLeft={-200}>
          Rep measure how much you contribute to Sweet Spots. Post spots and write reviews to up your rep!
        </Popover>
      );
        return (
          <div>
            <NavBarWithoutSearch />
            <Grid>
              <Row>
                <Col sm={7} md={3}>
                </Col>
                <Col sm={10} md={6}>
                <OverlayTrigger overlay={popover} placement='bottom'>
                <h1 > {username}&#39;s Profile (Current Rep: {rep})</h1>
              </OverlayTrigger>
            </Col>
            <Col sm={6} md={2}>
            </Col>
              </Row>
              <Row className="show-grid">
                <Col sm={8} md={4}>
                  <h3>Posted Spots</h3>
                  <div id="posted-spots">
                    {spots.map((spot) => (
                      <div key={spot._id}>
                      <h4><a href={'/spots/'+spot._id+'/details'}>{spot.title}</a></h4>
                      <p>Average rating: {spot.rating} out of 5 <br />
                      {spot.reviews.length} {spot.reviews.length === 1 ? "review" : "reviews"} </p>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col sm={8} md={4}>
                  <h3>Your Reviews</h3>
                  <div id="your-reviews">
                    {reviews.map((review) => (
                      <div>
                        {reviewToSpot[review._id]? (<h4><a href={'/spots/'+ reviewToSpot[review._id]._id +'/details'}>{reviewToSpot[review._id].title}</a></h4>) : <div></div> }
                      <span>{review.rating} out of 5 </span> <br />
                      <span>"{review.description}"</span><br />
                      <span>Contribution to rep: {review.score > 0 ? "+" : ""}{review.score}</span>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col sm={8} md={4}>
                  <h3>Favorite Spots</h3>
                  <div id="favorite-spots">
                    {(favorites.length === 0) ? ("You have no favorites") : ("")}
                    {favorites.map((spot) => (
                      <div>
                        <h4><a href={'/spots/'+spot._id+'/details'}>{spot.title}</a></h4>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        )
    }
}
