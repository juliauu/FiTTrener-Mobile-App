import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import CameraService from "../../components/CameraService";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import globalStyles from "../../constants/globalStyles";

const initializeTensorFlow = async () => {
  await tf.ready();
};

const loadModel = async () => {
  const modelJson = require("../../assets/model/model.json");
  const modelWeights = [require("../../assets/model/weights.bin")];
  const model = await tf.loadLayersModel(
    bundleResourceIO(modelJson, modelWeights)
  );
  return model;
};

const Camera = () => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadTFModel = async () => {
      try {
        await initializeTensorFlow();
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading TensorFlow model:", error);
      }
    };

    loadTFModel();
  }, []);

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      <Text style={globalStyles.title}>Take a photo of the gym equipment</Text>
      {model ? (
        <CameraService model={model} />
      ) : (
        <Text style={globalStyles.text}>Loading model...</Text>
      )}
    </SafeAreaView>
  );
};

export default Camera;
