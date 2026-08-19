import { Center } from "@react-three/drei/core/Center";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function GeometricForm() {
  const form = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  useEffect(() => {
    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return undefined;

    const updateTarget = (event: PointerEvent) => {
      target.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 0.16,
        y: (event.clientY / window.innerHeight - 0.5) * 0.12,
      };
      invalidate();
    };

    window.addEventListener("pointermove", updateTarget, { passive: true });
    return () => window.removeEventListener("pointermove", updateTarget);
  }, [invalidate]);

  useFrame((_, delta) => {
    if (!form.current) return;
    const nextY = THREE.MathUtils.damp(form.current.rotation.y, target.current.x, 6, delta);
    const nextX = THREE.MathUtils.damp(form.current.rotation.x, -target.current.y, 6, delta);
    const settling = Math.abs(nextX - form.current.rotation.x) > 0.0001 || Math.abs(nextY - form.current.rotation.y) > 0.0001;
    form.current.rotation.set(nextX, nextY, 0);
    if (settling) invalidate();
  });

  return <Center>
    <group ref={form} rotation={[0.04, -0.24, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshStandardMaterial color="#6f9eff" emissive="#263c7b" emissiveIntensity={0.38} metalness={0.52} roughness={0.34} />
      </mesh>
      <mesh rotation={[0.48, 0.35, 0.1]} scale={1.38}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial color="#a179ff" transparent opacity={0.18} wireframe />
      </mesh>
    </group>
  </Center>;
}

/** Loaded only after the visible Hero is interactive on capable desktop browsers. */
export default function HeroScene() {
  return <div className="hero-scene" aria-hidden="true">
    <Canvas
      camera={{ fov: 36, position: [0, 0, 5.4] }}
      dpr={[1, 1.25]}
      frameloop="demand"
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight color="#8bd3ff" intensity={1.25} position={[2, 3, 4]} />
      <directionalLight color="#9a73ff" intensity={0.8} position={[-3, -2, 2]} />
      <GeometricForm />
    </Canvas>
  </div>;
}
