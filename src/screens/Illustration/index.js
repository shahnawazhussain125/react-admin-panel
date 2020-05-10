import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import { Typography, Button, Row, Col } from "antd";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";
import { illustrationInputValidation } from "../../utilities/validation";
import ValidationInput from "../../components/ValidationInput";
import SideMenu from "../../components/sideMenu";

export default class Illustration extends Component {
  constructor() {
    super();
    this.state = {
      illustrators: [],
      currentIndex: 0,
      I0_ID_Illustrator: "",
      I_IllustratorName: "",
      I_isIllustratorHidden: false,
      isAddNew: false,
      isLoading: true,
      is_error: null,
      validation_error: null,
    };
  }

  getAllIllustrator = () => {
    let illustrators = [];
    firebase
      .firestore()
      .collection("Illustrators")
      .orderBy("I_IllustratorName", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          illustrators.push({
            I0_ID_Illustrator_WEB: doc.id,
            I0_ID_Illustrator: doc.data()?.I0_ID_Illustrator,
            I_IllustratorName: doc.data()?.I_IllustratorName,
            I_isIllustratorHidden: doc.data()?.I_isIllustratorHidden,
          });
        });
        this.setState({
          illustrators,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getAllIllustrator();
  }

  handleNext = () => {
    const { currentIndex, illustrators } = this.state;
    if (currentIndex < illustrators?.length - 1) {
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
    this.getAllIllustrator();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      isEdit: false,
      I0_ID_Illustrator: "",
      I_IllustratorName: "",
      I_isIllustratorHidden: false,
    });
  };

  handleSaveData = () => {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      I_isIllustratorHidden,
      illustrators,
    } = this.state;

    const { is_error, validation_error } = illustrationInputValidation({
      I0_ID_Illustrator,
      I_IllustratorName,
      I_isIllustratorHidden,
      illustrators,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        firebase
          .firestore()
          .collection("Illustrators")
          .add({
            I0_ID_Illustrator,
            I_IllustratorName,
            I_isIllustratorHidden,
          })
          .then(() => {
            notify.show("Owner has been successfully added", "success", 2000);
            this.setState({
              I0_ID_Illustrator: "",
              I_IllustratorName: "",
              I_isIllustratorHidden: false,
              isAddNew: false,
            });
            this.getAllIllustrator();
          })
          .catch((error) => {
            notify.show(`Error! ${error.message}`, "error", 2000);
          });
      }
    });
  };

  handleOnUpdate = () => {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      I_isIllustratorHidden,
      illustrators,
      I0_ID_Illustrator_WEB,
      currentIndex,
    } = this.state;

    const { is_error, validation_error } = illustrationInputValidation({
      I0_ID_Illustrator,
      I_IllustratorName,
      I_isIllustratorHidden,
      illustrators: illustrators.filter(
        (value, index) => index !== currentIndex
      ),
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        firebase
          .firestore()
          .collection("Illustrators")
          .doc(I0_ID_Illustrator_WEB)
          .update({
            I0_ID_Illustrator,
            I_IllustratorName,
            I_isIllustratorHidden,
          })
          .then(() => {
            firebase
              .firestore()
              .collection("Tales")
              .where("I0_ID_Illustrator_WEB", "==", I0_ID_Illustrator_WEB)
              .get()
              .then((response) => {
                let updateDocumentPromise = [];

                response.forEach((doc) => {
                  updateDocumentPromise.push(
                    firebase
                      .firestore()
                      .collection("Tales")
                      .doc(doc.id)
                      .update({
                        I0_ID_Illustrator,
                        I_IllustratorName,
                        I_isIllustratorHidden,
                        I0_ID_Illustrator_WEB,
                      })
                  );
                });

                Promise.all(updateDocumentPromise)
                  .then(() => {
                    notify.show(
                      "Illustrator has been successfully updated",
                      "success",
                      2000
                    );

                    illustrators[currentIndex] = {
                      I0_ID_Illustrator,
                      I_IllustratorName,
                      I_isIllustratorHidden,
                      I0_ID_Illustrator_WEB,
                    };

                    this.setState({
                      I0_ID_Illustrator: "",
                      I_IllustratorName: "",
                      I0_ID_Illustrator_WEB: "",
                      I_isIllustratorHidden: false,
                      isAddNew: false,
                      isEdit: false,
                      illustrators,
                    });
                  })
                  .catch((error) => {
                    notify.show(`Error! ${error.message}`, "error", 2000);
                  });
              })
              .catch((error) => {
                notify.show(`Error! ${error.message}`, "error", 2000);
              });
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
      I0_ID_Illustrator,
      I_IllustratorName,
      I_isIllustratorHidden,
      isAddNew,
      illustrators,
      currentIndex,
      validation_error,
      isEdit,
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
              currentIndex={currentIndex}
              noOfDocument={illustrators.length}
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
              <Typography
                style={{
                  fontSize: 20,
                }}
              >
                {isEdit ? "Update Illustrator" : "Add New Illustrator"}
              </Typography>
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
                    <Typography style={{ fontSize: 15, fontWeight: "bold" }}>
                      I_IllustratorName
                    </Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="text"
                      key={1}
                      name="I_IllustratorName"
                      value={I_IllustratorName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.I_IllustratorName}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>L0_ID_Language</Typography>
                  </Col>
                  <Col span={14}>
                    <ValidationInput
                      type="number"
                      key={0}
                      name="I0_ID_Illustrator"
                      value={I0_ID_Illustrator}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.I0_ID_Illustrator}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>I_isIllustratorHidden</Typography>
                  </Col>
                  <Col span={14}>
                    <Checkbox
                      key={3}
                      checked={I_isIllustratorHidden}
                      onChange={() =>
                        this.setState({
                          I_isIllustratorHidden: !I_isIllustratorHidden,
                        })
                      }
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
                  {isEdit ? (
                    <Button
                      style={{ marginLeft: 10 }}
                      type="primary"
                      onClick={() => {
                        this.handleOnUpdate();
                      }}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      style={{ marginLeft: 10 }}
                      type="primary"
                      onClick={() => {
                        this.handleSaveData();
                      }}
                    >
                      Save
                    </Button>
                  )}
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
                    <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                      I_IllustratorName
                    </Typography>
                  </Col>
                  <Col span={14}>
                    <Typography
                      className="ant-input"
                      ellipsis={{ rows: 3, expandable: true }}
                    >
                      {illustrators[currentIndex]?.I_IllustratorName}
                    </Typography>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>I0_ID_Illustrator</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography
                      className="ant-input"
                      ellipsis={{ rows: 3, expandable: true }}
                    >
                      {illustrators[currentIndex]?.I0_ID_Illustrator}
                    </Typography>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>I0_ID_Illustrator_WEB</Typography>
                  </Col>
                  <Col span={14}>
                    <Typography
                      className="ant-input"
                      ellipsis={{ rows: 3, expandable: true }}
                    >
                      {illustrators[currentIndex]?.I0_ID_Illustrator_WEB}
                    </Typography>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Typography>I_isIllustratorHidden</Typography>
                  </Col>
                  <Col span={14}>
                    <Checkbox
                      checked={
                        illustrators[currentIndex]?.I_isIllustratorHidden
                      }
                    />
                  </Col>
                </Row>

                <Row style={{ marginTop: 10 }}>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    onClick={() => {
                      this.setState({
                        isAddNew: true,
                        isEdit: true,
                        ...illustrators[currentIndex],
                      });
                    }}
                  >
                    Edit
                  </Button>
                </Row>
              </div>
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}
