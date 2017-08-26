//@author: Maryam Archie

const BASE_URL = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/reviews" : "http://localhost:3000/reviews";
const BASE_URL_USER = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/users" : "http://localhost:3000/users";

var request = require("request-promise-native");

export default {

    /**
     * Get all the Reviews by a particular user
     * GET /users/:userId/reviews
     * @param {ObjectId} userId - the id of the User of interest
     * @return {Object} the Reviews created by the User of interest
     *                  the response is of the form { reviews: reviews }
     * @throws Will throw 404 error if the User cannot be found
     *                    500 otherwise
     */
    getReviewsByUser: (userId) => {
        return request({
            uri: BASE_URL_USER + `/${userId}/reviews`,
            method: "GET",
            json: true
        });
    },

    /**
     * Upvote or downvote a Review
     * POST /reviews/:reviewId
     * @param {ObjectId} reviewId - the id of a given Review
     * @param {Boolean} upvote - true if upvote, false if downvote
     * @throws Will throw 404 error if the Review/ User cannot be found
     *                    500 error otherwise
     */
    upvoteReview: (reviewId, upvote) => {
        return request({
            uri: BASE_URL + `/${reviewId}`,
            method: "POST",
            json: true,
            body: {
                upvote: upvote
            }
        });
    }
};