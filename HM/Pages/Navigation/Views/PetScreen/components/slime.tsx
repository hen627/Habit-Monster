import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshProps } from "@react-three/fiber";
import { lerp } from "three/src/math/MathUtils";
import * as THREE from "three";

interface SphereProps extends MeshProps {
  position: [number, number, number];
}

export default function Slime(props: SphereProps) {
  const meshRef = useRef<any>(null);
  const [forward, setForward] = useState(true);
  const [jumping, setJumping] = useState(false);
  const baseScale = [1.2, 0.85, 1.2];
  const endScale = [1.2, 0.95, 1.2];
  let t = 0;

  const initialPosition = useRef<[number, number, number]>(props.position);

  useFrame(() => {
    if (meshRef.current) {
      if (!jumping && Math.random() < 0.005) {
        setJumping(true);
        animateJump();
      }

      if (!jumping) {
        t += forward ? 0.008 : -0.008;

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
    }
  });

  const animateJump = () => {
    if (!meshRef.current) return;
    const jumpStartTime = performance.now();
    const jumpDuration = 1500;
    const startY = meshRef.current.position.y;
    const targetY = initialPosition.current[1];

    const startPosition = meshRef.current.position.clone();
    const targetX = startPosition.x + (Math.random() - 0.5) * 2;

    const jumpAnimation = (timestamp: number) => {
      const elapsedTime = timestamp - jumpStartTime;
      const jumpProgress = Math.min(1, elapsedTime / jumpDuration);

      const newPosition = startPosition
        .clone()
        .lerp(
          new THREE.Vector3(targetX, targetY, startPosition.z),
          jumpProgress
        );
      meshRef.current.position.copy(newPosition);

      if (meshRef.current.position) {
        meshRef.current.position.y =
          Math.sin(jumpProgress * Math.PI) * 0.5 + startY;
      }

      meshRef.current.position.z +=
        (Math.random() - 0.5) * 0.1 * (1 - jumpProgress);

      if (jumpProgress < 1) {
        requestAnimationFrame(jumpAnimation);
      } else {
        meshRef.current.position.y = initialPosition.current[1];
        setJumping(false);
      }
    };

    requestAnimationFrame(jumpAnimation);
  };

  return (
    <mesh {...props} ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}
