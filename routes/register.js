// @author: Nishchal Bhandari

var express = require("express");
var router = express.Router();
var _ = require("lodash");

/*
 * The route to get the register page. This will render the page for the user.
 * @param{Object} req - The request
 * @param{Object} res - The response
 */
router.get("/", function (req, res) {
    res.render("register", { fail: "" });
});

module.exports = router;
