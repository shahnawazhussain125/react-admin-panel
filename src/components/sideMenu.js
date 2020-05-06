import React from "react";
import { Row, Col } from "antd";
import { UserOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <span>
      <Row>
        <h2>Mesélj nekem</h2>
      </Row>
      <Row>
        <Col>
          <img
            src={require("../image/logo512.png")}
            width={50}
            width={50}
            style={{
              borderRadius: 25,
            }}
          />
        </Col>
        <Col>
          <p>German Aglela</p>
          <p>Aglela@meslinekem.com</p>
        </Col>
      </Row>
      <Row>
        <UserOutlined />
        <p>Usage</p>
      </Row>
      <Row>
        <MenuFoldOutlined />
        <p>Administration</p>
      </Row>
      <Row>
        <ul>
          <li>
            <Link to="tables">Tables</Link>
          </li>
          <li>
            <Link to="auther">Authers</Link>
          </li>
          <li>
            <Link to="illustrator">Illustrators</Link>
          </li>
          <li>
            <Link to="book">Book</Link>
          </li>
          <li>
            <Link to="language">Book Language</Link>
          </li>
          <li>
            <Link to="owner">Book Owner</Link>
          </li>
        </ul>
      </Row>
    </span>
  );
}
