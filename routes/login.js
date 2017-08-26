// @author: Nishchal Bhandari

var express = require("express");
var router = express.Router();
var _ = require("lodash");


/**
 * Gets the current user
 * GET /users/
 * @param {Object} req - the request must contain the session if signed in
 * @param {Object} res - success.loggedIn: true if a user is logged in, false otherwise
 *                     - success.user: the email of the current user
 */
router.get("/", function (req, res) {
    res.render("login", { login: "" });
});

module.exports = router;
