import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button, Checkbox } from "antd";

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
    const { dataSet } = this.state;

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
                  <input
                    type={value}
                    onPaste={(e) => this.handleOnPast(e, row, col)}
                    value={dataSet[row][collectionKeys[col]]}
                    onChange={(e) => this.handleOnChange(e, row, col)}
                  />
                </TableCell>
              );
            } else if (value === "boolean") {
              return (
                <TableCell>
                  <Checkbox
                    key={3}
                    checked={dataSet[row][types[col]]}
                    // value={B_isBookHidden}
                    // onChange={() =>
                    //   this.setState({
                    //     B_isBookHidden: !B_isBookHidden,
                    //   })
                    // }
                  />
                </TableCell>
              );
            }
          })}
        </TableRow>
      );
    }
    return newLine;
  };

  handleOnChange = (e, row, col) => {
    const { collectionKeys } = this.props;
    const { dataSet } = this.state;

    dataSet[row][collectionKeys[col]] = e.target.value;
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
                    <Button className="button-show">Show</Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {this.createNewLine()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(styles)(React.memo(CustomTable));
