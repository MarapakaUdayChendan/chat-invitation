import React from "react";
import { render } from "@testing-library/react-native";
import Email from "../Email";

test("renders Email component", () => {
  const { toJSON } = render(<Email />);
  expect(toJSON()).toMatchSnapshot();
});
