import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InviteUsers from "../../src/screens/InviteUsers";

// Mock navigation for expo-router or React Navigation
const mockNavigate = jest.fn();
jest.mock("expo-router", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("InviteUsers", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders InviteUsers component and matches snapshot", () => {
    const { toJSON } = render(<InviteUsers />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("toggles checkboxes when pressed", () => {
    const { getByText } = render(<InviteUsers />);

    const emailOption = getByText("E-Mail");
    const smsOption = getByText("SMS");

    fireEvent.press(emailOption);
    fireEvent.press(smsOption);

    fireEvent.press(emailOption);
  });

  it("navigates to MobileScreen on submit with selected options", () => {
    const { getByText } = render(<InviteUsers />);

    fireEvent.press(getByText("E-Mail"));
    fireEvent.press(getByText("What's app"));
    fireEvent.press(getByText("Submit"));

    expect(mockNavigate).toHaveBeenCalledWith("MobileScreen");
  });

  it("navigates to MobileScreen on submit with no options selected", () => {
    const { getByText } = render(<InviteUsers />);
    fireEvent.press(getByText("Submit"));
    expect(mockNavigate).toHaveBeenCalledWith("MobileScreen");
  });
});
