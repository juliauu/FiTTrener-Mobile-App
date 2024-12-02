import React from "react";
import { render } from "@testing-library/react-native";
import Plans from "../app/(tabs)/plans";
import UserPlans from "../app/screens/UserPlans";

jest.mock("../app/screens/UserPlans");

describe("Plans Component", () => {
  it('renders UserPlans with planType "plans"', () => {
    render(<Plans />);

    expect(UserPlans).toHaveBeenCalledWith(
      expect.objectContaining({ planType: "plans" }),
      expect.anything()
    );
  });
});
