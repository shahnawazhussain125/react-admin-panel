import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";
import ValidationInput from "../../components/ValidationInput";
import { autherInputValidation } from "../../utilities/validation";

export default class Auther extends Component {
  constructor() {
    super();
    this.state = {
      authors: [],
      currentIndex: 0,
      A0_ID_Author: "",
      A0_ID_Author_WEB: "",
      A_AuthorName: "",
      Storage: null,
      A_isAuthorHiden: false,
      isAddNew: false,
      isLoading: true,
      validation_error: null,
    };
  }

  getAllAuthors = () => {
    let authors = [];
    firebase
      .firestore()
      .collection("Authors")
      .orderBy("A0_ID_Author", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          authors.push({
            A0_ID_Author_WEB: doc.id,
            A0_ID_Author: doc.data()?.A0_ID_Author,
            A_AuthorName: doc.data()?.A_AuthorName,
            A_isAuthorHiden: doc.data()?.A_isAuthorHiden,
            A_AuthorImage: doc.data()?.A_AuthorImage,
            Storage: doc.data()?.Storage,
          });
        });
        this.setState({
          authors,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getAllAuthors();
  }

  handleNext = () => {
    const { currentIndex, authors } = this.state;
    if (currentIndex < authors?.length - 1) {
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
    this.getAllAuthors();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      A0_ID_Author: "",
      A_AuthorName: "",
      A_isAuthorHiden: false,
      A_AuthorImage: "",
    });
  };

  handleSaveData = () => {
    const {
      A0_ID_Author,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      Storage,
      authors,
      file,
    } = this.state;

    const { is_error, validation_error } = autherInputValidation({
      A0_ID_Author,
      A_AuthorImage,
      A_AuthorName,
      Storage,
      authors,
      file,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`AuthorImages/${Math.random().toString().substring(5)}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef
              .getDownloadURL()
              .then((Storage) => {
                firebase
                  .firestore()
                  .collection("Authors")
                  .add({
                    A0_ID_Author,
                    A_AuthorImage,
                    A_AuthorName,
                    A_isAuthorHiden,
                    Storage,
                  })
                  .then(() => {
                    notify.show(
                      "Author has been successfully added",
                      "success",
                      2000
                    );
                    this.setState({
                      A0_ID_Author: "",
                      A_AuthorImage: "",
                      A_AuthorName: "",
                      file: "",
                      A_isAuthorHiden: false,
                      isAddNew: false,
                    });
                    this.getAllAuthors();
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
      A0_ID_Author,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      authors,
      Storage,
      isAddNew,
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
          <div>
            <div className="row">
              <p>A0_ID_Author</p>
              <ValidationInput
                key={0}
                type="number"
                name="A0_ID_Author"
                value={A0_ID_Author}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.A0_ID_Author}
              />
            </div>
            <div className="row">
              <p>A_AuthorImage</p>
              <ValidationInput
                type="text"
                key={1}
                name="A_AuthorImage"
                value={A_AuthorImage}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.A_AuthorImage}
              />
            </div>

            <div className="row">
              <p>A_AuthorName</p>
              <ValidationInput
                type="text"
                key={2}
                name="A_AuthorName"
                value={A_AuthorName}
                handleOnChange={this.handleOnChange}
                errorMessage={validation_error?.A_AuthorName}
              />
            </div>
            <div className="row">
              <p>_isIllustratorHidden</p>
              <Checkbox
                key={3}
                checked={A_isAuthorHiden}
                value={A_isAuthorHiden}
                onChange={() =>
                  this.setState({
                    A_isAuthorHiden: !A_isAuthorHiden,
                  })
                }
              />
            </div>
            <div className="row">
              <img
                style={{
                  width: "200px",
                  height: "200px",
                }}
                src={Storage}
              />
            </div>
            <div className="row">
              <p>Storage</p>
              <ValidationInput
                type="file"
                accept="image/*"
                key={3}
                name="A_AuthorImage"
                // value={Storage}
                handleOnChange={(e) => {
                  this.setState({
                    A_AuthorImage: e.target.files[0].name,
                    Storage: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0],
                  });
                }}
                errorMessage={validation_error?.Storage}
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
              <p>A0_ID_Author</p>
              <input defaultValue={authors[currentIndex]?.A0_ID_Author} />
            </div>
            <div className="row">
              <p>A0_ID_Author_WEB</p>
              <input defaultValue={authors[currentIndex]?.A0_ID_Author_WEB} />
            </div>
            <div className="row">
              <p>A_AuthorImage</p>
              <input defaultValue={authors[currentIndex]?.A_AuthorImage} />
            </div>
            <div className="row">
              <p>A_AuthorName</p>
              <input defaultValue={authors[currentIndex]?.A_AuthorName} />
            </div>
            <div className="row">
              <p>A_isAuthorHiden</p>
              <Checkbox checked={authors[currentIndex]?.A_isAuthorHiden} />
            </div>
            <div className="row">
              <img
                style={{
                  width: "200px",
                  height: "200px",
                }}
                src={
                  authors[currentIndex]?.Storage
                    ? authors[currentIndex]?.Storage
                    : null
                }
              />
            </div>
            <div className="row">
              <p>Upload Image</p>
              <input defaultValue={authors[currentIndex]?.Storage} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
