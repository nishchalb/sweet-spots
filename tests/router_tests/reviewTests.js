// @author: Maryam Archie

var assert = require("assert");
var request = require("supertest");
var mongoose = require("mongoose");
var app = require("../../app");

var cookie, cookie2, cookie3;
var review1, review2, review3, review4, review5;

describe("Set up accounts for post routes", function() {
    describe("POST /users/login", function() {
        it("should log a valid user in", function(done) {
            request(app)
                .post("/users/login")
                .send({ "email": "6170@mit.edu", "password": "6170" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "6170@mit.edu");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should log a different valid user in", function(done) {
            request(app)
                .post("/users/login")
                .send({ "email": "stud@mit.edu", "password": "studley" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie2 = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "stud@mit.edu");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should log yet another different valid user in", function(done) {
            request(app)
                .post("/users/login")
                .send({ "email": "dude@mit.edu", "password": "dude" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie3 = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "dude@mit.edu");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});

describe("Set up spots to get reviewIds", function() {
    it("should get all the spots", function(done) {
        request(app)
            .get("/spots")
            .set({ "cookie": cookie2 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function(res) {
                assert.equal(res.body.success, true);
                assert.equal(res.body.content.spots.length, 3);
                spot11 = res.body.content.spots[0];
                assert.equal(spot11.reviews.length, 2);
                review1 = spot11.reviews[0]._id;
                review2 = spot11.reviews[1]._id;
                spot22 = res.body.content.spots[1];
                assert.equal(spot22.reviews.length, 1);
                review3 = spot22.reviews[0]._id;
                spot33 = res.body.content.spots[2];
                assert.equal(spot33.reviews.length, 1);
                review4 = spot33.reviews[0]._id;
            })
            .end(function(err, res) {
                if (err) done(err);
                else done();
            });
    });
});

describe("Reviews", function() {
    describe("GET /reviews/:reviewId/spot", function() {
        // review: valid/, invalid/
        // reviewer: spot creator/, not spot creator/

        it("should get the spot given a review that was created by the spot's creator", function(done) {
            request(app)
                .get("/reviews/" + review1 + "/spot")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    spot1 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                    assert.equal(spot1.creator.username, "6170student");
                    assert.equal(spot1.title, "Bathroom2");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get the spot given a review that was not created by the spot's creator", function(done) {
            request(app)
                .get("/reviews/" + review2 + "/spot")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    spot1 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                    assert.equal(spot1.creator.username, "6170student");
                    assert.equal(spot1.title, "Bathroom2");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not get any spots for an invalid review", function(done) {
            request(app)
                .get("/reviews/684e0a9766d6ce2b48bca79e/spot")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such review with that id!");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /reviews/:reviewId", function() {
        // logged in: true/, false/
        // review: valid/, invalid/
        // review upon creation/, review after creation/
        // user: creator/, not creator/
        // upvote: true/, false/
        // first time upvote for user/
        // second time trying to upvote vote a spot that was previously upvoted by a user
        it("should upvote a review", function(done) {
            request(app)
                .post("/reviews/" + review1)
                .set({ "cookie": cookie2 })
                .send({
                    "upvote": true
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, true);
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should downvote the same review but different user", function(done) {
            request(app)
                .post("/reviews/" + review1)
                .set({ "cookie": cookie3 })
                .send({
                    "upvote": false
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, true);
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should upvote a different review", function(done) {
            request(app)
                .post("/reviews/" + review2)
                .set({ "cookie": cookie })
                .send({
                    "upvote": true
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, true);
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able upvote a review while not logged in", function(done) {
            request(app)
                .post("/reviews/" + review5)
                .send({
                    "upvote": true
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able upvote an invalid review", function(done) {
            request(app)
                .post("/reviews/684e0a9766d6ce2b48bca79e")
                .send({
                    "upvote": true
                })
                .set({ "cookie": cookie })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such review with that id!");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able to upvote/downvote own review", function(done) {
            request(app)
                .post("/reviews/" + review1)
                .set({ "cookie": cookie })
                .send({
                    "upvote": true
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You cannot upvote your own review!");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able to upvote/downvote same review", function(done) {
            request(app)
                .post("/reviews/" + review1)
                .set({ "cookie": cookie2 })
                .send({
                    "upvote": false
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function(res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You have already voted on this review!");
                })
                .end(function(err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});
