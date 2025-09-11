import React from "react";
import { render } from "@testing-library/react-native";
import ForgotPasswordScreen from "../ForgotPasswordScreen";

test("renders ForgotPasswordScreen component", () => {
  const { toJSON } = render(<ForgotPasswordScreen />);
  expect(toJSON()).toMatchSnapshot();
});
