// @author: Maryam Archie
// Referenced fritter-react/routes/users.js

var express = require("express");
var router = express.Router();
var _ = require("lodash");
var utils = require("../utils/utils");
var Users = require("../models/Users").Users;
var Reviews = require("../models/Reviews").Reviews;
var Spots = require("../models/Spots").Spots;

const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const SERVER_ERROR = 500;

/**
 * Middleware that requires authentication on all access to the Spots/ Reviews/ Tags.
 * Users who have not logged in will receive a 403: Forbidden HTTP status code.
 * @param {Object} req - Must contain currentUser if signed in
 * @param {Object} res - error if not signed in, success otherwise
 * @param {function} next - callback function that calls the next piece of middleware
 */
var requireAuthentication = function (req, res, next) {
    if (!req.currentUser) {
        // User is not logged in
        utils.sendErrorResponse(res, FORBIDDEN, "To use this feature, please sign in or register.");
    } else {
        // User has access to feature
        next();
    }
};

/**
 * Helper function that handles errors
 * @param {Object} res - the response from the route
 * @param {Object} err - err.http_status: known errors generated by model
 *                       otherwise, unknown errors
 */
var routerErrorHandler = function (res, err) {
    if (err.http_status) {
        utils.sendErrorResponse(res, err.http_status, err.msg);
    } else {
        // Unknown Error
        utils.sendErrorResponse(res, SERVER_ERROR, "Something went wrong... Please try again.");
    }
};

// Middleware
router.post("/logout", requireAuthentication);

/**
 * Gets the current user
 * GET /users/
 * @param {Object} req - the request must contain the session if signed in
 * @param {Object} res - success.loggedIn: true if a User is logged in, false otherwise
 *                     - success.user: the email of the current user
 *                     - success.userObject: the Object defining the current User
 */
router.get("/", function (req, res) {
    if (req.currentUser) {
        // User is logged in
        utils.sendSuccessResponse(res, {
            loggedIn: true,
            user: req.session.email,
            userObject: req.currentUser
        });
    } else {
        // User is not logged in
        utils.sendSuccessResponse(res, { loggedIn: false });
    }
});

/**
 * Gets the User associated with the given id
 * GET /spots/:userId
 * @param {Object} req - the request params must contain userId
 * @param {Object} res - success.user: User object
 *                     - error: on error, an error message
 */
router.get("/:userId", function (req, res) {
    var userId = req.params.userId;
    Users.findUserById(userId, function (err, user) {
        if (err) {
            routerErrorHandler(res, err);
        } else {
            utils.sendSuccessResponse(res, { user: user });
        }
    });
});

/**
 * Gets the Reviews for a given User
 * GET /users/:userId/reviews
 * @param {Object} req - the request params must contain userId
 * @param {Object} res - success.reviews: a list of Reviews created by the User
 *                     - error: if unknown, an empty list else an error message
 */
router.get("/:userId/reviews", function (req, res) {
    var userId = req.params.userId;
    Reviews.getReviewsByUser(userId, function (err, reviews) {
        if (err) {
            if (err.http_status) {
                // User cannot be found
                utils.sendErrorResponse(res, err.http_status, err.msg);
            } else {
                utils.sendSuccessResponse(res, { reviews: [] });
            }
        } else {
            utils.sendSuccessResponse(res, { reviews: reviews });
        }
    });
});

/**
 * Gets the Spots for a given User
 * GET /users/:userId/spots
 * @param {Object} req - the request params must contain userId
 * @param {Object} res - success.spots: a list of Spots created by the User
 *                     - error: if unknown, an empty list else an error message
 */
router.get("/:userId/spots", function (req, res) {
    var userId = req.params.userId;
    Spots.getSpotsByUser(userId, function (err, spots) {
        if (err) {
            if (err.http_status) {
                // User cannot be found
                utils.sendErrorResponse(res, err.http_status, err.msg);
            } else {
                utils.sendSuccessResponse(res, { spots: [] });
            }
        } else {
            utils.sendSuccessResponse(res, { spots: spots });
        }
    });
});

/**
 * Gets a User's favorite Spots
 * GET /users/:userId/favoriteSpots
 * @param {Object} req - the request params must contain userId
 * @param {Object} res - success.favorites: a list of Spots favorited by the User
 *                     - error: if unknown, an empty list else an error message
 */
router.get("/:userId/favoriteSpots", function (req, res) {
    var userId = req.params.userId;
    Users.getFavoriteSpots(userId, function (err, favorites) {
        if (err) {
            if (err.http_status) {
                // User cannot be found
                utils.sendErrorResponse(res, err.http_status, err.msg);
            } else {
                utils.sendSuccessResponse(res, { favorites: [] });
            }
        } else {
            utils.sendSuccessResponse(res, { favorites: favorites });
        }
    });
});

/**
 * Registers a user
 * POST /users/
 * @param {Object} req - the request body must contain username, email and password
 * @param {Object} res - success: true if user successfully created; false otherwise
 *                     - error: on error, an error message
 */
router.post("/", function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    Users.createUser(username, email, password, function (err) {
        if (err) {
            routerErrorHandler(res, err);
        } else {
            utils.sendSuccessResponse(res);
        }
    });
});

/**
 * Logs in a user
 * POST /users/login
 * @param {Object} req - the request body must contain email and password
 * @param {Object} res - success: true if the user successfully logged in, false otherwise
 *                     - success.user: the email of the user who is logging in
 *                     - error: on error, an error message
 */
router.post("/login", function (req, res) {
    if (req.currentUser) {
        // A User is already logged in
        var errorMsg = req.currentUser.email + " is currently signed in. To sign in to a different account, first logout this account.";
        utils.sendErrorResponse(res, FORBIDDEN, errorMsg);
    } else if (!(req.body.email && req.body.password)) {
        // Missing email/ password
        var missingErrorMsg = "Email or password not provided.";
        utils.sendErrorResponse(res, BAD_REQUEST, missingErrorMsg);
    } else {
        // Attempting to log the user in
        var email = req.body.email;
        var password = req.body.password;

        Users.validatePassword(email, password, function (err, isCorrect) {
            if (err) {
                routerErrorHandler(res, err);
            } else {
                if (isCorrect) {
                    // Correct password - Store user session
                    req.session.email = email;
                    utils.sendSuccessResponse(res, { user: email });
                } else {
                    // Incorrect Password
                    utils.sendErrorResponse(res, FORBIDDEN, "Wrong password. Try again.");
                }
            }
        });
    }
});

/**
 * Logs a user out
 * POST /users/logout
 * @param {Object} req - the request body must contain the session
 * @param {Object} res - success: true if the user was successfully logged out
 * 
 */
router.post("/logout", function (req, res) {
    req.session.destroy();
    utils.sendSuccessResponse(res);
});

module.exports = router;

