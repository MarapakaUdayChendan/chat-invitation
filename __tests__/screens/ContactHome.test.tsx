import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
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
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("ContactHome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Loading and Permissions", () => {
    it("shows loading state initially", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
      
      const { getByText } = render(<ContactHome />);
      expect(getByText("Loading contacts...")).toBeTruthy();
    });

    it("handles permission checking state", async () => {
      // Mock a delayed permission request
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ status: "granted" }), 100))
      );
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
      
      const { getByText } = render(<ContactHome />);
      expect(getByText("Loading contacts...")).toBeTruthy();
    });

    it("shows permission denied state with error message", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });
      
      const { getByText } = render(<ContactHome />);
      await waitFor(() => {
        expect(getByText("Contacts permission is required.")).toBeTruthy();
      });
    });

    it("handles permission request failure", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockRejectedValue(new Error("Permission error"));
      
      const { getByText } = render(<ContactHome />);
      await waitFor(() => {
        expect(getByText("Failed to load contacts")).toBeTruthy();
      });
    });

    it("handles contacts loading failure", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockRejectedValue(new Error("Contacts loading failed"));
      
      const { getByText } = render(<ContactHome />);
      await waitFor(() => {
        expect(getByText("Failed to load contacts")).toBeTruthy();
      });
    });
  });

  describe("Contact Loading and Display", () => {
    it("loads and displays contacts", async () => {
      const contactsMock = [
        { 
          id: "1", 
          name: "Alice", 
          phoneNumbers: [{ label: "mobile", number: "123" }], 
          emails: [{ label: "work", email: "alice@example.com" }] 
        },
        { 
          id: "2", 
          name: "Bob", 
          phoneNumbers: [{ label: "home", number: "456" }] 
        },
      ];
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
      
      const { findByText } = render(<ContactHome />);
      await findByText("Alice");
      await findByText("Bob");
    });

it("handles contacts without names gracefully", async () => {
  const contactsMock = [
    { id: "1", name: "", phoneNumbers: [{ label: "mobile", number: "123" }] },
    { id: "2", name: null, phoneNumbers: [{ label: "mobile", number: "456" }] },
    { id: "3", phoneNumbers: [{ label: "mobile", number: "789" }] }, // No name property
  ];
  (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
  (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
  
  const { findAllByText } = render(<ContactHome />);
  
  // Should render "Unknown" for contacts without names
  const unknownContacts = await findAllByText("Unknown");
  expect(unknownContacts).toHaveLength(3); // All three contacts should show as "Unknown"
});

    it("filters out contacts without IDs", async () => {
      const contactsMock = [
        { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] },
        { name: "Bob", phoneNumbers: [{ label: "mobile", number: "456" }] }, // No ID
        { id: "", name: "Charlie", phoneNumbers: [{ label: "mobile", number: "789" }] }, // Empty ID
      ];
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
      
      const { findByText, queryByText } = render(<ContactHome />);
      await findByText("Alice");
      expect(queryByText("Bob")).toBeNull();
      expect(queryByText("Charlie")).toBeNull();
    });

    it("shows empty state when no contacts", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
      
      const { findByText } = render(<ContactHome />);
      await findByText(/No contacts found/i);
    });
  });

  describe("Search Functionality", () => {
    const contactsMock = [
      { id: "1", name: "Alice Johnson", phoneNumbers: [{ label: "mobile", number: "1234567890" }] },
      { id: "2", name: "Bob Smith", phoneNumbers: [{ label: "home", number: "9876543210" }] },
      { id: "3", name: "Charlie Brown", phoneNumbers: [{ label: "work", number: "5555551234" }] },
    ];

    beforeEach(() => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    });

    it("filters contacts by name", async () => {
      const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);
      await findByText("Alice Johnson");
      
      const searchInput = getByPlaceholderText("Search by name or phone...");
      fireEvent.changeText(searchInput, "Alice");
      
      await waitFor(() => {
        expect(queryByText("Alice Johnson")).toBeTruthy();
        expect(queryByText("Bob Smith")).toBeNull();
        expect(queryByText("Charlie Brown")).toBeNull();
      });
    });

    it("filters contacts by phone number", async () => {
      const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);
      await findByText("Alice Johnson");
      
      const searchInput = getByPlaceholderText("Search by name or phone...");
      fireEvent.changeText(searchInput, "987");
      
      await waitFor(() => {
        expect(queryByText("Bob Smith")).toBeTruthy();
        expect(queryByText("Alice Johnson")).toBeNull();
        expect(queryByText("Charlie Brown")).toBeNull();
      });
    });

    it("handles search with mixed characters and numbers", async () => {
      const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);
      await findByText("Alice Johnson");
      
      const searchInput = getByPlaceholderText("Search by name or phone...");
      fireEvent.changeText(searchInput, "Bob 987");
      
      await waitFor(() => {
        expect(queryByText("Bob Smith")).toBeTruthy();
        expect(queryByText("Alice Johnson")).toBeNull();
      });
    });

    it("handles empty search query", async () => {
      const { findByText, getByPlaceholderText } = render(<ContactHome />);
      await findByText("Alice Johnson");
      
      const searchInput = getByPlaceholderText("Search by name or phone...");
      fireEvent.changeText(searchInput, "Alice");
      fireEvent.changeText(searchInput, "");
      
      await waitFor(() => {
        expect(findByText("Alice Johnson")).toBeTruthy();
        expect(findByText("Bob Smith")).toBeTruthy();
        expect(findByText("Charlie Brown")).toBeTruthy();
      });
    });

    it("handles contacts without phone numbers in search", async () => {
      const contactsWithoutPhones = [
        { id: "1", name: "Alice", emails: [{ label: "work", email: "alice@test.com" }] },
        { id: "2", name: "Bob", phoneNumbers: [] },
      ];
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsWithoutPhones });
      
      const { findByText, getByPlaceholderText, queryByText } = render(<ContactHome />);
      await findByText("Alice");
      
      const searchInput = getByPlaceholderText("Search by name or phone...");
      fireEvent.changeText(searchInput, "123");
      
      await waitFor(() => {
        expect(queryByText("Alice")).toBeNull();
        expect(queryByText("Bob")).toBeNull();
      });
    });
  });

  describe("Contact Selection", () => {
    const contactsMock = [
      { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] },
      { id: "2", name: "Bob", phoneNumbers: [{ label: "mobile", number: "456" }] },
      { id: "3", name: "Charlie" }, // No phone numbers
    ];

    beforeEach(() => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    });

    it("enters selection mode on long press", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const contact = await findByText("Alice");
      
      fireEvent(contact, "longPress");
      
      await waitFor(() => {
        expect(getByText("1 contact(s) selected")).toBeTruthy();
        expect(getByText("Cancel")).toBeTruthy();
      });
    });

    it("selects multiple contacts", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      const bob = await findByText("Bob");
      
      fireEvent(alice, "longPress");
      fireEvent.press(bob);
      
      await waitFor(() => {
        expect(getByText("2 contact(s) selected")).toBeTruthy();
        expect(getByText("Invite 2 Contact(s)")).toBeTruthy();
      });
    });

    it("deselects contacts when pressed again", async () => {
      const { findByText, getByText, queryByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      
      fireEvent(alice, "longPress");
      await waitFor(() => expect(getByText("1 contact(s) selected")).toBeTruthy());
      
      fireEvent.press(alice);
      await waitFor(() => {
        expect(queryByText("contact(s) selected")).toBeNull();
      });
    });

    it("cancels selection mode", async () => {
      const { findByText, getByText, queryByText } = render(<ContactHome />);
      const contact = await findByText("Alice");
      
      fireEvent(contact, "longPress");
      await waitFor(() => expect(getByText("Cancel")).toBeTruthy());
      
      const cancelButton = getByText("Cancel");
      fireEvent.press(cancelButton);
      
      await waitFor(() => {
        expect(queryByText("Cancel")).toBeNull();
        expect(queryByText("contact(s) selected")).toBeNull();
      });
    });

    it("handles contact press in selection mode", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      const bob = await findByText("Bob");
      
      fireEvent(alice, "longPress");
      fireEvent.press(bob);
      
      await waitFor(() => {
        expect(getByText("2 contact(s) selected")).toBeTruthy();
      });
    });
  });

  describe("Contact Information Display", () => {
    it("shows contact details on press when not in selection mode", async () => {
      const contactsMock = [
        { 
          id: "1", 
          name: "Alice", 
          phoneNumbers: [{ label: "mobile", number: "123" }],
          emails: [{ label: "work", email: "alice@test.com" }]
        },
      ];
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
      
      const { findByText } = render(<ContactHome />);
      const contact = await findByText("Alice");
      
      fireEvent.press(contact);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Alice",
          "Phone: 123\nEmail: alice@test.com",
          [{ text: "Close", style: "cancel" }]
        );
      });
    });

    it("handles contacts without phone or email", async () => {
    const contactsMock = [
      { id: "1", name: "Alice" },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    
    const { findByText } = render(<ContactHome />);
    const contact = await findByText("Alice");
    
    fireEvent.press(contact);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Alice",
        "Phone: No phone\nEmail: No email",
        [{ text: "Close", style: "cancel" }]
      );
    });
  });

  it("handles contacts without names in contact press", async () => {
    const contactsMock = [
      { id: "1", phoneNumbers: [{ label: "mobile", number: "123" }] },
    ];
    (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    
    const { getByText } = render(<ContactHome />);
    
    // Wait for the component to render and find the contact by "Unknown" name
    await waitFor(() => {
      const unknownContact = getByText("Unknown");
      expect(unknownContact).toBeTruthy();
      
      // Test contact press functionality
      fireEvent.press(unknownContact);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        "Unknown",
        "Phone: 123\nEmail: No email",
        [{ text: "Close", style: "cancel" }]
      );
    });
  });
  });

  describe("Invite Functionality", () => {
    const contactsMock = [
      { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: "123" }] },
      { id: "2", name: "Bob", phoneNumbers: [{ label: "mobile", number: "456" }] },
      { id: "3", name: "Charlie" }, // No phone numbers
    ];

    beforeEach(() => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
    });

    it("invites selected contacts with phone numbers", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      
      fireEvent(alice, "longPress");
      const inviteButton = getByText("Invite 1 Contact(s)");
      fireEvent.press(inviteButton);
      
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "INVITED_CONTACTS",
          JSON.stringify([{ id: "1", name: "Alice", phoneNumber: "123" }])
        );
        expect(mockNavigate).toHaveBeenCalledWith("OrganizationSelection");
      });
    });

    it("shows error when trying to invite contacts without phone numbers", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const charlie = await findByText("Charlie");
      
      fireEvent(charlie, "longPress");
      const inviteButton = getByText("Invite 1 Contact(s)");
      fireEvent.press(inviteButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Please select contacts with phone numbers"
        );
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it("filters out contacts without phone numbers when inviting multiple", async () => {
      const { findByText, getByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      const charlie = await findByText("Charlie");
      
      fireEvent(alice, "longPress");
      fireEvent.press(charlie);
      
      const inviteButton = getByText("Invite 2 Contact(s)");
      fireEvent.press(inviteButton);
      
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "INVITED_CONTACTS",
          JSON.stringify([{ id: "1", name: "Alice", phoneNumber: "123" }])
        );
      });
    });

    it("handles AsyncStorage save failure", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error("Storage error"));
      
      const { findByText, getByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      
      fireEvent(alice, "longPress");
      const inviteButton = getByText("Invite 1 Contact(s)");
      fireEvent.press(inviteButton);
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Failed to save contacts", expect.any(Error));
        expect(mockNavigate).toHaveBeenCalledWith("OrganizationSelection");
      });
    });

    it("resets selection state after successful invite", async () => {
      const { findByText, getByText, queryByText } = render(<ContactHome />);
      const alice = await findByText("Alice");
      
      fireEvent(alice, "longPress");
      const inviteButton = getByText("Invite 1 Contact(s)");
      fireEvent.press(inviteButton);
      
      await waitFor(() => {
        expect(queryByText("Cancel")).toBeNull();
        expect(queryByText("contact(s) selected")).toBeNull();
      });
    });
  });

  describe("Permission Retry", () => {
    it("retries permission request when retry button is pressed", async () => {
      (ExpoContacts.requestPermissionsAsync as jest.Mock)
        .mockResolvedValueOnce({ status: "denied" })
        .mockResolvedValueOnce({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });
      
      const { getByText, findByText } = render(<ContactHome />);
      
      // First render shows permission denied
      await waitFor(() => expect(getByText("Contacts permission is required.")).toBeTruthy());
      
      // Find and press retry button (assuming ContactPermission has a retry button)
      const retryButton = getByText(/retry|allow|grant/i);
      fireEvent.press(retryButton);
      
      // Should show loading state again
      await waitFor(() => expect(getByText("Loading contacts...")).toBeTruthy());
    });
  });

  describe("Edge Cases", () => {
    it("handles contacts with malformed phone number data", async () => {
      const contactsMock = [
        { id: "1", name: "Alice", phoneNumbers: [{ label: "mobile", number: null }] },
        { id: "2", name: "Bob", phoneNumbers: [{ number: "123" }] }, // Missing label
        { id: "3", name: "Charlie", phoneNumbers: [{}] }, // Empty phone object
      ];
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: contactsMock });
      
      const { findByText } = render(<ContactHome />);
      await findByText("Alice");
      await findByText("Bob");
      await findByText("Charlie");
    });

    it("handles very large contact lists", async () => {
      const largeContactList = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        name: `Contact ${i}`,
        phoneNumbers: [{ label: "mobile", number: `${i}`.repeat(10) }],
      }));
      
      (ExpoContacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (ExpoContacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: largeContactList });
      
      const { findByText } = render(<ContactHome />);
      await findByText("Contact 0");
      // Component should render without performance issues
    });
  });
});
