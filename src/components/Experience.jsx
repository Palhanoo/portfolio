import { Environment, Float, Text, useScroll } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { Leva, useControls } from 'leva'
import { Room } from './Room'
import { motion } from 'framer-motion-3d'
import { useFrame, useThree } from '@react-three/fiber'
import { animate, useMotionValue } from 'framer-motion'
import { framerMotionConfig } from '../utils/config'
import Projects from './Projects/Projects'
import Background from './Background'
import { Celebi } from './Celebi'
import * as THREE from 'three'

// Custom 3D shape for the skills section
const TechSphere = ({ position, size = 1, color = "#ffffff", rotationSpeed = 0.01, hovered, lowPerformanceMode }) => {
  const meshRef = useRef()
  const wireframeRef = useRef()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Reduce rotation speed on low-performance devices
      const speedMultiplier = lowPerformanceMode ? 0.5 : 1
      meshRef.current.rotation.x += delta * rotationSpeed * 0.5 * speedMultiplier
      meshRef.current.rotation.y += delta * rotationSpeed * speedMultiplier
      
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), lowPerformanceMode ? 0.2 : 0.1)
        if (wireframeRef.current) {
          wireframeRef.current.material.opacity = THREE.MathUtils.lerp(wireframeRef.current.material.opacity, 1, lowPerformanceMode ? 0.2 : 0.1)
        }
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), lowPerformanceMode ? 0.2 : 0.1)
        if (wireframeRef.current) {
          wireframeRef.current.material.opacity = THREE.MathUtils.lerp(wireframeRef.current.material.opacity, 0.4, lowPerformanceMode ? 0.2 : 0.1)
        }
      }
    }
  })
  
  // Use simpler geometry and materials for low performance mode
  const geometryDetail = lowPerformanceMode ? 0 : 1;
  const wireframeVisible = !lowPerformanceMode;
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, geometryDetail]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.5}
          metalness={0.8}
          envMapIntensity={lowPerformanceMode ? 0.5 : 1}
          transmission={lowPerformanceMode ? 0.2 : 0.5}
        />
      </mesh>
      {wireframeVisible && (
        <mesh ref={wireframeRef} scale={[1.02, 1.02, 1.02]}>
          <icosahedronGeometry args={[size, geometryDetail]} />
          <meshBasicMaterial 
            color={color}
            wireframe={true}
            transparent={true}
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  )
}

// Floating skill icon with text
const SkillIcon = ({ position, text, color, Icon, lowPerformanceMode }) => {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Reduce animation speed on low-performance devices
      const speedMultiplier = lowPerformanceMode ? 0.5 : 1
      groupRef.current.rotation.y += delta * 0.2 * speedMultiplier
      
      if (hovered) {
        groupRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), lowPerformanceMode ? 0.2 : 0.1)
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), lowPerformanceMode ? 0.2 : 0.1)
      }
    }
  })
  
  // Adjust Float properties based on performance mode
  const floatProps = lowPerformanceMode ? 
    { speed: 1, rotationIntensity: 0.1, floatIntensity: 0.2 } : 
    { speed: 2, rotationIntensity: 0.2, floatIntensity: 0.5 };
  
  return (
    <Float 
      {...floatProps}
      position={position}
    >
      <group 
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <TechSphere size={0.5} color={color} hovered={hovered} lowPerformanceMode={lowPerformanceMode} />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor={hovered ? color : "#000000"}
        >
          {text}
        </Text>
      </group>
    </Float>
  )
}

// 3D Tech stack visualization
const TechStack = ({ lowPerformanceMode }) => {
  return (
    <group>
      <SkillIcon 
        position={[-3, 0, -2]} 
        text="React" 
        color="#61dafb" 
        lowPerformanceMode={lowPerformanceMode}
      />
      <SkillIcon 
        position={[2.5, 1, -3]} 
        text="Node.js" 
        color="#8cc84b"
        lowPerformanceMode={lowPerformanceMode}
      />
      <SkillIcon 
        position={[0.5, -1.5, -0.5]} 
        text="TypeScript" 
        color="#3178c6" 
        lowPerformanceMode={lowPerformanceMode}
      />
      <SkillIcon 
        position={[-1.5, 2, -4]} 
        text="3D" 
        color="#ff7f50" 
        lowPerformanceMode={lowPerformanceMode}
      />
      <SkillIcon 
        position={[4, -0.5, -5]} 
        text="Mobile" 
        color="#a4c639" 
        lowPerformanceMode={lowPerformanceMode}
      />
    </group>
  )
}

