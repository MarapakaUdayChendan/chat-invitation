import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OrganizationSelection from "../../src/screens/OrganizationSelection";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("OrganizationSelection", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders and matches snapshot", () => {
    const { toJSON } = render(<OrganizationSelection />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("allows selecting different organizations and submits", () => {
    const { getByTestId, getByText } = render(<OrganizationSelection />);

    const myOrgPicker = getByTestId("myorg-picker").children[0];
    const externalOrgPicker = getByTestId("externalorg-picker").children[0];
    const entryPointPicker = getByTestId("entrypoint-picker").children[0];

    fireEvent(myOrgPicker, "onValueChange", "Org A");
    fireEvent(externalOrgPicker, "onValueChange", "External Org B");
    fireEvent(entryPointPicker, "onValueChange", "Partner");

    fireEvent.press(getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("InviteUsers");
  });
});
