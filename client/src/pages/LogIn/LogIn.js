import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import Wrapper from "../../components/Wrapper"
import LogInForm from "../../components/LogInForm";
import NavBar from "../../components/NavBar";

const axios = require("axios");

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      loginUserName: '',
      loginPassword: '',
      // redirectTo: null,
    };
    this.handleSubmit = this.handleSubmit.bind();
    this.handleChange = this.handleChange.bind();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log(this.state);
    
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let currentURL = window.location.origin;
    currentURL = "http://localhost:3001/auth/login" ? "http://localhost:3000/auth/login" : window.location.origin;

    if (this.state.loginPassword && this.state.loginUserName) {
      let userLogin = {
        userName: this.state.loginUserName,
        password: this.state.loginPassword,
      }

      axios
        .post(currentURL, userLogin)
        .then(response => {
          console.log(response);
          if (!response.data.errmsg) {
            console.log('success')
            // this.setState({
            //   redirectTo: `/user/${this.state.userName}`
            // });
          } else {
            console.log('error logging in')
          }
        })
    }
  }

  render() {
    // if (this.state.redirectTo) {
    //   return <Redirect to={{ pathname: this.state.redirectTo }} />
    // }
    return (
      <div>
        <Wrapper>
          <NavBar />
          <LogInForm 
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit} 
          />
        </Wrapper>
      </div>
    )
  }
}

export default LogIn;
