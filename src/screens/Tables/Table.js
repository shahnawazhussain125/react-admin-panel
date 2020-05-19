import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, Row, Input, Col } from "antd";
import {
  languageInputValidation,
  illustrationInputValidation,
  ownerInputValidation,
  authorInputValidation,
  bookInputValidation,
  talesInputValidation,
} from "../../utils/validation";
import TableInput from "../../components/TableInput";
import firebase from "../../config/firebase";
import { notify } from "react-notify-toast";
import swal from "sweetalert";
import Modal from "./Modal";

const styles = (theme) => ({
  table: {
    minWidth: 650,
    marginTop: 20,
  },
  tableHead: {
    backgroundColor: "#FF9500",
  },
  tableHeadCell: {
    cursor: "pointer",
  },
});

class CustomTable extends React.Component {
  constructor() {
    super();
    this.state = {
      pastDataSet: null,
      dataSet: [],
      validation_errors: [],
      collectionData: [],
      sortKey: null,
      sortOrder: "asc",
      visible: false,
      selectedRow: {},
      rowNo: 0,
      validation_error: {},
      selectedRowIndex: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      dataSet: nextProps.dataSet,
      collectionData: nextProps.collectionData,
      validation_errors: [],
    });

    localStorage.setItem(
      "prevoiusCollectionData",
      JSON.stringify([...nextProps.collectionData])
    );
  }

  handleOnPasteNewData = (e, prow, pcol) => {
    const { collectionKeys, types } = this.props;
    const { dataSet } = this.state;

    let pastDataSet = this.handleSplitPasteData(
      e.clipboardData.getData("Text")
    );

    let rowLength = dataSet.length;
    let colLength = Object.keys(dataSet[0])?.length;

    if (pastDataSet.length + prow < rowLength) {
      rowLength = pastDataSet.length + prow;
    }

    if (pastDataSet[0]?.length + pcol < colLength) {
      colLength = pastDataSet[0]?.length + pcol;
    }

    for (let row = prow; row < rowLength; row++) {
      for (let col = pcol; col < colLength; col++) {
        if (types[col] === "boolean") {
          dataSet[row][collectionKeys[col]] = "true".indexOf(
            pastDataSet[row - prow][col - pcol].toLowerCase()
          )
            ? true
            : false;
        } else {
          dataSet[row][collectionKeys[col]] =
            pastDataSet[row - prow][col - pcol];
        }
      }
    }

    console.log("dataSet", dataSet);

    this.setState({ dataSet });
  };

  handleOnPasteEditData = (e, prow, pcol) => {
    e.preventDefault();

    const { collectionKeys, types } = this.props;
    const { collectionData } = this.state;

    let pastDataSet = this.handleSplitPasteData(
      e.clipboardData.getData("text/plain")
    );

    let rowLength = collectionData.length;
    let colLength = Object.keys(collectionData[0])?.length - 1;

    if (pastDataSet.length + prow < rowLength) {
      rowLength = pastDataSet.length + prow;
    }

    if (pastDataSet[0]?.length + pcol < colLength) {
      colLength = pastDataSet[0]?.length + pcol;
    }

    for (let row = prow; row < rowLength; row++) {
      for (let col = pcol; col < colLength; col++) {
        if (types[col] === "boolean") {
          collectionData[row][collectionKeys[col]] = "true".indexOf(
            pastDataSet[row - prow][col - pcol].toLowerCase()
          )
            ? true
            : false;
        } else {
          collectionData[row][collectionKeys[col]] =
            pastDataSet[row - prow][col - pcol];
        }
        collectionData[row].isUpdate = true;
      }
    }

    this.setState({ collectionData });
  };

  handleSplitPasteData = (pastDataSet) => {
    return pastDataSet
      .replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm, function (
        match,
        p1
      ) {
        return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
      })
      .split(/\r\n|\n\r|\n|\r/g)
      .map((value) => {
        return value.split("\t");
      });
  };

  createNewLine = () => {
    let { types, collectionKeys } = this.props;
    const { dataSet, validation_errors } = this.state;

    const newLine = [];

    for (let row = 0; row < dataSet.length; row++) {
      newLine.push(
        <TableRow key={"r" + Math.random()}>
          {types.map((type, col) => {
            if (col === 0) {
              return (
                <TableCell key={Math.random()}>
                  <Row>
                    <Col span={6}>
                      <span>{row + 1}</span>
                    </Col>
                  </Row>
                </TableCell>
              );
            }
            if (
              collectionKeys[col] === "Storage" ||
              collectionKeys[col] === "T_Storage"
            ) {
              return (
                <TableCell key={Math.random()}>
                  <TableInput
                    type="file"
                    accept="image/*"
                    name="Storage"
                    handleOnChange={(e) =>
                      this.handleOnChange(e.target.files[0], row, col)
                    }
                    handleOnBlur={(e) =>
                      this.handleOnChange(e.target.files[0], row, col)
                    }
                    errorMessage={
                      validation_errors[row]
                        ? validation_errors[row][collectionKeys[col]]
                        : null
                    }
                  />
                </TableCell>
              );
            }
            return (
              <TableCell key={Math.random()}>
                <TableInput
                  type="text"
                  name={collectionKeys[col]}
                  defaultValue={dataSet[row][collectionKeys[col]]}
                  handleOnChange={(e) =>
                    this.handleOnChange(e.target.value, row, col)
                  }
                  handleOnBlur={(e) =>
                    this.handleOnChange(
                      types[col] === "boolean"
                        ? "true".indexOf(e.target.value.toLocaleLowerCase()) !==
                          -1
                          ? true
                          : false
                        : e.target.value,
                      row,
                      col
                    )
                  }
                  errorMessage={
                    validation_errors[row]
                      ? validation_errors[row][collectionKeys[col]]
                      : null
                  }
                  handleOnPaste={(e) => this.handleOnPasteNewData(e, row, col)}
                />
              </TableCell>
            );
          })}
          <TableCell></TableCell>
        </TableRow>
      );
    }
    return newLine;
  };

  handleOnChange = (value, row, col) => {
    const { collectionKeys } = this.props;
    const { dataSet } = this.state;

    dataSet[row][collectionKeys[col]] = value;
  };

  handleOnChangeText = (value, row, col) => {
    const { collectionKeys } = this.props;
    const collectionData = [...this.state.collectionData];

    collectionData[row][collectionKeys[col]] = value;
    collectionData[row]["isUpdate"] = true;

    this.setState({ collectionData });
  };

  validateInputFields = () => {
    const { selectedCollection, collectionData, allImages } = this.props;
    const { dataSet } = this.state;

    let is_error = false;
    let validation_errors = [];

    if (selectedCollection === "Languages") {
      let languages = [...collectionData];

      dataSet.forEach((data) => {
        const inputValidation = languageInputValidation({
          ...data,
          languages,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        languages.push(data);
      });
    } else if (selectedCollection === "Illustrators") {
      let illustrators = [...collectionData];

      dataSet.forEach((data) => {
        const inputValidation = illustrationInputValidation({
          ...data,
          illustrators,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        illustrators.push(data);
      });
    } else if (selectedCollection === "Owners") {
      let owners = [...collectionData];

      dataSet.forEach((data) => {
        const inputValidation = ownerInputValidation({
          ...data,
          owners,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        owners.push(data);
      });
    } else if (selectedCollection === "Authors") {
      let authors = [...collectionData];

      let imagesName = [...allImages.AuthorImages];

      dataSet.forEach((data) => {
        const inputValidation = authorInputValidation({
          ...data,
          authors,
          imagesName,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        imagesName.push(data.A_AuthorImage);
        authors.push(data);
      });
    } else if (selectedCollection === "Books") {
      let books = [...collectionData];
      let imagesName = [...allImages.BookImages];

      dataSet.forEach((data) => {
        const inputValidation = bookInputValidation({
          ...data,
          books,
          imagesName,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });

        imagesName.push(data.B_BookImage);
        books.push(data);
      });
    } else if (selectedCollection === "Tales") {
      let tales = [...collectionData];
      let imagesName = [...allImages.TaleImages];

      dataSet.forEach((data) => {
        const inputValidation = talesInputValidation({
          ...data,
          tales,
          imagesName,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        imagesName.push(data.T_TaleImage);
        tales.push(data);
      });
    }

    return {
      is_error,
      validation_errors,
    };
  };

  saveOnlyData = () => {
    const { selectedCollection, dataSet } = this.props;
    const { is_error, validation_errors } = this.validateInputFields();

    this.setState({ is_error, validation_errors }, () => {
      if (!is_error) {
        let firebasePromises = [];

        dataSet.forEach((data) => {
          delete data.ID_WEB;
          firebasePromises.push(
            firebase.firestore().collection(selectedCollection).add(data)
          );
        });

        Promise.all(firebasePromises)
          .then(() => {
            notify.show("All data has been successfully added", "success");
            this.handleGetSelectedCollectionData();
          })
          .catch((error) => {
            notify.show("Error! " + error.message, "error");
          });
      }
    });
  };

  saveImage = (folderName, file, imageName) => {
    return new Promise((resole, reject) => {
      if (typeof file === "string") {
        resole(file);
      } else {
        let storageRef = firebase
          .storage()
          .ref()
          .child(`${folderName}/${imageName}`);

        storageRef
          .put(file)
          .then(() => {
            storageRef.getDownloadURL().then((Storage) => {
              resole(Storage);
            });
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };

  saveImageAndData = () => {
    const { selectedCollection, dataSet } = this.props;
    const { is_error, validation_errors } = this.validateInputFields();

    this.setState({ is_error, validation_errors }, () => {
      if (!is_error) {
        let imagePromise = [];

        let firebasePromises = [];

        dataSet.forEach((data) => {
          if (selectedCollection === "Tales") {
            imagePromise.push(
              this.saveImage("TaleImages", data.T_Storage, data.T_TaleImage)
            );
          } else if (selectedCollection === "Authors") {
            imagePromise.push(
              this.saveImage("AuthorImages", data.Storage, data.A_AuthorImage)
            );
          } else {
            imagePromise.push(
              this.saveImage("BookImages", data.Storage, data.B_BookImage)
            );
          }
        });

        Promise.all(imagePromise)
          .then((urls) => {
            let index = 0;

            dataSet.forEach((data) => {
              delete data.ID_WEB;
              if (selectedCollection === "Tales") {
                data.T_Storage = urls[index];
              } else {
                data.Storage = urls[index];
              }
              firebasePromises.push(
                firebase.firestore().collection(selectedCollection).add(data)
              );

              index++;
            });
            Promise.all(firebasePromises)
              .then(() => {
                notify.show("All data has been successfully added", "success");
                this.handleGetSelectedCollectionData();
              })
              .catch((error) => {
                notify.show("Error! " + error.message, "error");
              });
          })
          .catch((error) => {
            notify.show("Error! " + error.message, "error");
          });
      }
    });
  };

  handleSaveAllNew = () => {
    const { selectedCollection } = this.props;
    if (["Languages", "Illustrators", "Owners"].includes(selectedCollection)) {
      this.saveOnlyData();
    } else {
      this.saveImageAndData();
    }
  };

  handleDeleteData = (docId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        firebase
          .firestore()
          .collection(this.props.selectedCollection)
          .doc(docId)
          .delete()
          .then(() => {
            swal("Success! Document has been successfully deleted!", {
              icon: "success",
            });

            this.handleGetSelectedCollectionData();
          })
          .catch((error) => {
            swal("Could not delete. An error occured" + error.message);
          });
      }
    });
  };

  handleGetSelectedCollectionData = () => {
    this.setState({ pastDataSet: [], dataSet: [] }, () => {
      this.props.getSelectedCollectionData();
    });
  };

  handleSortData = (key) => {
    let { sortKey, collectionData, sortOrder } = this.state;
    if (key !== sortKey || (key === sortKey && sortOrder !== "asc")) {
      collectionData = collectionData.sort((a, b) =>
        a[key] > b[key] ? 1 : -1
      );
    } else {
      collectionData = collectionData.sort((a, b) =>
        a[key] < b[key] ? 1 : -1
      );
    }
    this.setState({
      collectionData,
      sortKey: key,
      sortOrder: sortOrder === "asc" ? "desc" : "asc",
    });
  };

  // Modal functions

  handleCancelModalVisible = () => {
    this.setState({ visible: false }, () => {
      this.props.getSelectedCollectionData();
    });
  };

  handleModalVisible = (visible, selectedRow = false, rowNo) => {
    if (selectedRow) {
      this.setState({
        selectedRow,
        visible,
        rowNo,
      });
    } else {
      this.setState({ visible });
    }
  };

  handleOnCancel = (row) => {
    let editCollectionData = this.state.collectionData;
    const collectionData = JSON.parse(
      localStorage.getItem("prevoiusCollectionData")
    );
    editCollectionData[row] = collectionData[row];

    this.setState({ collectionData: editCollectionData });
  };

  ///Update data

  handleOnUpdate = (selectedRowIndex) => {
    const { selectedCollection } = this.props;
    const { is_error, validation_error } = this.validateUpdateInputFields(
      selectedRowIndex
    );

    console.log({ is_error, validation_error, selectedRowIndex });

    this.setState({ is_error, validation_error, selectedRowIndex }, () => {
      if (!is_error) {
        if (["Languages", "Owners"].includes(selectedCollection)) {
          this.handleUpdateDataWithBookAandTales(selectedRowIndex);
        } else if (
          ["Authors", "Illustrators", "Books"].includes(selectedCollection)
        ) {
          this.handleUpdateDataWithTales(selectedRowIndex);
        } else {
          this.handleUpdateTale(selectedRowIndex);
        }
      }
    });
  };

  validateUpdateInputFields = (selectedRowIndex) => {
    const { selectedCollection, collectionData } = this.props;

    const selectedRow = collectionData[selectedRowIndex];

    let is_error = false;
    let validation_error = {};

    if (selectedCollection === "Languages") {
      let languages = [...collectionData];
      languages.splice(selectedRowIndex, 1);

      const inputValidation = languageInputValidation({
        ...selectedRow,
        languages,
      });
      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Illustrators") {
      let illustrators = [...collectionData];
      illustrators.splice(selectedRowIndex, 1);

      const inputValidation = illustrationInputValidation({
        ...selectedRow,
        illustrators,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Owners") {
      let owners = [...collectionData];
      owners.splice(selectedRowIndex, 1);

      const inputValidation = ownerInputValidation({
        ...selectedRow,
        owners,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Authors") {
      let authors = [...collectionData];
      authors.splice(selectedRowIndex, 1);

      const inputValidation = authorInputValidation({
        ...selectedRow,
        authors,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Books") {
      let books = [...collectionData];
      books.splice(selectedRowIndex, 1);

      const inputValidation = bookInputValidation({
        ...selectedRow,
        books,
      });

      is_error = inputValidation.is_error;
      validation_error = inputValidation.validation_error;
    } else if (selectedCollection === "Tales") {
      let tales = [...collectionData];
      tales.splice(selectedRowIndex, 1);

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

  handleUpdateDataWithTales = (selectedRowIndex) => {
    const { selectedCollection, collectionKeys, collectionData } = this.props;
    const selectedRow = collectionData[selectedRowIndex];
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
              let Storage = "";

              if (selectedCollection === "Authors") {
                Storage = selectedRow.Storage;
                delete selectedRow.Storage;

                selectedRow.A_Storage = Storage;
              } else if (selectedCollection === "Books") {
                Storage = selectedRow.Storage;
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
                  collectionData[selectedRowIndex].ID_WEB = docId;
                  collectionData[selectedRowIndex].isUpdate = false;
                  collectionData[selectedRowIndex].Storage = Storage;
                  this.setState({ collectionData });
                  notify.show("Successfully updated", "success", 2000);
                })
                .catch((error) => {
                  notify.show(`Error! ${error.message}`, "error", 2000);
                });
            } else {
              collectionData[selectedRowIndex].ID_WEB = docId;
              collectionData[selectedRowIndex].isUpdate = false;
              this.setState({ collectionData });
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

  handleUpdateDataWithBookAandTales = (selectedRowIndex) => {
    const { selectedCollection, collectionKeys, collectionData } = this.props;
    const selectedRow = collectionData[selectedRowIndex];
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
                collectionData[selectedRowIndex].ID_WEB = docId;
                collectionData[selectedRowIndex].isUpdate = false;
                this.setState({ collectionData });
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

  handleUpdateTale = (selectedRowIndex) => {
    const { collectionData } = this.state;
    const selectedRow = collectionData[selectedRowIndex];
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
        collectionData[selectedRowIndex].ID_WEB = docId;
        collectionData[selectedRowIndex].isUpdate = false;
        this.setState({ collectionData });
        notify.show("Successfully updated", "success", 2000);
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  handleOnFilter = (value, key) => {
    let { collectionKeys, collectionData } = this.props;

    collectionData = collectionData.filter((data) => {
      return (
        data[key]?.toString().toLowerCase()?.indexOf(value.toLowerCase()) > -1
      );
    });
    this.setState({ collectionData });
  };

  render() {
    const { collectionKeys, classes, types, selectedCollection } = this.props;
    const {
      collectionData,
      validation_errors,
      validation_error,
      selectedRow,
      visible,
      rowNo,
      selectedRowIndex,
    } = this.state;

    return (
      <span>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                {collectionKeys?.map((value) => {
                  return (
                    <TableCell
                      className={classes.tableHeadCell}
                      key={value}
                      onClick={() => this.handleSortData(value)}
                    >
                      {value}
                    </TableCell>
                  );
                })}
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {types?.map((value, index) => {
                  return <TableCell key={index}>{value}</TableCell>;
                })}
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: "#A9A9A9",
                }}
              >
                {collectionKeys?.map((key, col) => {
                  return (
                    <TableCell key={col}>
                      <Input
                        style={{
                          width: 150,
                        }}
                        onChange={(e) =>
                          this.handleOnFilter(e.target.value, key)
                        }
                      />
                    </TableCell>
                  );
                })}
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              {collectionData?.map((data, row) => {
                return (
                  <TableRow key={row}>
                    {collectionKeys?.map((value, col) => {
                      return (
                        <TableCell key={col}>
                          {col === 0 ? (
                            data[value]
                          ) : (
                            <>
                              <Input
                                style={{
                                  width: 150,
                                }}
                                type="text"
                                defaultValue={data[value]}
                                value={data[value]}
                                onBlur={(e) =>
                                  this.handleOnChangeText(
                                    types[col] === "boolean"
                                      ? "true".indexOf(
                                          e.target.value.toLocaleLowerCase()
                                        ) !== -1
                                        ? true
                                        : false
                                      : e.target.value,
                                    row,
                                    col
                                  )
                                }
                                onChange={(e) =>
                                  this.handleOnChangeText(
                                    e.target.value,
                                    row,
                                    col
                                  )
                                }
                                onPaste={(e) =>
                                  this.handleOnPasteEditData(e, row, col)
                                }
                              />
                              <p style={{ color: "red", fontSize: 10 }}>
                                {selectedRowIndex === row
                                  ? validation_error &&
                                    validation_error[collectionKeys[col]]
                                    ? validation_error[collectionKeys[col]]
                                    : null
                                  : null}
                              </p>
                            </>
                          )}
                        </TableCell>
                      );
                    })}
                    {data.isUpdate ? (
                      <>
                        <TableCell>
                          <Button
                            type="primary"
                            onClick={() => this.handleOnUpdate(row)}
                          >
                            Update
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            danger
                            type="primary"
                            onClick={() => this.handleOnCancel(row)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <Button
                            type="primary"
                            onClick={() =>
                              this.handleModalVisible(true, data, row)
                            }
                          >
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            danger
                            type="primary"
                            onClick={() => this.handleDeleteData(data.ID_WEB)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
              {this.createNewLine()}
            </TableBody>
          </Table>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Button className="button-save-all" onClick={this.handleSaveAllNew}>
              Save all new
            </Button>
          </Row>
        </TableContainer>
        <Modal
          visible={visible}
          handleModalVisible={this.handleModalVisible}
          selectedRow={selectedRow}
          collectionKeys={collectionKeys}
          selectedCollection={selectedCollection}
          types={types}
          collectionData={this.props.collectionData}
          rowNo={rowNo}
          handleCancelModalVisible={this.handleCancelModalVisible}
        />
      </span>
    );
  }
}

export default withStyles(styles)(CustomTable);
