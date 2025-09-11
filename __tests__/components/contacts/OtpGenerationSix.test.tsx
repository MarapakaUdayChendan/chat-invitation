import React from "react";
import { render } from "@testing-library/react-native";
import OtpGenerationSix from "../OtpGenerationSix";

test("renders OtpGenerationSix component", () => {
  const { toJSON } = render(<OtpGenerationSix />);
  expect(toJSON()).toMatchSnapshot();
});
