import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import { Typography, Button, Row, Col } from "antd";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";
import { illustrationInputValidation } from "../../utilities/validation";
import ValidationInput from "../../components/ValidationInput";

export default class Illustration extends Component {
  constructor() {
    super();
    this.state = {
      illustrators: [],
      currentIndex: 0,
      I0_ID_Illustrator: "",
      I_IllustratorName: "",
      _isIllustratorHidden: false,
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
      .orderBy("I0_ID_Illustrator", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          illustrators.push({
            I0_ID_Illustrator_WEB: doc.id,
            I0_ID_Illustrator: doc.data()?.I0_ID_Illustrator,
            I_IllustratorName: doc.data()?.I_IllustratorName,
            _isIllustratorHidden: doc.data()?._isIllustratorHidden,
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
      I0_ID_Illustrator: "",
      I_IllustratorName: "",
      _isIllustratorHidden: false,
    });
  };

  handleSaveData = () => {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
      illustrators,
    } = this.state;

    const { is_error, validation_error } = illustrationInputValidation({
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
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
            _isIllustratorHidden,
          })
          .then(() => {
            notify.show("Owner has been successfully added", "success", 2000);
            this.setState({
              I0_ID_Illustrator: "",
              I_IllustratorName: "",
              _isIllustratorHidden: false,
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

  handleOnChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
      isAddNew,
      illustrators,
      currentIndex,
      validation_error,
    } = this.state;
    return (
      <div className="container">
        <Notifications />
        <Headers
          handleAddNew={this.handleAddNew}
          handleNext={this.handleNext}
          handlePrevious={this.handlePrevious}
          handleReload={this.handleReload}
        />
        {isAddNew ? (
          <div
            style={{
              backgroundColor: "#EBEAFF",
              width: "30%",
              margin: 20,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>I0_ID_Illustrator</p>
              <ValidationInput
                type="number"
                key={0}
                name="I0_ID_Illustrator"
                value={I0_ID_Illustrator}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.I0_ID_Illustrator}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>I_IllustratorName</p>
              <ValidationInput
                type="text"
                key={1}
                name="I_IllustratorName"
                value={I_IllustratorName}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.I_IllustratorName}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>_isIllustratorHidden</p>
              <Checkbox
                key={3}
                checked={_isIllustratorHidden}
                onChange={() =>
                  this.setState({
                    _isIllustratorHidden: !_isIllustratorHidden,
                  })
                }
              />
            </div>

            <div>
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
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#EBEAFF",
              width: "30%",
              margin: 20,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>I0_ID_Illustrator</p>
              <input
                defaultValue={illustrators[currentIndex]?.I0_ID_Illustrator}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>I0_ID_Illustrator_WEB</p>
              <input
                defaultValue={illustrators[currentIndex]?.I0_ID_Illustrator_WEB}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>I_IllustratorName</p>
              <input
                defaultValue={illustrators[currentIndex]?.I_IllustratorName}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>_isIllustratorHidden</p>
              <Checkbox
                checked={illustrators[currentIndex]?._isIllustratorHidden}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
