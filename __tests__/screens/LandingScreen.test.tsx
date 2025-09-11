import React from "react";
import { render } from "@testing-library/react-native";
import LandingScreen from "../LandingScreen";

test("renders LandingScreen component", () => {
  const { toJSON } = render(<LandingScreen />);
  expect(toJSON()).toMatchSnapshot();
});
