import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { View } from "react-native";
import useControls from "r3f-native-orbitcontrols";
import Slime from "./components/slime";

export default function ThreeApp() {
  const [OrbitControls, events] = useControls();

  return (
    <View style={{ flex: 1 }} {...events}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[1, 2, 3]} intensity={1.3} />
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial args={[{ color: "#A1662F" }]} />
        </mesh>
        <Slime position={[4, -0.7, 2]} />
        <Slime position={[0, -0.7, 0]} />
      </Canvas>
    </View>
  );
}
