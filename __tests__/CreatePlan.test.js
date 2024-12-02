import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";
import CreatePlan from "../app/screens/createPlan";

jest.mock("../config/FirebaseConfig", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../hooks/usePlanForm", () => ({
  usePlanForm: jest.fn(() => ({
    planName: "Test Plan",
    setPlanName: jest.fn(),
    planDay: "Monday",
    setPlanDay: jest.fn(),
    planMuscleGroup: "Arms",
    setPlanMuscleGroup: jest.fn(),
    selectedExercises: { exercise1: true },
    setSelectedExercises: jest.fn(),
    exercises: [{ id: "exercise1", name: "Push-up" }],
  })),
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

describe("CreatePlan", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ user: { uid: "testUserId" } });
  });

  it("renders the PlanForm correctly", () => {
    const { getByTestId } = render(<CreatePlan />);
    expect(getByTestId("planForm")).toBeTruthy();
  });
});
