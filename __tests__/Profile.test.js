import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Profile from "../app/(tabs)/profile";
import { useUser } from "../contexts/UserContext";

jest.mock("../contexts/UserContext");

describe("Profile Component", () => {
  const mockLogOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and profile title", () => {
    useUser.mockReturnValue({
      user: null,
      logOut: mockLogOut,
    });

    const { getByText } = render(<Profile />);

    expect(getByText("FitTrener")).toBeTruthy();
    expect(getByText("Your profile")).toBeTruthy();
  });

  it("renders user information when user is logged in", () => {
    useUser.mockReturnValue({
      user: { username: "TestUser", email: "test@example.com" },
      logOut: mockLogOut,
    });

    const { getByText } = render(<Profile />);

    expect(getByText("TestUser")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();
  });

  it("renders default text when user data is missing", () => {
    useUser.mockReturnValue({
      user: { username: null, email: null },
      logOut: mockLogOut,
    });

    const { getByText } = render(<Profile />);

    expect(getByText("No username")).toBeTruthy();
    expect(getByText("No email")).toBeTruthy();
  });

  it("renders a message when no user is logged in", () => {
    useUser.mockReturnValue({
      user: null,
      logOut: mockLogOut,
    });

    const { getByText } = render(<Profile />);

    expect(getByText("No profile data available")).toBeTruthy();
  });

  it("calls logOut when SIGN OUT button is pressed", () => {
    useUser.mockReturnValue({
      user: { username: "TestUser", email: "test@example.com" },
      logOut: mockLogOut,
    });

    const { getByText } = render(<Profile />);
    const signOutButton = getByText("SIGN OUT");
    fireEvent.press(signOutButton);
    expect(mockLogOut).toHaveBeenCalled();
  });
});
