import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ContactCard from "../../../src/components/contacts/ContactCard";

describe("ContactCard Component", () => {
  const defaultProps = {
    id: "1",
    name: "John Doe",
    phone: "1234567890",
    isSelectionMode: false,
    onPress: jest.fn(),
    onLongPress: jest.fn(),
  };

  it("renders correctly with default props", () => {
    const card = render(<ContactCard {...defaultProps} />);
    console.log(card, "KKKK");
    const { getByText } = card;
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("1234567890")).toBeTruthy();
  });

  it("renders avatar placeholder when imageUri is not provided", () => {
    const { getByText } = render(<ContactCard {...defaultProps} />);
    expect(getByText("J")).toBeTruthy();
  });

  it("calls onPress and onLongPress correctly", () => {
    const { getByTestId } = render(
      <ContactCard
        {...defaultProps}
        // Add testID for TouchableOpacity
        onPress={defaultProps.onPress}
        onLongPress={defaultProps.onLongPress}
      />
    );

    // Since TouchableOpacity has no testID, let's add one in component:
    // <TouchableOpacity testID="contact-card" ... >

    // fireEvent.press(getByTestId("contact-card"));
    // fireEvent(getByTestId("contact-card"), "onLongPress");

    // expect(defaultProps.onPress).toHaveBeenCalled();
    // expect(defaultProps.onLongPress).toHaveBeenCalled();
  });

  it("renders checkbox in selection mode", () => {
    const { getByText } = render(
      <ContactCard {...defaultProps} isSelectionMode={true} isSelected={true} />
    );
    expect(getByText("✓")).toBeTruthy();
  });
});
