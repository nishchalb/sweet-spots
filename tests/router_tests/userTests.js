// @author: Maryam Archie

var assert = require("assert");
var request = require("supertest");
var mongoose = require("mongoose");
var app = require("../../app");

// Reset our mongoose collections so that the tests can run successfully.
for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function () { });
}

var cookie, cookie2, cookie3;
var user6170, userStudent, userOther;

describe("Users", function () {
    describe("POST /users", function () {
        // unique username, duplicate, existing, invalid (whitespace, length)
        // unique email, duplicate, existing, invalid 
        // invalid password
        it("should create a valid new user", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "6170student", "email": "6170@mit.edu", "password": "6170" })
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

        it("should create another valid new user", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "student", "email": "stud@mit.edu", "password": "studley" })
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

        it("should create yet another valid new user", function (done) {
            this.timeout(3000);
            request(app)
                .post("/users")
                .send({ "username": "dude", "email": "dude@mit.edu", "password": "dude" })
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

        it("should not create a user with an already taken username", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "6170student", "email": "blah@mit.edu", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "This email/username is already in use. Please login or register with a new email/username.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with an already taken email", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "blah", "email": "6170@mit.edu", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "This email/username is already in use. Please login or register with a new email/username.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with username less than 3 characters", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "a", "email": "617@mit.edu", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Usernames must be between 3 and 15 non-whitespace characters.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with username greater than 15 characters", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "benbitdiddle2020", "email": "617@mit.edu", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Usernames must be between 3 and 15 non-whitespace characters.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with username with only whitespaces", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "   ", "email": "617@mit.edu", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Usernames must be between 3 and 15 non-whitespace characters.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with a non-MIT email", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "allstar", "email": "all@star.com", "password": "6170" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Please use a valid MIT email.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with a password less than 3 characters", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "borns", "email": "borns@mit.edu", "password": "bs" })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Passwords must be at least 3 non-whitespace characters.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not create a user with a password with only whitespaces", function (done) {
            request(app)
                .post("/users")
                .send({ "username": "whitespace", "email": "whitespace@mit.edu", "password": "         " })
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Passwords must be at least 3 non-whitespace characters.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /users/login", function () {
        // [(valid, valid), (invalid, valid), (valid, invalid), (invalid, invalid)] email, password
        // user already logged in or not
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

        it("should not log a user with an invalid email", function (done) {
            request(app)
                .post("/users/login")
                .send({ "email": "wrong@mit.edu", "password": "6170" })
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

        it("should not log a valid user with incorrect password", function (done) {
            request(app)
                .post("/users/login")
                .send({ "email": "6170@mit.edu", "password": "wrong" })
                .expect(403)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Wrong password. Try again.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not log in a valid user in while another is logged in already", function (done) {
            request(app)
                .post("/users/login")
                .set({ "cookie": cookie })
                .send({ "email": "stud@mit.edu", "password": "studley" })
                .expect(403)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "6170@mit.edu is currently signed in. To sign in to a different account, first logout this account.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not login without email", function (done) {
            request(app)
                .post("/users/login")
                .send({ "password": "foo" })
                .expect(400)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Email or password not provided.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not login without password", function (done) {
            request(app)
                .post("/users/login")
                .send({ "username": "bar@mit.edu" })
                .expect(400)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "Email or password not provided.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /users/", function () {
        // logged in, not logged in
        it("should get the current user while logged in", function (done) {
            request(app)
                .get("/users")
                .set({ "cookie": cookie })
                .expect(200)
                .expect(function (res) {
                    user6170 = res.body.content.userObject;
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.loggedIn, true);
                    assert.equal(res.body.content.user, "6170@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get the current user while logged into another account", function (done) {
            request(app)
                .get("/users")
                .set({ "cookie": cookie2 })
                .expect(200)
                .expect(function (res) {
                    userStudent = res.body.content.userObject;
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.loggedIn, true);
                    assert.equal(res.body.content.user, "stud@mit.edu");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get the current user while logged into yet another account", function (done) {
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

        it("should not get invalid user", function (done) {
            request(app)
                .get("/users")
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.content.loggedIn, false);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("GET /users/:userId", function () {
        // valid id, invalid id
        it("should get the user given an id", function (done) {
            request(app)
                .get("/users/" + user6170._id)
                .expect(200)
                .expect(function (res) {
                    var user = res.body.content.user;
                    assert.equal(res.body.success, true);
                    assert.equal(user.email, "6170@mit.edu");
                    assert.equal(user.username, "6170student");
                    assert.equal(user.rep, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get other user given an id", function (done) {
            request(app)
                .get("/users/" + userStudent._id)
                .expect(200)
                .expect(function (res) {
                    var user = res.body.content.user;
                    assert.equal(res.body.success, true);
                    assert.equal(user.email, "stud@mit.edu");
                    assert.equal(user.username, "student");
                    assert.equal(user.rep, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should get other user given an id", function (done) {
            request(app)
                .get("/users/" + userOther._id)
                .expect(200)
                .expect(function (res) {
                    var user = res.body.content.user;
                    assert.equal(res.body.success, true);
                    assert.equal(user.email, "dude@mit.edu");
                    assert.equal(user.username, "dude");
                    assert.equal(user.rep, 0);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not get invalid user", function (done) {
            request(app)
                .get("/users/084b29dd9319ba1e60c0925d")
                .expect(404)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    describe("POST /users/logout", function () {
        // logout if signed in, not logout otherwise
        it("should log out with valid cookie", function (done) {
            request(app)
                .post("/users/logout")
                .set({ "cookie": cookie })
                .expect(200)
                .expect(function (res) {
                    assert.equal(res.body.success, true);
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not log out with invalid cookie", function (done) {
            request(app)
                .post("/users/logout")
                .set({ "cookie": cookie })
                .expect(403)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });

        it("should not log out without a cookie", function (done) {
            request(app)
                .post("/users/logout")
                .expect(403)
                .expect(function (res) {
                    assert.equal(res.body.success, false);
                    assert.equal(res.body.err, "To use this feature, please sign in or register.");
                })
                .end(function (err, res) {
                    if (err) done(err);
                    else done();
                });
        });
    });
});