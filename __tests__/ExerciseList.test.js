import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ExerciseList from "../components/ExerciseList";

describe("ExerciseList Component", () => {
  const mockSetSelectedExercises = jest.fn();

  const defaultProps = {
    exercises: [
      {
        category: "Upper Body",
        exercises: [{ name: "Push-ups" }, { name: "Pull-ups" }],
      },
    ],
    selectedExercises: {},
    setSelectedExercises: mockSetSelectedExercises,
    searchQuery: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls setSelectedExercises when an exercise is selected", () => {
    const { getByText } = render(<ExerciseList {...defaultProps} />);
    const pushUpsButton = getByText("Push-ups");

    fireEvent.press(pushUpsButton);

    expect(mockSetSelectedExercises).toHaveBeenCalledWith(expect.any(Function));

    const setStateFunction = mockSetSelectedExercises.mock.calls[0][0];
    const newState = setStateFunction({});
    expect(newState).toEqual({
      "Push-ups": { series: 1, repetitions: 1 },
    });
  });

  it("increases the series count when '+' is pressed", () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedExercises: { "Push-ups": { series: 1, repetitions: 1 } },
    };
    const { getByTestId } = render(<ExerciseList {...propsWithSelection} />);

    const incrementSeriesButton = getByTestId("incrementSeries");

    fireEvent.press(incrementSeriesButton);

    expect(mockSetSelectedExercises).toHaveBeenCalledWith(expect.any(Function));

    const setStateFunction = mockSetSelectedExercises.mock.calls[0][0];
    const newState = setStateFunction({
      "Push-ups": { series: 1, repetitions: 1 },
    });
    expect(newState).toEqual({
      "Push-ups": { series: 2, repetitions: 1 },
    });
  });

  it("decreases the series count but not below 1 when '-' is pressed", () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedExercises: { "Push-ups": { series: 2, repetitions: 1 } },
    };
    const { getByTestId } = render(<ExerciseList {...propsWithSelection} />);

    const decrementSeriesButton = getByTestId("decrementSeries");

    fireEvent.press(decrementSeriesButton);

    expect(mockSetSelectedExercises).toHaveBeenCalledWith(expect.any(Function));
    const setStateFunction = mockSetSelectedExercises.mock.calls[0][0];
    const newState = setStateFunction({
      "Push-ups": { series: 2, repetitions: 1 },
    });
    expect(newState).toEqual({
      "Push-ups": { series: 1, repetitions: 1 },
    });
  });

  it("increases the repetitions count when '+' is pressed", () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedExercises: { "Push-ups": { series: 1, repetitions: 1 } },
    };
    const { getByTestId } = render(<ExerciseList {...propsWithSelection} />);

    const incrementRepetitionsButton = getByTestId("incrementRepetitions");

    fireEvent.press(incrementRepetitionsButton);

    expect(mockSetSelectedExercises).toHaveBeenCalledWith(expect.any(Function));

    const setStateFunction = mockSetSelectedExercises.mock.calls[0][0];
    const newState = setStateFunction({
      "Push-ups": { series: 1, repetitions: 1 },
    });
    expect(newState).toEqual({
      "Push-ups": { series: 1, repetitions: 2 },
    });
  });

  it("decreases the repetitions count but not below 1 when '-' is pressed", () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedExercises: { "Push-ups": { series: 1, repetitions: 2 } },
    };
    const { getByTestId } = render(<ExerciseList {...propsWithSelection} />);

    const decrementRepetitionsButton = getByTestId("decrementRepetitions");

    fireEvent.press(decrementRepetitionsButton);

    expect(mockSetSelectedExercises).toHaveBeenCalledWith(expect.any(Function));
    const setStateFunction = mockSetSelectedExercises.mock.calls[0][0];
    const newState = setStateFunction({
      "Push-ups": { series: 1, repetitions: 2 },
    });
    expect(newState).toEqual({
      "Push-ups": { series: 1, repetitions: 1 },
    });
  });
});
