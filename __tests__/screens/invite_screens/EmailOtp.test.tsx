import React from "react";
import { render } from "@testing-library/react-native";
import EmailOtp from "../EmailOtp";

test("renders EmailOtp component", () => {
  const { toJSON } = render(<EmailOtp />);
  expect(toJSON()).toMatchSnapshot();
});
