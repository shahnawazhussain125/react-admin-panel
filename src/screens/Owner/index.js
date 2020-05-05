import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import { Typography, Button, Row, Col } from "antd";
import "./index.css";
import Headers from "../../components/header";
import ValidationInput from "../../components/ValidationInput";
import { ownerInputValidation } from "../../utilities/validation";

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
              <p>O0_ID_Owner</p>
              <ValidationInput
                type="number"
                key={0}
                name="O0_ID_Owner"
                value={O0_ID_Owner}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O0_ID_Owner}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_Company</p>
              <ValidationInput
                type="text"
                key={1}
                name="O_Company"
                value={O_Company}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O_Company}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_Web</p>
              <ValidationInput
                type="url"
                key={2}
                name="O_Web"
                value={O_Web}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O_Web}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactName</p>
              <ValidationInput
                type="text"
                key={3}
                name="O_ContactName"
                value={O_ContactName}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O_ContactName}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactEmail</p>
              <ValidationInput
                type="email"
                key={4}
                name="O_ContactEmail"
                value={O_ContactEmail}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O_ContactEmail}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactTel</p>
              <ValidationInput
                type="tel"
                key={5}
                name="O_ContactTel"
                value={O_ContactTel}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.O_ContactTel}
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
              <p>O0_ID_Owner</p>
              <input defaultValue={owners[currentIndex]?.O0_ID_Owner} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O0_ID_Owner_WEB</p>
              <input defaultValue={owners[currentIndex]?.O0_ID_Owner_WEB} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_Company</p>
              <input defaultValue={owners[currentIndex]?.O_Company} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_Web</p>
              <input defaultValue={owners[currentIndex]?.O_Web} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactName</p>
              <input defaultValue={owners[currentIndex]?.O_ContactName} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactEmail</p>
              <input defaultValue={owners[currentIndex]?.O_ContactEmail} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>O_ContactTel</p>
              <input defaultValue={owners[currentIndex]?.O_ContactTel} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
