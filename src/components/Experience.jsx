import { ContactShadows, Environment, Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Sky, useScroll } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { Avatar } from './Avatar'
import { Leva, useControls } from 'leva'
import { Room } from './Room'
import { motion } from 'framer-motion-3d'
import { useFrame, useThree } from '@react-three/fiber'
import { animate, useMotionValue } from 'framer-motion'
import { framerMotionConfig } from '../config'


const Experience = (props) => {
  const { section, menuOpened } = props
  const [ani, setAni] = useState("Typing")
  const { viewport } = useThree()
  const data = useScroll()

  const cameraPositionX = useMotionValue()
  const cameraLookAtX = useMotionValue()

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    })
    animate(cameraLookAtX, menuOpened ? 5 : 0)
  }, [menuOpened])

  useFrame((state) => {
    state.camera.position.x = cameraPositionX.get()
    state.camera.lookAt(cameraLookAtX.get(), 0, 0)
    // console.log(data.offset)
    // if(data.offset > 0.32) {
    //   setAni("Standing")
    // }
  })

  const { animation } = useControls({
    animation: {
      value: "Typing",
      options: ["Typing", "Standing", "Falling"],
    }
  })

  return (
    <>
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <motion.group
        rotation-y={-Math.PI / 4}
        scale={[0.9, 0.9, 0.9]}
        position={[1.5, 2, 3]}
        animate={{
          y: section === 0 ? 0 : -1,
        }}

      >
        <Room section={section} />
      </motion.group>

      {/* Skills */}
      <motion.group
        animate={{
          z: section === 1 ? 0 : -10,
          y: section === 1 ? -viewport.height : -1.5,
        }}
        position={[0, -1.5, -10]}>
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={4}
              color="red"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={0.4}
              speed={5}
              color="yellow"
            />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, -1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial
              opacity={0.8}
              transparent
              // distort={0.4}
              factor={1}
              speed={5}
              color="blue"
            />
          </mesh>
        </Float>
        <Avatar
          // animation={ani}
          animation={section === 0 ? "Falling" : "Standing"}
          // rotation-z={Math.PI - 0.6}
          // position={[1.55, 1.9, 12.8]}
          position={section === 0 ? [5, 0, 0] : [0, 0, 4]}
          section={section} />
      </motion.group>
      <spotLight castShadow intensity={10} position={[3, 5, 0]} />
      {/* <OrbitControls /> */}
      <Leva hidden />
    </>
  )
}

export default Experience