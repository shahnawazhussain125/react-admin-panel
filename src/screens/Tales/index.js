import React, { Component } from "react";
import { Checkbox, Select, Row, Col, Button, Typography, Input } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { talesInputValidation } from "../../utils/validation";
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
      A_isAuthorHidden: false,
      B_BookTitle: "",
      B_BAuthorName: "",
      B0_ID_Book: "",
      B_Web: "",
      B_isBookFree: false,
      B_isBookHidden: false,
      L_LanguageName: "",
      L0_ID_Language: "",
      L0_ID_Language_WEB: "",
      storage: "",
      B_BookImage: "",
      BOOKOwner: "",
      O_Company: "",
      O_Web: "",
      O_ContactName: "",
      O_ContactEmail: "",
      O_ContactTel: "",
      O0_ID_Owner: "",
      O0_ID_Owner_WEB: "",
      isAddNew: false,
      isLoading: true,
      authors: [],
      languages: [],
      owners: [],
      books: [],
      illustrators: [],
      validation_error: null,
      imagesName: [],
    };
  }

  getAllLanguageAndAuthor = () => {
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
        console.log("Error", error);
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  getAllTales = () => {
    let tales = [];
    firebase
      .firestore()
      .collection("Tales")
      .orderBy("T_TaleTitle", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          tales.push({
            ...doc.data(),
            T0_ID_Tale_WEB: doc.id,
            T0_ID_Tale: doc.data().T0_ID_Tale,
            A0_ID_Author: doc.data().A0_ID_Author,
            B0_ID_Book: doc.data().B0_ID_Book,
            I0_ID_Illustrator: doc.data().I0_ID_Illustrator,
            L0_ID_Language: doc.data().L0_ID_Language,
            O0_ID_Owner: doc.data().O0_ID_Owner,
          });
        });
        this.setState({
          tales,
        });
      })
      .catch((error) => {
        console.log("Error", error);
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  getAllImageFileName = () => {
    let imagesName = [];

    firebase
      .storage()
      .ref()
      .child("TaleImages")
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

  componentDidMount() {
    this.getAllTales();
    this.getAllLanguageAndAuthor();
    this.getAllImageFileName();
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
      isEdit: false,
      isAddNew: true,
      A0_ID_Author: "",
      A0_ID_Author_WEB: "",
      A_AuthorImage: "",
      A_AuthorName: "",
      A_isAuthorHidden: false,
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
      I_isIllustratorHidden: false,
    });
  };

  handleSaveData = () => {
    const {
      T0_ID_Tale,
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHidden,
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
      I_isIllustratorHidden,
      file,
      imagesName,
      tales,
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
      imagesName,
      T0_ID_Tale,
      tales,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`TaleImages/${T_TaleImage}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef
              .getDownloadURL()
              .then((Storage) => {
                firebase
                  .firestore()
                  .collection("Tales")
                  .add({
                    A0_ID_Author,
                    A0_ID_Author_WEB,
                    A_AuthorImage,
                    A_AuthorName,
                    A_isAuthorHidden,
                    A_Storage,
                    B_BookTitle,
                    B_BAuthorName,
                    T0_ID_Tale,
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
                    I_isIllustratorHidden,
                    T_Storage: Storage,
                  })
                  .then(() => {
                    notify.show(
                      "Tale has been successfully added",
                      "success",
                      2000
                    );
                    this.setState({
                      T0_ID_Tale: "",
                      A0_ID_Author: "",
                      A0_ID_Author_WEB: "",
                      A_AuthorImage: "",
                      A_AuthorName: "",
                      A_isAuthorHidden: false,
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
                      I_isIllustratorHidden: false,
                      file: null,
                      isAddNew: false,
                      isEdit: false,
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

  handleOnUpdate = () => {
    const {
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      T_TaleTitle,
      T_TaleImage,
      T_Storage,
      T_TaleContent,
      B0_ID_Book,
      B0_ID_Book_WEB,
      B_Web,
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
      file,
      imagesName,
      tales,
      currentIndex,
      T0_ID_Tale,
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
      imagesName: imagesName.filter(
        (name) => name !== tales[currentIndex].T_TaleImage
      ),
      T0_ID_Tale,
      tales: tales.filter((value, index) => index !== currentIndex),
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        if (file) {
          let storageRef = firebase
            .storage()
            .ref()
            .child(`TaleImages/${T_TaleImage}`);

          storageRef
            .put(file)
            .then(() => {
              storageRef
                .getDownloadURL()
                .then((T_Storage) => {
                  this.handleUpdateData(T_Storage);
                })
                .catch((error) => {
                  notify.show(`Error! ${error.message}`, "error", 2000);
                });
            })
            .catch((error) => {
              notify.show(`Error! ${error.message}`, "error", 2000);
            });
        } else {
          this.handleUpdateData(T_Storage);
        }
      }
    });
  };

  handleUpdateData = (T_Storage) => {
    const {
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHidden,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      T_TaleTitle,
      T_TaleImage,
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
      I_isIllustratorHidden,
      tales,
      currentIndex,
      T0_ID_Tale_WEB,
      T0_ID_Tale,
    } = this.state;

    firebase
      .firestore()
      .collection("Tales")
      .doc(T0_ID_Tale_WEB)
      .update({
        T0_ID_Tale,
        A0_ID_Author,
        A0_ID_Author_WEB,
        A_AuthorImage,
        A_AuthorName,
        A_isAuthorHidden,
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
        I_isIllustratorHidden,
      })
      .then(() => {
        notify.show("Tale has been successfully updated", "success", 2000);
        tales[currentIndex] = {
          T0_ID_Tale,
          A0_ID_Author,
          A0_ID_Author_WEB,
          A_AuthorImage,
          A_AuthorName,
          A_isAuthorHidden,
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
          I_isIllustratorHidden,
          T0_ID_Tale_WEB,
        };

        this.setState({
          T0_ID_Tale: "",
          A0_ID_Author: "",
          A0_ID_Author_WEB: "",
          A_AuthorImage: "",
          A_AuthorName: "",
          A_isAuthorHidden: false,
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
          I_isIllustratorHidden: false,
          file: null,
          isAddNew: false,
          isEdit: false,
          tales,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  handleOnChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleTextToTag = (tag) => {
    let { T_TaleContent } = this.state;

    console.log("window.getSelection()", window.getSelection());
    let selectedText = window.getSelection().toString();

    if (selectedText?.trim()?.length !== 0) {
      if (tag === "bold") {
        this.setState({
          T_TaleContent: T_TaleContent.replace(
            selectedText,
            `<b>${selectedText}</b>`
          ),
        });
      } else if (tag === "italic") {
        this.setState({
          T_TaleContent: T_TaleContent.replace(
            selectedText,
            `<i>${selectedText}</i>`
          ),
        });
      } else {
        this.setState({
          T_TaleContent: T_TaleContent.replace(
            selectedText,
            `<u>${selectedText}</u>`
          ),
        });
      }
    }
  };

  render() {
    const {
      A0_ID_Author,
      A0_ID_Author_WEB,
      A_AuthorImage,
      A_AuthorName,
      A_isAuthorHidden,
      A_Storage,
      B_BookTitle,
      B_BAuthorName,
      T0_ID_Tale,
      T0_ID_Tale_WEB,
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
      I_isIllustratorHidden,
      isAddNew,
      tales,
      currentIndex,
      books,
      authors,
      owners,
      languages,
      illustrators,
      validation_error,
      isEdit,
    } = this.state;

    let noOfCharacter = T_TaleContent
      ? new DOMParser().parseFromString(T_TaleContent, "text/html").body
          .textContent?.length
      : 0;

    let lengthOfContent = new DOMParser().parseFromString(
      tales[currentIndex]?.T_TaleContent
        ? tales[currentIndex]?.T_TaleContent
        : "",
      "text/html"
    ).body.textContent?.length;

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
              noOfDocument={tales.length}
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
                {isEdit ? "Update Tale" : "Add New Tale"}
              </p>
            </Row>
          )}
          <Row>
            {isAddNew ? (
              <span
                style={{
                  backgroundColor: "#EBEAFF",
                  padding: 20,
                  margin: 20,
                }}
              >
                <Row>
                  <Col
                    span={12}
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                    }}
                  >
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={6}>
                        <Typography className="input-title">Book</Typography>
                      </Col>
                      <Col span={18}>
                        <Select
                          style={{ width: "100%" }}
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
                      <Col span={6}>
                        <Typography className="input-title">Author</Typography>
                      </Col>
                      <Col span={18}>
                        <Select
                          style={{ width: "100%" }}
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
                      <Col span={6}>
                        <Typography className="input-title">
                          Illustrator
                        </Typography>
                      </Col>
                      <Col span={18}>
                        <Select
                          style={{ width: "100%" }}
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
                      <Col span={6}>
                        <Typography
                          style={{ fontWeight: "bold", fontSize: 15 }}
                          className="input-title"
                        >
                          Title
                        </Typography>
                      </Col>
                      <Col span={18}>
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
                      <Col span={6}>
                        <Typography className="input-title">
                          T_TaleContent
                        </Typography>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: 10 }}>
                      <textarea
                        key={150}
                        value={T_TaleContent}
                        rows={10}
                        cols={90}
                        onChange={(e) =>
                          this.setState({ T_TaleContent: e.target.value })
                        }
                      ></textarea>
                    </Row>
                    <Row style={{ marginBottom: 10, marginTop: 10 }}>
                      <Col span={6}>
                        <Typography className="input-title">
                          T0_ID_Tale
                        </Typography>
                      </Col>
                      <Col span={18}>
                        <ValidationInput
                          type="text"
                          key={2}
                          name="T0_ID_Tale"
                          value={T0_ID_Tale}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.T0_ID_Tale}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      backgroundColor: "#EBEAFF",
                      padding: 20,
                    }}
                  >
                    <Row>
                      <Col span={14}>
                        <Row
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: 12,
                          }}
                        >
                          <img
                            key={Math.random()}
                            style={{
                              width: 150,
                              height: 150,
                            }}
                            src={T_Storage ? T_Storage : null}
                          />
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              T_Storage
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <ValidationInput
                              key={3}
                              type="file"
                              accept="image/*"
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
                            <Typography className="input-title">
                              T_TaleImage
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <ValidationInput
                              type="text"
                              key={4}
                              name="T_TaleImage"
                              value={T_TaleImage}
                              handleOnChange={this.handleOnChange}
                              errorMessage={validation_error?.T_TaleImage}
                            />
                          </Col>
                        </Row>

                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              T_isTaleHidden
                            </Typography>
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
                      <Col span={10}>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">Len</Typography>
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
                            <Typography className="input-title">
                              Time
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <input
                              className="ant-input"
                              readOnly
                              value={(noOfCharacter / 238).toFixed(2)}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 50 }}>
                          <Col span={5} offset={2}>
                            <Button
                              onClick={() => this.handleTextToTag("bold")}
                            >
                              Bold
                            </Button>
                          </Col>
                          <Col span={5} offset={2}>
                            <Button
                              onClick={() => this.handleTextToTag("italic")}
                            >
                              Italic
                            </Button>
                          </Col>
                          <Col span={5} offset={2}>
                            <Button
                              onClick={() => this.handleTextToTag("underline")}
                            >
                              Uderline
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Typography
                        className="ant-input"
                        style={{
                          backgroundColor: "#fff",
                          width: "100%",
                          height: 300,
                          overflow: "scroll",
                        }}
                      >
                        {HTMLReactParser(
                          T_TaleContent
                            ? T_TaleContent.split("\n").join("<br/>")
                            : ""
                        )}
                      </Typography>
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
                    <Row className="title-header-container">
                      <h2 className="title-header">Book</h2>
                    </Row>

                    <Row
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      <Col span={10}>
                        <Typography className="input-title">
                          B_BAuthorName
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={5}
                          type="text"
                          name="B0_ID_Book_WEB"
                          value={B0_ID_Book_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          key={6}
                          type="url"
                          name="B_Web"
                          value={B_Web}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_Web}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_isBookFree
                        </Typography>
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
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_isBookHidden
                        </Typography>
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
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_BookImage
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={7}
                          name="B_BookImage"
                          value={B_BookImage}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B_BookImage}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_Storage
                        </Typography>
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
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B0_ID_Book
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={9}
                          name="B0_ID_Book"
                          value={B0_ID_Book}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 12 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B0_ID_Book_WEB
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <ValidationInput
                          type="text"
                          key={10}
                          name="B0_ID_Book_WEB"
                          value={B0_ID_Book_WEB}
                          handleOnChange={this.handleOnChange}
                          errorMessage={validation_error?.B0_ID_Book_WEB}
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
                      <Row className="title-header-container">
                        <h2 className="title-header">Book Language</h2>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L_LanguageName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={11}
                            name="L_LanguageName"
                            value={L_LanguageName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L_LanguageName}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L0_ID_Language
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={12}
                            name="L0_ID_Language"
                            value={L0_ID_Language}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L0_ID_Language}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L0_ID_Language_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={13}
                            name="L0_ID_Language_WEB"
                            value={L0_ID_Language_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.L0_ID_Language_WEB}
                          />
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row className="title-header-container">
                        <h2 className="title-header">Book Owner</h2>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_Company
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={14}
                            name="O_Company"
                            value={O_Company}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_Company}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">O_Web</Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="url"
                            key={15}
                            name="O_Web"
                            value={O_Web}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_Web}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_ContactName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={16}
                            name="O_ContactName"
                            value={O_ContactName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactName}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_ContactEmail
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="email"
                            key={17}
                            name="O_ContactEmail"
                            value={O_ContactEmail}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactEmail}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_ContactTel
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="tel"
                            key={18}
                            name="O_ContactTel"
                            value={O_ContactTel}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O_ContactTel}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O0_ID_Owner
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={19}
                            name="O0_ID_Owner"
                            value={O0_ID_Owner}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O0_ID_Owner}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O0_ID_Owner_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={20}
                            name="O0_ID_Owner_WEB"
                            value={O0_ID_Owner_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.O0_ID_Owner_WEB}
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
                      <Row className="title-header-container">
                        <h2 className="title-header">Author</h2>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_AuthorImage
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={21}
                            name="A_AuthorImage"
                            value={A_AuthorImage}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A_AuthorImage}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_AuthorName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={22}
                            name="A_AuthorName"
                            value={A_AuthorName}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A_AuthorName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_isAuthorHidden
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            key={22}
                            checked={A_isAuthorHidden}
                            value={A_isAuthorHidden}
                            onChange={() =>
                              this.setState({
                                A_isAuthorHidden: !A_isAuthorHidden,
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
                          src={A_Storage ? A_Storage : null}
                        />
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A0_ID_Author
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={23}
                            name="A0_ID_Author"
                            value={A0_ID_Author}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A0_ID_Author}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A0_ID_Author_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={24}
                            name="A0_ID_Author_WEB"
                            value={A0_ID_Author_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.A0_ID_Author_WEB}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row className="title-header-container">
                        <h2 className="title-header">Illustrator</h2>
                      </Row>

                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I_IllustratorName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={25}
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
                          <Typography className="input-title">
                            II_isIllustratorHidden
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            key={25}
                            checked={I_isIllustratorHidden}
                            value={I_isIllustratorHidden}
                            onChange={() =>
                              this.setState({
                                I_isIllustratorHidden: !I_isIllustratorHidden,
                              })
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I0_ID_Illustrator
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={26}
                            name="I0_ID_Illustrator"
                            value={I0_ID_Illustrator}
                            handleOnChange={this.handleOnChange}
                            errorMessage={validation_error?.I0_ID_Illustrator}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 12 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I0_ID_Illustrator_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <ValidationInput
                            type="text"
                            key={27}
                            name="I0_ID_Illustrator_WEB"
                            value={I0_ID_Illustrator_WEB}
                            handleOnChange={this.handleOnChange}
                            errorMessage={
                              validation_error?.I0_ID_Illustrator_WEB
                            }
                          />
                        </Col>
                      </Row>
                    </div>
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
              </span>
            ) : (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#EBEAFF",
                  margin: 20,
                  paddingTop: 20,
                }}
              >
                <Row>
                  <Col span={10} offset={1}>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={6}>
                        <Typography className="input-title">Book</Typography>
                      </Col>
                      <Col span={18}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BookTitle}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={6}>
                        <Typography className="input-title">Author</Typography>
                      </Col>
                      <Col span={18}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.A_AuthorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={6}>
                        <Typography className="input-title">
                          Illustrator
                        </Typography>
                      </Col>
                      <Col span={18}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.I_IllustratorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={6}>
                        <Typography
                          style={{ fontSize: 15, fontWeight: "bold" }}
                          className="input-title"
                        >
                          Title
                        </Typography>
                      </Col>
                      <Col span={18}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.T_TaleTitle}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography
                          className="input-title"
                          ellipsis={{ rows: 3, expandable: true }}
                        >
                          T_TaleContent
                        </Typography>
                      </Col>
                    </Row>
                    <Row>
                      <textarea
                        className="ant-input"
                        key={Math.random()}
                        defaultValue={tales[currentIndex]?.T_TaleContent}
                        rows={16}
                        readOnly={true}
                      ></textarea>
                    </Row>
                  </Col>
                  <Col span={10} offset={1}>
                    <Row>
                      <Col span={12}>
                        <Row style={{ marginBottom: 10 }}>
                          <img
                            key={Math.random()}
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
                            <Typography className="input-title">
                              T_TaleImage
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <Input
                              key={Math.random()}
                              readOnly
                              className="ant-input"
                              defaultValue={tales[currentIndex]?.T_TaleImage}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              T_Storage
                            </Typography>
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
                            <Typography className="input-title">
                              T_isTaleHidden
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <Checkbox
                              checked={tales[currentIndex]?.T_isTaleHidden}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row style={{ marginBottom: 10, marginTop: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              T0_ID_Tale
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <Input
                              key={Math.random()}
                              readOnly
                              className="ant-input"
                              defaultValue={tales[currentIndex]?.T0_ID_Tale}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              T0_ID_Tale_WEB
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <Input
                              key={Math.random()}
                              readOnly
                              className="ant-input"
                              defaultValue={tales[currentIndex]?.T0_ID_Tale_WEB}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">Len</Typography>
                          </Col>
                          <Col span={14}>
                            <Typography
                              className="ant-input"
                              ellipsis={{ rows: 3, expandable: true }}
                            >
                              {lengthOfContent.toFixed(2)}
                            </Typography>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={10}>
                            <Typography className="input-title">
                              Time
                            </Typography>
                          </Col>
                          <Col span={14}>
                            <Typography
                              className="ant-input"
                              ellipsis={{ rows: 3, expandable: true }}
                            >
                              {(lengthOfContent / 238).toFixed(2)}
                            </Typography>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Typography
                        className="ant-input"
                        ellipsis={{ rows: 3, expandable: true }}
                        style={{
                          width: "100%",
                          height: 300,
                          overflow: "scroll",
                        }}
                      >
                        {HTMLReactParser(
                          tales[currentIndex]?.T_TaleContent
                            ? tales[currentIndex]?.T_TaleContent.split(
                                "\n"
                              ).join("<br/>")
                            : ""
                        )}
                      </Typography>
                    </Row>
                  </Col>
                </Row>
                <Row gutter={[8, 24]}>
                  <Col span={7} offset={1}>
                    <Row className="title-header-container">
                      <Typography className="title-header">Book</Typography>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_BAuthorName
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BAuthorName}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">B_Web</Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_Web}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_isBookFree
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <Checkbox checked={tales[currentIndex]?.B_isBookFree} />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_isBookHidden
                        </Typography>
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
                        <Typography className="input-title">
                          B_BookImage
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_BookImage}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B_Storage
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B_Storage}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B0_ID_Book
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <Input
                          key={Math.random()}
                          readOnly
                          className="ant-input"
                          defaultValue={tales[currentIndex]?.B0_ID_Book}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                      <Col span={10}>
                        <Typography className="input-title">
                          B0_ID_Book_WEB
                        </Typography>
                      </Col>
                      <Col span={14}>
                        <input
                          className="ant-input"
                          readOnly
                          defaultValue={tales[currentIndex]?.B0_ID_Book_WEB}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={7} offset={1}>
                    <div>
                      <Row className="title-header-container">
                        <Typography className="title-header">
                          Book Language
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L_LanguageName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.L_LanguageName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L0_ID_Language
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.L0_ID_Language}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            L0_ID_Language_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            readOnly
                            defaultValue={
                              tales[currentIndex]?.L0_ID_Language_WEB
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row className="title-header-container">
                        <Typography className="title-header">
                          Book Owner
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography
                            className="input-title"
                            ellipsis={{ rows: 3, expandable: true }}
                          >
                            O_Company
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_Company}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">O_Web</Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_Web}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography
                            className="input-title"
                            ellipsis={{ rows: 3, expandable: true }}
                          >
                            O_ContactName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactName}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_ContactEmail
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactEmail}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O_ContactTel
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O_ContactTel}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O0_ID_Owner
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.O0_ID_Owner}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            O0_ID_Owner_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            readOnly
                            defaultValue={tales[currentIndex]?.O0_ID_Owner_WEB}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={7} style={{ paddingLeft: 25 }}>
                    <div>
                      <Row className="title-header-container">
                        <Typography className="title-header">Author</Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_AuthorName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A_AuthorName}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_AuthorImage
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A_AuthorImage}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A0_ID_Author
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={tales[currentIndex]?.A0_ID_Author}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A0_ID_Author_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            readOnly
                            defaultValue={tales[currentIndex]?.A0_ID_Author_WEB}
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            A_isAuthorHidden
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            checked={tales[currentIndex]?.A_isAuthorHidden}
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
                          <Typography className="input-title">
                            A_Storage
                          </Typography>
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
                      <Row className="title-header-container">
                        <Typography className="title-header">
                          Illustrator
                        </Typography>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I_IllustratorName
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.I_IllustratorName
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I_isIllustratorHidden
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Checkbox
                            checked={tales[currentIndex]?.I_isIllustratorHidden}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I0_ID_Illustrator
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <Input
                            key={Math.random()}
                            readOnly
                            className="ant-input"
                            defaultValue={
                              tales[currentIndex]?.I0_ID_Illustrator
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                          <Typography className="input-title">
                            I0_ID_Illustrator_WEB
                          </Typography>
                        </Col>
                        <Col span={14}>
                          <input
                            className="ant-input"
                            readOnly
                            defaultValue={
                              tales[currentIndex]?.I0_ID_Illustrator_WEB
                            }
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
                              ...tales[currentIndex],
                            });
                          }}
                        >
                          Edit
                        </Button>
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
