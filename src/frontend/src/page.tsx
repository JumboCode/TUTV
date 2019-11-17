import React from "react";
import { useState } from "react";

interface IProps {
  name?: string;
}

const dashboard: React.FC<IProps> = (props: IProps) => {
  //
  return <h1>Hello, {props.name}! Welcome to React and TypeScript.</h1>;

  dashboard.defaultProps = {
    name: "world"
  };
};

export default dashboard;

//   import * as React from 'react';

// const Header: React.FC<IProps> = (props: IProps) => (
//   <h1>Hello, {props.name}! Welcome to React and TypeScript.</h1>
// );
