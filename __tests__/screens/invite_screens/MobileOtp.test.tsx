import React from "react";
import { render } from "@testing-library/react-native";
import MobileOtp from "../MobileOtp";

test("renders MobileOtp component", () => {
  const { toJSON } = render(<MobileOtp />);
  expect(toJSON()).toMatchSnapshot();
});
