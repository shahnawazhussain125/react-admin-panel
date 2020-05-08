import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, Checkbox, Row } from "antd";
import {
  languageInputValidation,
  illustrationInputValidation,
  ownerInputValidation,
  autherInputValidation,
  bookInputValidation,
  talesInputValidation,
} from "../../utilities/validation";
import TableInput from "../../components/TableInput";
import firebase from "../../config/firebase";
import { notify } from "react-notify-toast";
import swal from "sweetalert";

const styles = (theme) => ({
  table: {
    minWidth: 650,
    marginTop: 20,
  },
  tableHead: {
    backgroundColor: "#FF9500",
  },
});

class CustomTable extends React.Component {
  constructor() {
    super();
    this.state = {
      pastDataSet: null,
      dataSet: [],
      validation_errors: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ dataSet: nextProps.dataSet });
  }

  handleOnPast = (e, prow, pcol) => {
    const { collectionKeys } = this.props;
    const { dataSet } = this.state;

    let dataArr = e.clipboardData
      .getData("Text")
      .split("\n")
      .map((value) => {
        return value.split("\t");
      });

    let obj = {};

    let rowLength = 0;

    if (dataSet.length - prow < dataArr.length) {
      rowLength = dataSet.length - prow;
    } else {
      rowLength = dataArr.length;
    }

    console.log(
      "dataArr[row][col];",

      { e, prow, pcol }
    );

    for (let row = 0; row < rowLength; row++) {
      obj = {};
      for (let col = 0; col < dataArr[row].length; col++) {
        dataSet[row + prow][collectionKeys[col + pcol]] = dataArr[row][col];
      }
    }

    console.log("dataSet", dataSet);

    this.setState({ dataSet });
  };

  createNewLine = () => {
    let { types, collectionKeys } = this.props;
    const { dataSet, validation_errors } = this.state;

    const newLine = [];

    for (let row = 0; row < dataSet.length; row++) {
      newLine.push(
        <TableRow key={"r" + Math.random()}>
          {types.map((value, col) => {
            if (col === 0) {
              return <TableCell key={Math.random()}>{row + 1}</TableCell>;
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
                  type={value === "number" ? value : "text"}
                  name={collectionKeys[col]}
                  defaultValue={dataSet[row][collectionKeys[col]]}
                  handleOnChange={(e) =>
                    this.handleOnChange(e.target.value, row, col)
                  }
                  errorMessage={
                    validation_errors[row]
                      ? validation_errors[row][collectionKeys[col]]
                      : null
                  }
                  handleOnPast={(e) => this.handleOnPast(e, row, col)}
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

  validateInputFields = () => {
    const { selectedCollection, collectionData } = this.props;
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

      dataSet.forEach((data) => {
        const inputValidation = autherInputValidation({
          ...data,
          authors,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        authors.push(data);
      });
    } else if (selectedCollection === "Books") {
      let books = [...collectionData];

      dataSet.forEach((data) => {
        const inputValidation = bookInputValidation({
          ...data,
          books,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
        books.push(data);
      });
    } else if (selectedCollection === "Tales") {
      dataSet.forEach((data) => {
        const inputValidation = talesInputValidation({
          ...data,
        });

        is_error = is_error || inputValidation.is_error;
        validation_errors.push({
          ...inputValidation.validation_error,
        });
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

  saveImage = (folderName, file) => {
    return new Promise((resole, reject) => {
      let storageRef = firebase
        .storage()
        .ref()
        .child(`${folderName}/${Math.random().toString().substring(5)}`);

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
            imagePromise.push(this.saveImage("TaleImages", data.T_Storage));
          } else if (selectedCollection === "Authors") {
            imagePromise.push(this.saveImage("AuthorImages", data.Storage));
          } else {
            imagePromise.push(this.saveImage("BookImages", data.Storage));
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

  render() {
    const { collectionData, collectionKeys, classes, types } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {collectionKeys?.map((value) => {
                return <TableCell key={value}>{value}</TableCell>;
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
            {collectionData.map((row, i) => {
              return (
                <TableRow key={i}>
                  {collectionKeys?.map((value, index) => {
                    return (
                      <TableCell key={index}>
                        {row[value]?.length > 20 ? (
                          <textarea value={row[value]}></textarea>
                        ) : (
                          row[value]
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Button
                      type="primary"
                      onClick={() => this.props.handleModalVisible(true, row)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      danger
                      type="primary"
                      onClick={() => this.handleDeleteData(row.ID_WEB)}
                    >
                      Delete
                    </Button>
                  </TableCell>
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
    );
  }
}

export default withStyles(styles)(CustomTable);
