import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import SignUp from "../app/(auth)/SignUp";
import { useUser } from "../contexts/UserContext";
import { Alert } from "react-native";

jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock("expo-router", () => ({
  Link: ({ children }) => children,
}));

describe("SignUp", () => {
  let mockSignUp;

  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockSignUp = jest.fn();
    useUser.mockReturnValue({
      signUp: mockSignUp,
    });
  });

  it("renders correctly", () => {
    render(<SignUp />);

    expect(screen.getByText("FitTrener")).toBeTruthy();
    expect(screen.getByText("Sign up")).toBeTruthy();
    expect(screen.getByTestId("email")).toBeTruthy();
    expect(screen.getByTestId("username")).toBeTruthy();
    expect(screen.getByTestId("password")).toBeTruthy();
    expect(screen.getByText("SIGN UP")).toBeTruthy();
  });

  it("handles form submission with valid data", async () => {
    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("username"), "testuser");
    fireEvent.changeText(screen.getByTestId("password"), "password123");
    fireEvent.press(screen.getByText("SIGN UP"));
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        { username: "testuser" }
      );
    });
  });

  it("handles errors during sign up", async () => {
    mockSignUp.mockImplementationOnce(() => {
      const error = new Error("auth/email-already-in-use");
      error.code = "auth/email-already-in-use";
      throw error;
    });

    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "taken@example.com");
    fireEvent.changeText(screen.getByTestId("username"), "existinguser");
    fireEvent.changeText(screen.getByTestId("password"), "password123");

    fireEvent.press(screen.getByText("SIGN UP"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Signup Error",
        "This email is already registered."
      );
    });
  });

  it("shows error when username is missing", async () => {
    mockSignUp.mockImplementationOnce(() => {
      const error = new Error("auth/missing-username");
      error.code = "auth/missing-username";
      throw error;
    });

    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("password"), "password123");

    fireEvent.press(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Signup Error",
        "Username cannot be empty."
      );
    });
  });

  it("shows success alert on successful signup", async () => {
    jest.spyOn(Alert, "alert").mockClear();

    mockSignUp.mockResolvedValueOnce(true);

    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("username"), "testuser");
    fireEvent.changeText(screen.getByTestId("password"), "password123");

    fireEvent.press(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Account created successfully");
    });
  });

  it("shows error when email is invalid", async () => {
    mockSignUp.mockImplementationOnce(() => {
      const error = new Error("auth/invalid-email");
      error.code = "auth/invalid-email";
      throw error;
    });

    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "invalid-email");
    fireEvent.changeText(screen.getByTestId("username"), "testuser");
    fireEvent.changeText(screen.getByTestId("password"), "password123");

    fireEvent.press(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Signup Error",
        "Invalid email address."
      );
    });
  });

  it("shows error when password is too weak", async () => {
    mockSignUp.mockImplementationOnce(() => {
      const error = new Error("auth/weak-password");
      error.code = "auth/weak-password";
      throw error;
    });

    render(<SignUp />);

    fireEvent.changeText(screen.getByTestId("email"), "test@example.com");
    fireEvent.changeText(screen.getByTestId("username"), "testuser");
    fireEvent.changeText(screen.getByTestId("password"), "123");
    fireEvent.press(screen.getByText("SIGN UP"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Signup Error",
        "Password should be at least 6 characters."
      );
    });
  });
});
