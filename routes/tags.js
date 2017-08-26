//@author: Maryam Archie

var express = require("express");
var router = express.Router();
var _ = require("lodash");
var utils = require("../utils/utils");
var Tags = require("../models/Tags").Tags;
var Spots = require("../models/Spots").Spots;

/**
 * Retrieves all of the Tags
 * GET /tags/
 * @param {Object} req - No request parameters necessary
 * @param {Object} res - success.tags: list of all the Tags (empty if none)
 */
router.get("/", function (req, res) {
    Tags.getTags(function (err, tags) {
        if (err) {
            utils.sendSuccessResponse(res, { tags: [] });
        } else {
            utils.sendSuccessResponse(res, { tags: tags });
        }
    });
});

/**
 * Retrieves the labels of all of the Tags
 * GET /tags/labels
 * @param {Object} req - No request parameters necessary
 * @param {Object} res - success.tags: list of all the labels of Tags (empty if none)
 */
router.get("/labels", function (req, res) {
    Tags.getLabels(function (err, labels) {
        if (err) {
            utils.sendSuccessResponse(res, { labels: [] });
        } else {
            utils.sendSuccessResponse(res, { labels: labels });
        }
    });
});

/**
 * Gets all the Spots given the label of a Tags
 * GET /tags/:label/spots
 * @param {Object} req - the request must contain the label as a parameter
 * @param {Object} res - success.spots: a list of Spots, empty if none
 *                     - error: on error, an error message
 */
router.get("/:label/spots", function (req, res) {
    var label = req.params.label.toLowerCase();
    Spots.getSpotsByTag(label, function (err, spots) {
        if (err) {
            utils.sendSuccessResponse(res, { spots: [] });
        } else {
            utils.sendSuccessResponse(res, { spots: spots });
        }
    });
});

module.exports = router;