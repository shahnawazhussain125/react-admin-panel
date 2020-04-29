import React, { Component } from "react";
import { Row, Col, Input, Button, Typography, Select } from "antd";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "antd/dist/antd.css";
import "./index.css";
import SimpleTable from "./Table";
import Modal from "./Modal";

const { Option } = Select;
const db = firebase.firestore();

class Tables extends Component {
  constructor() {
    super();
    this.state = {
      collectionNames: [
        {
          name: "Authors",
          id: "Authors",
        },
        {
          name: "Books",
          id: "Books",
        },
        {
          name: "Illustrators",
          id: "Illustrators",
        },
        {
          name: "Languages",
          id: "Languages",
        },
        {
          name: "Owners",
          id: "Owners",
        },
        {
          name: "Tales",
          id: "Tales",
        },
        {
          name: "Users",
          id: "Users",
        },
        {
          name: "zTales",
          id: "zTales",
        },
        {
          name: "zTest",
          id: "zTest",
        },
      ],
      selectedCollection: "Languages",
      collectionData: [],
      collectionKeys: [],
      visible: false,
      noOfLine: 0,
      types: [],
      dataSet: [],
    };
  }

  getSelectedCollectionData = () => {
    const { selectedCollection } = this.state;
    let collectionData = [];
    db.collection(selectedCollection)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          collectionData.push({
            ID_WEB: doc.id,
            ...doc.data(),
          });
        });
        let keys = collectionData.map((value) => Object.keys(value));
        let lengths = keys.map((value) => value.length);
        let collectionKeys = keys[lengths.indexOf(Math.max(...lengths))];
        let types = collectionKeys.map((value) => {
          return typeof collectionData[0][value];
        });

        this.setState({
          collectionData,
          collectionKeys,
          types,
        });
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error");
      });
  };

  componentDidMount() {
    this.getSelectedCollectionData();
  }

  // Modal functions

  handleCancel = () => {
    this.setState({ visible: false });
  };

  createDataSet = () => {
    const { noOfLine, collectionKeys, types } = this.state;

    const dataSet = [];

    let obj = {};

    for (let row = 0; row < noOfLine; row++) {
      obj = {};
      for (let col = 0; col < collectionKeys.length; col++) {
        if (col === 0) {
          obj[collectionKeys[col]] = row + 1;
        } else if (types[col] === "boolean") {
          obj[collectionKeys[col]] = false;
        } else {
          obj[collectionKeys[col]] = null;
        }
      }

      dataSet.push(obj);
    }

    this.setState({ dataSet });
  };

  render() {
    const {
      collectionNames,
      selectedCollection,
      collectionData,
      collectionKeys,
      noOfLine,
      dataSet,
      types,
    } = this.state;

    return (
      <div>
        <Notifications />
        <div className="provoder-list-body">
          <Row className="row-container">
            <Col span={21} style={{ marginTop: 100, marginBottom: 30 }}>
              <Row>
                <Col span={5}>
                  <Row>
                    <Col span={16}>
                      <Select
                        style={{ width: "90%" }}
                        placeholder="Select collection"
                        defaultValue={selectedCollection}
                        onChange={(value) =>
                          this.setState({ selectedCollection: value }, () => {
                            this.getSelectedCollectionData();
                          })
                        }
                      >
                        {collectionNames.map((value) => (
                          <Option key={value.id} value={value.id}>
                            {value.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Button>Search</Button>
                    </Col>
                  </Row>
                </Col>

                <Col span={5}></Col>
                <Col span={2}>
                  <Input
                    placeholder="4"
                    style={{ textAlign: "center", fontSize: 16 }}
                    onChange={(e) =>
                      this.setState({ noOfLine: e.target.value })
                    }
                  />
                </Col>
                <Col span={3}>
                  <Button
                    className="text-add"
                    onClick={() => this.createDataSet()}
                  >
                    Add Line
                  </Button>
                </Col>
              </Row>
              <Row>
                <SimpleTable
                  collectionData={collectionData}
                  collectionKeys={collectionKeys}
                  noOfLine={noOfLine}
                  dataSet={dataSet}
                  types={types}
                />
              </Row>
              {/* Table conatiner */}
            </Col>
            <Col span={1}>
              <Button className="button-update">Update</Button>
            </Col>
          </Row>

          {/* Row save all new button */}
          <Row style={{ display: "flex", justifyContent: "center" }}>
            <Button className="button-save-all">Save all new</Button>
          </Row>
        </div>
        {/* Modal */}
        <Modal />
      </div>
    );
  }
}

export default Tables;
