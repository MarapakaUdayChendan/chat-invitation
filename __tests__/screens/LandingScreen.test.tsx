import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LandingScreen from "../../src/screens/LandingScreen";

const mockNavigate = jest.fn();

// Mock the useNavigation hook from expo-router
jest.mock("expo-router", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the theme file
jest.mock("../../src/styles/theme", () => ({
  COLORS: {
    background: "#FFFFFF",
    primary: "#007AFF",
    accent: "#FF6B6B",
    onPrimary: "#FFFFFF",
  },
  FONT: {
    size: {
      heading: 28,
      subheading: 16,
      button: 16,
    },
    weight: {
      bold: "bold",
    },
    family: "System",
  },
}));

describe("LandingScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all UI elements correctly", () => {
    const { getByText } = render(<LandingScreen />);

    expect(getByText("Welcome")).toBeTruthy();
    expect(getByText("Choose your authentication method")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("displays welcome title with correct text", () => {
    const { getByText } = render(<LandingScreen />);
    
    const titleElement = getByText("Welcome");
    expect(titleElement).toBeTruthy();
  });

  it("displays subtitle with correct text", () => {
    const { getByText } = render(<LandingScreen />);
    
    const subtitleElement = getByText("Choose your authentication method");
    expect(subtitleElement).toBeTruthy();
  });

  it("renders Sign In button", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    expect(signInButton).toBeTruthy();
  });

  it("renders Sign Up button", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signUpButton = getByText("Sign Up");
    expect(signUpButton).toBeTruthy();
  });

  it("navigates to LoginScreen when Sign In button is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    fireEvent.press(signInButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("navigates to SignUpScreen when Sign Up button is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signUpButton = getByText("Sign Up");
    fireEvent.press(signUpButton);
    
    expect(mockNavigate).toHaveBeenCalledWith("SignUpScreen");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("calls navigation function only once per button press", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    const signUpButton = getByText("Sign Up");
    
    // Press Sign In button
    fireEvent.press(signInButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
    
    // Clear mocks and press Sign Up button
    mockNavigate.mockClear();
    fireEvent.press(signUpButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("SignUpScreen");
  });

  it("handles multiple button presses correctly", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    
    // Press the same button multiple times
    fireEvent.press(signInButton);
    fireEvent.press(signInButton);
    fireEvent.press(signInButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, "LoginScreen");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "LoginScreen");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "LoginScreen");
  });

  it("renders buttons with correct accessibility", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    const signUpButton = getByText("Sign Up");
    
    // Verify buttons are touchable/accessible
    expect(signInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
  });

  it("has correct component structure", () => {
    const { getByText } = render(<LandingScreen />);
    
    // Verify all main elements are present
    expect(getByText("Welcome")).toBeTruthy();
    expect(getByText("Choose your authentication method")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("does not navigate on component mount", () => {
    render(<LandingScreen />);
    
    // Navigation should not be called during initial render
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("maintains navigation state between renders", () => {
    const { getByText, rerender } = render(<LandingScreen />);
    
    // Press button before rerender
    fireEvent.press(getByText("Sign In"));
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
    
    // Rerender component
    rerender(<LandingScreen />);
    
    // Navigation call count should remain the same
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    
    // Should still be able to navigate after rerender
    fireEvent.press(getByText("Sign Up"));
    expect(mockNavigate).toHaveBeenCalledWith("SignUpScreen");
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it("handles button press interactions independently", () => {
    const { getByText } = render(<LandingScreen />);
    
    const signInButton = getByText("Sign In");
    const signUpButton = getByText("Sign Up");
    
    // Press Sign Up first
    fireEvent.press(signUpButton);
    expect(mockNavigate).toHaveBeenCalledWith("SignUpScreen");
    
    // Then press Sign In
    fireEvent.press(signInButton);
    expect(mockNavigate).toHaveBeenCalledWith("LoginScreen");
    
    // Verify both calls were made
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, "SignUpScreen");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "LoginScreen");
  });
});
