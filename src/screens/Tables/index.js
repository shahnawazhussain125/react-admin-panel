import React, { Component } from "react";
import { Row, Col, Input, Button, Typography, Select } from "antd";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "antd/dist/antd.css";
import "./index.css";
import SimpleTable from "./Table";
import Modal from "./Modal";
import SideMenu from "../../components/sideMenu";
import { getKeysFromCollection } from "../../utilities/constants";

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
      ],
      selectedCollection: "Tales",
      collectionData: [],
      collectionKeys: [],
      visible: false,
      noOfLine: 1,
      types: [],
      dataSet: [],
      visible: false,
      selectedRow: null,
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

        let collectionKeys = getKeysFromCollection(collectionData);

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

  handleModalVisible = (visible, selectedRow = false) => {
    if (selectedRow) {
      this.setState({
        selectedRow,
        visible,
      });
    } else {
      this.setState({ visible });
    }
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
      visible,
      selectedRow,
    } = this.state;

    return (
      <Row>
        <Notifications />
        <Col className="gutter-row" span={4}>
          <SideMenu />
        </Col>
        <Col className="gutter-row" span={20}>
          <Row
            style={{
              background: "#f5f6f8",
              height: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Row>

          <Row style={{ padding: 15 }}>
            <Col span={24} style={{ marginTop: 50, marginBottom: 30 }}>
              <Row>
                <Col span={5}>
                  <Row>
                    <Col span={16}>
                      <Select
                        style={{ width: "90%" }}
                        placeholder="Select collection"
                        defaultValue={selectedCollection}
                        onChange={(value) =>
                          this.setState({ selectedCollection: value })
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
                      <Button
                        type="primary"
                        onClick={() => this.getSelectedCollectionData()}
                      >
                        Show
                      </Button>
                    </Col>
                  </Row>
                </Col>

                <Col span={5}></Col>
                <Col span={2}>
                  <Input
                    placeholder="1"
                    style={{ textAlign: "center", fontSize: 16 }}
                    value={noOfLine}
                    onChange={(e) =>
                      this.setState({ noOfLine: e.target.value })
                    }
                  />
                </Col>
                <Col span={3}>
                  <Button
                    type="primary"
                    style={{ marginLeft: 10 }}
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
                  selectedCollection={selectedCollection}
                  handleModalVisible={this.handleModalVisible}
                  getSelectedCollectionData={this.getSelectedCollectionData}
                />
              </Row>
            </Col>
          </Row>
        </Col>
        <Modal
          visible={visible}
          handleModalVisible={this.handleModalVisible}
          selectedRow={selectedRow}
          collectionKeys={collectionKeys}
          selectedCollection={selectedCollection}
        />
      </Row>
    );
  }
}

export default Tables;
