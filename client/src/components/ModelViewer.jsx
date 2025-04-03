import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, PresentationControls } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} position={[0, 0, 0]} />;
}

const ModelViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
        >
          <Stage
            environment="studio"
            intensity={1}
            adjustCamera={false}
            preset="rembrandt"
            shadows
            position={[0, 0, 0]}
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
          zoomSpeed={0.4}
          panSpeed={0.3}
          rotateSpeed={0.3}
          minDistance={3}
          maxDistance={8}
          target={[0, 0, 0]}
          makeDefault
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer; 