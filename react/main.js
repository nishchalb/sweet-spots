//@author: Nishchal Bhandari
import React from "react";
import { render } from "react-dom";
import App from "./App.jsx";
import SpotDetails from "./Pages/SpotDetails.jsx";
import Profile from "./Pages/Profile.jsx";
import Bootstrap from '../public/vendor/bootstrap-3.3.7-dist/css/bootstrap.css';

// Figure out what page we are on, and render appropriately
var details = document.getElementById("spot");
var profile = document.getElementById("profile");
if (details) {
  var spotId = details.getAttribute("spot_id");
  render(<SpotDetails spotId = {spotId}/>, details);
} else if (profile) {
  var userId = profile.getAttribute("user_id");
  render(<Profile userId={userId}/>, profile);
} else {
  render(<App />, document.getElementById("main-container"));
}
