import React from "react";
import { render } from "@testing-library/react-native";
import UserPlans from "../app/screens/UserPlans";
import SharedPlans from "../app/(tabs)/sharedPlans";

jest.mock("../app/screens/UserPlans");

describe("SharedPlans Component", () => {
  it('renders UserPlans with planType "sharedPlans"', () => {
    render(<SharedPlans />);

    expect(UserPlans).toHaveBeenCalledWith(
      expect.objectContaining({ planType: "sharedPlans" }),
      expect.anything()
    );
  });
});
