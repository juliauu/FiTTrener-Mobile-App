import { StyleSheet, Text, View, Image, Modal, ScrollView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import Button from "./Button";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import colors from "../constants/colors";
import globalStyles from "../constants/globalStyles";
import { fetchExercisesByEquipment } from "../services/equipmentService";

function CameraService({ model }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  const labels = [
    "dumbbell",
    "kettlebell",
    "none",
    "treadmill",
    "bulgarian bag",
  ];

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && permission.granted === false) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        setLoading(true);
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
        await predictImage(data.uri);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const predictImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const imageData = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(imageData));
      const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
      const normalizedImage = resizedImage.div(255.0).expandDims(0);
      const preds = await model.predict(normalizedImage).data();

      const results = Array.from(preds).map((probability, index) => ({
        className: labels[index],
        probability: probability,
      }));
      console.log(results);
      setPredictions(results);

      const topPrediction = results.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );

      if (topPrediction.className === "none") {
        setMessage("Equipment not recognized.");
      } else {
        const exercisesData = await fetchExercisesByEquipment(
          topPrediction.className
        );
        setExercises(exercisesData);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error predicting image:", error);
      setMessage("Error processing image. Please try again.");
    }
  };

  if (permission && !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={globalStyles.text}>
          Camera access denied. Please enable it in your device settings.
        </Text>
        <Button
          testID="permissionButton"
          onPress={requestPermission}
          title="Grant permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.view}>
      {!image ? (
        <CameraView style={styles.camera} ref={cameraRef}></CameraView>
      ) : (
        <Image style={styles.img} source={{ uri: image }} />
      )}

      <View style={styles.controlContainer}>
        {image ? (
          <View style={{ alignItems: "center" }}>
            <Button
              customStyles={styles.photoButton}
              title="Retake a photo"
              handlePress={() => {
                setImage(null);
                setPredictions([]);
                setExercises([]);
                setMessage("");
                setModalVisible(false);
              }}
            ></Button>
            {loading ? (
              <Text style={styles.text}>Loading...</Text>
            ) : message ? (
              <Text style={styles.text}>{message}</Text>
            ) : null}
          </View>
        ) : (
          <Button
            testID="takePhoto"
            customStyles={styles.photoButton}
            title="Take a photo"
            handlePress={takePicture}
          ></Button>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.exercises}>Exercises:</Text>
            {exercises.length > 0 ? (
              <ScrollView style={styles.scrollview}>
                <View style={{ alignItems: "center" }}>
                  {exercises.map((exercise, idx) => (
                    <View key={idx}>
                      <Text style={styles.exercises}>{exercise.name}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={globalStyles.text}>No exercises found.</Text>
            )}

            <Button
              title="Close"
              customStyles={styles.closeButton}
              handlePress={() => setModalVisible(false)}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default CameraService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginTop: 5,
    alignSelf: "center",
  },
  view: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  camera: {
    height: "85%",
    width: "100%",
  },
  img: {
    height: "85%",
    width: "100%",
  },
  controlContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height: "45%",
    width: "80%",
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoButton: {
    height: 30,
    width: 170,
    marginTop: 15,
  },
  exercises: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    marginTop: 10,
  },
  scrollview: {
    marginTop: 15,
  },
  closeButton: {
    height: 40,
    width: 150,
    marginTop: 20,
    marginBottom: 20,
  },
});
