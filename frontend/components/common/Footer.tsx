import React from "react";

function Footer() {
  return (
    <footer
      className="py-3 d-flex justify-content-center align-items-center text-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        color: "white",
        width: "100%",
      }}
    >
      <p className="mb-0 px-3" style={{ fontSize: "14px" }}>
        Developed by <strong>Team HackerX</strong> |{" "}
        <strong>LNMIIT Hackathon | </strong>
         <strong>TEAM LEADER : RAGHAV ARORA </strong>
          <strong>TEAM MEMBER : ARYAN PRADHAN </strong>

      </p>
    </footer>
  );
}

export default Footer;
