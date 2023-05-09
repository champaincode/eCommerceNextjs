import React from "react";

export const Spinner = () => {
  return (
    <div className="dot-wave__container">
      <div className="dot-wave">
        <div className="dot-wave__dot" />
        <div className="dot-wave__dot" />
        <div className="dot-wave__dot" />
        <div className="dot-wave__dot" />
      </div>
    </div>
  );
};
