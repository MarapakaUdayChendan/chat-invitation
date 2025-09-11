import React from "react";
import { render } from "@testing-library/react-native";
import OrganizationSelection from "../OrganizationSelection";

test("renders OrganizationSelection component", () => {
  const { toJSON } = render(<OrganizationSelection />);
  expect(toJSON()).toMatchSnapshot();
});
