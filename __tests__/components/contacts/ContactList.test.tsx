import React from "react";
import { render } from "@testing-library/react-native";
import ContactList from "../ContactList";

test("renders ContactList component", () => {
  const { toJSON } = render(<ContactList />);
  expect(toJSON()).toMatchSnapshot();
});
