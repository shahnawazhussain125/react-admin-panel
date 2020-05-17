import React from "react";
import { Row, Col } from "antd";
import {
  UserOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import firebase from "../config/firebase";
import Notification, { notify } from "react-notify-toast";

export default function SideMenu(props) {
  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.clear();
        notify.show("Successfully logout", "success", 2000);
        window.location.assign("/");
      })
      .catch((error) => {
        notify.show("Error!" + error.message, "error", 2000);
      });
  };

  return (
    <span>
      <Notification />
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
      <Row style={{ backgroundColor: "#EFEFFF", padding: 10 }}>
        <ul className="link-list">
          <li style={{ marginBottom: 30 }}>
            <Link className="link" to="tables">
              <h4 style={{ color: "#2298FF" }}>Tables</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="tales">
              <h4 style={{ color: "#2298FF" }}>Tales</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="author">
              <h4 style={{ color: "#2298FF" }}>Authors</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="illustrator">
              <h4 style={{ color: "#2298FF" }}>Illustrators</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="book">
              <h4 style={{ color: "#2298FF" }}>Book</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="language">
              <h4 style={{ color: "#2298FF" }}>Book Language</h4>
            </Link>
          </li>
          <li>
            <Link className="link" to="owner">
              <h4 style={{ color: "#2298FF" }}>Book Owner</h4>
            </Link>
          </li>
        </ul>
      </Row>
      <Row style={{ height: 200, backgroundColor: "#EFEFFF" }}>
        <Row
          style={{ backgroundColor: "#EFEFFF", padding: 10, cursor: "pointer" }}
          onClick={() => handleLogout()}
        >
          <LogoutOutlined
            style={{
              fontSize: 20,
              color: "rgba(34, 34, 34, 0.4)",
              marginLeft: 10,
              marginTop: 2,
            }}
          />
          <h3 style={{ marginLeft: 15, color: "rgba(34, 34, 34, 0.7)" }}>
            Logout
          </h3>
        </Row>
      </Row>
    </span>
  );
}
