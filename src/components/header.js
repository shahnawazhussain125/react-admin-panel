import React, { Component } from "react";

export default class Headers extends Component {
  render() {
    return (
      <div className="header">
        <button onClick={this.props.handlePrevious}>Previous</button>
        <button onClick={this.props.handleReload}>Reload</button>
        <button onClick={this.props.handleNext}>Next</button>
        <button onClick={this.props.handleAddNew}>Add</button>
      </div>
    );
  }
}
