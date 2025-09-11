import React from "react";
import { render } from "@testing-library/react-native";
import ForgotPasswordConfirm from "../ForgotPasswordConfirm";

test("renders ForgotPasswordConfirm component", () => {
  const { toJSON } = render(<ForgotPasswordConfirm />);
  expect(toJSON()).toMatchSnapshot();
});
