import React, { Component } from "react";
import firebase from "../../config/firebase";
import { Typography, Button, Row, Col } from "antd";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import ValidationInput from "../../components/ValidationInput";
import { languageInputValidation } from "../../utilities/validation";

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
      <div className="container">
        <Notifications />
        {!isAddNew && (
          <Headers
            handleAddNew={this.handleAddNew}
            handleNext={this.handleNext}
            handlePrevious={this.handlePrevious}
            handleReload={this.handleReload}
          />
        )}
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
              <p>L0_ID_Language</p>
              <ValidationInput
                type="number"
                key={0}
                name="L0_ID_Language"
                value={L0_ID_Language}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.L0_ID_Language}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>L_LanguageName</p>
              <ValidationInput
                type="text"
                key={1}
                name="L_LanguageName"
                value={L_LanguageName}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.L_LanguageName}
              />
            </div>
            <div style={{ display: "flex" }}>
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
              <Typography>L0_ID_Language</Typography>
              <input defaultValue={languages[currentIndex]?.L0_ID_Language} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Typography>L0_ID_Language_WEB</Typography>
              <input
                defaultValue={languages[currentIndex]?.L0_ID_Language_WEB}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                L_LanguageName
              </Typography>
              <input defaultValue={languages[currentIndex]?.L_LanguageName} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
