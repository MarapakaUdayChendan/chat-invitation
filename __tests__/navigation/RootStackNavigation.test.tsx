import React from "react";
import { render } from "@testing-library/react-native";
import RootStackNavigation from "../RootStackNavigation";

test("renders RootStackNavigation component", () => {
  const { toJSON } = render(<RootStackNavigation />);
  expect(toJSON()).toMatchSnapshot();
});
