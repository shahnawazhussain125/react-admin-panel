import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";

export default class Language extends Component {
  constructor() {
    super();
    this.state = {
      languages: [],
      currentIndex: 0,
      L0_ID_Language: null,
      L0_ID_Language_WEB: null,
      L_LanguageName: null,
      isAddNew: false,
      isLoading: true,
    };
  }

  getAllLanguage = () => {
    let languages = [];
    firebase
      .firestore()
      .collection("Languages")
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
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  };

  handlePrevious = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 });
  };

  handleReload = () => {
    this.getAllLanguage();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      L0_ID_Language: null,
      L_LanguageName: null,
    });
  };

  handleSaveData = () => {
    const { L0_ID_Language, L_LanguageName } = this.state;
    firebase
      .firestore()
      .collection("Languages")
      .add({
        L0_ID_Language,
        L_LanguageName,
      })
      .then(() => {
        notify.show("Language has been successfully added", "success", 2000);
        this.setState({
          L0_ID_Language: null,
          L_LanguageName: null,
          isAddNew: false,
        });
        this.getAllLanguage();
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  render() {
    const {
      L0_ID_Language,
      L_LanguageName,
      isAddNew,
      languages,
      currentIndex,
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
          <div>
            <div className="row">
              <p>L0_ID_Language</p>
              <input
                key={0}
                value={L0_ID_Language}
                onChange={(e) =>
                  this.setState({ L0_ID_Language: e.target.value })
                }
              />
            </div>

            <div className="row">
              <p>L_LanguageName</p>
              <input
                key={2}
                value={L_LanguageName}
                onChange={(e) =>
                  this.setState({ L_LanguageName: e.target.value })
                }
              />
            </div>
            <div>
              <button
                onClick={() => {
                  this.setState({ isAddNew: false });
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  this.handleSaveData();
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="row">
              <p>L0_ID_Language</p>
              <input value={languages[currentIndex]?.L0_ID_Language} />
            </div>
            <div className="row">
              <p>L0_ID_Language_WEB</p>
              <input value={languages[currentIndex]?.L0_ID_Language_WEB} />
            </div>
            <div className="row">
              <p>L_LanguageName</p>
              <input value={languages[currentIndex]?.L_LanguageName} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
