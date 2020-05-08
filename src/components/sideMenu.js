import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { UserOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <span>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#EFEFFF",
        }}
      >
        <h2 style={{ color: "#109CF1", marginTop: 21, marginBottom: 25 }}>
          Mesélj nekem!
        </h2>
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "rgba(34, 34, 34, 0.3)",
            marginBottom: 20,
          }}
        ></div>
      </Row>
      <Row style={{ backgroundColor: "#EFEFFF" }}>
        <Col span={7}>
          <img
            src={require("../image/logo512.png")}
            width={50}
            // width={50}
            style={{
              borderRadius: 25,
              marginLeft: 10,
            }}
          />
        </Col>
        <Col span={17}>
          <h4 style={{ marginBottom: -2 }}>German Aglela</h4>
          <h5 style={{ fontSize: 12, color: "rgba(34, 34, 34, 0.4)" }}>
            Aglela@meslinekem.com
          </h5>
        </Col>
      </Row>
      <Row
        style={{ backgroundColor: "#EFEFFF", paddingLeft: 20, paddingTop: 40 }}
      >
        <UserOutlined
          style={{ fontSize: 20, color: "rgba(34, 34, 34, 0.4)" }}
        />
        <h3 style={{ marginLeft: 15, color: "rgba(34, 34, 34, 0.7)" }}>
          Usage
        </h3>
      </Row>
      <Row style={{ backgroundColor: "#EFEFFF", padding: 10 }}>
        <MenuFoldOutlined
          style={{
            fontSize: 20,
            color: "rgba(34, 34, 34, 0.4)",
            marginLeft: 10,
          }}
        />
        <h3 style={{ marginLeft: 15, color: "rgba(34, 34, 34, 0.7)" }}>
          Administration
        </h3>
      </Row>
      <Row
        style={{
          backgroundColor: "#EFEFFF",
          padding: 10,
        }}
      >
        <ul className="link-list">
          <li>
            <Link className="link" to="tables">
              Tables
            </Link>
          </li>
          <li>
            <Link className="link" to="tales">
              Tales
            </Link>
          </li>
          <li>
            <Link className="link" to="auther">
              Authors
            </Link>
          </li>
          <li>
            <Link className="link" to="illustrator">
              Illustrators
            </Link>
          </li>
          <li>
            <Link className="link" to="book">
              Book
            </Link>
          </li>
          <li>
            <Link className="link" to="language">
              Book Language
            </Link>
          </li>
          <li>
            <Link className="link" to="owner">
              Book Owner
            </Link>
          </li>
        </ul>
      </Row>
      <Row style={{ height: 200, backgroundColor: "#EFEFFF" }}></Row>
    </span>
  );
}
