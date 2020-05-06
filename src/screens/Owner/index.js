import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import { Typography, Button, Row, Col } from "antd";
import "./index.css";
import Headers from "../../components/header";
import ValidationInput from "../../components/ValidationInput";
import { ownerInputValidation } from "../../utilities/validation";
import SideMenu from "../../components/sideMenu";

export default class Owner extends Component {
  constructor() {
    super();
    this.state = {
      owners: [],
      currentIndex: 0,
      O0_ID_Owner: "",
      O_Company: "",
      O_Web: "",
      O_ContactName: "",
      O_ContactEmail: "",
      O_ContactTel: "",
      isAddNew: false,
      isLoading: true,
    };
  }

  getAllOwners = () => {
    let owners = [];
    firebase
      .firestore()
      .collection("Owners")
      .orderBy("O0_ID_Owner", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          owners.push({
            O0_ID_Owner_WEB: doc.id,
            O0_ID_Owner: doc.data()?.O0_ID_Owner,
            O_Company: doc.data()?.O_Company,
            O_Web: doc.data()?.O_Web,
            O_ContactName: doc.data()?.O_ContactName,
            O_ContactEmail: doc.data()?.O_ContactEmail,
            O_ContactTel: doc.data()?.O_ContactTel,
          });
        });
        this.setState({
          owners,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getAllOwners();
  }

  handleNext = () => {
    const { currentIndex, owners } = this.state;
    if (currentIndex < owners?.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
    }
  };

  handlePrevious = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
    }
  };

  handleReload = () => {
    this.getAllOwners();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      O0_ID_Owner: "",
      O_Company: "",
      O_Web: "",
      O_ContactName: "",
      O_ContactEmail: "",
      O_ContactTel: "",
    });
  };

  handleSaveData = () => {
    const {
      O0_ID_Owner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      owners,
    } = this.state;

    const { is_error, validation_error } = ownerInputValidation({
      O0_ID_Owner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      owners,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        firebase
          .firestore()
          .collection("Owners")
          .add({
            O0_ID_Owner,
            O_Company,
            O_Web,
            O_ContactName,
            O_ContactEmail,
            O_ContactTel,
          })
          .then(() => {
            notify.show("Owner has been successfully added", "success", 2000);
            this.setState({
              O0_ID_Owner: "",
              O_Company: "",
              O_Web: "",
              O_ContactName: "",
              O_ContactEmail: "",
              O_ContactTel: "",
              isAddNew: false,
            });
            this.getAllOwners();
          })
          .catch((error) => {
            notify.show(`Error! ${error.message}`, "error", 2000);
          });
      }
    });
  };

  handleOnChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      O0_ID_Owner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      isAddNew,
      owners,
      currentIndex,
      validation_error,
    } = this.state;
    return (
      <Row>
        <Notifications />
        <Col className="gutter-row" span={4}>
          <SideMenu />
        </Col>
        <Col className="gutter-row" span={20}>
          {!isAddNew ? (
            <Headers
              handleAddNew={this.handleAddNew}
              handleNext={this.handleNext}
              handlePrevious={this.handlePrevious}
              handleReload={this.handleReload}
            />
          ) : (
            <Row
              style={{
                background: "#f5f6f8",
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 20,
                }}
              >
                Add New
              </p>
            </Row>
          )}
          <Row>
            {isAddNew ? (
              <div
                style={{
                  backgroundColor: "#EBEAFF",
                  width: 500,
                  margin: 20,
                  padding: 20,
                }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O0_ID_Owner</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="number"
                      key={0}
                      name="O0_ID_Owner"
                      value={O0_ID_Owner}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O0_ID_Owner}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_Company</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="text"
                      key={1}
                      name="O_Company"
                      value={O_Company}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_Company}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_Web</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="url"
                      key={2}
                      name="O_Web"
                      value={O_Web}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_Web}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactName</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="text"
                      key={3}
                      name="O_ContactName"
                      value={O_ContactName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactName}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactEmail</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="email"
                      key={4}
                      name="O_ContactEmail"
                      value={O_ContactEmail}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactEmail}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactTel</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="tel"
                      key={5}
                      name="O_ContactTel"
                      value={O_ContactTel}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactTel}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    onClick={() => {
                      this.setState({ isAddNew: false });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    onClick={() => {
                      this.handleSaveData();
                    }}
                  >
                    Save
                  </Button>
                </Row>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#EBEAFF",
                  width: 500,
                  margin: 20,
                  padding: 20,
                }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O0_ID_Owner</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O0_ID_Owner}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O0_ID_Owner_WEB</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O0_ID_Owner_WEB}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_Company</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O_Company}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_Web</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O_Web}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactName</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O_ContactName}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactEmail</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O_ContactEmail}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>O_ContactTel</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={owners[currentIndex]?.O_ContactTel}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}
