import React, { Component } from "react";
import firebase from "../../config/firebase";
import { Typography, Button, Row, Col } from "antd";
import Notifications, { notify } from "react-notify-toast";
import Headers from "../../components/header";
import ValidationInput from "../../components/ValidationInput";
import { languageInputValidation } from "../../utilities/validation";
import SideMenu from "../../components/sideMenu";
import "./index.css";

export default class Language extends Component {
  constructor() {
    super();
    this.state = {
      languages: [],
      currentIndex: 0,
      L0_ID_Language: "",
      L0_ID_Language_WEB: "",
      L_LanguageName: "",
      isAddNew: false,
      isLoading: true,
      validation_error: null,
      is_error: null,
    };
  }

  getAllLanguage = () => {
    let languages = [];
    firebase
      .firestore()
      .collection("Languages")
      .orderBy("L0_ID_Language", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          languages.push({
            L0_ID_Language_WEB: doc.id,
            L0_ID_Language: doc.data()?.L0_ID_Language,
            L_LanguageName: doc.data()?.L_LanguageName,
          });
        });
        this.setState({
          languages,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getAllLanguage();
  }

  handleNext = () => {
    const { currentIndex, languages } = this.state;
    if (currentIndex < languages?.length - 1) {
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
    this.getAllLanguage();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      L0_ID_Language: "",
      L_LanguageName: "",
    });
  };

  handleSaveData = () => {
    const { L0_ID_Language, L_LanguageName, languages } = this.state;

    const { is_error, validation_error } = languageInputValidation({
      L0_ID_Language,
      L_LanguageName,
      languages,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        firebase
          .firestore()
          .collection("Languages")
          .add({
            L0_ID_Language,
            L_LanguageName,
          })
          .then(() => {
            notify.show(
              "Language has been successfully added",
              "success",
              2000
            );
            this.setState({
              L0_ID_Language: "",
              L_LanguageName: "",
              isAddNew: false,
            });
            this.getAllLanguage();
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
      L0_ID_Language,
      L_LanguageName,
      isAddNew,
      languages,
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
                Add new Language
              </p>
            </Row>
          )}
          <Row>
            {isAddNew ? (
              <div
                style={{
                  width: 500,
                  backgroundColor: "#EBEAFF",
                  margin: 20,
                  padding: 20,
                }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>L0_ID_Language</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="number"
                      key={0}
                      name="L0_ID_Language"
                      value={L0_ID_Language}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.L0_ID_Language}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography style={{ fontWeight: "bold" }}>
                      L_LanguageName
                    </Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="text"
                      key={1}
                      name="L_LanguageName"
                      value={L_LanguageName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.L_LanguageName}
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
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
                  width: 500,
                  backgroundColor: "#EBEAFF",
                  margin: 20,
                  padding: 20,
                }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>L0_ID_Language</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={languages[currentIndex]?.L0_ID_Language}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>L0_ID_Language_WEB</Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={languages[currentIndex]?.L0_ID_Language_WEB}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography style={{ fontWeight: "bold" }}>
                      L_LanguageName
                    </Typography>
                  </Col>
                  <Col span={14}>
                    <input
                      className="ant-input"
                      defaultValue={languages[currentIndex]?.L_LanguageName}
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
