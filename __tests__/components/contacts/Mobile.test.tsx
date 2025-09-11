import React from "react";
import { render } from "@testing-library/react-native";
import Mobile from "../Mobile";

test("renders Mobile component", () => {
  const { toJSON } = render(<Mobile />);
  expect(toJSON()).toMatchSnapshot();
});
