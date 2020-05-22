import React from "react";

export default function TableInput(props) {
  const {
    type = "text",
    accept,
    defaultValue,
    handleOnChange,
    handleOnBlur,
    errorMessage,
    handleOnPaste,
  } = props;
  return (
    <div>
      <input
        className="ant-input"
        type={type}
        defaultValue={defaultValue}
        accept={accept}
        onBlur={(e) => handleOnBlur(e)}
        onChange={(e) => handleOnChange(e)}
        onPaste={handleOnPaste}
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
