//@author Isaac Rosado

var assert = require("assert");
var mongoose = require("mongoose");
require("../../app");
var Users = require("../../models/Users").Users;
var Tags = require("../../models/Tags").Tags;
var Spots = require("../../models/Spots").Spots;
var Reviews = require("../../models/Reviews").Reviews;

for (var i in mongoose.connection.collections) {
	mongoose.connection.collections[i].remove(function () { });
};

var user1, user2;
var tag1;
var review1, review2, review3;
var spot1, spot2;

describe("Users", function () {

	describe("createUser", function () {

		it("should add the user to the database", function (done) {
			Users.createUser("theguy", "theguy@mit.edu", "iamtheguy", function (err, newUser) {
				assert.equal(newUser.username, "theguy");
				assert.equal(newUser.email, "theguy@mit.edu");
				assert.equal(newUser.rep, 0);
				user1 = newUser;
				done();
			});
		});

		it("should add another user to the database", function (done) {
			Users.createUser("DrStrange", "dormammu@mit.edu", "Ivecometobargain", function (err, newUser) {
				assert.equal(newUser.username, "DrStrange");
				assert.equal(newUser.email, "dormammu@mit.edu");
				assert.equal(newUser.rep, 0);
				user2 = newUser;
				done();
			});
		});

		it("should have invalid usernames", function (done) {
			Users.createUser("hi", "hello@mit.edu", "helloworld", function (err, newUser) {
				assert.equal(err.msg, "Usernames must be between 3 and 15 non-whitespace characters.");
				Users.createUser("negasonicteenagewarhead", "angst@mit.edu", "fuuuuu", function (err2, newUser2) {
					assert.equal(err2.msg, "Usernames must be between 3 and 15 non-whitespace characters.");
					Users.createUser("the guy", "whitespace@mit.edu", "iamalsotheguy", function (err3, newUser3) {
						assert.equal(err3.msg, "Usernames must be between 3 and 15 non-whitespace characters.");
						Users.createUser("애교", "cutee@mit.edu", "aegyo", function (err4, newUser4) {
							assert.equal(err4.msg, "Usernames must be between 3 and 15 non-whitespace characters.");
							done();
						});
					});
				});
			});
		});

		it("should have invalid emails", function (done) {
			Users.createUser("dracula", "white space@mit.edu", "transylvania", function (err, newUser) {
				assert.equal(err.msg, "Please use a valid MIT email.");
				Users.createUser("person", "loser@harvard.edu", "richyrich", function (err2, newUser2) {
					assert.equal(err2.msg, "Please use a valid MIT email.");
					done();
				});
			});
		});

		it("should have invalid passwords", function (done) {
			Users.createUser("Drizzy", "drake@mit.edu", "no new friends", function (err, newUser) {
				assert.equal(err.msg, "Passwords must be at least 3 non-whitespace characters.");
				Users.createUser("Gandolf", "shallnotpass@mit.edu", "k", function (err2, newUser2) {
					assert.equal(err2.msg, "Passwords must be at least 3 non-whitespace characters.");
					done();
				});
			});
		});

		it("should not allow the duplicate", function (done) {
			Users.createUser("theguy", "therealguy@mit.edu", "gaisensei", function (err, newUser) {
				assert.equal(err.msg, "This email/username is already in use. Please login or register with a new email/username.");
				Users.createUser("theotherguy", "theguy@mit.edu", "iamanotherguy", function (err2, newUser2) {
					assert.equal(err.msg, "This email/username is already in use. Please login or register with a new email/username.");
					done();
				});
			});
		});

	});

	describe("findUser", function () {

		it("should find the user", function (done) {
			Users.findUser(user1.email, function (err, user) {
				assert.equal(user.username, user1.username);
				assert.equal(user.email, user1.email);
				done();
			});
		});

		it("should not find the user", function (done) {
			Users.findUser("email@mit.edu", function (err, user) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("findUserById", function () {

		it("should find the user", function (done) {
			Users.findUserById(user1.id, function (err, user) {
				assert.equal(user.username, user1.username);
				assert.equal(user.email, user1.email);
				done();
			});
		});

		it("should not find the user", function (done) {
			Users.findUserById(mongoose.Types.ObjectId(), function (err, user) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("validatePassword", function () {

		it("should validate the password", function (done) {
			Users.validatePassword(user1.email, "iamtheguy", function (err, validated) {
				assert.equal(validated, true);
				done();
			});
		});

		it("should not validate the password", function (done) {
			Users.validatePassword(user1.email, "iamnottheguy", function (err, validated) {
				assert.equal(validated, false);
				done();
			});
		});

		it("should not find the user", function (done) {
			Users.validatePassword("notarealemail@mit.edu", "iamtheguy", function (err, validated) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("updateRep", function () {

		it("should add 1 to the user rep", function (done) {
			Users.updateRep(user1.id, true, function (err, user) {
				assert.equal(user.rep, 1);
				done();
			});
		});

		it("should subtract 1 from the user's rep", function (done) {
			Users.updateRep(user1.id, false, function (err, user) {
				assert.equal(user.rep, 0);
				done();
			});
		});

		it("should not find the user", function (done) {
			Users.updateRep(mongoose.Types.ObjectId(), true, function (err, user) {
				assert.equal(err.msg.msg, "User cannot be found.");
				done();
			});
		});

	});

});

describe("Tags", function () {

	describe("addTag", function () {

		it("should add the tag to the database", function (done) {
			Tags.addTag("badass parkour", false, function (err, newTag) {
				assert.equal(newTag.label, "badass parkour");
				assert.equal(newTag.predefined, false);
				tag1 = newTag;
				done();
			});
		});

		it("should not add the tag with an invalid label", function(done) {
			Tags.addTag("&&&", false, function(err, newTag) {
				assert.equal(err.msg, "Tags must be alphanumerics only and must be between 3 and 20 characters long!");
				done();
			});
		});

	});

	describe("addPredefinedTag", function() {

		it("should add the predefined tag to the database", function(done) {
			Tags.addTag("park", true, function(err, newTag) {
				assert.equal(newTag.label, "park");
				assert.equal(newTag.predefined, true);
				done();
			});
		});

	});

	describe("getTagByLabel", function() {

		it("should find and return the tag", function(done) {
			Tags.getTagByLabel(tag1.label, function(err, tag) {
				assert.equal(tag.label, "badass parkour");
				done();
			});
		});

		it("should not find a tag", function(done) {
			Tags.getTagByLabel("hot tub", function(err, tag) {
				assert.equal(err.msg, "No such tag with that label!");
				done();
			});
		});

	});

	describe("getLabels", function() {

		it("should get all the labels that have been created", function(done) {
			Tags.getLabels(function(err, labels) {
				var firstLabel = labels[0];
				var lastLabel = labels[4];
				assert.equal(firstLabel, "bathroom");
				assert.equal(lastLabel, tag1.label);
				done();
			});
		});

	});

	describe("getTags", function() {

		it("should get all the tags", function(done) {
			Tags.getTags(function(err, tags) {
				var firstTag = tags[0];
				var lastTag = tags[4];
				assert.equal(firstTag.label, "bathroom");
				assert.equal(firstTag.predefined, true);
				assert.equal(lastTag.label, tag1.label);
				assert.equal(lastTag.predefined, false);
				done();
			});
		});

	});

});

describe("Reviews", function () {

	describe("addReview", function () {

		it("should add the review to the database", function (done) {
			Reviews.addReview(user1.id, "this spot is pretty chill", 3, function (err, newReview) {
				assert.equal(newReview.creator, user1.id);
				assert.equal(newReview.description, "this spot is pretty chill");
				assert.equal(newReview.rating, 3);
				assert.equal(newReview.score, 0);
				review1 = newReview;
				done();
			});
		});

		it("should add another review to the database", function(done) {
			Reviews.addReview(user1.id, "low key good", 4, function(err, newReview) {
				assert.equal(newReview.creator, user1.id);
				assert.equal(newReview.description, "low key good");
				assert.equal(newReview.rating, 4);
				assert.equal(newReview.score, 0);
				review2 = newReview;
				done();
			});
		});

		it("should add yet another review to the database", function(done) {
			Reviews.addReview(user2.id, "straight up sucked", 1, function(err, newReview) {
				assert.equal(newReview.creator, user2.id);
				assert.equal(newReview.description, "straight up sucked");
				assert.equal(newReview.rating, 1);
				assert.equal(newReview.score, 0);
				review3 = newReview;
				done();
			});
		});

		it("should have an invalid rating", function(done) {
			Reviews.addReview(user1.id, "woah", -1, function(err, newReview) {
				assert.equal(err.msg, "Rating must be an integer between 0 and 5 inclusive!");
				Reviews.addReview(user1.id, "gnarly bro", 6, function(err2, newReview2) {
					assert.equal(err2.msg, "Rating must be an integer between 0 and 5 inclusive!");
					Reviews.addReview(user1.id, "what even is?", 2.5, function(err3, newReview3) {
						assert.equal(err3.msg, "Rating must be an integer between 0 and 5 inclusive!");
						done();
					});
				});
			});
		});

		it("should not find the user", function(done) {
			Reviews.addReview(mongoose.Types.ObjectId(), "best ever", 5, function(err, newReview) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("getReviewById", function() {

		it("should get the review", function(done) {
			Reviews.getReviewById(review1.id, function(err, review) {
				assert.equal(review.id, review1.id);
				assert.equal(review.creator, user1.id);
				assert.equal(review.description, review1.description);
				assert.equal(review.rating, review1.rating);
				done();
			});
		});

		it("should not get the review", function(done) {
			Reviews.getReviewById(mongoose.Types.ObjectId(), function(err, review) {
				assert.equal(err.msg, "No such review with that id!");
				done();
			});
		});

	});

	describe("getReviewsByUser", function() {

		it("should get the reviews from user1", function(done) {
			Reviews.getReviewsByUser(user1.id, function(err, reviews) {
				assert.equal(reviews[0].id, review1.id);
				assert.equal(reviews[1].id, review2.id);
				done();
			});
		});

		it("should get the reviews from user2", function(done) {
			Reviews.getReviewsByUser(user2.id, function(err, reviews) {
				assert.equal(reviews[0].id, review3.id);
				done();
			});
		});

		it("should not get the user", function(done) {
			Reviews.getReviewsByUser(mongoose.Types.ObjectId(), function(err, reviews) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("updateScore", function() {

		it("should increase the score by 1", function(done) {
			Reviews.updateScore(review1.id, user2.id, true, function(err, review) {
				assert.equal(review.score, review1.score + 1);
				done();
			});
		});

		it("should decrease the score by 1", function(done) {
			Reviews.updateScore(review3.id, user1.id, false, function(err, review) {
				assert.equal(review.score, review3.score - 1);
				done();
			});
		});

		it("should not allow the user to upvote their own review", function(done) {
			Reviews.updateScore(review1.id, user1.id, true, function(err, review) {
				assert.equal(err.msg, "You cannot upvote your own review!");
				done();
			});
		});

		it("should not allow the user to upvote more than once", function(done) {
			Reviews.updateScore(review1.id, user2.id, true, function(err, review) {
				assert.equal(err.msg, "You have already voted on this review!");
				Reviews.updateScore(review1.id, user2.id, false, function(err, review) {
					assert.equal(err.msg, "You have already voted on this review!");
					done();
				});
			});
		});

		it("should not find the review", function(done) {
			Reviews.updateScore(mongoose.Types.ObjectId(), user1.id, true, function(err, review) {
				assert.equal(err.msg, "No such review with that id!");
				done();
			});
		});

		it("should not find the user", function(done) {
			Reviews.updateScore(review1.id, mongoose.Types.ObjectId(), true, function(err, review) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

});

describe("Spots", function () {

	describe("addSpot", function () {

		it("should add the spot to the database", function (done) {
			Spots.addSpot("The Spot", user1.id, { latitude: 77.34223, longitude: -34.3243 }, null, "bathroom",
			"this place is dabomb.com", 4, function (err, newSpot) {
				assert.equal(newSpot.title, "The Spot");
				assert.equal(newSpot.creator, user1.id);
				assert.equal(newSpot.location.latitude, 77.34223);
				assert.equal(newSpot.location.longitude, -34.3243);
				assert.equal(newSpot.floor, "1");
				spot1 = newSpot;
				done();
			});
		});

		it("should add the spot but not the tag", function(done) {
			Spots.addSpot("Chill Place", user2.id, { latitude: 74.3242, longitude: -35.3423 }, "2", "badass parkour",
			"pretty chill, we should put definitely put this spot on the map", 3, function(err, newSpot) {
				assert.equal(newSpot.title, "Chill Place");
				assert.equal(newSpot.creator, user2.id);
				assert.equal(newSpot.location.latitude, 74.3242);
				assert.equal(newSpot.location.longitude, -35.3423);
				assert.equal(newSpot.floor, "2");
				spot2 = newSpot;
				done();
			});
		});

		it("should not add the spot nor the tag", function(done) {
			Spots.addSpot("####", user1.id, { latitude: 77.2232, longitude: -34.2342 }, null, "rockclimbing",
			"Makes me feel young again!", 4, function(err, newSpot) {
				assert.equal(err.msg, "The title must be a unique name between 3 and 20 characters!");
				done();
			});
		});

		it("should have an invalid title", function(done) {
			Spots.addSpot("The Spot", user2.id, { latitude: 77.3242, longitude: -34.2343 }, null, "bathroom",
			"qqqqqqq", 4, function(err, newSpot) {
				assert.equal(err.msg, "A Spot already exists with this title.");
				Spots.addSpot("bu", user1.id, { latitude: 55.4354, longitude: -45.3442 }, null, "water fountain",
				"slurp", 2, function(err2, newSpot2) {
					assert.equal(err2.msg, "The title must be a unique name between 3 and 20 characters!");
					Spots.addSpot("XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", user1.id, { latitude: -45.3453, longitude: 23.2342 }, "B", "study space",
					"lolz", 5, function(err3, newSpot3) {
						assert.equal(err3.msg, "The title must be a unique name between 3 and 20 characters!");
						Spots.addSpot("&&%^*", user2.id, { latitude: 77.3243, longitude: -34.2342 }, "7", "nap space",
						"what even is?", 1, function(err4, newSpot4) {
							assert.equal(err4.msg, "The title must be a unique name between 3 and 20 characters!");
							done();
						});
					});
				});
			});
		});

		it("should have an invalid floor", function(done) {
			Spots.addSpot("Puddles", user1.id, { latitude: 77.3423, longitude: -33.2342 }, "Hole", "bathroom",
			"Water literally everywhere", 1, function(err, newSpot) {
				assert.equal(err.msg, "The floor must be alphanumerics and cannot be greater than 3 characters!");
				Spots.addSpot("chamberofsecrets", user2.id, { latitude: 77.2423, longitude: -34.2342 }, "%%", "study space",
				"woah", 4, function(err2, newSpot2) {
					assert.equal(err.msg, "The floor must be alphanumerics and cannot be greater than 3 characters!");
					done();
				});
			});
		});

		it("should not find the user", function(done) {
			Spots.addSpot("Tree", mongoose.Types.ObjectId(), { latitude: 77.3243, longitude: -32.2342 }, null, "park",
			"A really climbable tree", 4, function(err, newSpot) {
				assert.equal(err.msg.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("addReviewToSpot", function () {

		it("should add the review to the spot", function (done) {
			Spots.addReviewToSpot(spot1.id, user2.id, "this place sucks", 1, function (err, spot, review) {
				assert.equal(JSON.stringify(spot.reviews[0]), JSON.stringify(spot1.reviews[0]));
				assert.equal(spot.reviews[1], review.id);
				done();
			});
		});

		it("should not add the review to the spot", function (done) {
			Spots.addReviewToSpot(spot1.id, user2.id, "this place still sucks", 1, function (err, spot, review) {
				assert.equal(err.msg, "You already submitted a review for this spot!");
				done();
			});
		});

		it("should not find the spot", function(done) {
			Spots.addReviewToSpot(mongoose.Types.ObjectId(), user1.id, "truly the bees knees", 5, function(err, spot, review) {
				assert.equal(err.msg, "No such spot with that id!");
				done();
			});
		});

		it("should not find the user", function(done) {
			Spots.addReviewToSpot(spot1.id, mongoose.Types.ObjectId(), "could be better tbh", 2, function(err, spot, review) {
				assert.equal(err.msg.msg, "User cannot be found.");
				done();
			});
		});

	});

	describe("getSpotById", function() {

		it("should return a spot", function(done) {
			Spots.getSpotById(spot1.id, function(err, spot) {
				assert.equal(spot1.id, spot.id);
				assert.equal(spot1.title, spot.title);
				done();
			});
		});

		it("should not return a spot", function(done) {
			Spots.getSpotById(mongoose.Types.ObjectId(), function(err, spot) {
				assert.equal(err.msg, "No such spot with that id!");
				done();
			});
		});

	});

	describe("getSpotsByLocation", function () {

		it("should return a spot", function (done) {
			const RADIUS = .1;
			var latitude = spot1.location.latitude;
			var longitude = spot1.location.longitude;
			Spots.getSpotsByLocation(latitude - RADIUS, latitude + RADIUS, longitude - RADIUS, longitude + RADIUS, function (err, spots) {
				var spot = spots[0];
				assert.equal(spot.title, spot1.title);
				done();
			});
		});

	});

	describe("deleteSpot", function() {

		it("should delete the spot", function(done) {
			Spots.deleteSpot(spot2.id, user2.id, function(err) {
				assert.equal(err, null);
				done();
			});
		});

	});

});

describe("Users", function () {

	describe("favoriteSpot", function () {

		it("should add the spot to favorites", function (done) {
			Users.favoriteSpot(user1.id, spot1.id, function (err, user) {
				assert.equal(user.favorites[0], spot1.id);
				user1 = user;
				done();
			});
		});

		it("should not add the spot to favorites", function (done) {
			Users.favoriteSpot(user1.id, spot1.id, function (err, user) {
				assert.equal(err.msg, "You have already favorited this spot!");
				done();
			});
		});

		it("should not find the spot", function (done) {
			Users.favoriteSpot(user1.id, mongoose.Types.ObjectId(), function (err, user) {
				assert.equal(err.msg, "No such spot with that id!");
				done();
			});
		});

	});

	describe("getFavoriteSpots", function () {

		it("should get the spots the user has favorited", function (done) {
			Users.getFavoriteSpots(user1.id, function (err, favorites) {
				assert.equal(favorites[0].id, spot1.id);
				done();
			});
		});

		it("should not find the user", function (done) {
			Users.getFavoriteSpots(mongoose.Types.ObjectId(), function (err, favorites) {
				assert.equal(err.msg, "User cannot be found.");
				done();
			});
		});

	});

});

describe("Tags", function() {

	describe("getAllTags", function() {

		it("should not have any repeats", function(done) {
			Tags.getTags(function(err, tags) {
				assert.equal(tags.length, 6);
				done();
			});
		});

	});

});