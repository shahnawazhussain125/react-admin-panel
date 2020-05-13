import React from "react";

export default function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "#fabd03",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={require("../../image/404-Page.jpg")} />
    </div>
  );
}
