import { ContactShadows, Environment, Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Sky, useScroll } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { Leva, useControls } from 'leva'
import { Room } from './Room'
import { motion } from 'framer-motion-3d'
import { useFrame, useThree } from '@react-three/fiber'
import { animate, useMotionValue } from 'framer-motion'
import { framerMotionConfig } from '../config'
import * as THREE from 'three'

const Experience = (props) => {
  const { menuOpened } = props
  const characterContainerAboutRef = useRef()
  const [section, setSection] = useState(0)
  const [characterAnimation, setCharacterAnimation] = useState("Typing")
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
    let curSection = Math.floor(data.scroll.current * data.pages)

    if (curSection > 3) {
      curSection = 3
    }

    if (curSection !== section) {
      setSection(curSection)
    }

    state.camera.position.x = cameraPositionX.get()
    state.camera.lookAt(cameraLookAtX.get(), 0, 0)

    //get the position
    // const position = new THREE.Vector3()
    // characterContainerAboutRef.current.getWorldPosition(position)
    // // console.log([position.x, position.y, position.z]);


    // //get the rotation
    // const quaternion = new THREE.Quaternion();
    // characterContainerAboutRef.current.getWorldQuaternion(quaternion);
    // const euler = new THREE.Euler();
    // euler.setFromQuaternion(quaternion, 'XYZ')
    // console.log([euler.x, euler.y, euler.z])
    // console.log(data.offset)
    // if(data.offset > 0.32) {
    //   setAni("Standing")
    // }
  })

  const { animation } = useControls({
    animation: {
      value: "Typing",
      options: ["Typing", "Standing", "Falling", "Dancing"],
    }
  })

  useEffect(() => {
    setCharacterAnimation("Falling")
    setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Dancing")    
    }, 300)
  }, [section])

  return (
    <>
      {/* <OrbitControls /> */}
      <motion.group
        animate={"" + section}
        transition={{
          duration: 0.8
        }}
        variants={{
          0: {
            scaleX: 1.2,
            scaleY: 1.2,
            scaleZ: 1.2,
          },
          1: {
            y: -viewport.height + 0.5,
            x: 0,
            z: 7,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          },
          2: {
            x: -2,
            y: -viewport.height * 2 + 0.5,
            z: 0,
            rotateX: 0,
            rotateY: Math.PI / 2,
            rotateZ: 0,
          },
          3: {
            x: 0.3,
            y: -viewport.height * 3 + 1,
            z: 8.5,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0
          }
        }}
        rotation={[-3.141592653589793, 0.9593981633974485, 3.141592653589793]}
        position={[1.4949088311754568, 0.6012, 2.6402240697322847]}
      >
        <Avatar
          animation={characterAnimation}
          section={section}
        />
      </motion.group>
      <Environment preset="sunset" />
      <motion.group
        rotation-y={-Math.PI / 4}
        scale={[1.2, 1.2, 1.2]}
        position={[1.5, 2, 3]}
        animate={{
          y: section === 0 ? 0 : -1,
        }}

      >
        <Room section={section} />
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

      </motion.group>
      <spotLight castShadow intensity={10} position={[3, 5, 0]} />
      {/* <OrbitControls /> */}
      <Leva hidden />
    </>
  )
}

export default Experience