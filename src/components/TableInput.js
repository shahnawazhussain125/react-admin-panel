import React from "react";

export default function TableInput(props) {
  const {
    key = 0,
    type = "text",
    accept,
    value,
    handleOnChange,
    name,
    errorMessage,
  } = props;
  return (
    <div key={key}>
      <input
        className="ant-input"
        type={type}
        value={value}
        accept={accept}
        onChange={(e) => handleOnChange(e)}
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
