import React, { Component } from "react";
import { Row, Col, Input, Button, Typography, Select } from "antd";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";
import "antd/dist/antd.css";
import "./index.css";
import SimpleTable from "./Table";
import SideMenu from "../../components/sideMenu";
import { getKeysFromCollection } from "../../utils/constants";

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
      allImages: null,
    };
  }

  componentDidMount() {
    this.getSelectedCollectionData();
    this.getAllImageFileName();
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
            isUpdate: false,
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

  getAllImageFileName = () => {
    let imagesName = [];
    let allImages = {};
    let imagePromises = [];
    let imageCollectionName = ["AuthorImages", "BookImages", "TaleImages"];

    imagePromises.push(
      firebase.storage().ref().child("AuthorImages").listAll()
    );
    imagePromises.push(firebase.storage().ref().child("BookImages").listAll());
    imagePromises.push(firebase.storage().ref().child("TaleImages").listAll());

    Promise.all(imagePromises)
      .then((response) => {
        let index = 0;
        response.forEach((resp) => {
          imagesName = [];
          resp.items.forEach((itemRef) => {
            imagesName.push(itemRef.name);
          });

          allImages[imageCollectionName[index]] = imagesName;
          index++;
        });

        this.setState({ allImages: allImages });
      })
      .catch((error) => {
        console.log("error", error);
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
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
          obj[collectionKeys[col]] = "";
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
                    <Typography>Select Collection</Typography>
                  </Row>
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
                <Col span={5}>
                  <Row>
                    <Typography>Add New Lines</Typography>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Input
                        placeholder="1"
                        style={{ textAlign: "center", fontSize: 16 }}
                        value={noOfLine}
                        onChange={(e) =>
                          this.setState({ noOfLine: e.target.value })
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Button
                        type="primary"
                        style={{ marginLeft: 10 }}
                        onClick={() => this.createDataSet()}
                      >
                        Add Line
                      </Button>
                    </Col>
                  </Row>
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
                  allImages={this.state.allImages}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Tables;
