import React from "react";
import { render, screen } from "@testing-library/react-native";
import App from "../app/index.jsx";
import { Redirect } from "expo-router";

jest.mock("expo-router", () => ({
  Redirect: jest.fn(() => null),
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Redirect to /SignIn", () => {
    render(<App />);

    expect(Redirect).toHaveBeenCalledWith(
      { href: "/SignIn" },
      expect.anything()
    );
  });

  it("does not render SignIn directly", () => {
    render(<App />);

    expect(screen.queryByTestId("sign-in")).toBeNull();
  });
});
