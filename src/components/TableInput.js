import React from "react";

export default function TableInput(props) {
  const {
    key = 0,
    type = "text",
    accept,
    defaultValue,
    handleOnChange,
    name,
    errorMessage,
  } = props;
  return (
    <div>
      <input
        className="ant-input"
        type={type}
        defaultValue={defaultValue}
        // value={value}
        accept={accept}
        onChange={(e) => handleOnChange(e)}
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
