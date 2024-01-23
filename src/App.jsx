import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import { Scroll, ScrollControls } from '@react-three/drei'
import Interface from './components/Interface'
import ScrollManager from './components/ScrollManager'
import Menu from './components/Menu'
import { MotionConfig } from 'framer-motion'
import {framerMotionConfig} from './config'
import { Cursor } from './components/Cursor'

function App() {
  const [section, setSection] = useState(0)
  const [menuOpened, setMenuOpened] = useState(false)

  useEffect(() => {
    setMenuOpened(false)
  }, [section])

  return (
    <>
      <MotionConfig
        transition={{
          ...framerMotionConfig
        }}
      >
        <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
          <ScrollControls pages={4} damping={0.1}>
            <ScrollManager section={section} onSectionChange={setSection} />
            <Scroll>
              <Experience section={section} menuOpened={menuOpened} />
            </Scroll>
            <Scroll html>
              <Interface />
            </Scroll>
          </ScrollControls>
        </Canvas>
        <Menu onSectionChange={setSection} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </MotionConfig>
      <Cursor />
    </>
  )
}

export default App
