import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";

export default class Illustration extends Component {
  constructor() {
    super();
    this.state = {
      owners: [],
      currentIndex: 0,
      O0_ID_Owner: null,
      O_Company: null,
      O_Web: null,
      O_ContactName: null,
      O_ContactEmail: null,
      O_ContactTel: null,
      isAddNew: false,
      isLoading: true,
    };
  }

  getAllLanguage = () => {
    let owners = [];
    firebase
      .firestore()
      .collection("Owners")
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
      O0_ID_Owner: null,
      O_Company: null,
      O_Web: null,
      O_ContactName: null,
      O_ContactEmail: null,
      O_ContactTel: null,
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
    } = this.state;
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
          O0_ID_Owner: null,
          O_Company: null,
          O_Web: null,
          O_ContactName: null,
          O_ContactEmail: null,
          O_ContactTel: null,
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
      O0_ID_Owner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      isAddNew,
      owners,
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
              <p>O0_ID_Owner</p>
              <input
                key={1}
                value={O0_ID_Owner}
                onChange={(e) => this.setState({ O0_ID_Owner: e.target.value })}
              />
            </div>

            <div className="row">
              <p>O_Company</p>
              <input
                key={2}
                value={O_Company}
                onChange={(e) => this.setState({ O_Company: e.target.value })}
              />
            </div>
            <div className="row">
              <p>O_Web</p>
              <input
                key={3}
                value={O_Web}
                onChange={(e) => this.setState({ O_Web: e.target.value })}
              />
            </div>
            <div className="row">
              <p>O_ContactName</p>
              <input
                key={4}
                value={O_ContactName}
                onChange={(e) =>
                  this.setState({ O_ContactName: e.target.value })
                }
              />
            </div>
            <div className="row">
              <p>O_ContactEmail</p>
              <input
                key={5}
                value={O_ContactEmail}
                onChange={(e) =>
                  this.setState({ O_ContactEmail: e.target.value })
                }
              />
            </div>
            <div className="row">
              <p>O_ContactTel</p>
              <input
                key={6}
                value={O_ContactTel}
                onChange={(e) =>
                  this.setState({ O_ContactTel: e.target.value })
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
              <p>O0_ID_Owner</p>
              <input value={owners[currentIndex]?.O0_ID_Owner} />
            </div>
            <div className="row">
              <p>O0_ID_Owner_WEB</p>
              <input value={owners[currentIndex]?.O0_ID_Owner_WEB} />
            </div>
            <div className="row">
              <p>O_Company</p>
              <input value={owners[currentIndex]?.O_Company} />
            </div>
            <div className="row">
              <p>O_Web</p>
              <input value={owners[currentIndex]?.O_Web} />
            </div>
            <div className="row">
              <p>O_ContactName</p>
              <input value={owners[currentIndex]?.O_ContactName} />
            </div>
            <div className="row">
              <p>O_ContactEmail</p>
              <input value={owners[currentIndex]?.O_ContactEmail} />
            </div>
            <div className="row">
              <p>O_ContactTel</p>
              <input value={owners[currentIndex]?.O_ContactTel} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
