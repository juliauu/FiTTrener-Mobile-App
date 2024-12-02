import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { UserProvider, useUser } from "../contexts/UserContext";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import { ref, get, set } from "firebase/database";
import { Alert } from "react-native";

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn().mockReturnValue({
    _isAvailable: jest.fn().mockResolvedValue(true),
  }),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  getDatabase: jest.fn(),
}));

const mockSnapshot = {
  exists: jest.fn().mockReturnValue(true),
  val: jest.fn().mockReturnValue({
    username: "testUser",
    email: "test@example.com",
  }),
};

get.mockResolvedValueOnce({
  exists: jest.fn().mockReturnValue(false),
});

set.mockResolvedValueOnce();

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error.mockRestore();
});

describe("UserContext signUp", () => {
  it("should sign up the user, save data, and navigate to /Profile", async () => {
    const userId = "test-user-id";
    const mockSnapshot = {
      exists: jest.fn().mockReturnValue(false),
    };

    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: userId },
    });

    get.mockResolvedValueOnce(mockSnapshot);
    set.mockResolvedValueOnce();

    const TestComponent = () => {
      const { signUp } = useUser();
      return (
        <Text
          onPress={() =>
            signUp("test@example.com", "password", { username: "newUsername" })
          }
        >
          Sign Up
        </Text>
      );
    };

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledTimes(1);
      expect(set).toHaveBeenCalledTimes(2);
      expect(router.replace).toHaveBeenCalledWith("/Profile");
    });
  });
});

describe("UserContext logOut", () => {
  it("should log out the user and navigate to /SignIn", async () => {
    signOut.mockResolvedValueOnce();

    const TestComponent = () => {
      const { logOut } = useUser();
      return <Text onPress={logOut}>Log Out</Text>;
    };

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(getByText("Log Out"));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith("/SignIn");
    });
  });
});

describe("UserContext signIn", () => {
  it("should sign in the user and navigate to /Profile", async () => {
    const userId = "test-user-id";
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: userId },
    });

    const TestComponent = () => {
      const { signIn } = useUser();
      return (
        <Text onPress={() => signIn("test@example.com", "password")}>
          Sign In
        </Text>
      );
    };

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/Profile");
    });
  });
});
