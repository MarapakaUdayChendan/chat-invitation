import React from "react";
import { render } from "@testing-library/react-native";
import OtpGeneration from "../OtpGeneration";

test("renders OtpGeneration component", () => {
  const { toJSON } = render(<OtpGeneration />);
  expect(toJSON()).toMatchSnapshot();
});
