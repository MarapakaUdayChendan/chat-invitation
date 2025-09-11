import React from "react";
import { render } from "@testing-library/react-native";
import SignUpConfirmation from "../SignUpConfirmation";

test("renders SignUpConfirmation component", () => {
  const { toJSON } = render(<SignUpConfirmation />);
  expect(toJSON()).toMatchSnapshot();
});
