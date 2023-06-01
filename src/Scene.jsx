import React, {useState, useRef} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {DoubleSide} from 'three';


export default function Scene() {
  const groupRef = useRef();

  return (
    <Canvas>
      <group ref={groupRef}>
        <Plane position={[1, 0, 0]} rotation={[0, 0, 0]} />
        <Plane position={[-1, 0, 0]} rotation={[0, Math.PI, 0]} />
        <Plane position={[0, 1, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} />
        <Plane position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />
        <Plane position={[0, 0, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Plane position={[0, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      </group>
    </Canvas>
  );
}

function Plane() {
  // const [ref] = usePlane(() => ({mass: 0}));

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="red" side={DoubleSide} />
    </mesh>
  );
}
