import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";

export default class Auther extends Component {
  constructor() {
    super();
    this.state = {
      authors: [],
      currentIndex: 0,
      A0_ID_Author: null,
      A0_ID_Author_WEB: null,
      A_AuthorName: null,
      Storage: null,
      A_isAuthorHiden: false,
      isAddNew: false,
      isLoading: true,
    };
  }

  getAllLanguage = () => {
    let authors = [];
    firebase
      .firestore()
      .collection("Authors")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          authors.push({
            A0_ID_Author_WEB: doc.id,
            A0_ID_Author: doc.data()?.A0_ID_Author,
            A_AuthorName: doc.data()?.A_AuthorName,
            A_isAuthorHiden: doc.data()?.A_isAuthorHiden,
            A_AuthorImage: doc.data()?.A_AuthorImage,
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
      A0_ID_Author: null,
      A_AuthorName: null,
      A_isAuthorHiden: false,
      A_AuthorImage: null,
    });
  };

  handleSaveData = () => {
    const {
      A0_ID_Author,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      file,
    } = this.state;

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
                  A0_ID_Author: null,
                  A_AuthorImage: null,
                  A_AuthorName: null,
                  file: null,
                  A_isAuthorHiden: false,
                  isAddNew: false,
                });
                this.getAllLanguage();
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
  };

  render() {
    const {
      A0_ID_Author,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      isAddNew,
      authors,
      currentIndex,
      Storage,
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
              <input
                key={0}
                value={A0_ID_Author}
                onChange={(e) =>
                  this.setState({ A0_ID_Author: e.target.value })
                }
              />
            </div>
            <div className="row">
              <p>A_AuthorImage</p>
              <input
                key={1}
                value={A_AuthorImage}
                onChange={(e) =>
                  this.setState({ A_AuthorImage: e.target.value })
                }
              />
            </div>

            <div className="row">
              <p>A_AuthorName</p>
              <input
                key={2}
                value={A_AuthorName}
                onChange={(e) =>
                  this.setState({ A_AuthorName: e.target.value })
                }
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  this.setState({
                    A_AuthorImage: e.target.files[0].name,
                    Storage: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0],
                  });
                }}
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
              <input value={authors[currentIndex]?.A0_ID_Author} />
            </div>
            <div className="row">
              <p>A0_ID_Author_WEB</p>
              <input value={authors[currentIndex]?.A0_ID_Author_WEB} />
            </div>
            <div className="row">
              <p>A_AuthorImage</p>
              <input value={authors[currentIndex]?.A_AuthorImage} />
            </div>
            <div className="row">
              <p>A_AuthorName</p>
              <input value={authors[currentIndex]?.A_AuthorName} />
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
                  "https://i.pinimg.com/736x/50/df/34/50df34b9e93f30269853b96b09c37e3b.jpg"
                }
              />
            </div>
            <div className="row">
              <p>Upload Image</p>
              <input
                value={
                  "https://i.pinimg.com/736x/50/df/34/50df34b9e93f30269853b96b09c37e3b.jpg"
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
