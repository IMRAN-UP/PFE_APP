import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, PresentationControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  useFrame((state, delta) => {
    // Rotate the model around the Y axis
    modelRef.current.rotation.y += delta * 0.5; // Adjust speed by changing the multiplier
  });
  
  return <primitive ref={modelRef} object={scene} scale={2.65} position={[0, -19, 0]} />;
}

const ModelViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-[650px]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 100 }}
        style={{ background: 'transparent' }}
      >
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          config={{ mass: 1, tension: 300 }}
          snap={{ mass: 2, tension: 1000 }}
        >
          <Stage
            environment="studio"
            intensity={1.2}
            adjustCamera={false}
            preset="rembrandt"
            shadows
            position={[0, 0, 0]}
            center
          >
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            }>
              <Model url={modelUrl} />
            </Suspense>
          </Stage>
        </PresentationControls>
        <Environment preset="studio" />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.3}
          panSpeed={0.2}
          rotateSpeed={0.2}
          minDistance={20}
          maxDistance={20}
          target={[0, 0, 0]}
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer; 