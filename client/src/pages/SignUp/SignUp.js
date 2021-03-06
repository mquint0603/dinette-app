import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../components/Wrapper"
import SignUpForm from "../../components/SignUpForm"

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      zipcode: '',
      redirectTo: null,
    };
    this.handleSubmit = this.handleSubmit.bind();
    this.handleChange = this.handleChange.bind();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });    
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.password === this.state.confirmPassword) {
      let newUser = {
        userName: this.state.userName,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        zipcode: this.state.zipcode,
      }

      console.log(newUser);

      axios
        .post("/auth/signup", newUser)
        .then(response => {

          if (!response.data.errmsg) {
            this.setState({
              redirectTo: window.location.replace("/login"),
            });
          } else {
            console.log('duplicate')
          }
        })
    } 
    else {
      console.log("Passwords don't match");
      
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    }
    return (
      <div>
        <Wrapper>
          <SignUpForm
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            userName={this.state.userName}
            password={this.state.password}
            confirmPassword={this.state.confirmPassword}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            zipcode={this.state.zipcode}
          />
        </Wrapper>
      </div>
    )
  }
}

export default SignUp;
