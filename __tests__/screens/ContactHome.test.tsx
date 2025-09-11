import React from "react";
import { render } from "@testing-library/react-native";
import ContactHome from "../ContactHome";

test("renders ContactHome component", () => {
  const { toJSON } = render(<ContactHome />);
  expect(toJSON()).toMatchSnapshot();
});
