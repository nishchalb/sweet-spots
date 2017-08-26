// @author: Maryam Archie

var mongoose = require("mongoose");
var tagModel = require("../models/Tags").tagModel;

tagModel({}).remove(function() {
    tagModel.create({
        label: "bathroom", predefined: true
    }, function(err, newTag) { });

    tagModel.create({
        label: "study space", predefined: true
    }, function(err, newTag) { });

    tagModel.create({
        label: "nap space", predefined: true
    }, function(err, newTag) { });

    tagModel.create({
        label: "water fountain", predefined: true
    }, function(err, newTag) { });
});