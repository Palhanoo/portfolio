import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import { Scroll, ScrollControls } from '@react-three/drei'
import Interface from './components/Interface'
import ScrollManager from './components/ScrollManager'
import Menu from './components/Menu'
import { MotionConfig } from 'framer-motion'
import { framerMotionConfig } from './config'
import { Cursor } from './components/Cursor'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [section, setSection] = useState(0)
  const [started, setStarted] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)

  useEffect(() => {
    setMenuOpened(false)
  }, [section])

  return (
    <>
    <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig
        }}
      >
        <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
          <ScrollControls pages={4} damping={0.1}>
            <ScrollManager section={section} onSectionChange={setSection} />
            <Scroll>
              <Suspense>
                <Experience section={section} menuOpened={menuOpened} />
              </Suspense>
            </Scroll>
            <Scroll html>
              <Interface setSection={setSection} />
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
