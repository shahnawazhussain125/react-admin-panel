import React, { Component } from "react";
import { Checkbox, Select, Row, Col, Button, Typography } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { talesInputValidation } from "../../utilities/validation";
import HTMLReactParser from "html-react-parser";
import SideMenu from "../../components/sideMenu";

const db = firebase.firestore();
const { Option } = Select;

export default class Tales extends Component {
  constructor() {
    super();
    this.state = {
      tales: [],
      currentIndex: 0,
      B_BookTitle: null,
      B_BAuthorName: null,
      B0_ID_Book: null,
      B_Web: null,
      B_isBookFree: false,
      B_isBookHidden: false,
      L_LanguageName: null,
      L0_ID_Language: null,
      L0_ID_Language_WEB: null,
      storage: null,
      B_BookImage: null,
      BOOKOwner: null,
      O_Company: null,
      O_Web: null,
      O_ContactName: null,
      O_ContactEmail: null,
      O_ContactTel: null,
      O0_ID_Owner: null,
      O0_ID_Owner_WEB: null,
      isAddNew: false,
      isLoading: true,
      authors: [],
      languages: [],
      owners: [],
      books: [],
      illustrators: [],
      validation_error: null,
    };
  }

  getAllLanguageAndAuther = () => {
    let authors = [];
    let languages = [];
    let owners = [];
    let books = [];
    let illustrators = [];

    let allPromises = [];

    allPromises.push(db.collection("Authors").get());
    allPromises.push(db.collection("Owners").get());
    allPromises.push(db.collection("Languages").get());
    allPromises.push(db.collection("Books").get());
    allPromises.push(db.collection("Illustrators").get());

    Promise.all(allPromises)
      .then((responses) => {
        let index = 0;
        responses.forEach((response) => {
          response.forEach((doc) => {
            if (index === 0) {
              authors.push({
                A0_ID_Author_WEB: doc.id,
                ...doc.data(),
                A_Storage: doc.data().Storage,
              });
            } else if (index === 1) {
              owners.push({
                O0_ID_Owner_WEB: doc.id,
                ...doc.data(),
              });
            } else if (index === 2) {
              languages.push({
                L0_ID_Language_WEB: doc.id,
                ...doc.data(),
              });
            } else if (index === 3) {
              books.push({
                B0_ID_Book_WEB: doc.id,
                ...doc.data(),
                B_Storage: doc.data().Storage,
              });
            } else {
              illustrators.push({
                I0_ID_Illustrator_WEB: doc.id,
                ...doc.data(),
              });
            }
          });
          index++;
        });
        this.setState({ languages, owners, authors, books, illustrators });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  getAllTales = () => {
    let tales = [];
    firebase
      .firestore()
      .collection("zTales")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          tales.push({
            A0_ID_Author: doc.data()?.A0_ID_Author,
            A0_ID_Author_WEB: doc.data()?.A0_ID_Author_WEB,
            A_AuthorImage: doc.data()?.A_AuthorImage,
            A_AuthorName: doc.data()?.A_AuthorName,
            A_isAuthorHidden: doc.data()?.A_isAuthorHidden,

            A_Storage: doc.data().A_Storage,
            B0_ID_Book: doc.data()?.B0_ID_Book,
            B0_ID_Book_WEB: doc.data()?.B0_ID_Book_WEB,
            B_BAuthorName: doc.data()?.B_BAuthorName,

            B_BookImage: doc.data()?.B_BookImage,
            B_BookTitle: doc.data()?.B_BookTitle,
            B_Storage: doc.data().B_Storage,
            B_Web: doc.data()?.B_Web,

            B_isBookFree: doc.data()?.B_isBookFree,
            B_isBookHidden: doc.data().B_isBookHidden,
            I0_ID_Illustrator: doc.data().I0_ID_Illustrator,
            I_IllustratorName: doc.data().I_IllustratorName,
            I_isIllustratorHidden: doc.data().I_isIllustratorHidden,
            I0_ID_Illustrator_WEB: doc.data().I0_ID_Illustrator_WEB,
            L0_ID_Language: doc.data().L0_ID_Language,
            L0_ID_Language_WEB: doc.data().L0_ID_Language_WEB,
            L_LanguageName: doc.data().L_LanguageName,

            O0_ID_Owner: doc.data().O0_ID_Owner,
            O0_ID_Owner_WEB: doc.data()?.O0_ID_Owner_WEB,
            O_Company: doc.data().O_Company,
            O_ContactEmail: doc.data()?.O_ContactEmail,
            O_ContactName: doc.data()?.O_ContactName,
            O_ContactTel: doc.data()?.O_ContactTel,
            O_Web: doc.data()?.O_Web,
            T_TaleContent: doc.data().T_TaleContent,
            T_TaleImage: doc.data().T_TaleImage,
            T_TaleTitle: doc.data().T_TaleTitle,
            T_Storage: doc.data().T_Storage,
            T_ID_Tale: doc.id,
          });
        });
        this.setState({
          tales,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getAllTales();
    this.getAllLanguageAndAuther();
  }

  handleNext = () => {
    const { currentIndex, tales } = this.state;
    if (currentIndex < tales?.length - 1) {
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
    this.getAllTales();
  };

  handleAddNew = () => {
    this.setState({
      isAddNew: true,
      A0_ID_Author: "",
      A0_ID_Author_WEB: "",
      A_AuthorImage: "",
      A_AuthorName: "",
      A_isAuthorHiden: false,
      A_Storage: "",
      B_BookTitle: "",
      B_BAuthorName: "",
      T_TaleTitle: "",
      T_TaleImage: "",
      T_Storage: "",
      T_isTaleHidden: false,
      T_TaleContent: "",
      B0_ID_Book: "",
      B0_ID_Book_WEB: "",
      B_Web: "",
      B_isBookFree: false,
      B_isBookHidden: false,
      B_Storage: "",
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
      I0_ID_Illustrator_WEB: "",
      I0_ID_Illustrator: "",
      I_IllustratorName: "",
      _isIllustratorHidden: false,
    });
  };

  handleSaveData = () => {
    const {
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      T_TaleTitle,
      T_TaleImage,
      T_Storage,
      T_isTaleHidden,
      T_TaleContent,
      B0_ID_Book,
      B0_ID_Book_WEB,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      B_Storage,
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
      I0_ID_Illustrator_WEB,
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
      file,
    } = this.state;

    const { is_error, validation_error } = talesInputValidation({
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      B_Web,
      B0_ID_Book,
      B_BookImage,
      B_Storage,
      B0_ID_Book_WEB,
      T_TaleTitle,
      T_TaleImage,
      T_Storage,
      T_TaleContent,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      I0_ID_Illustrator_WEB,
      I0_ID_Illustrator,
      I_IllustratorName,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`TaleImages/${Math.random().toString().substring(5)}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef
              .getDownloadURL()
              .then((Storage) => {
                firebase
                  .firestore()
                  .collection("zTales")
                  .add({
                    A0_ID_Author,
                    A0_ID_Author_WEB,
                    A_AuthorImage,
                    A_AuthorName,
                    A_isAuthorHiden,
                    A_Storage,
                    B_BookTitle,
                    B_BAuthorName,
                    T_TaleTitle,
                    T_TaleImage,
                    T_Storage,
                    T_isTaleHidden,
                    T_TaleContent,
                    B0_ID_Book,
                    B0_ID_Book_WEB,
                    B_Web,
                    B_isBookFree,
                    B_isBookHidden,
                    B_Storage,
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
                    I0_ID_Illustrator_WEB,
                    I0_ID_Illustrator,
                    I_IllustratorName,
                    _isIllustratorHidden,
                    T_Storage: Storage,
                  })
                  .then(() => {
                    notify.show(
                      "Tale has been successfully added",
                      "success",
                      2000
                    );
                    this.setState({
                      isAddNew: false,
                      A0_ID_Author: "",
                      A0_ID_Author_WEB: "",
                      A_AuthorImage: "",
                      A_AuthorName: "",
                      A_isAuthorHiden: false,
                      A_Storage: "",
                      B_BookTitle: "",
                      B_BAuthorName: "",
                      T_TaleTitle: "",
                      T_TaleImage: "",
                      T_Storage: "",
                      T_isTaleHidden: false,
                      T_TaleContent: "",
                      B0_ID_Book: "",
                      B0_ID_Book_WEB: "",
                      B_Web: "",
                      B_isBookFree: false,
                      B_isBookHidden: false,
                      B_Storage: "",
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
                      I0_ID_Illustrator_WEB: "",
                      I0_ID_Illustrator: "",
                      I_IllustratorName: "",
                      _isIllustratorHidden: false,
                      file: null,
                    });
                    this.getAllTales();
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
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHiden,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      T_TaleTitle,
      T_TaleImage,
      T_Storage,
      T_isTaleHidden,
      T_TaleContent,
      B0_ID_Book,
      B0_ID_Book_WEB,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      B_Storage,
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
      I0_ID_Illustrator_WEB,
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
      isAddNew,
      tales,
      currentIndex,
      books,
      authors,
      owners,
      languages,
      illustrators,
      validation_error,
    } = this.state;

    let noOfCharacter = T_TaleContent
      ? new DOMParser().parseFromString(T_TaleContent, "text/html").body
          .textContent?.length
      : 0;
    // console.log("noOfCharacter", noOfCharacter);
    return (
      <Row>
        <Notifications />
        <Col className="gutter-row" span={4}>
          <SideMenu />
        </Col>
        <Col className="gutter-row" span={20}>
          {!isAddNew ? (
            <Headers
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
              <p
                style={{
                  fontSize: 20,
                }}
              >
                Add new Language
              </p>
            </Row>
          )}
          <Row>
            {isAddNew ? (
              <span>
                <Row>
                  <Col
                    span={11}
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                      margin: 20,
                    }}
                  >
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Book</Typography>
                      </Col>
                      <Col span={14}>
                        <Select
                          style={{ width: 250 }}
                          placeholder="Select Book"
                          value={B_BookTitle}
                          onChange={(value) =>
                            this.setState({
                              ...books[value],
                              B_Storage: books[value].B_Storage,
                            })
                          }
                        >
                          {books.map((value, index) => (
                            <Option key={value.O0_ID_Owner} value={index}>
                              {value.B_BookTitle}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Author</Typography>
                      </Col>
                      <Col span={14}>
                        <Select
                          style={{ width: 250 }}
                          placeholder="Select Author"
                          value={B_BAuthorName}
                          onChange={(value) =>
                            this.setState({
                              ...authors[value],
                              A_Storage: authors[value].A_Storage,
                              B_BAuthorName: authors[value].A_AuthorName,
                            })
                          }
                        >
                          {authors.map((value, index) => (
                            <Option key={value.A0_ID_Author} value={index}>
                              {value.A_AuthorName}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Illustrator</Typography>
                      </Col>
                      <Col span={14}>
                        <Select
                          style={{ width: 250 }}
                          placeholder="Select Illustrator"
                          value={I_IllustratorName}
                          onChange={(value) =>
                            this.setState({
                              ...illustrators[value],
                            })
                          }
                        >
                          {illustrators.map((value, index) => (
                            <Option key={value.I_IllustratorName} value={index}>
                              {value.I_IllustratorName}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Title</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={1}
                          name="T_TaleTitle"
                          value={T_TaleTitle}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.T_TaleTitle}
                        />
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>T_TaleContent</Typography>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <textarea
                        defaultValue={T_TaleContent}
                        rows={10}
                        cols={90}
                        onChange={(e) =>
                          this.setState({ T_TaleContent: e.target.value })
                        }
                      ></textarea>
                    </Row>
                  </Col>
                  <Col
                    span={11}
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                      margin: 20,
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Row
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: 12,
                          }}
                        >
                          <img
                            style={{
                              width: 150,
                              height: 150,
                            }}
                            src={T_Storage ? T_Storage : null}
                          />
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_Storage</Typography>
                          </Col>
                          <Col span={14}>
                            <ValidationInput
                              type="file"
                              accept="image/*"
                              key={3}
                              name="T_TaleImage"
                              // value={Storage}
                              handleOnChange={(e) => {
                                this.setState({
                                  T_TaleImage: e.target.files[0].name,
                                  T_Storage: URL.createObjectURL(
                                    e.target.files[0]
                                  ),
                                  file: e.target.files[0],
                                });
                              }}
                              errorMessage={validation_error?.T_Storage}
                            />
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_TaleImage</Typography>
                          </Col>
                          <Col span={14}>
                            <ValidationInput
                              type="text"
                              key={121}
                              name="T_TaleImage"
                              value={T_TaleImage}
                              handleOnChange={this.handleOnChange}
                              errorMessage={validation_error?.T_TaleImage}
                            />
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_isTaleHidden</Typography>
                          </Col>
                          <Col span={14}>
                            <Checkbox
                              key={45}
                              checked={T_isTaleHidden}
                              value={T_isTaleHidden}
                              onChange={() =>
                                this.setState({
                                  T_isTaleHidden: !T_isTaleHidden,
                                })
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>Len</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              readOnly
                              value={noOfCharacter}
                            />
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>Time</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              readOnly
                              value={noOfCharacter / 238}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <div
                        style={{
                          border: "1px solid black",
                          backgroundColor: "#fff",
                          width: 400,
                          height: 300,
                        }}
                      >
                        {HTMLReactParser(T_TaleContent ? T_TaleContent : "")}
                      </div>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col
                    span={7}
                    style={{
                      margin: 20,
                      padding: 20,
                      backgroundColor: "#EBEAFF",
                    }}
                  >
                    <Row>
                      <h2 className="title-header">Book</h2>
                    </Row>

                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B0_ID_Book</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="number"
                          key={5}
                          name="B0_ID_Book"
                          value={B0_ID_Book}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_BAuthorName</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={6}
                          name="B0_ID_Book_WEB"
                          value={B0_ID_Book_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B0_ID_Book_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={7}
                          name="B0_ID_Book_WEB"
                          value={B0_ID_Book_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="url"
                          key={8}
                          name="B_Web"
                          value={B_Web}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_Web}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_isBookFree</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          key={9}
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
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_isBookHidden</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          key={10}
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
                    <Row style={{ marginBottom: 12 }}>
                      <img
                        style={{
                          width: 150,
                          height: 150,
                        }}
                        src={B_Storage ? B_Storage : null}
                      />
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_BookImage</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={8}
                          name="B_BookImage"
                          value={B_BookImage}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_BookImage}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography>B_Storage</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={8}
                          name="B_Storage"
                          value={B_Storage}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_Storage}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    span={7}
                    style={{
                      padding: 20,
                      margin: 20,
                      backgroundColor: "#EBEAFF",
                    }}
                  >
                    <div>
                      <Row>
                        <h2 className="title-header">Book Language</h2>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>L_LanguageName</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={10}
                            name="L_LanguageName"
                            value={L_LanguageName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L_LanguageName}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>L0_ID_Language</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="number"
                            key={11}
                            name="L0_ID_Language"
                            value={L0_ID_Language}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L0_ID_Language}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>L0_ID_Language_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={12}
                            name="L0_ID_Language_WEB"
                            value={L0_ID_Language_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L0_ID_Language_WEB}
                          />
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row>
                        <h2 className="title-header">Book Owner</h2>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O0_ID_Owner</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="number"
                            key={13}
                            name="O0_ID_Owner"
                            value={O0_ID_Owner}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O0_ID_Owner}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O0_ID_Owner_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={14}
                            name="O0_ID_Owner_WEB"
                            value={O0_ID_Owner_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O0_ID_Owner_WEB}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O_Company</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={15}
                            name="O_Company"
                            value={O_Company}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_Company}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O_Web</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="url"
                            key={16}
                            name="O_Web"
                            value={O_Web}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_Web}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O_ContactName</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={17}
                            name="O_ContactName"
                            value={O_ContactName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactName}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O_ContactEmail</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="email"
                            key={18}
                            name="O_ContactEmail"
                            value={O_ContactEmail}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactEmail}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>O_ContactTel</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="tel"
                            key={19}
                            name="O_ContactTel"
                            value={O_ContactTel}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactTel}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col
                    span={7}
                    style={{
                      margin: 20,
                      padding: 20,
                      backgroundColor: "#EBEAFF",
                    }}
                  >
                    <div>
                      <Row>
                        <h2 className="title-header">Author</h2>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>A0_ID_Author</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="number"
                            key={18}
                            name="A0_ID_Author"
                            value={A0_ID_Author}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A0_ID_Author}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>A0_ID_Author_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={19}
                            name="A0_ID_Author_WEB"
                            value={A0_ID_Author_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A0_ID_Author_WEB}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>A_AuthorImage</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={20}
                            name="A_AuthorImage"
                            value={A_AuthorImage}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A_AuthorImage}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>A_AuthorName</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={21}
                            name="A_AuthorName"
                            value={A_AuthorName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A_AuthorName}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>A_isAuthorHiden</Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            key={22}
                            checked={A_isAuthorHiden}
                            value={A_isAuthorHiden}
                            onChange={() =>
                              this.setState({
                                A_isAuthorHiden: !A_isAuthorHiden,
                              })
                            }
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <img
                          style={{
                            width: 150,
                            height: 150,
                          }}
                          src={A_Storage ? A_Storage : null}
                        />
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <h2 className="title-header">Illustrator</h2>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>I0_ID_Illustrator</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="number"
                            key={23}
                            name="I0_ID_Illustrator"
                            value={I0_ID_Illustrator}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.I0_ID_Illustrator}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>I0_ID_Illustrator_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={23}
                            name="I0_ID_Illustrator_WEB"
                            value={I0_ID_Illustrator_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={
                              validation_error?.I0_ID_Illustrator_WEB
                            }
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>I_IllustratorName</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={24}
                            name="I_IllustratorName"
                            value={I_IllustratorName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.I_IllustratorName}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "90%",
                          marginBottom: 12,
                        }}
                      >
                        <Col span={10}>
                          <Typography>_isIllustratorHidden</Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            key={25}
                            checked={_isIllustratorHidden}
                            value={_isIllustratorHidden}
                            onChange={() =>
                              this.setState({
                                _isIllustratorHidden: !_isIllustratorHidden,
                              })
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row>
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
                </Row>
              </span>
            ) : (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#EBEAFF",
                  margin: 20,
                  padding: 20,
                  border: "2px solid red",
                }}
              >
                <Row>
                  <Col span={12}>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Book</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BookTitle}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Author</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.A_AuthorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Illustrator</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.I_IllustratorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>Title</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.T_TaleTitle}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>T_TaleContent</Typography>
                      </Col>
                    </Row>
                    <Row>
                      <textarea
                        className="ant-input"
                        defaultValue={tales[currentIndex]?.T_TaleContent}
                        rows={10}
                        // cols={100}
                      ></textarea>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={12}>
                        <Row>
                          <img
                            style={{
                              width: 150,
                              height: 150,
                            }}
                            src={
                              tales[currentIndex]?.T_Storage
                                ? tales[currentIndex]?.T_Storage
                                : null
                            }
                          />
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_TaleImage</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              defaultValue={tales[currentIndex]?.T_TaleImage}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_Storage</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              defaultValue={tales[currentIndex]?.T_Storage}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>T_isTaleHidden</Typography>
                          </Col>
                          <Col span={14}>
                            <Checkbox
                              checked={tales[currentIndex]?.T_isTaleHidden}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>Len</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              readOnly
                              value={
                                new DOMParser().parseFromString(
                                  tales[currentIndex]?.T_TaleContent
                                    ? tales[currentIndex]?.T_TaleContent
                                    : "",
                                  "text/html"
                                ).body.textContent.length
                              }
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography>Time</Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              readOnly
                              value={
                                new DOMParser().parseFromString(
                                  tales[currentIndex]?.T_TaleContent
                                    ? tales[currentIndex]?.T_TaleContent
                                    : "",
                                  "text/html"
                                ).body.textContent.length / 238
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={14}>
                        <div
                          style={{
                            border: "2px solid black",
                            width: 400,
                            height: 300,
                          }}
                        >
                          {HTMLReactParser(
                            tales[currentIndex]?.T_TaleContent
                              ? tales[currentIndex]?.T_TaleContent
                              : ""
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Row>
                      <Typography className="title-header">Book</Typography>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B0_ID_Book</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B0_ID_Book}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_BAuthorName</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BAuthorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B0_ID_Book_WEB</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_Web}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_isBookFree</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox checked={tales[currentIndex]?.B_isBookFree} />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_isBookHidden</Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox
                          checked={tales[currentIndex]?.B_isBookHidden}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <img
                        style={{
                          width: "200px",
                          height: "200px",
                        }}
                        src={
                          tales[currentIndex]?.B_Storage
                            ? tales[currentIndex]?.B_Storage
                            : null
                        }
                      />
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_BookImage</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BookImage}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography>B_Storage</Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_Storage}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Row>
                        <Typography className="title-header">
                          Book Language
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>L_LanguageName</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.L_LanguageName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>L0_ID_Language</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.L0_ID_Language}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>L0_ID_Language_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.L0_ID_Language_WEB
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Typography className="title-header">
                          Book Owner
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O0_ID_Owner</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O0_ID_Owner}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O0_ID_Owner_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O0_ID_Owner_WEB}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O_Company</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_Company}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O_Web</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_Web}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O_ContactName</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O_ContactEmail</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactEmail}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>O_ContactTel</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactTel}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <Row>
                        <Typography className="title-header">Author</Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A0_ID_Author</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A0_ID_Author}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A0_ID_Author_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A0_ID_Author_WEB}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A_AuthorImage</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A_AuthorImage}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A_AuthorName</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A_AuthorName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A_isAuthorHiden</Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            checked={tales[currentIndex]?.A_isAuthorHiden}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <img
                          style={{
                            width: 150,
                            height: 150,
                          }}
                          src={
                            tales[currentIndex]?.A_Storage
                              ? tales[currentIndex]?.A_Storage
                              : null
                          }
                        />
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>A_Storage</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A_Storage}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row>
                        <Typography className="title-header">
                          Illustrator
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>I0_ID_Illustrator</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.I0_ID_Illustrator
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>I0_ID_Illustrator_WEB</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.I0_ID_Illustrator_WEB
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>I_IllustratorName</Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.I_IllustratorName
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography>_isIllustratorHidden</Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            checked={tales[currentIndex]?._isIllustratorHidden}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}
