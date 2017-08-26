# Sweet Spots - Team No REST for the Wicked

Sweet Spots is a web application that allows users to map, filter and review points of interest on campus.

Try our app today!
https://sweet-spots.herokuapp.com/

### Installation

1. First, run `npm install` in the root of the project

1. Run `npm start` to build and run a local server

1. navigate to `localhost:3000` to reach the main page

1. At the main page, you can interact with the map and search for things. After you search, changing the map bounds constrains the search to a location. You cannot add spots without logging in.

1. Click the login button or navigate to `/login` to reach the login page. You can
login or click the link to navigate to the register page.

1. Register using an MIT email and choose a username and password. After submitting,
you might have to manually navigate to the `/login` page

1. Login using your email and password

1. Once logged in, you can add spots. Do this by dragging the big marker onto the map.

1. You can also post reviews for spots, upvote and downvote other people's reviews, and favorite spots you like!

### Testing
1. Ensure that you've run `npm install` in the root directory

2. Run `npm test` to run the functional (routes) and unit (model) tests.
Because we seed the database with Tags in `app.js`, we need to use `require` it in the tests. As a result, please ignore the following errors:
```
ERROR in multi main
Module not found: Error: Cannot resolve 'file' or 'directory' ./react/main.js in <path_to>\tests\model_tests
 @ multi main
```

### File Ownership
**Maryam Archie**
+ app.js
+ routes/reviews.js
+ routes/spots.js
+ routes/tags.js
+ routes/users.js
+ seeds/*
+ services/*
+ models/Users.js
+ tests/router_tests/*
+ utils/*
+ webpack.config.js
+ webpack.dev.config.js
+ package.json
+ .gitignore
+ README.md
+ .eslintrc.json
+ .slugignore


**Nishchal Bhandari**
+ public/index.html
+ views/spotDetails.ejs
+ views/login.ejs
+ views/register.ejs
+ react/main.js
+ react/Elements/SweetSpotsMap.jsx
+ react/Pages/Main.jsx (partially)
+ routes/login.js
+ routes/register.js
+ public/js/login.js
+ public/js/register.js
+ public/stylesheets/styles.css

**Bob Liang**
+ react/App.jsx
+ react/Pages/*
+ react/Elements/AddASpot.jsx
+ react/Elements/AddASpotForm.jsx
+ react/Elements/NavBar.jsx
+ react/Elements/NavBarWithoutSearch.jsx
+ react/Elements/SearchResults.jsx
+ views/InternalServerError.ejs
+ views/NotFound.ejs
+ views/profile.ejs
+ views/register.ejs
+ public/stylesheets/styles.css (partially)

**Isaac Rosado**
+ models/Review.js
+ models/Spots.js
+ models/Tags.js
