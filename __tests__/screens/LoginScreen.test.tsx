import React from "react";
import { render } from "@testing-library/react-native";
import LoginScreen from "../LoginScreen";

test("renders LoginScreen component", () => {
  const { toJSON } = render(<LoginScreen />);
  expect(toJSON()).toMatchSnapshot();
});
