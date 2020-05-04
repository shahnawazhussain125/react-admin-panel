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
} from "../../utilities/validation";
import TableInput from "../../components/TableInput";

const styles = (theme) => ({
  table: {
    minWidth: 650,
    marginTop: 20,
  },
  tableHead: {
    backgroundColor: "red",
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

    for (let row = 0; row < rowLength; row++) {
      obj = {};
      for (let col = 0; col < dataArr[row].length; col++) {
        dataSet[row + prow][collectionKeys[col + pcol]] = dataArr[row][col];
      }
    }
    this.setState({ dataSet });
  };

  createNewLine = () => {
    let { types, collectionKeys } = this.props;
    const { dataSet, validation_errors } = this.state;

    const newLine = [];

    for (let row = 0; row < dataSet.length; row++) {
      newLine.push(
        <TableRow key={Math.random()}>
          {types.map((value, col) => {
            if (col === 0) {
              return <TableCell>{row + 1}</TableCell>;
            }
            if (value === "string" || value === "number") {
              return (
                <TableCell>
                  <TableInput
                    key={Math.random()}
                    type={value === "number" ? value : "text"}
                    name={collectionKeys[col]}
                    value={dataSet[row][collectionKeys[col]]}
                    handleOnChange={(e) =>
                      this.handleOnChange(e.target.value, row, col)
                    }
                    errorMessage={
                      validation_errors[row]
                        ? validation_errors[row][collectionKeys[col]]
                        : null
                    }
                  />
                  {/* <input
                    className="ant-input"
                    type={value}
                    onPaste={(e) => this.handleOnPast(e, row, col)}
                    value={dataSet[row][collectionKeys[col]]}
                    onChange={(e) =>
                      this.handleOnChange(e.target.value, row, col)
                    }
                  /> */}
                </TableCell>
              );
            } else if (value === "boolean") {
              return (
                <TableCell>
                  <Checkbox
                    key={3}
                    checked={dataSet[row][types[col]]}
                    onChange={(e) =>
                      this.handleOnChange(!dataSet[row][types[col]], row, col)
                    }
                  />
                </TableCell>
              );
            }
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
    }
    return {
      is_error,
      validation_errors,
    };
  };

  saveOnlyData = () => {
    const { selectedCollection } = this.props;
    const { is_error, validation_errors } = this.validateInputFields();
    this.setState({ is_error, validation_errors });
  };

  saveImageAndData = () => {};

  handleSaveAllNew = () => {
    const { selectedCollection } = this.props;
    if (["Languages", "Illustrators", "Owners"].includes(selectedCollection)) {
      this.saveOnlyData();
    } else {
      this.saveImageAndData();
    }
  };

  render() {
    const { collectionData, collectionKeys, classes } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.tableHead}>
            <TableRow>
              {collectionKeys?.map((value) => {
                return <TableCell key={value}>{value}</TableCell>;
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionData.map((row, i) => {
              return (
                <TableRow key={i}>
                  {collectionKeys?.map((value, index) => {
                    if (typeof row[value] === "boolean") {
                      return (
                        <TableCell key={index}>
                          <Checkbox checked={row[value]} />
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={index}>
                          {row[value]?.length > 20 ? (
                            <textarea value={row[value]}></textarea>
                          ) : (
                            row[value]
                          )}
                        </TableCell>
                      );
                    }
                  })}
                  <TableCell>
                    <Button
                      className="button-show"
                      onClick={() => this.props.handleModalVisible(true, row)}
                    >
                      Show
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
