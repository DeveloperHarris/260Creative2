import React, { Component } from "react";

const profile = props => {
  if (!props.name) return null;

  return <h1>Hello World</h1>;
};

export default profile;
