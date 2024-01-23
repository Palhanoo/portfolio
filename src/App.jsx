import React from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import { Scroll, ScrollControls } from '@react-three/drei'
import Interface from './components/Interface'

function App() {

  return (
    <>
      <Canvas shadows camera={{ position: [4, 3, 4] }}>
        <ScrollControls pages={4} damping={0.1}>
          <Experience />
          <Scroll html>
            <Interface />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  )
}

export default App
