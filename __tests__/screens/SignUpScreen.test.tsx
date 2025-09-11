import React from "react";
import { render } from "@testing-library/react-native";
import SignUpScreen from "../SignUpScreen";

test("renders SignUpScreen component", () => {
  const { toJSON } = render(<SignUpScreen />);
  expect(toJSON()).toMatchSnapshot();
});
