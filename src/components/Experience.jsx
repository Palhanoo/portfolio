import { ContactShadows, Environment, OrbitControls, Sky } from '@react-three/drei'
import React from 'react'
import { Avatar } from './Avatar'
import { useControls } from 'leva'
import { Room } from './Room'

const Experience = () => {

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
      <Room />
      <group position-y={-1}>
        <ContactShadows
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color={'#000000'}
        />
        <Avatar animation={animation} rotation-z={Math.PI} position={[-0.25, 1.5, -0.2]} />
      </group>
    </>
  )
}

export default Experience