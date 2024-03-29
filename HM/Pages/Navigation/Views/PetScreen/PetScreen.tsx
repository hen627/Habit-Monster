import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber/native";
import { View } from "react-native";
import useControls from "r3f-native-orbitcontrols";
import Slime from "./components/slime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

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
      console.error("Failed retreiving habits:", error);
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
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={30}>
          <planeGeometry />
          <meshStandardMaterial args={[{ color: "#A1662F" }]} />
        </mesh>
        <mesh
          position-x={100}
          position-y={-1}
          rotation-x={-Math.PI * 0.5}
          scale={20}
        >
          <planeGeometry />
          <meshStandardMaterial args={[{ color: "green" }]} />
        </mesh>
        {habits.map((habit, index) => (
          <Slime
            key={index}
            position={[
              Math.floor(Math.random() * 21) - 10,
              -0.7,
              Math.floor(Math.random() * 21) - 10,
            ]}
            color={`${habit.color}`}
          />
        ))}
      </Canvas>
    </View>
  );
}
