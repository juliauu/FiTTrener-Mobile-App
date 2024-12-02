import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CameraService from "../components/CameraService";
import { useCameraPermissions } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { fetchExercisesByEquipment } from "../services/equipmentService";

jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  CameraView: () => <></>,
}));

jest.mock("@tensorflow/tfjs", () => ({
  image: {
    resizeBilinear: jest.fn(),
  },
  decodeJpeg: jest.fn(),
}));

jest.mock("@tensorflow/tfjs-react-native", () => ({
  decodeJpeg: jest.fn(),
}));

jest.mock("../services/equipmentService", () => ({
  fetchExercisesByEquipment: jest.fn(),
}));
jest.mock("expo-camera", () => ({
  useCameraPermissions: jest.fn(),
  CameraView: () => <></>,
}));

describe("CameraService", () => {
  beforeEach(() => {
    useCameraPermissions.mockReturnValue([true, jest.fn()]);
    tf.image.resizeBilinear.mockReturnValue({
      div: jest.fn().mockReturnValue({
        expandDims: jest.fn().mockReturnValue({}),
      }),
    });
    fetchExercisesByEquipment.mockResolvedValue([
      { name: "Push-up" },
      { name: "Squats" },
    ]);
  });

  it("should render CameraService component correctly", () => {
    const { getByText, getByTestId } = render(
      <CameraService model={{ predict: jest.fn() }} />
    );
    const button = getByText("Grant permission");
    expect(button).toBeTruthy();
  });
  it("should render Grant permission button when camera access is denied", async () => {
    useCameraPermissions.mockReturnValueOnce([{ granted: false }, jest.fn()]);

    const { findByTestId } = render(
      <CameraService model={{ predict: jest.fn() }} />
    );
    const button = await findByTestId("permissionButton");
    expect(button).toBeTruthy();
  });
});
