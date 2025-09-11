import React from "react";
import { render } from "@testing-library/react-native";
import ContactPermission from "../ContactPermission";

test("renders ContactPermission component", () => {
  const { toJSON } = render(<ContactPermission />);
  expect(toJSON()).toMatchSnapshot();
});