const Experience = (props) => {
  const { menuOpened, lowPerformanceMode = false } = props
  const characterContainerAboutRef = useRef()
  const [section, setSection] = useState(0)
  const [characterAnimation, setCharacterAnimation] = useState("Typing")
  const [celebiVisible, setCelebiVisible] = useState(false)
  const { viewport } = useThree()
  const data = useScroll()

  const isMobile = window.innerWidth < 768
  const responsiveRatio = viewport.width / 12;
  const roomScaleRatio = Math.max(0.5, Math.min(1.2 * responsiveRatio, 1.2));
  const avatarScaleRatio = Math.max(0.5, Math.min(1 * responsiveRatio, 1));

  const cameraPositionX = useMotionValue()
  const cameraLookAtX = useMotionValue()

  const characterGroup = useRef()

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    })
    animate(cameraLookAtX, menuOpened ? 5 : 0)
  }, [menuOpened])

  useFrame((state) => {
    let curSection = Math.floor(data.scroll.current * data.pages)

    if (curSection > 3) {
      curSection = 3
    }

    if (curSection !== section) {
      setSection(curSection)
    }

    state.camera.position.x = cameraPositionX.get()
    state.camera.lookAt(cameraLookAtX.get(), 0, 0)

    if (section === 0) {
      characterContainerAboutRef.current.getWorldPosition(characterGroup.current.position)
    }
  })

  useEffect(() => {
    if (section === 1 || section === 2) {
      setCharacterAnimation("Landing")
    }
    if (section === 0) {
      setTimeout(() => {
        setCharacterAnimation(section === 0 ? "Typing" : "Standing")
      }, 300)
    }
  }, [section])

  // Use lower intensity for lights in low performance mode
  const lightIntensity = lowPerformanceMode ? 0.25 : 0.4;
  const spotlightIntensity = lowPerformanceMode ? 5 : 10;

  return (
    <>
      <Background />
      <motion.group
        animate={"" + section}
        transition={{
          duration: 0.8
        }}
        variants={{
          0: {
            scaleX: roomScaleRatio,
            scaleY: roomScaleRatio,
            scaleZ: roomScaleRatio,
          },
          1: {
            y: -viewport.height + 0.7,
            x: isMobile ? 0.3 : 0,
            z: 4,
            rotateX: 0,
            rotateY: isMobile ? - Math.PI / 2 : 0,
            rotateZ: 0,
          },
          2: {
            x: isMobile ? -1.3 : -2,
            y: -viewport.height * 2 + 0.5,
            z: 1,
            rotateX: 0,
            rotateY: Math.PI / 2,
            rotateZ: 0,
          },
          3: {
            x: 0.3,
            y: -viewport.height * 3 + 1,
            z: 7.5,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0
          }
        }}
        rotation={[-3.141592653589793, 0.9593981633974485, 3.141592653589793]}
        ref={characterGroup}
      >
        <Avatar
          animation={characterAnimation}
          section={section}
        />
      </motion.group>
      <Environment preset="sunset" />
      <motion.group
        rotation-y={-Math.PI / 4}
        scale={[roomScaleRatio, roomScaleRatio, roomScaleRatio]}
        position={isMobile ? [0, -viewport.height / 6, 3] : [1.5, 2, 3]}
        animate={{
          y: isMobile ? -viewport.height / 6 : section === 0 ? 0 : -1,
        }}
        transition={{
          duration: 1.2
        }}
      >
        <Room section={section} setCelebiVisible={setCelebiVisible} celebiVisible={celebiVisible} lowPerformanceMode={lowPerformanceMode} />
        <group
          name="Empty"
          ref={characterContainerAboutRef}
          position={[-0.215, 0.501, -0.209]}
          rotation={[-Math.PI, 0.174, -Math.PI]}
        >
        </group>
      </motion.group>

      {/* Skills */}
      <motion.group
        animate={{
          z: section === 1 ? 0 : -10,
          y: section === 1 ? -viewport.height : (isMobile ? -viewport.height : -1.5 * roomScaleRatio),
        }}
        position={[0, isMobile ? -viewport.height : -1.5 * roomScaleRatio, -10]}>
        <directionalLight position={[-5, 3, 5]} intensity={lightIntensity} />
        
        {/* Replace the three meshes with our new tech stack */}
        <TechStack lowPerformanceMode={lowPerformanceMode} />
        
        {celebiVisible && (
          <Celebi section={section} position={[4, 0, 0]} />
        )}
        
        {/* Add some ambient light to better illuminate the skill elements */}
        <ambientLight intensity={lightIntensity} />
        <pointLight position={[0, 2, 5]} intensity={lightIntensity} color="#ffffff" />
      </motion.group>
      
      <spotLight castShadow intensity={spotlightIntensity} position={[3, 5, 0]} />
      <Leva hidden />
      <Projects section={section} lowPerformanceMode={lowPerformanceMode} />
    </>
  )
}

export default Experience