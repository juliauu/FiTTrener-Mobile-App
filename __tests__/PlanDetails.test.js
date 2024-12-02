import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PlanDetails from "../app/screens/PlanDetails";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import { getDoc, deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import { ref, get } from "firebase/database";
import { ModalPortal } from "react-native-modals";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  getDatabase: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("PlanDetails Component", () => {
  const mockPlan = {
    id: "plan123",
    name: "Test Plan",
    day: "Monday",
    muscleGroup: "Chest",
    exercises: {
      BenchPress: { series: 3, repetitions: 12 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRoute.mockReturnValue({
      params: { planId: "plan123", planType: "plans" },
    });
    useUser.mockReturnValue({ user: { uid: "user123", username: "testUser" } });
  });

  const renderWithPortal = (ui) =>
    render(
      <>
        <ModalPortal />
        {ui}
      </>
    );

  it("renders loading state when plan data is not available", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });
    const { getByText } = render(<PlanDetails />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders plan data correctly when available", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockPlan,
    });

    const { getByText } = renderWithPortal(<PlanDetails />);
    await waitFor(() => expect(getByText("Test Plan")).toBeTruthy());
    expect(getByText("Day: Monday")).toBeTruthy();
    expect(getByText("Muscle Group: Chest")).toBeTruthy();
    expect(getByText("BenchPress: 3 x 12")).toBeTruthy();
  });

  it("calls deleteDoc when deleting a plan", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockPlan,
    });

    const { getByText } = render(<PlanDetails />);
    await waitFor(() => getByText("Remove"));

    fireEvent.press(getByText("Remove"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Confirm Deletion",
      "Are you sure you want to delete this plan?",
      expect.any(Array)
    );

    const deleteAction = Alert.alert.mock.calls[0][2][1].onPress;
    await deleteAction();
    expect(deleteDoc).toHaveBeenCalledWith(
      doc(undefined, "users", "user123", "plans", "plan123")
    );
  });
});
