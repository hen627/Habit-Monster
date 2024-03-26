import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { MeshProps } from "@react-three/fiber";
import { View } from "react-native";
import useControls from "r3f-native-orbitcontrols";
import { lerp } from "three/src/math/MathUtils";

interface BoxProps extends MeshProps {
  position: [number, number, number];
}

interface SphereProps extends MeshProps {
  position: [number, number, number];
}

function Box(props: BoxProps) {
  const meshRef = useRef<any>(null);
  // const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.x += delta;
  });
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      // onPointerOver={(event) => setHover(true)}
      // onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

function Sphere(props: SphereProps) {
  const meshRef = useRef<any>(null);
  const [forward, setForward] = useState(true);
  const baseScale = [1.2, 0.85, 1.2];
  const endScale = [1.2, 0.95, 1.2];
  let t = 0;

  useFrame(() => {
    if (meshRef.current) {
      t += forward ? 0.008 : -10;

      t = Math.max(0, Math.min(1, t));

      const easedT = Math.sin(t * Math.PI);

      const newScale = [
        lerp(baseScale[0], endScale[0], easedT),
        lerp(baseScale[1], endScale[1], easedT),
        lerp(baseScale[2], endScale[2], easedT),
      ];

      meshRef.current.scale.set(...newScale);

      if (t >= 1 || t <= 0) {
        setForward(!forward);
      }
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

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
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Sphere position={[0, -0.7, 0]} />
      </Canvas>
    </View>
  );
}
