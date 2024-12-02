import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import UserPlans from "../app/screens/UserPlans";
import { useUser } from "../contexts/UserContext";
import { getDocs } from "firebase/firestore";
import { router } from "expo-router";

jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getFirestore: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("UserPlans Component", () => {
  const mockUser = { uid: "testUserId" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'User not logged in' when user is not authenticated", () => {
    useUser.mockReturnValue({ user: null });

    const { getByText } = render(<UserPlans planType="plans" />);
    expect(getByText("User not logged in")).toBeTruthy();
  });

  it("renders loading state correctly", () => {
    useUser.mockReturnValue({ user: mockUser });
    getDocs.mockReturnValueOnce(new Promise(() => {}));

    const { getByText } = render(<UserPlans planType="plans" />);
    expect(getByText("loading")).toBeTruthy();
  });

  it("renders no plans message when there are no plans", async () => {
    useUser.mockReturnValue({ user: mockUser });
    getDocs.mockResolvedValueOnce({ docs: [] });

    const { getByText } = render(<UserPlans planType="plans" />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText("No workout plans found.")).toBeTruthy();
      });
    });
  });

  it("renders plans correctly", async () => {
    const mockPlans = [
      { id: "1", name: "Plan A" },
      { id: "2", name: "Plan B" },
    ];
    useUser.mockReturnValue({ user: mockUser });
    getDocs.mockResolvedValueOnce({
      docs: mockPlans.map((plan) => ({
        id: plan.id,
        data: () => plan,
      })),
    });

    const { getByText } = render(<UserPlans planType="plans" />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText("Plan A")).toBeTruthy();
        expect(getByText("Plan B")).toBeTruthy();
      });
    });
  });

  it("navigates to plan details when a plan is clicked", async () => {
    const mockPlans = [{ id: "1", name: "Plan A" }];
    useUser.mockReturnValue({ user: mockUser });
    getDocs.mockResolvedValueOnce({
      docs: mockPlans.map((plan) => ({
        id: plan.id,
        data: () => plan,
      })),
    });

    const { getByText } = render(<UserPlans planType="plans" />);

    await act(async () => {
      await waitFor(() => {
        const planButton = getByText("Plan A");
        fireEvent.press(planButton);
        expect(router.push).toHaveBeenCalledWith({
          pathname: "/screens/PlanDetails",
          params: { planId: "1", planType: "plans" },
        });
      });
    });
  });

  it("renders the create button and navigates to CreatePlan", async () => {
    useUser.mockReturnValue({ user: mockUser });
    getDocs.mockResolvedValueOnce({ docs: [] });

    const { getByText } = render(<UserPlans planType="plans" />);

    await act(async () => {
      await waitFor(() => {
        const createButton = getByText("+");
        fireEvent.press(createButton);
        expect(router.push).toHaveBeenCalledWith("/screens/CreatePlan");
      });
    });
  });
});
