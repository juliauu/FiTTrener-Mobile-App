import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { useUser } from "../contexts/UserContext";
import EditPlan from "../app/screens/EditPlan";
import { useRoute } from "@react-navigation/native";

jest.mock("../config/FirebaseConfig", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
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

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

import { getDoc } from "firebase/firestore";

describe("EditPlan", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUser.mockReturnValue({ user: { uid: "testUserId" } });
    useRoute.mockReturnValue({
      params: { planId: "testPlanId", planType: "workoutPlans" },
    });

    getDoc.mockResolvedValue({
      exists: jest.fn(() => true),
      data: jest.fn(() => ({
        name: "Test Plan",
        day: "Monday",
        muscleGroup: "Arms",
        exercises: { exercise1: { series: 3, repetitions: 10 } },
      })),
    });
  });

  it("renders the PlanForm correctly", async () => {
    const { getByTestId } = render(<EditPlan />);
    await waitFor(() => expect(getByTestId("planForm")).toBeTruthy());
  });
});
