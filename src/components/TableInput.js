import React from "react";

export default function TableInput(props) {
  const {
    key = 0,
    type = "text",
    accept,
    defaultValue,
    handleOnChange,
    handleOnBlur,
    name,
    errorMessage,
    handleOnPast,
  } = props;
  return (
    <div>
      <input
        className="ant-input"
        type={type}
        defaultValue={defaultValue}
        // value={value}
        accept={accept}
        onBlur={(e) => handleOnBlur(e)}
        onChange={(e) => handleOnChange(e)}
        onPaste={handleOnPast}
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
