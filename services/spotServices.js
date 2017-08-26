// @author: Maryam Archie

const BASE_URL = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/spots" : "http://localhost:3000/spots";
const BASE_URL_USER = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/users" : "http://localhost:3000/users";
const BASE_URL_TAG = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/tags" : "http://localhost:3000/tags";
const BASE_URL_REVIEWS = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/reviews" : "http://localhost:3000/reviews";

var request = require("request-promise-native");

export default {
    /**
     * Retrieves all of the spots
     * GET /spots/
     * @return {Spot[]} all Spots in the database, empty if none
     */
    getAllSpots: () => {
        return request({
            uri: BASE_URL,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets an individual Spot
     * GET /spots/:spotId
     * @param {ObjectId} spotId - the id of the Spot of interest
     * @return {Spot} the Spot of interest
     */
    getSpot: (spotId) => {
        return request({
            uri: BASE_URL + `/${spotId}`,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets all the Spots at a particular location
     * GET /spots/byLocation to the server
     * @param {Object} location - location on the map with GPS coordinates
     *                 - Must be of the form { minLatitude: min latitude of the map,
     *                                         maxLatitude: the max latitude of the map,
     *                                         minLongitude: the min longitude of the map,
	 *							               maxLongitude: the min longitude of the map }
     * @return {Spot[]} the Spots at the specified location, empty if none
     */
    getSpotsByLocation: (location) => {
        return request({
            uri: BASE_URL + `/byLocation/${location}`,
            method: "GET",
            json: true
        });
    },

    /**
     * Get all the Spots created by a given User
     * GET /users/:userId/spots
     * @param {ObjectId} userId - the id of the User of interest
     * @return {Spot[]} the Spots by the specified User, empty if none
     */
    getSpotsByUser: (userId) => {
        return request({
            uri: BASE_URL_USER + `/${userId}/spots`,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets all the Spots with matching the specified Tag
     * GET /tags/:label/spots
     * @param {String} label - the description of the Tag
     * @return {Spot[]} the Spots matching the Tag, empty if none
     */
    getSpotsByTag: (label) => {
        return request({
            uri: BASE_URL_TAG + `/${label}/spots`,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets a Spot given the id of a Review
     * @param {ObjectId} reviewid - the id of the Review for which we want to find the Spot
     * @return {Object} { spot: spot }
     */
    getSpotByReview: (reviewId) => {
        return request({
            uri: BASE_URL_REVIEWS + `/${reviewId}/spot`,
            method: "GET",
            json: true
        });
    },

    /**
     * Creates a Spot
     * POST /spots
     * @param {String} title - the name of the spot
     * @param {Object} location - location on the map with GPS coordinates
     *                 - Must be of the form { latitude: the latitude of the spot,
	 *							               longitude: the longitude of the spot }
     * @param {String} floor - (optional) the floor of the Spot
     * @param {String} label - the category of the Spot
     * @param {String} description - the content of the Review
     * @param {Number} rating - integer rating of the Spot between 0 and 5
     * @return {Object} the newly created Spot { spot: spot }
     */
    createSpot: (title, location, floor, label, description, rating) => {
        return request({
            uri: BASE_URL,
            method: "POST",
            json: true,
            body: {
                title: title,
                location: location,
                floor: floor,
                label: label,
                description: description,
                rating: rating
            }
        });
    },

    /**
     * Adds a Review to a particular Spot
     * POST /spots/:spotId/addReview
     * @param {ObjectId} spotId - the id of the Spot of interest
     * @param {String} description - the content of the Review
     * @param {Number} rating - integer rating of the Spot between 0 and 5
     */
    createReviewForSpot: (spotId, description, rating) => {
        return request({
            uri: BASE_URL + `/${spotId}/addReview`,
            method: "POST",
            json: true,
            body: {
                description: description,
                rating: rating
            }
        });
    },

    /**
     * Allows the User to favorite a Spot
     * POST /spots/:spotId/favorite
     * @param {ObjectId} spotId - the id of the Spot of interest
     */
    favoriteSpot: (spotId) => {
        return request({
            uri: BASE_URL + `/${spotId}/favorite`,
            method: "POST",
            json: true
        });
    },

    /**
     * Report Spot
     * POST /spots/:spotId/Report
     * @param {ObjectId} spotId - the id of the Spot of interest
     */
    reportSpot: (spotId) => {
        return request({
            uri: BASE_URL + `/${spotId}/report`,
            method: "POST",
            json: true
        });
    },

    /**
     * Delete a spot
     * DELETE /spots/:spotId
     * @param {ObjectId} spotId - the id of the Spot of interest
     */
    deleteSpot: (spotId) => {
        return request({
            uri: BASE_URL + `/${spotId}`,
            method: "DELETE",
            json: true
        });
    }
};
