import React from "react";
import { render } from "@testing-library/react-native";
import MobileScreen from "../../../src/screens/invite_screens/MobileScreen";

test("renders MobileScreen component", () => {
  const { toJSON } = render(<MobileScreen />);
  expect(toJSON()).toMatchSnapshot();
});
