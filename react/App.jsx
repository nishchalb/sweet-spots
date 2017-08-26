//import Services from '../services';
import NavBar from './Elements/NavBar.jsx';
import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Main from "./Pages/Main.jsx";
import SpotDetails from "./Pages/SpotDetails.jsx";

export default class App extends React.Component {
  render(){
    var reviews = [];
    return (
      <div>
        <Main />
      </div>
    );

  }
}
