import React from "react";

export default function ValidationInput(props) {
  const { key = 0, value, handleOnChange, name, errorMessage } = props;
  return (
    <div key={key}>
      <input
        value={value}
        onChange={(e) => handleOnChange(name, e.target.value)}
      />
      {errorMessage && (
        <p style={{ color: "red", fontSize: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
