import React, { Component } from "react";
import { Checkbox, Select } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { bookInputValidation } from "../../utilities/validation";
import HTMLReactParser from "html-react-parser";

const db = firebase.firestore();
const { Option } = Select;

export default class Tales extends Component {
  constructor() {
    super();
    this.state = {
      tales: [],
      currentIndex: 0,
      B_BookTitle: null,
      BAuthorName: null,
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
      .orderBy("00_ID_Tale", "asc")
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
      B_BookTitle: null,
      BAuthorName: null,
      B0_ID_Book: null,
      B_Web: null,
      A_AuthorName: false,
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
    });
  };

  handleSaveData = () => {
    const {
      B_BookTitle,
      BAuthorName,
      B0_ID_Book,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      L_LanguageName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      B_BookImage,
      BOOKOwner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
      file,
      Storage,
      tales,
    } = this.state;

    const { is_error, validation_error } = bookInputValidation({
      B_BookTitle,
      BAuthorName,
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
      tales,
    });

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`BookImages/${Math.random().toString().substring(5)}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef
              .getDownloadURL()
              .then((Storage) => {
                firebase
                  .firestore()
                  .collection("tales")
                  .add({
                    B_BookTitle,
                    BAuthorName,
                    B0_ID_Book,
                    B_Web,
                    B_isBookFree,
                    B_isBookHidden,
                    L_LanguageName,
                    L0_ID_Language,
                    L0_ID_Language_WEB,
                    B_BookImage,
                    BOOKOwner,
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
                      B0_ID_Book: null,
                      A_AuthorImage: null,
                      B_BookTitle: null,
                      file: null,
                      BAuthorName: false,
                      isAddNew: false,
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
      BAuthorName,
      Title_Tale,
      T_TaleImage,
      T_Storage,
      T_isTaleHidden,
      Content,
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
      owners,
      books,
      authors,
      languages,
      illustrators,
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
            <div className="row-container">
              <div>
                <div className="row">
                  <p>Book</p>
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
                </div>
                <div className="row">
                  <p>Author</p>
                  <Select
                    style={{ width: 250 }}
                    placeholder="Select Author"
                    value={BAuthorName}
                    onChange={(value) =>
                      this.setState({
                        ...authors[value],
                        A_Storage: authors[value].A_Storage,
                        BAuthorName: authors[value].A_AuthorName,
                      })
                    }
                  >
                    {authors.map((value, index) => (
                      <Option key={value.A0_ID_Author} value={index}>
                        {value.A_AuthorName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="row">
                  <p>Illustrator</p>
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
                </div>
                <div className="row">
                  <p>Title</p>
                  <ValidationInput
                    type="text"
                    key={1}
                    name="Title_Tale"
                    value={Title_Tale}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.Title_Tale}
                  />
                </div>
                <div className="row">
                  <p>Content</p>
                  <textarea
                    defaultValue={Content}
                    rows={10}
                    cols={100}
                    onChange={(e) => this.setState({ Content: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="row-container">
                  <div>
                    <div className="row">
                      <img
                        style={{
                          width: "200px",
                          height: "200px",
                        }}
                        src={T_Storage ? T_Storage : null}
                      />
                    </div>
                    <div>
                      <p>T_Storage</p>
                      <ValidationInput
                        type="file"
                        accept="image/*"
                        key={3}
                        name="T_TaleImage"
                        // value={Storage}
                        handleOnChange={(e) => {
                          this.setState({
                            T_TaleImage: e.target.files[0].name,
                            T_Storage: URL.createObjectURL(e.target.files[0]),
                            file: e.target.files[0],
                          });
                        }}
                        errorMessage={validation_error?.T_Storage}
                      />
                    </div>
                    <div className="row">
                      <p>T_TaleImage</p>
                      <ValidationInput
                        type="text"
                        key={121}
                        name="T_TaleImage"
                        value={T_TaleImage}
                        handleOnChange={this.handleOnChange}
                        errorMessage={validation_error?.T_TaleImage}
                      />
                    </div>
                    <div className="row">
                      <p>T_isTaleHidden</p>
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
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <p>Len</p>
                      <input
                        readOnly
                        value={
                          new DOMParser().parseFromString(
                            Content ? Content : "",
                            "text/html"
                          ).body.textContent.length
                        }
                      />
                    </div>
                    <div className="row">
                      <p>Time</p>
                      <input
                        readOnly
                        value={
                          new DOMParser().parseFromString(
                            Content ? Content : "",
                            "text/html"
                          ).body.textContent.length / 238
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    border: "2px solid black",
                    width: 400,
                    height: 300,
                  }}
                >
                  {HTMLReactParser(Content ? Content : "")}
                </div>
              </div>
            </div>
            <div className="row-container">
              <div>
                <div className="row">
                  <h2 className="title-header">Book</h2>
                </div>
                <div className="row">
                  <p>B0_ID_Book</p>
                  <ValidationInput
                    type="number"
                    key={5}
                    name="B0_ID_Book"
                    value={B0_ID_Book}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B0_ID_Book}
                  />
                </div>
                <div className="row">
                  <p>BAuthorName</p>
                  <ValidationInput
                    type="text"
                    key={6}
                    name="B0_ID_Book_WEB"
                    value={B0_ID_Book_WEB}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B0_ID_Book_WEB}
                  />
                </div>
                <div className="row">
                  <p>B0_ID_Book_WEB</p>
                  <ValidationInput
                    type="text"
                    key={7}
                    name="B0_ID_Book_WEB"
                    value={B0_ID_Book_WEB}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B0_ID_Book_WEB}
                  />
                </div>
                <div className="row">
                  <p>B_Web</p>
                  <ValidationInput
                    type="url"
                    key={8}
                    name="B_Web"
                    value={B_Web}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B_Web}
                  />
                </div>
                <div className="row">
                  <p>B_isBookFree</p>
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
                </div>
                <div className="row">
                  <p>B_isBookHidden</p>
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
                </div>
                <div className="row">
                  <img
                    style={{
                      width: "200px",
                      height: "200px",
                    }}
                    src={B_Storage ? B_Storage : null}
                  />
                </div>
                <div className="row">
                  <p>B_BookImage</p>
                  <ValidationInput
                    type="text"
                    key={8}
                    name="B_BookImage"
                    value={B_BookImage}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B_BookImage}
                  />
                </div>
                <div className="row">
                  <p>B_Storage</p>
                  <ValidationInput
                    type="text"
                    key={8}
                    name="B_Storage"
                    value={B_Storage}
                    handleOnChange={this.handleOnChange}
                    errorMessage={validation_error?.B_Storage}
                  />
                </div>
              </div>
              <div>
                <div>
                  <div className="row">
                    <h2 className="title-header">Book Language</h2>
                  </div>
                  <div className="row">
                    <p>L_LanguageName</p>
                    <ValidationInput
                      type="text"
                      key={10}
                      name="L_LanguageName"
                      value={L_LanguageName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.L_LanguageName}
                    />
                  </div>
                  <div className="row">
                    <p>L0_ID_Language</p>
                    <ValidationInput
                      type="number"
                      key={11}
                      name="L0_ID_Language"
                      value={L0_ID_Language}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.L0_ID_Language}
                    />
                  </div>
                  <div className="row">
                    <p>L0_ID_Language_WEB</p>
                    <ValidationInput
                      type="text"
                      key={11}
                      name="L0_ID_Language_WEB"
                      value={L0_ID_Language_WEB}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.L0_ID_Language_WEB}
                    />
                  </div>
                </div>
                <div>
                  <div className="row">
                    <h2 className="title-header">Book Owner</h2>
                  </div>
                  <div className="row">
                    <p>O0_ID_Owner</p>
                    <ValidationInput
                      type="number"
                      key={12}
                      name="O0_ID_Owner"
                      value={O0_ID_Owner}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O0_ID_Owner}
                    />
                  </div>
                  <div className="row">
                    <p>O0_ID_Owner_WEB</p>
                    <ValidationInput
                      type="text"
                      key={13}
                      name="O0_ID_Owner_WEB"
                      value={O0_ID_Owner_WEB}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O0_ID_Owner_WEB}
                    />
                  </div>
                  <div className="row">
                    <p>O_Company</p>
                    <ValidationInput
                      type="text"
                      key={13}
                      name="O_Company"
                      value={O_Company}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_Company}
                    />
                  </div>
                  <div className="row">
                    <p>O_Web</p>
                    <ValidationInput
                      type="url"
                      key={14}
                      name="O_Web"
                      value={O_Web}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_Web}
                    />
                  </div>
                  <div className="row">
                    <p>O_ContactName</p>
                    <ValidationInput
                      type="text"
                      key={15}
                      name="O_ContactName"
                      value={O_ContactName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactName}
                    />
                  </div>
                  <div className="row">
                    <p>O_ContactEmail</p>
                    <ValidationInput
                      type="email"
                      key={16}
                      name="O_ContactEmail"
                      value={O_ContactEmail}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactEmail}
                    />
                  </div>
                  <div className="row">
                    <p>O_ContactTel</p>
                    <ValidationInput
                      type="tel"
                      key={17}
                      name="O_ContactTel"
                      value={O_ContactTel}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.O_ContactTel}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="row">
                    <h2 className="title-header">Author</h2>
                  </div>
                  <div className="row">
                    <p>A0_ID_Author</p>
                    <ValidationInput
                      type="number"
                      key={18}
                      name="A0_ID_Author"
                      value={A0_ID_Author}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.A0_ID_Author}
                    />
                  </div>
                  <div className="row">
                    <p>A0_ID_Author_WEB</p>
                    <ValidationInput
                      type="text"
                      key={19}
                      name="A0_ID_Author_WEB"
                      value={A0_ID_Author_WEB}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.A0_ID_Author_WEB}
                    />
                  </div>
                  <div className="row">
                    <p>A_AuthorImage</p>
                    <ValidationInput
                      type="text"
                      key={20}
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
                      key={21}
                      name="A_AuthorName"
                      value={A_AuthorName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.A_AuthorName}
                    />
                  </div>
                  <div className="row">
                    <p>A_isAuthorHiden</p>
                    <Checkbox
                      key={10}
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
                      src={A_Storage ? A_Storage : null}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <h2 className="title-header">Illustrator</h2>
                  </div>
                  <div className="row">
                    <p>I0_ID_Illustrator</p>
                    <ValidationInput
                      type="number"
                      key={22}
                      name="I0_ID_Illustrator"
                      value={I0_ID_Illustrator}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.I0_ID_Illustrator}
                    />
                  </div>
                  <div className="row">
                    <p>I0_ID_Illustrator_WEB</p>
                    <ValidationInput
                      type="text"
                      key={23}
                      name="I0_ID_Illustrator_WEB"
                      value={I0_ID_Illustrator_WEB}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.I0_ID_Illustrator_WEB}
                    />
                  </div>

                  <div className="row">
                    <p>I_IllustratorName</p>
                    <ValidationInput
                      type="text"
                      key={24}
                      name="I_IllustratorName"
                      value={I_IllustratorName}
                      handleOnChange={this.handleOnChange}
                      errorMessage={validation_error?.I_IllustratorName}
                    />
                  </div>
                  <div className="row">
                    <p>_isIllustratorHidden</p>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="row-container">
              <div>
                <div className="row">
                  <p>Book</p>
                  <input defaultValue={tales[currentIndex]?.B_BookTitle} />
                </div>
                <div className="row">
                  <p>Author</p>
                  <input defaultValue={tales[currentIndex]?.B_BAuthorName} />
                </div>
                <div className="row">
                  <p>Illustrator</p>
                  <input
                    defaultValue={tales[currentIndex]?.I_IllustratorName}
                  />
                </div>
                <div className="row">
                  <p>Title</p>
                  <input defaultValue={tales[currentIndex]?.Title_Tale} />
                </div>
                <div className="row">
                  <p>Content</p>
                  <textarea
                    defaultValue={tales[currentIndex]?.Content}
                    rows={10}
                    cols={100}
                  ></textarea>
                </div>
              </div>
              <div>
                <div className="row-container">
                  <div>
                    <div className="row">
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
                    </div>
                    <div className="row">
                      <p>T_TaleImage</p>
                      <input defaultValue={tales[currentIndex]?.T_TaleImage} />
                    </div>
                    <div className="row">
                      <p>T_isTaleHidden</p>
                      <Checkbox checked={tales[currentIndex]?.T_isTaleHidden} />
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <p>Len</p>
                      <input
                        defaultValue={
                          new DOMParser().parseFromString(
                            tales[currentIndex]?.Content
                              ? tales[currentIndex]?.Content
                              : "",
                            "text/html"
                          ).body.textContent.length
                        }
                      />
                    </div>
                    <div className="row">
                      <p>Time</p>
                      <input
                        defaultValue={
                          new DOMParser().parseFromString(
                            tales[currentIndex]?.Content
                              ? tales[currentIndex]?.Content
                              : "",
                            "text/html"
                          ).body.textContent.length / 238
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    border: "2px solid black",
                    width: 400,
                    height: 300,
                  }}
                >
                  {HTMLReactParser(
                    tales[currentIndex]?.Content
                      ? tales[currentIndex]?.Content
                      : ""
                  )}
                </div>
              </div>
            </div>
            <div className="row-container">
              <div>
                <div className="row">
                  <h2 className="title-header">Book</h2>
                </div>
                <div className="row">
                  <p>B0_ID_Book</p>
                  <input defaultValue={tales[currentIndex]?.B0_ID_Book} />
                </div>
                <div className="row">
                  <p>BAuthorName</p>
                  <input defaultValue={tales[currentIndex]?.B_BAuthorName} />
                </div>
                <div className="row">
                  <p>B0_ID_Book_WEB</p>
                  <input defaultValue={tales[currentIndex]?.B0_ID_Book_WEB} />
                </div>
                <div className="row">
                  <p>B_Web</p>
                  <input defaultValue={tales[currentIndex]?.B_Web} />
                </div>
                <div className="row">
                  <p>B_isBookFree</p>
                  <Checkbox checked={tales[currentIndex]?.B_isBookFree} />
                </div>
                <div className="row">
                  <p>B_isBookHidden</p>
                  <Checkbox checked={tales[currentIndex]?.B_isBookHidden} />
                </div>
                <div className="row">
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
                </div>
                <div className="row">
                  <p>B_BookImage</p>
                  <input defaultValue={tales[currentIndex]?.B_BookImage} />
                </div>
                <div className="row">
                  <p>B_Storage</p>
                  <input defaultValue={tales[currentIndex]?.B_Storage} />
                </div>
              </div>
              <div>
                <div>
                  <div className="row">
                    <h2 className="title-header">Book Language</h2>
                  </div>
                  <div className="row">
                    <p>L_LanguageName</p>
                    <input defaultValue={tales[currentIndex]?.L_LanguageName} />
                  </div>
                  <div className="row">
                    <p>L0_ID_Language</p>
                    <input defaultValue={tales[currentIndex]?.L0_ID_Language} />
                  </div>
                  <div className="row">
                    <p>L0_ID_Language_WEB</p>
                    <input
                      defaultValue={tales[currentIndex]?.L0_ID_Language_WEB}
                    />
                  </div>
                </div>
                <div>
                  <div className="tales[currentIndex]?.Contentrow">
                    <h2 className="title-header">Book Owner</h2>
                  </div>
                  <div className="row">
                    <p>O0_ID_Owner</p>
                    <input defaultValue={tales[currentIndex]?.O0_ID_Owner} />
                  </div>
                  <div className="row">
                    <p>O0_ID_Owner_WEB</p>
                    <input
                      defaultValue={tales[currentIndex]?.O0_ID_Owner_WEB}
                    />
                  </div>
                  <div className="row">
                    <p>O_Company</p>
                    <input defaultValue={tales[currentIndex]?.O_Company} />
                  </div>
                  <div className="row">
                    <p>O_Web</p>
                    <input defaultValue={tales[currentIndex]?.O_Web} />
                  </div>
                  <div className="row">
                    <p>O_ContactName</p>
                    <input defaultValue={tales[currentIndex]?.O_ContactName} />
                  </div>
                  <div className="row">
                    <p>O_ContactEmail</p>
                    <input defaultValue={tales[currentIndex]?.O_ContactEmail} />
                  </div>
                  <div className="row">
                    <p>O_ContactTel</p>
                    <input defaultValue={tales[currentIndex]?.O_ContactTel} />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="row">
                    <h2 className="title-header">Author</h2>
                  </div>
                  <div className="row">
                    <p>A0_ID_Author</p>
                    <input defaultValue={tales[currentIndex]?.A0_ID_Author} />
                  </div>
                  <div className="row">
                    <p>A0_ID_Author_WEB</p>
                    <input
                      defaultValue={tales[currentIndex]?.A0_ID_Author_WEB}
                    />
                  </div>
                  <div className="row">
                    <p>A_AuthorImage</p>
                    <input defaultValue={tales[currentIndex]?.A_AuthorImage} />
                  </div>
                  <div className="row">
                    <p>A_AuthorName</p>
                    <input defaultValue={tales[currentIndex]?.A_AuthorName} />
                  </div>
                  <div className="row">
                    <p>A_isAuthorHiden</p>
                    <Checkbox checked={tales[currentIndex]?.A_isAuthorHiden} />
                  </div>
                  <div className="row">
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                      src={
                        tales[currentIndex]?.A_Storage
                          ? tales[currentIndex]?.A_Storage
                          : null
                      }
                    />
                  </div>
                  <div className="row">
                    <p>A_Storage</p>
                    <input defaultValue={tales[currentIndex]?.A_Storage} />
                  </div>
                </div>
                <div>
                  <div>
                    <h2 className="title-header">Illustrator</h2>
                  </div>
                  <div className="row">
                    <p>I0_ID_Illustrator</p>
                    <input
                      defaultValue={tales[currentIndex]?.I0_ID_Illustrator}
                    />
                  </div>
                  <div className="row">
                    <p>I0_ID_Illustrator_WEB</p>
                    <input
                      defaultValue={tales[currentIndex]?.I0_ID_Illustrator_WEB}
                    />
                  </div>
                  <div className="row">
                    <p>I_IllustratorName</p>
                    <input
                      defaultValue={tales[currentIndex]?.I_IllustratorName}
                    />
                  </div>
                  <div className="row">
                    <p>_isIllustratorHidden</p>
                    <Checkbox
                      checked={tales[currentIndex]?._isIllustratorHidden}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
