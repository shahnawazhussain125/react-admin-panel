import React, { Component } from "react";
import { Checkbox, Select } from "antd";
import firebase from "../../config/firebase";
import Headers from "../../components/header";
import Notifications, { notify } from "react-notify-toast";
import ValidationInput from "../../components/ValidationInput";
import "./index.css";
import { bookInputValidation } from "../../utilities/validation";

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
      validation_error: null,
    };
  }

  getAllLanguageAndAuther = () => {
    let authors = [];
    let languages = [];
    let owners = [];
    let books = [];

    let allPromises = [];

    allPromises.push(db.collection("Authors").get());
    allPromises.push(db.collection("Owners").get());
    allPromises.push(db.collection("Languages").get());
    allPromises.push(db.collection("Books").get());

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
              });
            }
          });
          index++;
        });
        this.setState({ languages, owners, authors, books });
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
      tales,
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
            <div>
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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

              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
                <h2 className="title-header">Book Language</h2>
              </div>

              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
            <div>
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
              <div className="row">
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
              <div className="row">
                <h2 className="title-header">Book Owner</h2>
              </div>
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
              <div className="row">
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
                <div className="row">
                  <p>Book</p>
                  <input defaultValue={tales[currentIndex]?.B0_ID_Book} />
                </div>
                <div className="row">
                  <p>BAuthorName</p>
                  <input defaultValue={tales[currentIndex]?.BAuthorName} />
                </div>
                <div className="row">
                  <p>B0_ID_Book_WEB</p>
                  <input defaultValue={tales[currentIndex]?.B0_ID_Book_WEB} />
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
                  <div className="row">
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
