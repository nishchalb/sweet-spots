// @author: Maryam Archie

var assert = require("assert");
var request = require("supertest");
var mongoose = require("mongoose");
var app = require("../../app");

var spot1_id = "584deb678715542958d024d0";
var spot2_id = "584deb678715542958d024d2";
var spot3_id = "584deb678715542958d024d4";

var loc = { latitude: 42.3596434, longitude: -71.0924585 };

describe("Tags", function () {
    describe("GET /tags/", function () {
        // Check num, label and predefined
        it("should retrieve all the tags - must be unique", function (done) {
            request(app)
                .get("/tags")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    var tags = res.body.content.tags;
                    assert.equal(tags[0].label, "bathroom");
                    assert.equal(tags[0].predefined, true);
                    assert.equal(tags[1].label, "study space");
                    assert.equal(tags[1].predefined, true);
                    assert.equal(tags[2].label, "nap space");
                    assert.equal(tags[2].predefined, true);
                    assert.equal(tags[3].label, "water fountain");
                    assert.equal(tags[3].predefined, true);
                    assert.equal(tags[4].label, "toilet");
                    assert.equal(tags[4].predefined, false);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /tags/labels", function () {
        // Check num, labels
        it("should retrieve all the labels", function (done) {
            request(app)
                .get("/tags/labels")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    var labels = res.body.content.labels;
                    assert.equal(labels[0], "bathroom");
                    assert.equal(labels[1], "study space");
                    assert.equal(labels[2], "nap space");
                    assert.equal(labels[3], "water fountain");
                    assert.equal(labels[4], "toilet");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /tags/:label/spots", function () {
        // label: valid/, invalid/
        // valid label: 0 spots/, >0 spots/
        // can get the following info from spot/:
        //  tag (label, predefined), 
        //  reviews (description, rating, creator (username, email))
        it("should get 0 spots for valid label", function (done) {
            request(app)
                .get("/tags/study space/spots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    var spots = res.body.content.spots;
                    assert.equal(spots.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get all the spots with a valid label (nap space)", function (done) {
            request(app)
                .get("/tags/nap space/spots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    var spots = res.body.content.spots;
                    assert.equal(spots.length, 1);
                    assert.equal(spots[0].title, "Best Nap Space");
                    assert.deepEqual(spots[0].location, loc);
                    assert.equal(spots[0].floor, "1");
                    assert.equal(spots[0].rating, 5);
                    assert.equal(spots[0].tag.label, "nap space");
                    assert.equal(spots[0].tag.predefined, true);
                    assert.equal(spots[0].reviews[0].description, "dream dream dream");
                    assert.equal(spots[0].reviews[0].rating, 5);
                    assert.equal(spots[0].reviews[0].creator.username, "6170student");
                    assert.equal(spots[0].reviews[0].creator.email, "6170@mit.edu");
                    assert.equal(spots[0].reports.length, 1);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not get any spots for an invalid label", function (done) {
            request(app)
                .get("/tags/bad label/spots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    var spots = res.body.content.spots;
                    assert.equal(spots.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});