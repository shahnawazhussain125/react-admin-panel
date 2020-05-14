import React from "react";

export default function ValidationInput(props) {
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
        onChange={(e) =>
          type === "image" || type === "file"
            ? handleOnChange(e)
            : handleOnChange(name, e.target.value)
        }
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
