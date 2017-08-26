// @author: Bob Liang
import React from 'react';
import { Button, ButtonToolbar, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Services from "../../services/index.js";
import Autosuggest from "react-autosuggest";
import { Typeahead } from 'react-bootstrap-typeahead';

export default class AddASpotForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            category: "",
            floor: null,
            reviewStars: null,
            reviewText: "",
            tags: [],
            value: '',
            suggestions: [],
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeFloor = this.handleChangeFloor.bind(this);
        this.handleChangeReview = this.handleChangeReview.bind(this);
        this.handleClickRating = this.handleClickRating.bind(this);

    }
    componentDidMount() {
        var tags = Services.tag.getAllTags().then((resp) => {
            this.setState({
                tags: resp.content.tags.map((tag) => {return tag.label;}),
            });
        });
    }

    //Handles a change in the name entry by updating state
    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    //Handles a change in the category entry by updating state
    handleChangeCategory(value) {
        this.setState({category: value});
    }

    //Handles a change in the floor entry by updating state
    handleChangeFloor(event) {
        this.setState({floor: event.target.value});
    }

    //Handles a change in the review's text by updating state
    handleChangeReview(event) {
        this.setState({reviewText: event.target.value});
    }

    //Handles a change in the review's rating by updating state
    handleClickRating(x) {
        this.setState({reviewStars: x});
    }


    render(){
        var that = this;
        var value = this.state.category;
        var tags = this.state.tags;

        return (
            <div id="add-a-spot-form">
                <h2 id="add-a-spot">Add a spot:</h2> <br />
                <a href="/"> &lt; Back to home</a> <br /> <br />
                <form>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl placeholder="Enter the spot's name" onChange={this.handleChangeName} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <Typeahead
                            placeholder="Enter the spot's category"
                            onInputChange={this.handleChangeCategory}
                            options={tags}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Floor</ControlLabel>
                        <FormControl placeholder="Which floor is this spot on?" onChange={this.handleChangeFloor} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Review</ControlLabel> <br />
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
                        <FormControl componentClass="textarea" onChange={this.handleChangeReview}/>
                        {this.props.error.length > 0 &&
                                <div className='alert alert-danger'>Error: {this.props.error}<br /></div>
                        }
                    </FormGroup>
                </form>
                <Button bsStyle="primary" id="submit-new-spot" onClick={() => {
                    that.props.onClick(that.state);
                }}>Submit Spot</Button>
        </div>
        );
    }
};
