import React from "react";
import { render } from "@testing-library/react-native";
import ContactSearch from "../ContactSearch";

test("renders ContactSearch component", () => {
  const { toJSON } = render(<ContactSearch />);
  expect(toJSON()).toMatchSnapshot();
});
