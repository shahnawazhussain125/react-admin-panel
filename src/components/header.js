import React, { Component } from "react";
import {
  CaretLeftOutlined,
  RedoOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Typography, Button } from "antd";

export default class Headers extends Component {
  render() {
    return (
      <div
        className="header"
        style={{
          display: "flex",
          background: "#f5f6f8",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            height: 36,
            width: 36,
            display: "flex",
            marginRight: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
          }}
          onClick={this.props.handlePrevious}
        >
          <CaretLeftOutlined style={{ color: "blue", fontSize: 26 }} />
        </Button>
        <Button
          style={{
            height: 36,
            width: 36,
            display: "flex",
            marginRight: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
          }}
          onClick={this.props.handleReload}
        >
          <RedoOutlined style={{ color: "red", fontSize: 27 }} />
        </Button>
        <Button
          style={{
            height: 36,
            width: 36,
            display: "flex",
            marginRight: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
          }}
          onClick={this.props.handleNext}
        >
          <CaretRightOutlined style={{ color: "blue", fontSize: 26 }} />
        </Button>
        <Button
          style={{
            height: 36,
            width: 36,
            display: "flex",
            marginRight: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
            background: "#BE0012",
          }}
          onClick={this.props.handleAddNew}
        >
          <PlusOutlined style={{ color: "white", fontSize: 27 }} />
        </Button>
      </div>
    );
  }
}
