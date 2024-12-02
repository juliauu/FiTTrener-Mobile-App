import { db } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchExercises = async () => {
  const subCollections = [
    "glutes",
    "legs",
    "back",
    "abs",
    "arms",
    "chest",
    "shoulders",
  ];

  const exercisesData = [];

  await Promise.all(
    subCollections.map(async (subCollectionName) => {
      try {
        const subCollectionRef = collection(
          db,
          "exercises",
          "category",
          subCollectionName
        );
        const exercisesSnapshot = await getDocs(subCollectionRef);

        const exercisesList = exercisesSnapshot.docs.map((exerciseDoc) => ({
          name: exerciseDoc.id,
        }));

        exercisesData.push({
          category: subCollectionName,
          exercises: exercisesList,
        });
      } catch (error) {
        console.error(`Error fetching ${subCollectionName} exercises: `, error);
      }
    })
  );

  return exercisesData;
};
