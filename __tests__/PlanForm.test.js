import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PlanForm from "../components/PlanForm";

describe("PlanForm Component", () => {
  const mockSetPlanName = jest.fn();
  const mockSetPlanDay = jest.fn();
  const mockSetPlanMuscleGroup = jest.fn();
  const mockSetSelectedExercises = jest.fn();
  const mockSetSearchQuery = jest.fn();
  const mockSetShowExercises = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    mode: "create",
    planName: "",
    setPlanName: mockSetPlanName,
    planDay: "Monday",
    setPlanDay: mockSetPlanDay,
    planMuscleGroup: "",
    setPlanMuscleGroup: mockSetPlanMuscleGroup,
    selectedExercises: [],
    setSelectedExercises: mockSetSelectedExercises,
    exercises: [],
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    setShowExercises: mockSetShowExercises,
    onSave: mockOnSave,
    showExercises: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly in 'create' mode", () => {
    const { getByText, queryByTestId } = render(<PlanForm {...defaultProps} />);

    expect(getByText("FitTrener")).toBeTruthy();
    expect(getByText("Create Plan")).toBeTruthy();
    expect(getByText("Name:")).toBeTruthy();
    expect(getByText("Muscle group:")).toBeTruthy();
    expect(getByText("Choose Exercises")).toBeTruthy();
    expect(queryByTestId("planNameInput")).toBeTruthy();
    expect(queryByTestId("muscleGroupInput")).toBeTruthy();
  });

  it("calls setPlanName when name input changes", () => {
    const mockSetPlanName = jest.fn();
    const { getByTestId } = render(
      <PlanForm {...defaultProps} setPlanName={mockSetPlanName} />
    );

    const input = getByTestId("planNameInput");
    fireEvent.changeText(input, "New Plan Name");

    expect(mockSetPlanName).toHaveBeenCalledWith("New Plan Name");
  });

  it("calls setPlanMuscleGroup when muscle group input changes", () => {
    const mockSetPlanMuscleGroup = jest.fn();
    const { getByTestId } = render(
      <PlanForm {...defaultProps} setPlanMuscleGroup={mockSetPlanMuscleGroup} />
    );

    const input = getByTestId("muscleGroupInput");
    fireEvent.changeText(input, "Legs");

    expect(mockSetPlanMuscleGroup).toHaveBeenCalledWith("Legs");
  });

  it("calls setShowExercises when 'Choose Exercises' button is pressed", () => {
    const { getByText } = render(<PlanForm {...defaultProps} />);
    const button = getByText("Choose Exercises");

    fireEvent.press(button);
    expect(mockSetShowExercises).toHaveBeenCalledWith(true);
  });

  it("calls onSave when 'Save Plan' button is pressed in showExercises mode", () => {
    const mockOnSave = jest.fn();
    const props = { ...defaultProps, showExercises: true, onSave: mockOnSave };
    const { getByText } = render(<PlanForm {...props} />);

    const button = getByText("Save Plan");
    fireEvent.press(button);

    expect(mockOnSave).toHaveBeenCalled();
  });
});
