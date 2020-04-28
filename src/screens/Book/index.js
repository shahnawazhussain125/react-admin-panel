import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";

export default class Book extends Component {
  constructor() {
    super();
    this.state = {
      authors: [],
      currentIndex: 0,
      B_BookTitle: null,
      BAuthorName: null,
      B0_ID_Book: null,
      B0_ID_Book_WEB: null,
      B_Web: null,
      B_isBookFree: false,
      B_isBookHidden: false,
      L_LanguagaeName: null,
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
    };
  }

  getAllLanguage = () => {
    let authors = [];
    firebase
      .firestore()
      .collection("Books")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          authors.push({
            B0_ID_Book_WEB: doc.id,
            B_BookTitle: doc.data()?.B_BookTitle,
            BAuthorName: doc.data()?.BAuthorName,
            B0_ID_Book: doc.data()?.B0_ID_Book,
            B0_ID_Book_WEB: doc.data()?.B0_ID_Book_WEB,
            B_Web: doc.data()?.B_Web,
            B_isBookFree: doc.data()?.A_AuthorImage,
            B_isBookHidden: doc.data()?.B_isBookHidden,
            L_LanguagaeName: doc.data()?.L_LanguagaeName,
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
      B0_ID_Book: null,
      B_BookTitle: null,
      BAuthorName: false,
      A_AuthorImage: null,
    });
  };

