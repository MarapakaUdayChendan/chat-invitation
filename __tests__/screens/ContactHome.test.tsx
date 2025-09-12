import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ContactHome from "../../src/screens/ContactHome";
import * as ExpoContacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const mockNavigate = jest.fn();

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
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: any) => cb(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("ContactHome", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading state initially", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
    const { getByText } = render(<ContactHome />);
    getByText("Loading contacts...");
  });

  it("shows permission denied fallback", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });
    const { getByText } = render(<ContactHome />);
    await waitFor(() => getByText("Contacts permission is required."));
  });

  it("loads and displays contacts", async () => {
    const contactsMock = [
      { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }], emails: [{ label: "work", email: "alice@example.com" }] },
      { id: "2", name: "Bob", phoneNumbers: [{ label: "home", number: "456" }] },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    const { findByText } = render(<ContactHome />);
    await findByText("Alice");
    await findByText("Bob");
  });

  it("selects a contact and triggers invite", async () => {
    const contactsMock = [{ id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] }];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    const { findByText, getByText, queryByText } = render(<ContactHome />);
    const contact = await findByText("Alice");
    fireEvent(contact, "longPress");
    await waitFor(() => expect(queryByText(/Invite.*Contact/i)).toBeTruthy());
    const inviteButton = getByText(/Invite.*Contact/i);
    fireEvent.press(inviteButton);
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith("INVITED_CONTACTS", expect.stringContaining("Alice")));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("OrganizationSelection"));
  });

  it("handles search functionality", async () => {
    const contactsMock = [
      { id: "1", name: "Alice Johnson", phoneNumbers: [{ label: "mobile", number: "123" }] },
      { id: "2", name: "Bob Smith", phoneNumbers: [{ label: "home", number: "456" }] },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);
    await findByText("Alice Johnson");
    await findByText("Bob Smith");
    const searchInput = getByPlaceholderText("Search by name or phone...");
    fireEvent.changeText(searchInput, "Alice");
    await waitFor(() => {
      expect(queryByText("Alice Johnson")).toBeTruthy();
      expect(queryByText("Bob Smith")).toBeNull();
    });
  });

  it("handles multiple contact selection", async () => {
    const contactsMock = [
      { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] },
      { id: "2", name: "Bob", phoneNumbers: [{ label: "mobile", number: "456" }] },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    const { findByText, getByText, queryAllByText } = render(<ContactHome />);
    const alice = await findByText("Alice");
    const bob = await findByText("Bob");
    fireEvent(alice, "longPress");
    fireEvent.press(bob);
    await waitFor(() => expect(getByText("2 contact(s) selected")).toBeTruthy());
    await waitFor(() => {
      const checkmarks = queryAllByText("✓");
      expect(checkmarks).toHaveLength(2);
    });
    await waitFor(() => expect(getByText("Invite 2 Contact(s)")).toBeTruthy());
  });

  it("shows empty state when no contacts", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
    const { findByText } = render(<ContactHome />);
    await findByText(/No contacts found/i);
  });

  it("cancels selection mode", async () => {
    const contactsMock = [{ id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] }];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    const { findByText, getByText, queryByText } = render(<ContactHome />);
    const contact = await findByText("Alice");
    fireEvent(contact, "longPress");
    await waitFor(() => expect(getByText(/Invite.*Contact/i)).toBeTruthy());
    const cancelButton = getByText(/Cancel|×/i);
    fireEvent.press(cancelButton);
    await waitFor(() => expect(queryByText(/Invite.*Contact/i)).toBeNull());
  });
});
