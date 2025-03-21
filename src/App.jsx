import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import { Scroll, ScrollControls } from '@react-three/drei'
import Interface from './components/Interface'
import ScrollManager from './components/ScrollManager'
import Menu from './components/Menu/Menu'
import { MotionConfig } from 'framer-motion'
import { framerMotionConfig } from './utils/config'
import { Cursor } from './components/Cursor'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [section, setSection] = useState(0)
  const [started, setStarted] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false)

  // Detect low-performance device
  useEffect(() => {
    // Check if the device is low-performance based on navigator properties or screen size
    const isLowPerfDevice = window.navigator.hardwareConcurrency <= 4 || 
                             window.innerWidth < 768 || 
                             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    setLowPerformanceMode(isLowPerfDevice)
  }, [])

  useEffect(() => {
    setMenuOpened(false)
  }, [section])

  // Configure performance-related settings based on device capability
  const performanceSettings = useMemo(() => ({
    shadows: !lowPerformanceMode,
    dpr: lowPerformanceMode ? [0.6, 1] : [1, 2],
    camera: { position: [0, 3, 10], fov: 42 },
  }), [lowPerformanceMode])

  return (
    <>
    <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig
        }}
      >
        <Canvas 
          shadows={performanceSettings.shadows} 
          dpr={performanceSettings.dpr}
          camera={performanceSettings.camera}
          performance={{ min: 0.5 }}
        >
          <ScrollControls pages={4} damping={lowPerformanceMode ? 0.2 : 0.1}>
            <ScrollManager section={section} onSectionChange={setSection} lowPerformanceMode={lowPerformanceMode} />
            <Scroll>
              <Suspense>
                <Experience section={section} menuOpened={menuOpened} lowPerformanceMode={lowPerformanceMode} />
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
