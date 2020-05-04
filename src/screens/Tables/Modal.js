import React, { Component } from "react";
import { Row, Col, Typography, Modal, Button, Input } from "antd";
import firebase from "../../config/firebase";
import Notifications, { notify } from "react-notify-toast";

export default class CustomModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      loading: false,
      collectionKeys: [],
      selectedRow: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedRow, collectionKeys } = nextProps;

    this.setState({ selectedRow, collectionKeys });
  }

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

  handleUpdate = () => {
    const { selectedRow, collectionKeys } = this.state;

    let objToUpdate = {};

    collectionKeys.forEach((key) => {
      if (key !== "ID_WEB") {
        objToUpdate[key] = selectedRow[key];
      }
    });

    firebase
      .firestore()
      .collection(this.props.selectedCollection)
      .doc(selectedRow.ID_WEB)
      .set({
        ...objToUpdate,
      })
      .then((response) => {
        notify.show("Successfully updated", "success", 2000);
        this.props.handleModalVisible(false);
      })
      .catch((error) => {
        notify.show(`Error! ${error.message}`, "error", 2000);
      });
  };

  render() {
    const { loading, selectedRow, collectionKeys } = this.state;
    const { visible } = this.props;

    return (
      <Modal
        visible={visible}
        title="Selected Row"
        onCancel={() => this.props.handleModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => this.props.handleModalVisible(false)}
          >
            Close
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleUpdate}
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
                  placeholder="Enter document"
                  style={{ fontSize: 16 }}
                  value={selectedRow ? selectedRow[key] : ""}
                  onChange={(e) => this.handleChange(key, e.target.value)}
                />
              </Col>
            </Row>
          );
        })}
      </Modal>
    );
  }
}
