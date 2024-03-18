import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { MeshProps } from "@react-three/fiber";
import { SpotLightShadow } from "three";

interface BoxProps extends MeshProps {
  position: [number, number, number];
  receiveShadow: boolean;
  castShadow: boolean;
}

function Box(props: BoxProps) {
  const meshRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);
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
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function ThreeApp() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box castShadow={true} position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}