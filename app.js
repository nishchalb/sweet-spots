// @author: Maryam Archie

// Based on app.js from fritter-react

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var logger = require("morgan");

// Require routes
var users = require("./routes/users");
var reviews = require("./routes/reviews");
var tags = require("./routes/tags");
var spots = require("./routes/spots");
var login = require("./routes/login");
var register = require("./routes/register");
var profile = require("./routes/profile");

// Require Users model for Authentication
var Users = require("./models/Users").Users;

// Setting up MongoDB
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/sweetspots");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(callback) {
    console.log("database connected");
});

var app = express();

// Seed db
require("./seeds/seed");

// Set up webpack-hot-middleware for development, express-static for production
if (process.env.NODE_ENV !== "production") {
    console.log("DEVELOPMENT: Turning on WebPack middleware...");
    var webpackDevHelper = require("./hotReload.js");
    app = webpackDevHelper.useWebpackMiddleware(app);
    app.use("/css", express.static(path.join(__dirname, "public/css")));
    app.use("/vendor", express.static(path.join(__dirname, "public/vendor")));
} else {
    console.log("PRODUCTION: Serving static files from /public...");
    app.use(express.static(path.join(__dirname, "public")));
}

// Set up middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine stuff
app.set("view engine", "ejs");
app.set("views", "./views");


// Set up a secret to encrypt cookies
app.use(session({ secret: "sweetspots", resave: true, saveUninitialized: true }));

// // Authentication middleware
app.use(function(req, res, next) {
    if (req.session.email) {
        Users.findUser(req.session.email, function(err, user) {
            if (user) {
                req.currentUser = user;
            } else {
                req.session.destroy();
            }
            next();
        });
    } else {
        next();
    }
});

// Setting up routes
app.use("/users", users);
app.use("/reviews", reviews);
app.use("/tags", tags);
app.use("/spots", spots);
app.use("/login", login);
app.use("/register", register);
app.use("/profile", profile);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err.message);
        res.status(err.status || 500);
        if (res.status === 404) {
            res.render("NotFound");
        } else {
            res.render("InternalServerError");
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (res.status === 404) {
        res.render("NotFound");
    } else {
        res.render("InternalServerError");
    }
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Export our app (so that tests and bin can find it)
module.exports = app;