  handleSaveData = () => {
    const {
      B0_ID_Book,
      A_AuthorImage,
      B_BookTitle,
      BAuthorName,
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
              .collection("Books")
              .add({
                B0_ID_Book,
                A_AuthorImage,
                B_BookTitle,
                BAuthorName,
                Storage,
              })
              .then(() => {
                notify.show(
                  "Author has been successfully added",
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
      B_BookTitle,
      BAuthorName,
      B0_ID_Book,
      B0_ID_Book_WEB,
      B_Web,
      B_isBookFree,
      B_isBookHidden,
      L_LanguagaeName,
      L0_ID_Language,
      L0_ID_Language_WEB,
      storage,
      B_BookImage,
      BOOKOwner,
      O_Company,
      O_Web,
      O_ContactName,
      O_ContactEmail,
      O_ContactTel,
      O0_ID_Owner,
      O0_ID_Owner_WEB,
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
          <div className="row-container">
            <div>
              <div className="row">
                <p>B_BookTitle</p>
                <input
                  key={0}
                  value={B0_ID_Book}
                  onChange={(e) =>
                    this.setState({ B_BookTitle: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>BAuthorName</p>
                <input
                  key={1}
                  value={BAuthorName}
                  onChange={(e) =>
                    this.setState({ BAuthorName: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>B0_ID_Book</p>
                <input
                  key={1}
                  value={B0_ID_Book}
                  onChange={(e) =>
                    this.setState({ B0_ID_Book: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>B0_ID_Book_WEB</p>
                <input
                  key={1}
                  value={B0_ID_Book_WEB}
                  onChange={(e) =>
                    this.setState({ B0_ID_Book_WEB: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>B_Web</p>
                <input
                  key={1}
                  value={B_Web}
                  onChange={(e) => this.setState({ B_Web: e.target.value })}
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
                <h3>Book Language</h3>
              </div>

              <div className="row">
                <p>BookLanguage</p>
                <input
                  key={1}
                  value={L_LanguagaeName}
                  onChange={(e) =>
                    this.setState({ L_LanguagaeName: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>L_LanguagaeName</p>
                <input
                  key={1}
                  value={L_LanguagaeName}
                  onChange={(e) =>
                    this.setState({ L_LanguagaeName: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>L0_ID_Language</p>
                <input
                  key={1}
                  value={L0_ID_Language}
                  onChange={(e) =>
                    this.setState({ L0_ID_Language: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>L0_ID_Language_WEB</p>
                <input
                  key={1}
                  value={L0_ID_Language_WEB}
                  onChange={(e) =>
                    this.setState({ L0_ID_Language_WEB: e.target.value })
                  }
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
              <div className="row">
                <p>B_BookImage</p>
                <input
                  key={1}
                  value={B_BookImage}
                  onChange={(e) =>
                    this.setState({ B_BookImage: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <h3>Book Owner</h3>
              </div>
              <div className="row">
                <p>BOOKOwner</p>
                <input
                  key={1}
                  // value={BOOKOwner}
                  onChange={(e) => this.setState({ BOOKOwner: e.target.value })}
                />
              </div>
              <div className="row">
                <p>O_Company</p>
                <input
                  key={1}
                  value={O_Company}
                  onChange={(e) => this.setState({ O_Company: e.target.value })}
                />
              </div>
              <div className="row">
                <p>O_Web</p>
                <input
                  key={1}
                  value={O_Web}
                  onChange={(e) => this.setState({ O_Web: e.target.value })}
                />
              </div>
              <div className="row">
                <p>O_ContactName</p>
                <input
                  key={1}
                  value={O_ContactName}
                  onChange={(e) =>
                    this.setState({ O_ContactName: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>O_ContactEmail</p>
                <input
                  key={1}
                  value={O_ContactEmail}
                  onChange={(e) =>
                    this.setState({ O_ContactEmail: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>O_ContactTel</p>
                <input
                  key={1}
                  value={O_ContactTel}
                  onChange={(e) =>
                    this.setState({ O_ContactTel: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>O0_ID_Owner</p>
                <input
                  key={1}
                  value={O0_ID_Owner}
                  onChange={(e) =>
                    this.setState({ O0_ID_Owner: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <p>O0_ID_Owner_WEB</p>
                <input
                  key={1}
                  value={O0_ID_Owner_WEB}
                  onChange={(e) =>
                    this.setState({ O0_ID_Owner_WEB: e.target.value })
                  }
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
          <div className="row-container">
            <div>
              <div className="row">
                <p>B0_ID_Book</p>
                <input value={authors[currentIndex]?.B0_ID_Book} />
              </div>
              <div className="row">
                <p>BAuthorName</p>
                <input value={authors[currentIndex]?.BAuthorName} />
              </div>
              <div className="row">
                <p>B0_ID_Book_WEB</p>
                <input value={authors[currentIndex]?.B0_ID_Book_WEB} />
              </div>
              <div className="row">
                <p>B_Web</p>
                <input value={authors[currentIndex]?.B_Web} />
              </div>
              <div className="row">
                <p>B_isBookFree</p>
                <Checkbox checked={authors[currentIndex]?.B_isBookFree} />
              </div>
              <div className="row">
                <p>B_isBookHidden</p>
                <Checkbox checked={authors[currentIndex]?.B_isBookHidden} />
              </div>
              <div className="row">
                <h3>Book Language</h3>
              </div>
              <div className="row">
                <p>BookLanguage</p>
                <input value={authors[currentIndex]?.L_LanguagaeName} />
              </div>
              <div className="row">
                <p>L_LanguagaeName</p>
                <input value={authors[currentIndex]?.L_LanguagaeName} />
              </div>
              <div className="row">
                <p>L0_ID_Language</p>
                <input value={authors[currentIndex]?.L0_ID_Language} />
              </div>
              <div className="row">
                <p>L0_ID_Language_WEB</p>
                <input value={authors[currentIndex]?.L0_ID_Language_WEB} />
              </div>
            </div>
            <div>
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
                <p>Storage</p>
                <input
                  value={
                    "https://i.pinimg.com/736x/50/df/34/50df34b9e93f30269853b96b09c37e3b.jpg"
                  }
                />
              </div>
              <div className="row">
                <p>B_BookImage</p>
                <input value={authors[currentIndex]?.B_BookImage} />
              </div>
              <div className="row">
                <h3>Book Owner</h3>
              </div>
              <div className="row">
                <p>O_Company</p>
                <input value={authors[currentIndex]?.O_Company} />
              </div>
              <div className="row">
                <p>O_Web</p>
                <input value={authors[currentIndex]?.O_Web} />
              </div>
              <div className="row">
                <p>O_ContactName</p>
                <input value={authors[currentIndex]?.O_ContactName} />
              </div>
              <div className="row">
                <p>O_ContactEmail</p>
                <input value={authors[currentIndex]?.O_ContactEmail} />
              </div>
              <div className="row">
                <p>O_ContactTel</p>
                <input value={authors[currentIndex]?.O_ContactTel} />
              </div>
              <div className="row">
                <p>O0_ID_Owner</p>
                <input value={authors[currentIndex]?.O0_ID_Owner} />
              </div>
              <div className="row">
                <p>O0_ID_Owner_WEB</p>
                <input value={authors[currentIndex]?.O0_ID_Owner_WEB} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
