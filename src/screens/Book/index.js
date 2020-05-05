import React, { Component } from "react";
import { Checkbox, Select } from "antd";
import { Row, Col, Button } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { bookInputValidation } from "../../utilities/validation";

const db = firebase.firestore();
const { Option } = Select;

export default class Book extends Component {
  constructor() {
    super();
    this.state = {
      books: [],
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
      validation_error: null,
    };
  }

  getAllLanguageAndAuther = () => {
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
      .orderBy("B0_ID_Book", "asc")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          books.push({
            B0_ID_Book_WEB: doc.id,
            B_BookTitle: doc.data()?.B_BookTitle,
            BAuthorName: doc.data()?.BAuthorName,
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
            BOOKOwner: doc.data()?.BOOKOwner,
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

  componentDidMount() {
    this.getAllBooks();
    this.getAllLanguageAndAuther();
  }

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
      isAddNew: true,
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
      books,
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
      books,
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
                  .collection("Books")
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

  handleOnChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
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
          <div className="row-container">
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
                <p>B_BookTitle</p>
                <ValidationInput
                  key={0}
                  type="text"
                  name="B_BookTitle"
                  value={B_BookTitle}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.B_BookTitle}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>BAuthorName</p>
                <ValidationInput
                  key={1}
                  type="text"
                  name="BAuthorName"
                  value={BAuthorName}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.BAuthorName}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B0_ID_Book</p>
                <ValidationInput
                  key={2}
                  type="number"
                  name="B0_ID_Book"
                  value={B0_ID_Book}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.B0_ID_Book}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_Web</p>
                <ValidationInput
                  key={4}
                  type="url"
                  name="B_Web"
                  value={B_Web}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.B_Web}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_isBookFree</p>
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_isBookHidden</p>
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ backgroundColor: "#885AF8", padding: 5 }}>
                  Book Language
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>BOOKOwner</p>
                <Select
                  style={{ width: 250 }}
                  placeholder="Select Owner"
                  onChange={(value) => this.setState({ ...languages[value] })}
                >
                  {languages.map((value, index) => (
                    <Option key={value.L0_ID_Language} value={index}>
                      {value.L_LanguageName}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L_LanguageName</p>
                <ValidationInput
                  key={5}
                  type="text"
                  name="L_LanguageName"
                  value={L_LanguageName}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.L_LanguageName}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L0_ID_Language</p>
                <ValidationInput
                  key={6}
                  type="number"
                  name="L0_ID_Language"
                  value={L0_ID_Language}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.L0_ID_Language}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L0_ID_Language_WEB</p>
                <ValidationInput
                  key={7}
                  type="text"
                  name="L0_ID_Language_WEB"
                  value={L0_ID_Language_WEB}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.L0_ID_Language_WEB}
                />
              </div>
            </div>
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
                <img
                  style={{
                    width: 130,
                    height: 130,
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
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_BookImage</p>
                <ValidationInput
                  key={9}
                  type="text"
                  name="B_BookImage"
                  value={B_BookImage}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.B_BookImage}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ backgroundColor: "#885AF8", padding: 5 }}>
                  Book Owner
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>BOOKOwner</p>
                <Select
                  style={{ width: 250 }}
                  placeholder="Select Owner"
                  onChange={(value) => this.setState({ ...owners[value] })}
                >
                  {owners.map((value, index) => (
                    <Option key={value.O0_ID_Owner} value={index}>
                      {value.O_ContactName}
                    </Option>
                  ))}
                </Select>
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
                  key={12}
                  type="text"
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
                  key={13}
                  type="url"
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
                  key={14}
                  type="text"
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
                  key={15}
                  type="email"
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
                  key={16}
                  type="tel"
                  name="O_ContactTel"
                  value={O_ContactTel}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.O_ContactTel}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O0_ID_Owner</p>
                <ValidationInput
                  key={17}
                  type="number"
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
                <p>O0_ID_Owner_WEB</p>
                <ValidationInput
                  key={18}
                  type="text"
                  name="O0_ID_Owner_WEB"
                  value={O0_ID_Owner_WEB}
                  handleOnChange={this.handleOnChange}
                  errorMessage={validation_error?.O0_ID_Owner_WEB}
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
          </div>
        ) : (
          <div className="row-container">
            <div
              style={{
                backgroundColor: "#EBEAFF",
                width: "25%",
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
                <p>B0_ID_Book</p>
                <input defaultValue={books[currentIndex]?.B0_ID_Book} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>BAuthorName</p>
                <input defaultValue={books[currentIndex]?.BAuthorName} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B0_ID_Book_WEB</p>
                <input defaultValue={books[currentIndex]?.B0_ID_Book_WEB} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_Web</p>
                <input defaultValue={books[currentIndex]?.B_Web} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_isBookFree</p>
                <Checkbox checked={books[currentIndex]?.B_isBookFree} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_isBookHidden</p>
                <Checkbox checked={books[currentIndex]?.B_isBookHidden} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ backgroundColor: "#885AF8", padding: 5 }}>
                  Book Language
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>BookLanguage</p>
                <input defaultValue={books[currentIndex]?.L_LanguageName} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L_LanguageName</p>
                <input defaultValue={books[currentIndex]?.L_LanguageName} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L0_ID_Language</p>
                <input defaultValue={books[currentIndex]?.L0_ID_Language} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>L0_ID_Language_WEB</p>
                <input defaultValue={books[currentIndex]?.L0_ID_Language_WEB} />
              </div>
            </div>
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
                <img
                  style={{
                    width: 130,
                    height: 130,
                  }}
                  src={books[currentIndex]?.Storage}
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
                <input defaultValue={books[currentIndex]?.Storage} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>B_BookImage</p>
                <input defaultValue={books[currentIndex]?.B_BookImage} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ backgroundColor: "#885AF8", padding: 5 }}>
                  Book Owner
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O_Company</p>
                <input defaultValue={books[currentIndex]?.O_Company} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O_Web</p>
                <input defaultValue={books[currentIndex]?.O_Web} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O_ContactName</p>
                <input defaultValue={books[currentIndex]?.O_ContactName} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O_ContactEmail</p>
                <input defaultValue={books[currentIndex]?.O_ContactEmail} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O_ContactTel</p>
                <input defaultValue={books[currentIndex]?.O_ContactTel} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O0_ID_Owner</p>
                <input defaultValue={books[currentIndex]?.O0_ID_Owner} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p>O0_ID_Owner_WEB</p>
                <input defaultValue={books[currentIndex]?.O0_ID_Owner_WEB} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
