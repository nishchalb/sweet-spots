// @author: Maryam Archie
// Based off fritter-react/services/userServices

const BASE_URL = process.env.NODE_ENV === "production" ? "https://sweet-spots.herokuapp.com/users" : "http://localhost:3000/users";

var request = require("request-promise-native");

export default {
    /**
     * Registers a new User
     * GET /users
     * @param {String} username - the username that the User tries to register with
     *                          - must only contain 3-15 alphanumeric characters
     * @param {String} email - the email that the User tries to register with
     *                       - must be a valid MIT email address, i.e. ends with @mit.edu
     * @param {String} password - the password that the User will use to access their account
     * @throws Will throw a 400 error if duplicate username/ email or checkRep is violated
     *                      500 error otherwise
     */
    register: (username, email, password) => {
        return request({
            uri: BASE_URL,
            method: "POST",
            json: true,
            body: {
                username: username,
                email: email,
                password: password
            }
        });
    },

    /**
     * Logs a user in
     * POST /users/login
     * @param {String} email - the @mit.edu email address of the User
     * @param {String} password - the password to the User's account
     * @return {Object} - the response is of the form { user: email }
     * @throws Will throw a 400 error if the email/username is not provided
     *                      403 error if a User is already signed in, wrong password
     *                      404 error if User cannot be found 
     *                      500 error otherwise
     */
    login: (email, password) => {
        return request({
            uri: BASE_URL + "/login",
            method: "POST",
            json: true,
            body: {
                email: email,
                password: password
            }
        });
    },

    /**
     * Gets the current user 
     * GET /users
     * @return {Object} if logged in, {loggedIn: true, user: email, userObject: User}
     *                  else {loggedIn: false}
     */
    getCurrentUser: () => {
        return request({
            uri: BASE_URL,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets a User object given a userId
     * GET /users/:userId
     * @param {ObjectId} - the id of the User of interest
     * @return {Object} the User associated with a userId
     *                  the response is of the form { user: User }
     * @throws Will throw a 404 error if the User cannot be found
     *                      500 error otherwise
     */
    getUser: (userId) => {
        return request({
            uri: BASE_URL + `/${userId}`,
            method: "GET",
            json: true
        });
    },

    /**
     * Gets a User's favorite Spots
     * GET /users/:userId/favoriteSpots
     * @param {ObjectId} - the id of the User of interest
     * @return {Object} the Spots that the User favorited
     *                  the response is of the form { favorites: Spots[] }
     * @throws Will throw a 404 error if the User cannot be found
     *                      500 error otherwise
     */
    getUserFavoriteSpots: (userId) => {
        return request({
            uri: BASE_URL + `/${userId}/favoriteSpots`,
            method: "GET",
            json: true
        });
    },

    /**
     * Logs the user out
     * POST /users/logout
     */
    logout: () => {
        return request({
            uri: BASE_URL + "/logout",
            method: "POST",
            json: true
        });
    }
};
