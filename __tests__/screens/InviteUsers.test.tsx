import React from "react";
import { render } from "@testing-library/react-native";
import InviteUsers from "../InviteUsers";

test("renders InviteUsers component", () => {
  const { toJSON } = render(<InviteUsers />);
  expect(toJSON()).toMatchSnapshot();
});
