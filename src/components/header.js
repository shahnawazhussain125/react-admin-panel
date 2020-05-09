import React, { Component } from "react";
import { Typography, Button } from "antd";

export default class Headers extends Component {
  render() {
    return (
      <div
        className="header"
        style={{
          display: "flex",
          background: "#f5f6f8",
          height: 80,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            height: 50,
            width: 50,
            display: "flex",
            marginLeft: 30,
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f6f8",
            padding: 0,
          }}
          onClick={this.props.handlePrevious}
        >
          <img
            src={require("../image/icon_previous.png")}
            width={50}
            height={50}
            style={{
              fill: "red",
            }}
          />
        </Button>
        <Button
          style={{
            height: 50,
            width: 50,
            display: "flex",
            marginLeft: 30,
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f6f8",
            padding: 0,
          }}
          onClick={this.props.handleReload}
        >
          <img
            src={require("../image/icon_update.png")}
            width={50}
            height={50}
            style={{
              fill: "red",
            }}
          />
        </Button>
        <Button
          style={{
            height: 50,
            width: 50,
            display: "flex",
            marginLeft: 30,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            background: "#f5f6f8",
            padding: 0,
          }}
          onClick={this.props.handleNext}
        >
          <img
            src={require("../image/icon_next.png")}
            width={50}
            height={50}
            style={{
              fill: "red",
            }}
          />
        </Button>
        <div
          style={{
            border: "2px solid red",
            height: 50,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 50,
          }}
        >
          <div
            style={{
              border: "2px solid red",
              textAlign: "center",
              width: 25,
            }}
          >
            {Number(this.props.currentIndex) + 1}
          </div>
          <div
            style={{
              border: "2px solid red",
              textAlign: "center",
              width: 25,
            }}
          >
            {this.props.noOfDocument}
          </div>
        </div>
        <Button
          style={{
            height: 50,
            width: 50,
            display: "flex",
            marginLeft: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            background: "#f5f6f8",
            padding: 0,
          }}
          onClick={this.props.handleAddNew}
        >
          <img
            src={require("../image/icon_add.png")}
            width={50}
            height={50}
            style={{
              fill: "red",
            }}
          />
        </Button>
      </div>
    );
  }
}
