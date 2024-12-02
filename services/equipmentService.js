import { db } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchExercisesByEquipment = async (equipment) => {
  try {
    const equipmentRef = collection(db, "equipment", equipment, "exercises");
    const exercisesSnapshot = await getDocs(equipmentRef);

    return exercisesSnapshot.docs.map((doc) => ({
      name: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching exercises for equipment:", error);
    return [];
  }
};
