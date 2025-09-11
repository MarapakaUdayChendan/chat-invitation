import React from "react";
import { render } from "@testing-library/react-native";
import EmailScreen from "../EmailScreen";

test("renders EmailScreen component", () => {
  const { toJSON } = render(<EmailScreen />);
  expect(toJSON()).toMatchSnapshot();
});
