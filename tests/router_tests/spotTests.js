// @author: Maryam Archie

var assert = require("assert");
var request = require("supertest");
var mongoose = require("mongoose");
var app = require("../../app");

var cookie, cookie2, cookie3;
var spot1, spot2, spot3, spot4;
var loc = { minLatitude: 41, maxLatitude: 43, minLongitude: -72, maxLongitude: -70 };
var badLoc = { minLatitude: 90, maxLatitude: 91, minLongitude: -2, maxLongitude: -7 };
var userOther;

describe("Set up accounts", function () {
    describe("POST /users/login", function () {
        it("should log a valid user in", function (done) {
            request(app)
                .post("/users/login")
                .send({ "email": "6170@mit.edu", "password": "6170" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "6170@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should log a different valid user in", function (done) {
            request(app)
                .post("/users/login")
                .send({ "email": "stud@mit.edu", "password": "studley" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie2 = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "stud@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should log yet another different valid user in", function (done) {
            request(app)
                .post("/users/login")
                .send({ "email": "dude@mit.edu", "password": "dude" })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.ok(res.headers["set-cookie"]);
                    cookie3 = res.headers["set-cookie"];
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.user, "dude@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get the current user for cookie3", function (done) {
            request(app)
                .get("/users")
                .set({ "cookie": cookie3 })
                .expect(200)
                .expect(function (res) {
                    userOther = res.body.content.userObject;
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.loggedIn, true);
                    assert.equal(res.body.content.user, "dude@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});

describe("Spots", function () {
    describe("GET /spots", function () {
        it("should retrieve an empty list", function (done) {
            request(app)
                .get("/spots")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.deepEqual(res.body.content.spots, []);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /spots", function () {
        // unique title/, duplicate title (err)/, invalid title (err)/
        // unique tags (3)/, duplicate tags(2, 2)/, invalid label (err)/
        // valid review/, invalid description/, invalid rating/
        // floor/, no floor/
        it("should make a valid spot while logged in", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Bathroom2",
                    "location": { latitude: 42.3587203, longitude: -71.094867 },
                    "floor": "2",
                    "label": "Toilet",
                    "description": "Do not look inside",
                    "rating": "2"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    spot1 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should make another valid spot while logged in, no floor", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Best Nap Space",
                    "location": { latitude: 42.3596434, longitude: -71.0924585 },
                    "label": "Nap Space",
                    "description": "dream dream dream",
                    "rating": "5"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    spot2 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should make a valid spot although duplicate label", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie2 })
                .send({
                    "title": "Stata Bathrooms",
                    "location": { latitude: 42.362078, longitude: -71.090551 },
                    "floor": "1",
                    "label": "Toilet",
                    "description": "It uses rain water so the water is kinda brown",
                    "rating": "4"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    spot3 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should make a valid spot with predefined tag", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie2 })
                .send({
                    "title": "Fountain of Youth",
                    "location": { latitude: 42.362078, longitude: -71.090551 },
                    "floor": "1",
                    "label": "Water Fountain",
                    "description": "Crystal clear.",
                    "rating": "5"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    spot4 = res.body.content.spot;
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot because duplicate title", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Stata Bathrooms",
                    "location": { latitude: 42.362078, longitude: -71.090551 },
                    "floor": "0",
                    "label": "Shower",
                    "description": "It's kinda creepy...",
                    "rating": "1"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "A Spot already exists with this title.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a valid spot while not logged in", function (done) {
            request(app)
                .post("/spots")
                .send({
                    "title": "sleep",
                    "location": { latitude: 42.3587203, longitude: -71.094867 },
                    "floor": "2",
                    "label": "sleep",
                    "description": "Do not disturb",
                    "rating": "2"
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with title of length < 3", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "no",
                    "location": { latitude: 42.3596434, longitude: -71.0924585 },
                    "floor": "00",
                    "label": "cry",
                    "description": "bad bad bad",
                    "rating": "0"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "The title must be a unique name between 3 and 20 characters!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with title of length > 20", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "tempor incididunt ut labore et dolore magna aliqua",
                    "location": { latitude: 42.3596434, longitude: -71.0924585 },
                    "floor": "1",
                    "label": "boohoo",
                    "description": "lorem ipsum",
                    "rating": "0"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "The title must be a unique name between 3 and 20 characters!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with label of length < 3", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Short Spot",
                    "location": { latitude: 42.3590434, longitude: -71.0994585 },
                    "floor": "1",
                    "label": "s",
                    "description": "lorem ipsum",
                    "rating": "0"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Tags must be alphanumerics only and must be between 3 and 20 characters long!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with label of length > 20", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Long Spot",
                    "location": { latitude: 42.3590494, longitude: -72.0994585 },
                    "floor": "1",
                    "label": "Lorem ipsum dolor sit amet consectetur adipiscing elit",
                    "description": "lorem ipsum",
                    "rating": "0"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Tags must be alphanumerics only and must be between 3 and 20 characters long!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with description of length > 500", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Vending Machine",
                    "location": { latitude: 44.3590494, longitude: -71.0994285 },
                    "floor": "1",
                    "label": "snack",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "rating": "3"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Description must be less than 500 characters!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with negative rating", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Garbage Dumpsters",
                    "location": { latitude: 44.3590494, longitude: -71.0994285 },
                    "floor": "1",
                    "label": "Garbage",
                    "description": "it kinda stinks...",
                    "rating": "-1"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Rating must be an integer between 0 and 5 inclusive!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not make a spot with rating > 5", function (done) {
            request(app)
                .post("/spots")
                .set({ "cookie": cookie })
                .send({
                    "title": "Barker Library",
                    "location": { latitude: 44.3590494, longitude: -71.0994285 },
                    "floor": "1",
                    "label": "study space",
                    "description": "The 8th floor is really good for teams.",
                    "rating": "10"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Rating must be an integer between 0 and 5 inclusive!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /spots/:spotId/addReview", function () {
        // spot: valid/, invalid/
        // loggedIn: true/, false/
        // descrition: valid/, invalid/
        // rating: valid/, invalid/
        // first time review for spot for user/, 
        // second time trying to review a spot that was previously reviewed by User/
        it("should add valid review to valid spot", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/addReview")
                .set({ "cookie": cookie2 })
                .send({
                    "description": "So gross",
                    "rating": "1"
                })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not add invalid review (description) to valid spot", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/addReview")
                .set({ "cookie": cookie3 })
                .send({
                    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "rating": "1"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Description must be less than 500 characters!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not add invalid review (rating) to valid spot", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/addReview")
                .set({ "cookie": cookie3 })
                .send({
                    "description": "I look fantastic",
                    "rating": "10"
                })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Rating must be an integer between 0 and 5 inclusive!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not add a valid review to an invalid spot", function (done) {
            request(app)
                .post("/spots/5033422e28379e2c046c9112/addReview")
                .set({ "cookie": cookie3 })
                .send({
                    "description": "Screw you all. It's great.",
                    "rating": "5"
                })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such spot with that id!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not add valid review when not logged in", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/addReview")
                .send({
                    "description": "This is most definitely NOT a sweet spot...",
                    "rating": "0"
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able to add another valid review to spot already reviewed by user", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/addReview")
                .set({ "cookie": cookie2 })
                .send({
                    "description": "Can I say again how disgusting it is?",
                    "rating": "0"
                })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You already submitted a review for this spot!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /spots/:spotId/favorite", function () {
        // spot: valid/, invalid/
        // loggedIn: true/, false/
        // first time favorite for spot for user/, 
        // second time trying to favorite a spot that was previously favorited by User/
        it("should favorite a valid spot while logged in", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/favorite")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should favorite a valid spot while logged in as other user", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/favorite")
                .set({ "cookie": cookie3 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should favorite other valid spot while logged in", function (done) {
            request(app)
                .post("/spots/" + spot2._id + "/favorite")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should favorite other valid spot while logged in as other user", function (done) {
            request(app)
                .post("/spots/" + spot2._id + "/favorite")
                .set({ "cookie": cookie3 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should favorite own valid spot", function (done) {
            request(app)
                .post("/spots/" + spot3._id + "/favorite")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not favorite invalid spot while logged in", function (done) {
            request(app)
                .post("/spots/5033422e28379e2c046c9112/favorite")
                .set({ "cookie": cookie })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such spot with that id!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not favorite valid spot while not logged in", function (done) {
            request(app)
                .post("/spots/" + spot3._id + "/favorite")
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not favorite spot that the user has already favorited", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/favorite")
                .set({ "cookie": cookie2 })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You have already favorited this spot!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

    });

    describe("POST /spots/:spotId/report", function () {
        // loggedIn: true/, false/
        // spot: valid/, invalid/
        // loggedIn: true/, false/
        // first time report for spot for user/, 
        // second time trying to report a spot that was previously reported by User
        it("should report a valid spot while logged in", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/report")
                .set({ "cookie": cookie })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should report another valid spot while logged in", function (done) {
            request(app)
                .post("/spots/" + spot2._id + "/report")
                .set({ "cookie": cookie })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should report valid spot while logged in other user", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/report")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not report valid spot while not logged in", function (done) {
            request(app)
                .post("/spots/" + spot3._id + "/report")
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not report invalid spot", function (done) {
            request(app)
                .post("/spots/5033422e28379e2c046c9112/report")
                .set({ "cookie": cookie2 })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such spot with that id!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not report a spot that was previously reported by the same user", function (done) {
            request(app)
                .post("/spots/" + spot1._id + "/report")
                .set({ "cookie": cookie })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You have already reported this spot!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /spots", function () {
        // check each of the following for one spot:
        // title, location, floor, tag,
        // reviews (numReviews, creator [email, username], description, rating, score, numvoters),
        // rating, reports (num)

        it("should get all the spots", function (done) {
            request(app)
                .get("/spots")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.spots.length, 4);
                    spot11 = res.body.content.spots[0];
                    spot22 = res.body.content.spots[1];
                    spot33 = res.body.content.spots[2];
                    assert.equal(spot11.title, spot1.title);
                    assert.deepEqual(spot11.location, spot1.location);
                    assert.equal(spot11.floor, spot1.floor);
                    assert.equal(spot11.tag.label, "toilet");
                    assert.equal(spot11.tag.predefined, false);
                    assert.equal(spot11.reviews.length, 2);
                    assert.equal(spot11.reviews[0].description, "Do not look inside");
                    assert.equal(spot11.reviews[0].rating, 2);
                    assert.equal(spot11.reviews[0].score, 0);
                    assert.equal(spot11.reviews[0].voters.length, 0);
                    assert.equal(spot11.rating, 2);
                    assert.equal(spot11.reports.length, 2);
                    assert.equal(spot22.title, spot2.title);
                    assert.deepEqual(spot22.location, spot2.location);
                    assert.equal(spot22.floor, spot2.floor);
                    assert.equal(spot33.title, spot3.title);
                    assert.deepEqual(spot33.location, spot3.location);
                    assert.equal(spot33.floor, spot3.floor);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /spots/:spotId", function () {
        // get valid spot (logged in, not), check each of the things:
        // title, location, floor, tag (label, predefined),
        // reviews (numReviews, creator, description, rating, score, numvoters),
        // rating, reports (num)
        // invalid spot (err)

        it("should get a spot by id while not logged in", function (done) {
            request(app)
                .get("/spots/" + spot1._id)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    var spot = res.body.content.spot;
                    assert.equal(spot.title, spot1.title);
                    assert.deepEqual(spot.location, spot1.location);
                    assert.equal(spot.floor, spot1.floor);
                    assert.equal(spot.reviews.length, 2);
                    assert.equal(spot.reviews[0].description, "Do not look inside");
                    assert.equal(spot.reviews[0].rating, 2);
                    assert.equal(spot.reviews[0].score, 0);
                    assert.equal(spot.reviews[0].voters.length, 0);
                    assert.equal(spot.reviews[1].creator.username, "student");
                    assert.equal(spot.reviews[1].creator.email, "stud@mit.edu");
                    assert.equal(spot.rating, 2);
                    assert.equal(spot.reports.length, 2);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get a spot by id while logged in", function (done) {
            request(app)
                .get("/spots/" + spot2._id)
                .set({ "cookie": cookie })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    var spot = res.body.content.spot;
                    assert.equal(spot.title, spot2.title);
                    assert.deepEqual(spot.location, spot2.location);
                    assert.equal(spot.floor, spot2.floor);
                    assert.equal(spot.reviews.length, 1);
                    assert.equal(spot.reviews[0].description, "dream dream dream");
                    assert.equal(spot.reviews[0].rating, 5);
                    assert.equal(spot.reviews[0].score, 0);
                    assert.equal(spot.reviews[0].voters.length, 0);
                    assert.equal(spot.reviews[0].creator.username, "6170student");
                    assert.equal(spot.reviews[0].creator.email, "6170@mit.edu");
                    assert.equal(spot.rating, 5);
                    assert.equal(spot.reports.length, 1);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not get spot with invalid id", function (done) {
            request(app)
                .get("/spots/5033422e28379e2c046c9112")
                .set({ "cookie": cookie })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such spot with that id!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /spots/byLocation/:location", function () {
        // no spots, all in specified bounds
        it("should get all the spots in the specified bounds", function (done) {
            request(app)
                .get("/spots/byLocation/" + JSON.stringify(loc))
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.spots.length, 4);
                    spot11 = res.body.content.spots[0];
                    spot22 = res.body.content.spots[1];
                    assert.equal(spot11.title, spot1.title);
                    assert.deepEqual(spot11.location, spot1.location);
                    assert.equal(spot11.floor, spot1.floor);
                    assert.equal(spot11.tag.label, "toilet");
                    assert.equal(spot11.tag.predefined, false);
                    assert.equal(spot11.reviews.length, 2);
                    assert.equal(spot11.reviews[0].description, "Do not look inside");
                    assert.equal(spot11.reviews[0].rating, 2);
                    assert.equal(spot22.title, spot2.title);
                    assert.deepEqual(spot22.location, spot2.location);
                    assert.equal(spot22.floor, spot2.floor);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not retrieve any spots", function (done) {
            request(app)
                .get("/spots/byLocation/" + JSON.stringify(badLoc))
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.spots.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("DELETE /spots/:spotId", function () {
        // spot: valid/, invalid/
        // user: creator/, not creator/
        it("should not be able to delete the spot because not creator", function (done) {
            request(app)
                .delete("/spots/" + spot4._id)
                .set({ "cookie": cookie })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "You do not have access to delete this spot!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able to delete invalid spot", function (done) {
            request(app)
                .delete("/spots/5033422e28379e2c046c9112")
                .set({ "cookie": cookie })
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "No such spot with that id!");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not be able to delete spot while not logged in", function (done) {
            request(app)
                .delete("/spots/" + spot4._id)
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should be able to delete the spot because creator", function (done) {
            request(app)
                .delete("/spots/" + spot4._id)
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});

describe("User Spot methods", function () {
    describe("GET users/:userId/spots", function () {
        // user: valid, invalid
        // numSpots: 0, >0
        it("should retrieve all the spots created by 6170student", function (done) {
            request(app)
                .get("/users/" + spot1.creator + "/spots")
                .set({ "cookie": cookie })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    spot11 = res.body.content.spots[0];
                    spot22 = res.body.content.spots[1];
                    assert.equal(spot11.title, spot1.title);
                    assert.deepEqual(spot11.location, spot1.location);
                    assert.equal(spot11.floor, spot1.floor);
                    assert.equal(spot11.reviews.length, 2);
                    assert.equal(spot11.rating, 2);
                    assert.equal(spot11.reports.length, 2);
                    assert.equal(spot22.title, spot2.title);
                    assert.deepEqual(spot22.location, spot2.location);
                    assert.equal(spot22.floor, spot2.floor);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should retrieve all the spots created by stud@mit.edu", function (done) {
            request(app)
                .get("/users/" + spot3.creator + "/spots")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    spot11 = res.body.content.spots[0];
                    assert.equal(spot11.title, spot3.title);
                    assert.deepEqual(spot11.location, spot3.location);
                    assert.equal(spot11.floor, spot3.floor);
                    assert.equal(spot11.reviews.length, 1);
                    assert.equal(spot11.rating, spot3.rating);
                    assert.equal(spot11.reports.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get no spots for a user who hasn't submitted a spot", function (done) {
            request(app)
                .get("/users/" + userOther._id + "/spots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.spots.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not get any spots for an invalid user", function (done) {
            request(app)
                .get("/users/084b29dd9319ba1e60c0925d/spots")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "User cannot be found.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /users/:userId/favoriteSpots", function () {
        it("should retrieve all the spots favorited by stud@mit.edu", function (done) {
            request(app)
                .get("/users/" + spot3.creator + "/favoriteSpots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.favorites.length, 3);
                    spot11 = res.body.content.favorites[0];
                    spot22 = res.body.content.favorites[1];
                    spot33 = res.body.content.favorites[2];
                    assert.equal(spot11.title, spot1.title);
                    assert.deepEqual(spot11.location, spot1.location);
                    assert.equal(spot22.title, spot2.title);
                    assert.deepEqual(spot22.location, spot2.location);
                    assert.equal(spot33.title, spot3.title);
                    assert.deepEqual(spot33.location, spot3.location);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should retrieve all the spots favorited by dude@mit.edu", function (done) {
            request(app)
                .get("/users/" + userOther._id + "/favoriteSpots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.favorites.length, 2);
                    spot11 = res.body.content.favorites[0];
                    spot22 = res.body.content.favorites[1];
                    assert.equal(spot11.title, spot1.title);
                    assert.deepEqual(spot11.location, spot1.location);
                    assert.equal(spot22.title, spot2.title);
                    assert.deepEqual(spot22.location, spot2.location);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should retrieve all the spots favorited by 6170@mit.edu", function (done) {
            request(app)
                .get("/users/" + spot1.creator + "/favoriteSpots")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.favorites.length, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

    });
});
