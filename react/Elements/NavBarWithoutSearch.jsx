// @author: Bob Liang

import React from 'react';
import Services from '../../services/index.js'
import {Button, ButtonToolbar, Navbar, Nav, FormGroup, FormControl} from 'react-bootstrap';

export default class NavBarWithoutSearch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          currentUser:"",
          currentId:"blah",
        };
    }

    componentDidMount() {
      Services.user.getCurrentUser().then((resp) => {
        this.setState({currentUser:resp.content.user});
        if (resp.content.userObject) {
          this.setState({currentUserId: resp.content.userObject._id});
        }
      });
    }

    render(){
      var logoutMessage = (<div>
        <Navbar.Form pullRight>
        <ButtonToolbar>
        <Button bsStyle="danger" id="logout-button"
            onClick={() => {Services.user.logout().then(() => {location.reload();}); }}>Logout</Button> &nbsp;
        <Button bsStyle="info" id="profile-button" onClick={() => {window.location = '/profile/' + user_id;}}>Profile</Button>
        </ButtonToolbar>
        </Navbar.Form><Navbar.Text pullRight>Hello, {this.state.currentUser}! &nbsp; </Navbar.Text></div>);
      var loginButtons =
      (<Navbar.Form pullRight>
        <ButtonToolbar>
        <Button bsStyle="primary" id="login-button" onClick={() => {window.location = '/login';}}>Login</Button> &nbsp;
        <Button bsStyle="info" id="register-button" onClick={() => {window.location = '/register';}}>Register</Button>
        </ButtonToolbar>
      </Navbar.Form>);
        var user_id = this.state.currentUserId;
        return (
            <Navbar id='nav-bar' fluid staticTop>
              <Navbar.Header>
                <Navbar.Brand>
                  <a className="sweet-spots-heading" href="/">Sweet Spots</a>
                </Navbar.Brand>
              </Navbar.Header>
              {(this.state.currentUser) ? logoutMessage : loginButtons}
            </Navbar>
        );
    }
};
