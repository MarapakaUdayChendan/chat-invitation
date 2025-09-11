import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ContactHome from "../../src/screens/ContactHome";
import * as ExpoContacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Create mockNavigate at module level
const mockNavigate = jest.fn();

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
    navigate: mockNavigate,
  }),
  useFocusEffect: (cb: any) => cb(), // Immediately call useFocusEffect callback
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("ContactHome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

    const { findByText, getByText, queryByText } = render(<ContactHome />);

    // Wait for contact to load
    const contact = await findByText("Alice");

    // Simulate long press to select contact
    fireEvent(contact, "longPress");

    // Wait for selection mode UI to appear
    await waitFor(() => {
      expect(queryByText(/Invite.*Contact/i)).toBeTruthy();
    });

    // Find and press invite button
    const inviteButton = getByText(/Invite.*Contact/i);
    fireEvent.press(inviteButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "INVITED_CONTACTS",
        expect.stringContaining("Alice")
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("OrganizationSelection");
    });
  });

it("handles search functionality", async () => {
  const contactsMock = [
    {
      id: "1",
      name: "Alice Johnson",
      phoneNumbers: [{ label: "mobile", number: "123" }],
    },
    {
      id: "2",
      name: "Bob Smith",
      phoneNumbers: [{ label: "home", number: "456" }],
    },
  ];
  
  (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
  (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

  const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);

  // Wait for contacts to load
  await findByText("Alice Johnson");
  await findByText("Bob Smith");

  // Search for Alice - use the correct placeholder text
  const searchInput = getByPlaceholderText("Search by name or phone...");
  fireEvent.changeText(searchInput, "Alice");

  // Alice should be visible, Bob should not
  await waitFor(() => {
    expect(queryByText("Alice Johnson")).toBeTruthy();
    expect(queryByText("Bob Smith")).toBeNull();
  });
});

it("handles multiple contact selection", async () => {
  const contactsMock = [
    {
      id: "1",
      name: "Alice",
      phoneNumbers: [{ label: "mobile", number: "123" }],
    },
    {
      id: "2", 
      name: "Bob",
      phoneNumbers: [{ label: "mobile", number: "456" }],
    },
  ];
  
  (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
  (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

  const { findByText, getByText, queryAllByText } = render(<ContactHome />);

  // Wait for contacts to load
  const alice = await findByText("Alice");
  const bob = await findByText("Bob");

  // Select first contact with long press
  fireEvent(alice, "longPress");

  // Select second contact with regular press
  fireEvent.press(bob);

  // Wait for selection count to appear
  await waitFor(() => {
    expect(getByText("2 contact(s) selected")).toBeTruthy();
  });

  // Verify both contacts show selection checkmarks
  await waitFor(() => {
    const checkmarks = queryAllByText("✓");
    expect(checkmarks).toHaveLength(2);
  });

  // Verify invite button shows the complete text
  await waitFor(() => {
    expect(getByText("Invite 2 Contact(s)")).toBeTruthy();
  });
});


  it("shows empty state when no contacts", async () => {
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });

    const { findByText } = render(<ContactHome />);
    
    await findByText(/No contacts found/i);
  });

  it("cancels selection mode", async () => {
    const contactsMock = [
      {
        id: "1",
        name: "Alice",
        phoneNumbers: [{ label: "mobile", number: "123" }],
      },
    ];
    
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });

    const { findByText, getByText, queryByText } = render(<ContactHome />);

    // Wait for contact to load and select
    const contact = await findByText("Alice");
    fireEvent(contact, "longPress");

    // Verify selection mode is active
    await waitFor(() => {
      expect(getByText(/Invite.*Contact/i)).toBeTruthy();
    });

    // Find and press cancel button (might be X or Cancel)
    const cancelButton = getByText(/Cancel|×/i);
    fireEvent.press(cancelButton);

    // Verify selection mode is cancelled
    await waitFor(() => {
      expect(queryByText(/Invite.*Contact/i)).toBeNull();
    });
  });
});
