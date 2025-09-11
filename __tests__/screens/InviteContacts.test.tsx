import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InviteContacts from "../../src/screens/InviteContacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useFocusEffect: (cb: any) => cb(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() =>
    Promise.resolve(
      JSON.stringify([
        { id: "1", name: "John Doe", phoneNumber: "1234567890" },
        { id: "2", name: "Jane Smith", phoneNumber: "9876543210" },
      ])
    )
  ),
}));

jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => buttons);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("InviteContacts", () => {
  it("fires individual invite alert on Invite button press", async () => {
    const { findByTestId } = render(<InviteContacts />);
    const inviteButton = await findByTestId("invite-button-1");
    fireEvent.press(inviteButton);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Send Invite",
      expect.stringContaining("John Doe"),
      expect.any(Array)
    );
  });

  it("fires bulk invite alert and navigates back on Send All", async () => {
    const { findByText } = render(<InviteContacts />);
    const sendAllButton = await findByText(/Send Invite to All/);
    fireEvent.press(sendAllButton);

    // First alert: "Send Invites" dialog
    const firstAlertCall = (Alert.alert as jest.Mock).mock.calls[
      (Alert.alert as jest.Mock).mock.calls.length - 1
    ];
    const sendAllBtn = firstAlertCall[2].find((btn: any) => btn.text === "Send All");
    expect(sendAllBtn).toBeDefined();

    // Simulate pressing "Send All"
    sendAllBtn.onPress();

    // Second alert: "Success" dialog
    const secondAlertCall = (Alert.alert as jest.Mock).mock.calls[
      (Alert.alert as jest.Mock).mock.calls.length - 1
    ];
    const okBtn = secondAlertCall[2].find((btn: any) => btn.text === "OK");
    expect(okBtn).toBeDefined();

    // Simulate pressing "OK" to trigger navigation.goBack()
    okBtn.onPress();

    expect(mockGoBack).toHaveBeenCalled();
  });
});
