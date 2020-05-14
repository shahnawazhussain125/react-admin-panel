import React, { Component } from "react";
import { Row, Col, Typography, Modal, Button, Input } from "antd";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import {
  languageInputValidation,
  illustrationInputValidation,
  ownerInputValidation,
  authorInputValidation,
  bookInputValidation,
  talesInputValidation,
} from "../../utils/validation";

export default class CustomModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      loading: false,
      collectionKeys: [],
      selectedRow: null,
      is_error: false,
      validation_error: {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedRow, collectionKeys } = nextProps;

    this.setState({ selectedRow, collectionKeys });
  }

  // handleOnUpdate = () => {
  //   const { selectedRow } = this.state;

  //   const docId = selectedRow.ID_WEB;

  //   delete selectedRow.ID_WEB;
  //   delete selectedRow.isUpdate;

  //   const { selectedCollection } = this.props;
  //   if (["Languages", "Illustrators", "Owners"].includes(selectedCollection)) {
  //     this.handleUpdateData();
  //   } else {
  //     this.saveImageAndData();
  //   }

  //   firebase
  //     .firestore()
  //     .collection(this.props.selectedCollection)
  //     .doc(docId)
  //     .set({
  //       ...selectedRow,
  //     })
  //     .then((response) => {
  //       this.props.handleCancelModalVisible();
  //       notify.show("Successfully updated", "success", 2000);
  //     })
  //     .catch((error) => {
  //       notify.show(`Error! ${error.message}`, "error", 2000);
  //     });
  // };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleChange = (key, value) => {
    const { selectedRow } = this.state;
    selectedRow[key] = value;

    this.setState({ selectedRow });
  };

  handleUpdateTale = () => {
    const { selectedRow } = this.state;

    const docId = selectedRow.ID_WEB;

    delete selectedRow.ID_WEB;
    delete selectedRow.isUpdate;

    firebase
      .firestore()
      .collection(this.props.selectedCollection)
      .doc(docId)
      .set({
        ...selectedRow,
      })
      .then((response) => {
        this.props.handleCancelModalVisible();
        notify.show("Successfully updated", "success", 2000);
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  handleOnUpdate = () => {
    const { selectedCollection } = this.props;
    const { is_error, validation_error } = this.validateInputFields();

    this.setState({ is_error, validation_error }, () => {
      if (!is_error) {
        if (["Languages", "Owners"].includes(selectedCollection)) {
          this.handleUpdateDataWithBookAandTales();
        } else if (
          ["Authors", "Illustrators", "Books"].includes(selectedCollection)
        ) {
          this.handleUpdateDataWithTales();
        } else {
          this.handleUpdateTale();
        }
      }
    });
  };

  validateInputFields = () => {
    const {
      selectedRow,
      selectedCollection,
      collectionData,
      rowNo,
    } = this.props;

    let is_error = false;
    let validation_error = {};

    if (selectedCollection === "Languages") {
      let languages = [...collectionData];
      languages.splice(rowNo, 1);

      const inputValidation = languageInputValidation({
        ...selectedRow,
        languages,
      });
      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Illustrators") {
      let illustrators = [...collectionData];
      illustrators.splice(rowNo, 1);

      const inputValidation = illustrationInputValidation({
        ...selectedRow,
        illustrators,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Owners") {
      let owners = [...collectionData];
      owners.splice(rowNo, 1);

      const inputValidation = ownerInputValidation({
        ...selectedRow,
        owners,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Authors") {
      let authors = [...collectionData];
      authors.splice(rowNo, 1);

      const inputValidation = authorInputValidation({
        ...selectedRow,
        authors,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Books") {
      let books = [...collectionData];
      books.splice(rowNo, 1);

      const inputValidation = bookInputValidation({
        ...selectedRow,
        books,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Tales") {
      let tales = [...collectionData];
      tales.splice(rowNo, 1);

      const inputValidation = talesInputValidation({
        ...selectedRow,
        tales,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    }

    return {
      is_error,
      validation_error,
    };
  };

  handleUpdateDataWithTales = () => {
    const { selectedRow } = this.state;
    const { selectedCollection, collectionKeys } = this.props;

    const docId = selectedRow.ID_WEB;

    delete selectedRow.ID_WEB;
    delete selectedRow.isUpdate;

    firebase
      .firestore()
      .collection(selectedCollection)
      .doc(docId)
      .update(selectedRow)
      .then(() => {
        firebase
          .firestore()
          .collection("Tales")
          .where(
            `${
              collectionKeys.filter((value) => value.indexOf("0_ID_") !== -1)[0]
            }_WEB`,
            "==",
            docId
          )
          .get()
          .then((response) => {
            if (response.size) {
              console.log(" response.size", response.size);

              let updateDocumentPromise = [];

              if (selectedCollection === "Authors") {
                let Storage = selectedRow.Storage;
                delete selectedRow.Storage;

                selectedRow.A_Storage = Storage;
              } else if (selectedCollection === "Books") {
                let Storage = selectedRow.Storage;
                delete selectedRow.Storage;

                selectedRow.B_Storage = Storage;
              }

              response.forEach((doc) => {
                updateDocumentPromise.push(
                  firebase
                    .firestore()
                    .collection("Tales")
                    .doc(doc.id)
                    .update({
                      ...selectedRow,
                    })
                );
              });

              Promise.all(updateDocumentPromise)
                .then(() => {
                  this.props.handleCancelModalVisible();
                  notify.show("Successfully updated", "success", 2000);
                })
                .catch((error) => {
                  notify.show(`Error! ${error.message}`, "error", 2000);
                });
            } else {
              this.props.handleCancelModalVisible();
              notify.show("Successfully updated", "success", 2000);
            }
          })
          .catch((error) => {
            notify.show(`Error! ${error.message}`, "error", 2000);
          });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  handleUpdateDataWithBookAandTales = () => {
    const { selectedRow } = this.state;
    const { selectedCollection, collectionKeys } = this.props;
    const docId = selectedRow.ID_WEB;

    delete selectedRow.ID_WEB;
    delete selectedRow.isUpdate;

    firebase
      .firestore()
      .collection(selectedCollection)
      .doc(docId)
      .update(selectedRow)
      .then(() => {
        let collectionPromise = [];

        collectionPromise.push(
          firebase
            .firestore()
            .collection("Books")
            .where(
              `${
                collectionKeys.filter(
                  (value) => value.indexOf("0_ID_") !== -1
                )[0]
              }_WEB`,
              "==",
              docId
            )
            .get()
        );

        collectionPromise.push(
          firebase
            .firestore()
            .collection("Tales")
            .where(
              `${
                collectionKeys.filter(
                  (value) => value.indexOf("0_ID_") !== -1
                )[0]
              }_WEB`,
              "==",
              docId
            )
            .get()
        );

        Promise.all(collectionPromise)
          .then((responses) => {
            let collections = ["Books", "Tales"];
            let updateDocumentPromise = [];

            for (let index = 0; index < responses.length; index++) {
              responses[index].forEach((doc) => {
                updateDocumentPromise.push(
                  firebase
                    .firestore()
                    .collection(collections[index])
                    .doc(doc.id)
                    .update({
                      ...selectedRow,
                    })
                );
              });
            }

            Promise.all(updateDocumentPromise)
              .then(() => {
                this.props.handleCancelModalVisible();
                notify.show("Successfully updated", "success", 2000);
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
    const { loading, selectedRow, collectionKeys } = this.state;
    const { visible, types } = this.props;

    return (
      <Modal
        visible={visible}
        title="Selected Row"
        onCancel={() => this.props.handleCancelModalVisible()}
        footer={[
          <Button
            key="back"
            onClick={() => this.props.handleCancelModalVisible()}
          >
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleOnUpdate}
          >
            Update
          </Button>,
        ]}
      >
        <Notifications />
        {collectionKeys?.map((key, index) => {
          return (
            <Row className="row-modal-inputflield" key={key}>
              <Col span={6}>
                <Typography>{key}</Typography>
              </Col>
              <Col span={15}>
                <Input
                  readOnly={key === "ID_WEB" ? true : false}
                  type={
                    types[index] === "number"
                      ? types[index]
                      : types[index] === "boolean"
                      ? "checkbox"
                      : "text"
                  }
                  style={{ fontSize: 16 }}
                  value={selectedRow ? selectedRow[key] : ""}
                  onChange={(e) =>
                    types[index] === "boolean"
                      ? this.handleChange(key, e.target.checked)
                      : this.handleChange(
                          key,
                          types[index] === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                  }
                />
              </Col>
            </Row>
          );
        })}
      </Modal>
    );
  }
}
