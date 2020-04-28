import React, { Component } from "react";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "./index.css";
import Headers from "../../components/header";
import { Checkbox } from "antd";

export default class Illustration extends Component {
  constructor() {
    super();
    this.state = {
      illustrators: [],
      currentIndex: 0,
      I0_ID_Illustrator: null,
      I_IllustratorName: null,
      _isIllustratorHidden: null,
      isAddNew: false,
      isLoading: true,
    };
  }

  getAllLanguage = () => {
    let illustrators = [];
    firebase
      .firestore()
      .collection("Illustrators")
      .get()
      .then((response) => {
        response.forEach((doc) => {
          illustrators.push({
            I0_ID_Illustrator_WEB: doc.id,
            I0_ID_Illustrator: doc.data()?.I0_ID_Illustrator,
            I_IllustratorName: doc.data()?.I_IllustratorName,
            _isIllustratorHidden: doc.data()?._isIllustratorHidden,
          });
        });
        this.setState({
          illustrators,
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
      I0_ID_Illustrator: null,
      I_IllustratorName: null,
      _isIllustratorHidden: null,
    });
  };

  handleSaveData = () => {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
    } = this.state;
    firebase
      .firestore()
      .collection("Illustrators")
      .add({
        I0_ID_Illustrator,
        I_IllustratorName,
        _isIllustratorHidden,
      })
      .then(() => {
        notify.show("Owner has been successfully added", "success", 2000);
        this.setState({
          I0_ID_Illustrator: null,
          I_IllustratorName: null,
          _isIllustratorHidden: null,
          isAddNew: false,
        });
        this.getAllLanguage();
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  render() {
    const {
      I0_ID_Illustrator,
      I_IllustratorName,
      _isIllustratorHidden,
      isAddNew,
      illustrators,
      currentIndex,
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
              <p>I0_ID_Illustrator</p>
              <input
                key={1}
                value={I0_ID_Illustrator}
                onChange={(e) =>
                  this.setState({ I0_ID_Illustrator: e.target.value })
                }
              />
            </div>

            <div className="row">
              <p>I_IllustratorName</p>
              <input
                key={2}
                value={I_IllustratorName}
                onChange={(e) =>
                  this.setState({ I_IllustratorName: e.target.value })
                }
              />
            </div>
            <div className="row">
              <p>_isIllustratorHidden</p>
              <Checkbox
                key={3}
                checked={_isIllustratorHidden}
                // value={_isIllustratorHidden}
                onChange={() =>
                  this.setState({
                    _isIllustratorHidden: !_isIllustratorHidden,
                  })
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
        ) : (
          <div>
            <div className="row">
              <p>I0_ID_Illustrator</p>
              <input value={illustrators[currentIndex]?.I0_ID_Illustrator} />
            </div>
            <div className="row">
              <p>I0_ID_Illustrator_WEB</p>
              <input
                value={illustrators[currentIndex]?.I0_ID_Illustrator_WEB}
              />
            </div>
            <div className="row">
              <p>I_IllustratorName</p>
              <input value={illustrators[currentIndex]?.I_IllustratorName} />
            </div>
            <div className="row">
              <p>_isIllustratorHidden</p>
              <Checkbox
                checked={illustrators[currentIndex]?._isIllustratorHidden}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
