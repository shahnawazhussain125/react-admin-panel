import React, { Component } from "react";
import { Row, Col, Typography, Modal, Button, Input } from "antd";

export default class CustomModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      loading: false,
    };
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
  render() {
    const { loading, visible } = this.state;
    return (
      <Modal
        visible={visible}
        title="Update data"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Document</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter document" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Test boolean</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter boolean" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Test number</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter number" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Test string</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter string" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Test string 2</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter string" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>t Timestamp</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter timestamp" style={{ fontSize: 16 }} />
          </Col>
        </Row>
        <Row className="row-modal-inputflield">
          <Col span={6}>
            <Typography>Dimestamp datetime</Typography>
          </Col>
          <Col span={15}>
            <Input placeholder="Enter dimestamp" style={{ fontSize: 16 }} />
          </Col>
        </Row>
      </Modal>
    );
  }
}
