import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import InviteContacts from "../../src/screens/InviteContacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useFocusEffect: (cb: any) => cb(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => buttons);
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("InviteContacts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Functionality", () => {
    beforeEach(() => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "John Doe", phoneNumber: "1234567890" },
          { id: "2", name: "Jane Smith", phoneNumber: "9876543210" },
        ])
      );
    });

    it("renders header correctly", async () => {
      const { getByText } = render(<InviteContacts />);
      expect(getByText("Send Invites")).toBeTruthy();
      expect(getByText("← Back")).toBeTruthy();
    });

    it("renders contacts summary correctly", async () => {
      const { getByText } = render(<InviteContacts />);
      await waitFor(() => {
        expect(getByText("Selected Contacts")).toBeTruthy();
        expect(getByText("2 contact(s) selected")).toBeTruthy();
      });
    });

    it("renders contact list with correct data", async () => {
      const { findByTestId } = render(<InviteContacts />);
      
      await findByTestId("contact-name-1");
      await findByTestId("contact-name-2");
      await findByTestId("contact-phone-1");
      await findByTestId("contact-phone-2");
      
      const name1 = await findByTestId("contact-name-1");
      const name2 = await findByTestId("contact-name-2");
      const phone1 = await findByTestId("contact-phone-1");
      const phone2 = await findByTestId("contact-phone-2");
      
      expect(name1.props.children).toBe("John Doe");
      expect(name2.props.children).toBe("Jane Smith");
      expect(phone1.props.children).toBe("1234567890");
      expect(phone2.props.children).toBe("9876543210");
    });

    it("renders avatar initials correctly", async () => {
      const { findByTestId } = render(<InviteContacts />);
      
      const avatar1 = await findByTestId("avatar-initial-1");
      const avatar2 = await findByTestId("avatar-initial-2");
      
      expect(avatar1.props.children).toBe("J");
      expect(avatar2.props.children).toBe("J");
    });

    it("shows send all button when contacts exist", async () => {
      const { findByText } = render(<InviteContacts />);
      await findByText("Send Invite to All (2)");
    });

    it("handles back button press", () => {
      const { getByText } = render(<InviteContacts />);
      const backButton = getByText("← Back");
      fireEvent.press(backButton);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe("AsyncStorage Loading", () => {
    it("loads contacts from AsyncStorage successfully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "Test User", phoneNumber: "1111111111" },
        ])
      );

      const { findByTestId, getByText } = render(<InviteContacts />);
      
      const contactName = await findByTestId("contact-name-1");
      const contactPhone = await findByTestId("contact-phone-1");
      
      expect(contactName.props.children).toBe("Test User");
      expect(contactPhone.props.children).toBe("1111111111");
      
      await waitFor(() => {
        expect(getByText("1 contact(s) selected")).toBeTruthy();
      });
    });

    it("handles null AsyncStorage data", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { getByText } = render(<InviteContacts />);
      await waitFor(() => {
        expect(getByText("No contacts selected")).toBeTruthy();
        expect(getByText("0 contact(s) selected")).toBeTruthy();
      });
    });

    it("handles AsyncStorage error gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error("Storage error"));

      const { getByText } = render(<InviteContacts />);
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Error loading contacts", expect.any(Error));
        expect(getByText("No contacts selected")).toBeTruthy();
      });
    });
  });

  describe("Individual Invite Functionality", () => {
    beforeEach(() => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "John Doe", phoneNumber: "1234567890" },
        ])
      );
    });

    it("fires individual invite alert on Invite button press", async () => {
      const { findByTestId } = render(<InviteContacts />);
      const inviteButton = await findByTestId("invite-button-1");
      
      fireEvent.press(inviteButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        "Send Invite",
        "Send invitation to John Doe?",
        expect.arrayContaining([
          { text: "Cancel", style: "cancel" },
          { text: "Send", onPress: expect.any(Function) },
        ])
      );
    });

    it("handles individual invite Send button press", async () => {
      const { findByTestId } = render(<InviteContacts />);
      const inviteButton = await findByTestId("invite-button-1");
      
      fireEvent.press(inviteButton);
      
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const sendButton = alertCall[2].find((btn: any) => btn.text === "Send");
      
      sendButton.onPress();
      
      expect(console.log).toHaveBeenCalledWith("Sending invite to John Doe at 1234567890");
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Invitation sent to John Doe!");
    });
  });

  describe("Bulk Invite Functionality", () => {
    beforeEach(() => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "John Doe", phoneNumber: "1234567890" },
          { id: "2", name: "Jane Smith", phoneNumber: "9876543210" },
        ])
      );
    });

    it("fires bulk invite alert on Send All button press", async () => {
      const { findByText } = render(<InviteContacts />);
      const sendAllButton = await findByText("Send Invite to All (2)");
      
      fireEvent.press(sendAllButton);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        "Send Invites",
        "Send invitation to all 2 contacts?",
        expect.arrayContaining([
          { text: "Cancel", style: "cancel" },
          { text: "Send All", onPress: expect.any(Function) },
        ])
      );
    });

    it("handles bulk invite Send All button press", async () => {
      const { findByText } = render(<InviteContacts />);
      const sendAllButton = await findByText("Send Invite to All (2)");
      
      fireEvent.press(sendAllButton);
      
      const firstAlertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const sendAllButton2 = firstAlertCall[2].find((btn: any) => btn.text === "Send All");
      
      sendAllButton2.onPress();
      
      expect(console.log).toHaveBeenCalledWith("Sending invite to John Doe at 1234567890");
      expect(console.log).toHaveBeenCalledWith("Sending invite to Jane Smith at 9876543210");
      
      const successAlertCall = (Alert.alert as jest.Mock).mock.calls[1];
      expect(successAlertCall[0]).toBe("Success");
      expect(successAlertCall[1]).toBe("Invitations sent to 2 contacts!");
      
      const okButton = successAlertCall[2][0];
      okButton.onPress();
      
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles contacts with empty names", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "", phoneNumber: "1234567890" },
        ])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      const avatar = await findByTestId("avatar-initial-1");
      const phone = await findByTestId("contact-phone-1");
      
      expect(avatar.props.children).toBe("?");
      expect(phone.props.children).toBe("1234567890");
    });

    it("handles contacts with null names", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([{ id: "3", name: null, phoneNumber: "0001112222" }])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      const avatar = await findByTestId("avatar-initial-3");
      expect(avatar.props.children).toBe("?");
    });

    it("handles contacts with undefined names", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([{ id: "4", phoneNumber: "1234567890" }])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      const avatar = await findByTestId("avatar-initial-4");
      expect(avatar.props.children).toBe("?");
    });

    it("handles contacts with single character names", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([{ id: "5", name: "A", phoneNumber: "1234567890" }])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      const avatar = await findByTestId("avatar-initial-5");
      const name = await findByTestId("contact-name-5");
      
      expect(avatar.props.children).toBe("A");
      expect(name.props.children).toBe("A");
    });

    it("handles large contact lists", async () => {
      const largeContactList = Array.from({ length: 100 }, (_, index) => ({
        id: `${index}`,
        name: `Contact ${index}`,
        phoneNumber: `${index}`.repeat(10),
      }));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(largeContactList));

      const { findByText } = render(<InviteContacts />);
      await findByText("100 contact(s) selected");
      await findByText("Send Invite to All (100)");
    });

    it("handles contacts with special characters in names", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "José María", phoneNumber: "1234567890" },
          { id: "2", name: "李小明", phoneNumber: "9876543210" },
        ])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      const name1 = await findByTestId("contact-name-1");
      const name2 = await findByTestId("contact-name-2");
      const avatar1 = await findByTestId("avatar-initial-1");
      const avatar2 = await findByTestId("avatar-initial-2");
      
      expect(name1.props.children).toBe("José María");
      expect(name2.props.children).toBe("李小明");
      expect(avatar1.props.children).toBe("J");
      expect(avatar2.props.children).toBe("李");
    });
  });

  describe("Error Boundary and Performance", () => {
    it("handles corrupted contact data gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1" }, // Missing required fields
          { name: "No ID", phoneNumber: "1111111111" }, // Missing ID
          { id: "2", name: "Valid", phoneNumber: "2222222222" }, // Valid
        ])
      );

      const { findByTestId } = render(<InviteContacts />);
      
      // Should still render the valid contact
      const validContact = await findByTestId("contact-name-2");
      expect(validContact.props.children).toBe("Valid");
    });

    it("handles component unmounting gracefully", () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          { id: "1", name: "Test", phoneNumber: "1111111111" },
        ])
      );

      const { unmount } = render(<InviteContacts />);
      expect(() => unmount()).not.toThrow();
    });
  });
});
