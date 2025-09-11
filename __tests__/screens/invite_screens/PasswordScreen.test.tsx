import React from "react";
import { render } from "@testing-library/react-native";
import PasswordScreen from "../PasswordScreen";

test("renders PasswordScreen component", () => {
  const { toJSON } = render(<PasswordScreen />);
  expect(toJSON()).toMatchSnapshot();
});
