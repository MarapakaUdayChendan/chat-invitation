import React from "react";
import { render } from "@testing-library/react-native";
import InviteContacts from "../InviteContacts";

test("renders InviteContacts component", () => {
  const { toJSON } = render(<InviteContacts />);
  expect(toJSON()).toMatchSnapshot();
});
