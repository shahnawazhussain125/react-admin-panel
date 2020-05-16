import React, { Component } from "react";
import { Checkbox, Select, Typography, Input } from "antd";
import { Row, Col, Button } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { bookInputValidation } from "../../utils/validation";
import SideMenu from "../../components/sideMenu";

const db = firebase.firestore();
const { Option } = Select;

export default class Book extends Component {
  constructor() {
    super();
    this.state = {
      B_BookTitle: "",
      B_BAuthorName: "",
      B0_ID_Book: "",
      B_Web: "",
      B_isBookFree: false,
      B_isBookHidden: false,
      L_LanguageName: "",
      L0_ID_Language: "",
      L0_ID_Language_WEB: "",
      B_BookImage: "",
      O_Company: "",
      O_Web: "",
      O_ContactName: "",
      O_ContactEmail: "",
      O_ContactTel: "",
      O0_ID_Owner: "",
      O0_ID_Owner_WEB: "",
      Storage: "",
      B0_ID_Book_WEB: "",
      file: "",
      isAddNew: false,
      isLoading: true,
      authors: [],
      languages: [],
      owners: [],
      validation_error: null,
      imagesName: [],
      books: [],
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.getAllBooks();
    this.getAllLanguageAndAuthor();
    this.getAllImageFileName();
  }

  getAllLanguageAndAuthor = () => {
    let authors = [];
    let languages = [];
    let owners = [];

    let allPromises = [];

    allPromises.push(db.collection("Authors").get());
    allPromises.push(db.collection("Owners").get());
    allPromises.push(db.collection("Languages").get());

    Promise.all(allPromises)
      .then((responses) => {
        let index = 0;
        responses.forEach((response) => {
          response.forEach((doc) => {
            if (index === 0) {
              authors.push({
                A0_ID_Author_WEB: doc.id,
                ...doc.data(),
              });
            } else if (index === 1) {
              owners.push({
                O0_ID_Owner_WEB: doc.id,
                ...doc.data(),
              });
            } else {
              languages.push({
                L0_ID_Language_WEB: doc.id,
                ...doc.data(),
              });
            }
          });
          index++;
        });
        this.setState({ languages, owners, authors });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  getAllBooks = () => {
    let books = [];
    firebase
      .firestore()
      .collection("Books")
      .orderBy("B_BookTitle", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          books.push({
            B0_ID_Book_WEB: doc.id,
            B_BookTitle: doc.data()?.B_BookTitle,
            B_BAuthorName: doc.data()?.B_BAuthorName,
            B0_ID_Book: doc.data()?.B0_ID_Book,
            B_Web: doc.data()?.B_Web,
            A_AuthorImage: doc.data().A_AuthorImage,
            B_isBookFree: doc.data()?.B_isBookFree,
            B_isBookHidden: doc.data()?.B_isBookHidden,
            L_LanguageName: doc.data()?.L_LanguageName,
            L0_ID_Language: doc.data()?.L0_ID_Language,
            L0_ID_Language_WEB: doc.data()?.L0_ID_Language_WEB,
            Storage: doc.data()?.Storage,
            B_BookImage: doc.data()?.B_BookImage,
            O_Company: doc.data()?.O_Company,
            O_Web: doc.data()?.O_Web,
            O_ContactName: doc.data()?.O_ContactName,
            O_ContactEmail: doc.data()?.O_ContactEmail,
            O_ContactTel: doc.data()?.O_ContactTel,
            O0_ID_Owner: doc.data()?.O0_ID_Owner,
            O0_ID_Owner_WEB: doc.data()?.O0_ID_Owner_WEB,
          });
        });
        this.setState({
          books,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  getAllImageFileName = () => {
    let imagesName = [];

    firebase
      .storage()
      .ref()
      .child("BookImages")
      .listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          imagesName.push(itemRef.name);
        });

        this.state.imagesName = imagesName;
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  handleNext = () => {
    const { currentIndex, books } = this.state;
    if (currentIndex < books?.length - 1) {
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
    this.getAllBooks();
  };

  handleAddNew = () => {
    this.setState({
      B_BookTitle: "",
      B_BAuthorName: "",
      B0_ID_Book: "",
      B_Web: "",
      B_isBookFree: false,
      B_isBookHidden: false,
      L_LanguageName: "",
      L0_ID_Language: "",
      L0_ID_Language_WEB: "",
      B_BookImage: "",
      O_Company: "",
      O_Web: "",
      O_ContactName: "",
      O_ContactEmail: "",
      O_ContactTel: "",
      O0_ID_Owner: "",
      O0_ID_Owner_WEB: "",
      B_Storage: "",
      B0_ID_Book_WEB: "",
      file: "",
      isAddNew: true,
      isEdit: false,
    });
  };

  handleSaveData = () => {
    const {
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      file,
      Storage,
      books,
    } = this.state;

    const { is_error, validation_error } = bookInputValidation({
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      Storage,
      books,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`BookImages/${B_BookImage}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef
              .getDownloadURL()
              .then((Storage) => {
                firebase
                  .firestore()
                  .collection("Books")
                  .add({
                    B_BookTitle,
                    B_BAuthorName,
                    B0_ID_Book,
                    B_Web,
                    B_isBookFree,
                    B_isBookHidden,
                    L_LanguageName,
                    L0_ID_Language,
                    L0_ID_Language_WEB,
                    B_BookImage,
                    O_Company,
                    O_Web,
                    O_ContactName,
                    O_ContactEmail,
                    O_ContactTel,
                    O0_ID_Owner,
                    O0_ID_Owner_WEB,
                    Storage,
                  })
                  .then(() => {
                    notify.show(
                      "Book has been successfully added",
                      "success",
                      2000
                    );
                    this.setState({
                      B_BookTitle: "",
                      B_BAuthorName: "",
                      B0_ID_Book: "",
                      B_Web: "",
                      B_isBookFree: false,
                      B_isBookHidden: false,
                      L_LanguageName: "",
                      L0_ID_Language: "",
                      L0_ID_Language_WEB: "",
                      B_BookImage: "",
                      O_Company: "",
                      O_Web: "",
                      O_ContactName: "",
                      O_ContactEmail: "",
                      O_ContactTel: "",
                      O0_ID_Owner: "",
                      O0_ID_Owner_WEB: "",
                      Storage: "",
                      B0_ID_Book_WEB: "",
                      file: "",
                      isAddNew: false,
                      isEdit: false,
                    });
                    this.getAllBooks();
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

  handleOnUpdate = () => {
    const {
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      file,
      Storage,
      books,
      imagesName,
      currentIndex,
    } = this.state;

    const { is_error, validation_error } = bookInputValidation({
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      Storage,
      books: books.filter((value, index) => index !== currentIndex),
      imagesName: imagesName.filter(
        (value) => value !== books[currentIndex].B_BookImage
      ),
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        if (file) {
          let storageRef = firebase
            .storage()
            .ref()
            .child(`BookImages/${B_BookImage}`);

          storageRef
            .put(file)
            .then(() => {
              storageRef
                .getDownloadURL()
                .then((Storage) => {
                  this.handleUpdateData(Storage);
                })
                .catch((error) => {
                  notify.show(`Error! ${error.message}`, "error", 2000);
                });
            })
            .catch((error) => {
              notify.show(`Error! ${error.message}`, "error", 2000);
            });
        } else {
          this.handleUpdateData(Storage);
        }
      }
    });
  };

  handleUpdateData = (Storage) => {
    const {
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      B0_ID_Book_WEB,
      B_isBookFree,
      B_isBookHidden,
      books,
      currentIndex,
    } = this.state;

    firebase
      .firestore()
      .collection("Books")
      .doc(B0_ID_Book_WEB)
      .update({
        B_BookTitle,
        B_BAuthorName,
        B0_ID_Book,
        B_Web,
        B_isBookFree,
        B_isBookHidden,
        L_LanguageName,
        L0_ID_Language,
        L0_ID_Language_WEB,
        B_BookImage,
        O_Company,
        O_Web,
        O_ContactName,
        O_ContactEmail,
        O_ContactTel,
        O0_ID_Owner,
        O0_ID_Owner_WEB,
        Storage,
      })
      .then(() => {
        firebase
          .firestore()
          .collection("Tales")
          .where("B0_ID_Book_WEB", "==", B0_ID_Book_WEB)
          .get()
          .then((response) => {
            let updateDocumentPromise = [];

            response.forEach((doc) => {
              updateDocumentPromise.push(
                firebase.firestore().collection("Tales").doc(doc.id).update({
                  B_BookTitle,
                  B_BAuthorName,
                  B0_ID_Book,
                  B_Web,
                  B_isBookFree,
                  B_isBookHidden,
                  L_LanguageName,
                  L0_ID_Language,
                  L0_ID_Language_WEB,
                  B_BookImage,
                  O_Company,
                  O_Web,
                  O_ContactName,
                  O_ContactEmail,
                  O_ContactTel,
                  O0_ID_Owner,
                  O0_ID_Owner_WEB,
                  B_Storage: Storage,
                })
              );
            });

            Promise.all(updateDocumentPromise)
              .then(() => {
                notify.show(
                  "Book has been successfully updated",
                  "success",
                  2000
                );

                books[currentIndex] = {
                  B_BookTitle,
                  B_BAuthorName,
                  B0_ID_Book,
                  B_Web,
                  B_isBookFree,
                  B_isBookHidden,
                  L_LanguageName,
                  L0_ID_Language,
                  L0_ID_Language_WEB,
                  B_BookImage,
                  O_Company,
                  O_Web,
                  O_ContactName,
                  O_ContactEmail,
                  O_ContactTel,
                  O0_ID_Owner,
                  O0_ID_Owner_WEB,
                  Storage,
                  B0_ID_Book_WEB,
                };

                this.setState({
                  B_BookTitle: "",
                  B_BAuthorName: "",
                  B0_ID_Book: "",
                  B_Web: "",
                  B_isBookFree: false,
                  B_isBookHidden: false,
                  L_LanguageName: "",
                  L0_ID_Language: "",
                  L0_ID_Language_WEB: "",
                  B_BookImage: "",
                  O_Company: "",
                  O_Web: "",
                  O_ContactName: "",
                  O_ContactEmail: "",
                  O_ContactTel: "",
                  O0_ID_Owner: "",
                  O0_ID_Owner_WEB: "",
                  Storage: "",
                  B0_ID_Book_WEB: "",
                  file: "",
                  isAddNew: false,
                  isEdit: false,
                  books,
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
  };

  handleOnChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      B_BookTitle,
      B_BAuthorName,
      B0_ID_Book,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      isAddNew,
      books,
      currentIndex,
      Storage,
      owners,
      authors,
      languages,
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
              noOfDocument={books.length}
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
              <p style={{ fontSize: 20 }}>
                {isEdit ? "Update Book" : "Add New Book"}
              </p>
            </Row>
          )}
          <Row>
            {isAddNew ? (
              <Row style={{ margin: 20 }}>
                <Col span={11} style={{ backgroundColor: "#EBEAFF" }}>
                  <div style={{ backgroundColor: "#EBEAFF", padding: 20 }}>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography
                          style={{ fontSize: 15, fontWeight: "bold" }}
                        >
                          B_BookTitle
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={0}
                          type="text"
                          name="B_BookTitle"
                          value={B_BookTitle}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_BookTitle}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_BAuthorName</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={1}
                          type="text"
                          name="B_BAuthorName"
                          value={B_BAuthorName}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_BAuthorName}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={4}
                          type="url"
                          name="B_Web"
                          value={B_Web}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_Web}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_isBookFree</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          key={3}
                          checked={B_isBookFree}
                          value={B_isBookFree}
                          onChange={() =>
                            this.setState({
                              B_isBookFree: !B_isBookFree,
                            })
                          }
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_isBookHidden</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          key={3}
                          checked={B_isBookHidden}
                          value={B_isBookHidden}
                          onChange={() =>
                            this.setState({
                              B_isBookHidden: !B_isBookHidden,
                            })
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B0_ID_Book</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={2}
                          type="text"
                          name="B0_ID_Book"
                          value={B0_ID_Book}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book}
                        />
                      </Col>
                    </Row>

                    <Row className="title-header-container">
                      <h2 className="title-header">Book Language</h2>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L_LanguageName</Typography>
                      </Col>
                      <Col span={14}>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Language"
                          onChange={(value) =>
                            this.setState({ ...languages[value] })
                          }
                          defaultValue={L_LanguageName}
                        >
                          {languages.map((value, index) => (
                            <Option key={value.L0_ID_Language} value={index}>
                              {value.L_LanguageName}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L0_ID_Language</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={6}
                          type="text"
                          name="L0_ID_Language"
                          value={L0_ID_Language}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.L0_ID_Language}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L0_ID_Language_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={7}
                          type="text"
                          name="L0_ID_Language_WEB"
                          value={L0_ID_Language_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.L0_ID_Language_WEB}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span={11} style={{ backgroundColor: "#EBEAFF" }}>
                  <div
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                    }}
                  >
                    <Row style={{ marginBottom: 20 }}>
                      <img
                        style={{
                          width: 130,
                          height: 130,
                        }}
                        src={Storage}
                      />
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>Storage</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={8}
                          type="file"
                          accept="image/*"
                          name="Storage"
                          // value={Storage}
                          handleOnChange={(e) => {
                            this.setState({
                              B_BookImage: e.target.files[0].name,
                              Storage: URL.createObjectURL(e.target.files[0]),
                              file: e.target.files[0],
                            });
                          }}
                          errorMessage={validation_error?.Storage}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_BookImage</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={9}
                          type="text"
                          name="B_BookImage"
                          value={B_BookImage}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_BookImage}
                        />
                      </Col>
                    </Row>

                    <Row className="title-header-container">
                      <h2 className="title-header">Book Owner</h2>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactName</Typography>
                      </Col>
                      <Col span={14}>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select Owner"
                          onChange={(value) =>
                            this.setState({
                              ...owners[value],
                            })
                          }
                          defaultValue={O_ContactName}
                        >
                          {owners.map((value, index) => (
                            <Option key={value.O0_ID_Owner} value={index}>
                              {value.O_ContactName}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_Company</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={12}
                          type="text"
                          name="O_Company"
                          value={O_Company}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O_Company}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={13}
                          type="url"
                          name="O_Web"
                          value={O_Web}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O_Web}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactEmail</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={15}
                          type="email"
                          name="O_ContactEmail"
                          value={O_ContactEmail}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O_ContactEmail}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactTel</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={16}
                          type="tel"
                          name="O_ContactTel"
                          value={O_ContactTel}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O_ContactTel}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O0_ID_Owner</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={17}
                          type="text"
                          name="O0_ID_Owner"
                          value={O0_ID_Owner}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O0_ID_Owner}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O0_ID_Owner_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={18}
                          type="text"
                          name="O0_ID_Owner_WEB"
                          value={O0_ID_Owner_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.O0_ID_Owner_WEB}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
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
                </Col>
              </Row>
            ) : (
              <Row span={32} style={{ margin: 20 }}>
                <Col
                  span={12}
                  style={{
                    backgroundColor: "#EBEAFF",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                    }}
                  >
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 15 }}
                        >
                          B_BookTitle
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B_BookTitle}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_BAuthorName</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B_BAuthorName}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B_Web}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B0_ID_Book</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B0_ID_Book}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B0_ID_Book_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_isBookFree</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox checked={books[currentIndex]?.B_isBookFree} />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_isBookHidden</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          checked={books[currentIndex]?.B_isBookHidden}
                        />
                      </Col>
                    </Row>

                    <Row className="title-header-container">
                      <h2 className="title-header">Book Language</h2>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L_LanguageName</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.L_LanguageName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L0_ID_Language</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.L0_ID_Language}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>L0_ID_Language_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.L0_ID_Language_WEB}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span={12} style={{ backgroundColor: "#EBEAFF" }}>
                  <div
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                    }}
                  >
                    <Row style={{ marginBottom: 20 }}>
                      <img
                        style={{
                          width: 130,
                          height: 130,
                        }}
                        src={books[currentIndex]?.Storage}
                      />
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>Storage</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.Storage}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>B_BookImage</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.B_BookImage}
                        />
                      </Col>
                    </Row>

                    <Row className="title-header-container">
                      <h2 className="title-header">Book Owner</h2>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_Company</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O_Company}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O_Web}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactName</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O_ContactName}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactEmail</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O_ContactEmail}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O_ContactTel</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O_ContactTel}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O0_ID_Owner</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O0_ID_Owner}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 20 }}>
                      <Col span={10}>
                        <Typography>O0_ID_Owner_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={books[currentIndex]?.O0_ID_Owner_WEB}
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
                            ...books[currentIndex],
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </Row>
                  </div>
                </Col>
              </Row>
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}
