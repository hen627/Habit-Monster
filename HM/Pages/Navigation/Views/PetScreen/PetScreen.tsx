import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { View } from "react-native";
import useControls from "r3f-native-orbitcontrols";
import Slime from "./components/slime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function ThreeApp() {
  const [OrbitControls, events] = useControls();
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const savedHabitsString = await AsyncStorage.getItem("habits");
      if (savedHabitsString !== null) {
        const savedHabits = JSON.parse(savedHabitsString);
        setHabits(savedHabits);
      }
    } catch (error) {
      console.error("Error retrieving habits:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {}, [habits]);

  useFocusEffect(
    React.useCallback(() => {
      fetchHabits();
    }, [])
  );

  return (
    <View style={{ flex: 1 }} {...events}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[1, 2, 3]} intensity={1.3} />
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={20}>
          <planeGeometry />
          <meshStandardMaterial args={[{ color: "#A1662F" }]} />
        </mesh>
        {habits.map((habit, index) => (
          <Slime
            key={index}
            position={[2 * (index + 1), -0.7, 2]} // Adjust position accordingly
            color={`${habit.color}`}
          />
        ))}
      </Canvas>
    </View>
  );
}
