import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ContactHome from "../../src/screens/ContactHome";
import * as ExpoContacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Mocks

jest.mock("expo-contacts", () => ({
  requestPermissionsAsync: jest.fn(),
  getContactsAsync: jest.fn(),
  Fields: {
    PhoneNumbers: "phoneNumbers",
    Emails: "emails",
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: (cb: any) => cb(), // Immediately call useFocusEffect callback
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ContactHome", () => {
  it("shows loading state initially", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });

    const { getByText } = render(<ContactHome />);
    getByText("Loading contacts...");
  });

  it("shows permission denied fallback", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

    const { getByText } = render(<ContactHome />);
    await waitFor(() => {
      getByText("Contacts permission is required."); // assuming ContactPermission shows this
    });
  });

  it("loads and displays contacts", async () => {
    const contactsMock = [
      {
        id: "1",
        name: "Alice",
        phoneNumbers: [{ label: "mobile", number: "123" }],
        emails: [{ label: "work", email: "alice@example.com" }],
      },
      {
        id: "2",
        name: "Bob",
        phoneNumbers: [{ label: "home", number: "456" }],
      },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

    const { findByText } = render(<ContactHome />);
    await findByText("Alice");
    await findByText("Bob");
  });

  it("selects a contact and triggers invite", async () => {
    const contactsMock = [
      {
        id: "1",
        name: "Alice",
        phoneNumbers: [{ label: "mobile", number: "123" }],
      },
    ];
    const mockNavigate = jest.fn();
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

    // Override useNavigation to capture navigation
    jest.mock("@react-navigation/native", () => ({
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
      useFocusEffect: (cb: any) => cb(),
    }));

    const { findByText, getByText } = render(<ContactHome />);

    const contact = await findByText("Alice");

    fireEvent(contact, "longPress"); // Enter selection mode and select contact

    const inviteButton = getByText(/Invite 1 Contact/);
    fireEvent.press(inviteButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "INVITED_CONTACTS",
        expect.stringContaining("Alice")
      );
      expect(mockNavigate).toHaveBeenCalledWith("OrganizationSelection");
    });
  });
});
