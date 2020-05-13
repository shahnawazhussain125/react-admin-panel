import React, { Component } from "react";
import { Row, Col, Button, Input, Spin } from "antd";
import firebase from "../../config/firebase";
import "antd/dist/antd.css";
import "./index.css";
import Notification, { notify } from "react-notify-toast";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let history = this.props.history;
    let location = this.props.history?.location;

    let { from } = location?.state || { from: { pathname: "/tables" } };

    const { email, password } = this.state;

    let test = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

    if (test === false) {
      alert("Please enter a valid email");
    } else if (password.trim().length <= 0) {
      alert("Please enter password");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          if (response.user.email === "admin@admin.com") {
            localStorage.setItem("admin", JSON.stringify(response.user));
            history.replace(from);
          } else {
            notify.show(
              "You do not have permission. Only admin can use it",
              "warning",
              2000
            );
          }
        })
        .catch((error) => {
          notify.show("Error!" + error.message, "error", 2000);
        });
    }
  };

  handeTextChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="login-div">
        <Notification />
        <Row
          type="flex"
          justify="center"
          id="vh100"
          className="login-container"
        >
          <Col xxl={5} xl={6} lg={7} md={9} sm={14} xs={22}>
            <Row className="row-login-box">
              <Row className="input-email" type="flex" justify="center">
                <Input
                  placeholder="Email"
                  name="email"
                  onChange={this.handeTextChange}
                  value={this.state.email}
                />
              </Row>
              <Row className="input-password" type="flex" justify="center">
                <Input
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  name="password"
                  onChange={this.handeTextChange}
                />
              </Row>

              <Row className="row-signin-button" type="flex" justify="center">
                <Button onClick={this.handleSubmit}>Sign in</Button>
              </Row>
            </Row>
          </Col>
          {false ? (
            <Spin
              tip="Loading..."
              size="large"
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 10,
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            ></Spin>
          ) : null}
        </Row>
      </div>
    );
  }
}

export default Login;
