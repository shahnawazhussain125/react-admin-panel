import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox, Row, Col, Button } from "antd";
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

  readJSON = (path) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "file:///home/shahnawaz/Downloads/test.png", true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      console.log(this.response);
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        console.log(res);
      };
      var file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send();
  };

  convertImgToBase64 = () => {};

  handleSaveData = () => {
    let file = "home/shahnawaz/Downloads/test.png";

    this.readJSON(file);

    // rawFile.send(null);
    // let storageRef = firebase
    //   .storage()
    //   .ref()
    //   .child(`test/${Math.random().toString().substring(5)}`);

    // storageRef.put(file).then(() => {
    //   storageRef.getDownloadURL().then((Storage) => {
    //     console.log("Storage", Storage);
    //   });
    // });
  };

  // handleSaveData = () => {
  //   const {
  //     A0_ID_Author,
  //     A_AuthorImage,
  //     A_AuthorName,
  //     A_isAuthorHiden,
  //     Storage,
  //     authors,
  //     file,
  //   } = this.state;

  //   const { is_error, validation_error } = autherInputValidation({
  //     A0_ID_Author,
  //     A_AuthorImage,
  //     A_AuthorName,
  //     Storage,
  //     authors,
  //     file,
  //   });

  //   this.setState({ is_error, validation_error }, () => {
  //     if (!is_error) {
  //       let storageRef = firebase
  //         .storage()
  //         .ref()
  //         .child(`AuthorImages/${Math.random().toString().substring(5)}`);

  //       storageRef
  //         .put(file)
  //         .then(() => {
  //           storageRef
  //             .getDownloadURL()
  //             .then((Storage) => {
  //               firebase
  //                 .firestore()
  //                 .collection("Authors")
  //                 .add({
  //                   A0_ID_Author,
  //                   A_AuthorImage,
  //                   A_AuthorName,
  //                   A_isAuthorHiden,
  //                   Storage,
  //                 })
  //                 .then(() => {
  //                   notify.show(
  //                     "Author has been successfully added",
  //                     "success",
  //                     2000
  //                   );
  //                   this.setState({
  //                     A0_ID_Author: "",
  //                     A_AuthorImage: "",
  //                     A_AuthorName: "",
  //                     file: "",
  //                     A_isAuthorHiden: false,
  //                     isAddNew: false,
  //                   });
  //                   this.getAllAuthors();
  //                 })
  //                 .catch((error) => {
  //                   notify.show(`Error! ${error.message}`, "error", 2000);
  //                 });
  //             })
  //             .catch((error) => {
  //               notify.show(`Error! ${error.message}`, "error", 2000);
  //             });
  //         })
  //         .catch((error) => {
  //           notify.show(`Error! ${error.message}`, "error", 2000);
  //         });
  //     }
  //   });
  // };

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
        {/* <img
          src={require("../../../../../../../shahnawaz/Downloads/test.png")}
          width={200}
          height={100}
        /> */}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>_isIllustratorHidden</p>
              <Checkbox
                style={{ marginRight: 155 }}
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
                backgroundColor: "#E0DFFF",
                padding: 10,
              }}
            >
              <img
                style={{
                  width: 120,
                  height: 120,
                }}
                src={Storage}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <p>Storage</p>
              <ValidationInput
                type="file"
                accept="image/*"
                key={3}
                name="A_AuthorImage"
                // value={Storage}
                handleOnChange={(e) => {
                  console.log(" e.target.files[0]", e.target.files[0]);
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
          <>
            <div
              style={{
                backgroundColor: "#EBEAFF",
                width: "35%",
                margin: 20,
                padding: 20,
              }}
            >
              <Row>
                <Col span={12}>
                  <p>A0_ID_Author</p>
                </Col>
                <Col span={12}>
                  <input
                    className="ant-input"
                    defaultValue={authors[currentIndex]?.A0_ID_Author}
                  />
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <p>A0_ID_Author_WEB</p>
                </Col>
                <Col span={12}>
                  <input
                    className="ant-input"
                    defaultValue={authors[currentIndex]?.A0_ID_Author_WEB}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p>A_AuthorImage</p>
                </Col>
                <Col span={12}>
                  <input
                    className="ant-input"
                    defaultValue={authors[currentIndex]?.A_AuthorImage}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p>A_AuthorName</p>
                </Col>
                <Col span={12}>
                  <input
                    className="ant-input"
                    defaultValue={authors[currentIndex]?.A_AuthorName}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p>A_isAuthorHiden</p>
                </Col>
                <Col span={12}>
                  <Checkbox checked={authors[currentIndex]?.A_isAuthorHiden} />
                </Col>
              </Row>
              <Row>
                <Col span={12}></Col>
                <Col span={12}>
                  <img
                    style={{
                      width: 120,
                      height: 120,
                      marginBottom: 20,
                    }}
                    src={
                      authors[currentIndex]?.Storage
                        ? authors[currentIndex]?.Storage
                        : null
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p>Upload Image</p>
                </Col>
                <Col span={12}>
                  <input
                    className="ant-input"
                    defaultValue={authors[currentIndex]?.Storage}
                  />
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
    );
  }
}
