import SignIn from "../app/(auth)/SignIn";
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useUser } from "../contexts/UserContext";
import { Alert } from "react-native";

const mockSignIn = jest.fn();

jest.mock("../contexts/UserContext", () => ({
  useUser: () => ({
    signIn: mockSignIn,
  }),
}));

jest.mock("expo-router", () => ({
  Link: ({ children }) => children,
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("SignIn", () => {
  it("renders correctly", () => {
    render(<SignIn />);
    expect(screen.getByText("FitTrener")).toBeTruthy();
    expect(screen.getByText("Sign in")).toBeTruthy();
    expect(screen.getByTestId("email")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getByText("SIGN IN")).toBeTruthy();
  });

  it("handles form submission with valid data", async () => {
    render(<SignIn />);

    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("password"), "password123");
    fireEvent.press(screen.getByText("SIGN IN"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    expect(Alert.alert).not.toHaveBeenCalledWith("Login Error");
  });

  it("handles errors during sign in with invalid credentials", async () => {
    mockSignIn.mockImplementationOnce(() => {
      const error = new Error("auth/wrong-password");
      error.code = "auth/wrong-password";
      throw error;
    });

    render(<SignIn />);
    fireEvent.changeText(screen.getByTestId("email"), "wrong@example.com");
    fireEvent.changeText(screen.getByTestId("password"), "wrongpassword");
    fireEvent.press(screen.getByText("SIGN IN"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "wrong@example.com",
        "wrongpassword"
      );
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      "Incorrect password. Please try again."
    );
  });

  it("handles errors during sign in with invalid email", async () => {
    mockSignIn.mockImplementationOnce(() => {
      const error = new Error("auth/invalid-email");
      error.code = "auth/invalid-email";
      throw error;
    });

    render(<SignIn />);
    fireEvent.changeText(screen.getByTestId("email"), "invalid-email");
    fireEvent.changeText(screen.getByTestId("password"), "password123");
    fireEvent.press(screen.getByText("SIGN IN"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("invalid-email", "password123");
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      "Invalid email address."
    );
  });

  it("handles errors during sign in with missing password", async () => {
    mockSignIn.mockImplementationOnce(() => {
      const error = new Error("auth/missing-password");
      error.code = "auth/missing-password";
      throw error;
    });

    render(<SignIn />);
    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("password"), "");
    fireEvent.press(screen.getByText("SIGN IN"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "");
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      "Password cannot be empty."
    );
  });

  it("handles unknown error during sign in", async () => {
    mockSignIn.mockImplementationOnce(() => {
      const error = new Error("Unknown error");
      error.code = "auth/unknown";
      throw error;
    });

    render(<SignIn />);
    fireEvent.changeText(screen.getByTestId("email"), "unknown@example.com");
    fireEvent.changeText(screen.getByTestId("password"), "unknownpassword");
    fireEvent.press(screen.getByText("SIGN IN"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "unknown@example.com",
        "unknownpassword"
      );
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Login Error",
      "An unexpected error occurred. Please try again."
    );
  });
});
