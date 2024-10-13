import React, { useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

function Planet({ position, texturePath, size, label, isSelected, onClick }) {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  const [hovered, setHovered] = useState(false);

  // Animation de mise à l'échelle et de positionnement
  const { scale, pos } = useSpring({
    scale: isSelected ? 3 : hovered ? 1.2 : 1, // Agrandir la planète si sélectionnée
    pos: isSelected ? [0, 0, 0] : position, // Déplace la planète sélectionnée au centre mais un peu plus loin (-2 en Z)
    config: { tension: 300, friction: 10 },
  });

  return (
    <group onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <animated.mesh scale={scale.to(s => [s, s, s])} position={pos}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </animated.mesh>

      {/* Lumière autour de la planète */}
      <pointLight color={0xFFFFFF} intensity={hovered || isSelected ? size * 120 : size * 100} />
    </group>
  );
}

function CameraSettings({ controlsEnabled }) {
  const { camera } = useThree();

  camera.position.set(0, 3, 6); // Position par défaut de la caméra
  camera.lookAt(0, 0, 0);
  return controlsEnabled ? <OrbitControls /> : null; // Activation ou désactivation des contrôles
}

function Scene({ selectedPlanet, setSelectedPlanet }) {
  const planetPositions = [
    [-7, 0, -3],
    [-4.9, 0, -7.9],
    [0, 0, -11],
    [4.9, 0, -7.9],
    [7, 0, -3],
  ];

  const planetTextures = [
    'texture/texture_orange.jpg',
    'texture/texture_jaune.jpg',
    'texture/texture_sale.jpg',
    'texture/texture_bleu.jpg',
    'texture/texture_rouge.jpg',
  ];

  const planetLabels = [
    'Planète Orange',
    'Planète Jaune',
    'Planète Sale',
    'Planète Bleue',
    'Planète Rouge',
  ];

  return (
    <Canvas>
      <CameraSettings controlsEnabled={!selectedPlanet} /> {/* Désactiver les contrôles si une planète est sélectionnée */}
      <ambientLight intensity={0.8} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Rendu des planètes */}
      {planetPositions.map((pos, idx) => (
        <Planet
          key={idx}
          position={pos}
          texturePath={planetTextures[idx]}
          size={1.5}
          label={planetLabels[idx]}
          isSelected={selectedPlanet === idx} // Détection de la planète sélectionnée
          onClick={() => setSelectedPlanet(idx)} // Clic pour sélectionner une planète
        />
      ))}
    </Canvas>
  );
}

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null); // Gérer la sélection de planète

  return (
    <div style={{ height: '100vh', backgroundColor: '#000000', position: 'relative' }}>
      {/* Titre de la planète sélectionnée */}
      {selectedPlanet !== null && (
        <>
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
            {/* Affichage du titre de la planète sélectionnée */}
            Planète {selectedPlanet + 1}
          </div>
        </>
      )}

      {/* Scène principale */}
      <Scene selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet} />
    </div>
  );
}

export default App;
