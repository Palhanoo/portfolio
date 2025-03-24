import React, { Suspense, useEffect, useState, useMemo, useCallback, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scroll, ScrollControls } from '@react-three/drei'
import Interface from './components/Interface'
import ScrollManager from './components/ScrollManager'
import Menu from './components/Menu/Menu'
import { MotionConfig } from 'framer-motion'
import { framerMotionConfig } from './utils/config'
import { Cursor } from './components/Cursor'
import LoadingScreen from './components/LoadingScreen'

// Dynamically import components for better code splitting
const Experience = lazy(() => import('./components/Experience'))

function App() {
  const [section, setSection] = useState(0)
  const [started, setStarted] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)

  // Function to set performance mode that can be accessed globally
  const setPerformanceMode = useCallback((isLowPerf) => {
    setLowPerformanceMode(isLowPerf)
  }, [])

  // Make the function available globally
  useEffect(() => {
    window.setPerformanceMode = setPerformanceMode
    
    return () => {
      delete window.setPerformanceMode
    }
  }, [setPerformanceMode])

  // Detect low-performance device and respect user preference
  useEffect(() => {
    // Check if user has a saved preference
    const savedMode = localStorage.getItem('performanceMode')
    
    if (savedMode) {
      setLowPerformanceMode(savedMode === 'low')
    } else {
      // Auto-detect if no preference saved
      const networkInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlow4G = networkInfo && 
                      (networkInfo.effectiveType === 'slow-2g' || 
                       networkInfo.effectiveType === '2g' || 
                       networkInfo.effectiveType === '3g');
                       
      const isLowPerfDevice = window.navigator.hardwareConcurrency <= 4 || 
                               window.innerWidth < 768 || 
                               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                               isSlow4G;
      
      setLowPerformanceMode(isLowPerfDevice)
    }
  }, [])

  useEffect(() => {
    setMenuOpened(false)
  }, [section])

  // Set assets ready when starting the experience
  useEffect(() => {
    if (started) {
      // Mark assets as ready when the loading screen starts to fade out
      setTimeout(() => {
        setAssetsReady(true);
      }, 500);
    }
  }, [started]);

  // Configure performance-related settings based on device capability or user preference
  const performanceSettings = useMemo(() => ({
    shadows: !lowPerformanceMode,
    dpr: lowPerformanceMode ? [0.5, 0.8] : [0.8, 1.5], // More aggressive DPR reduction
    camera: { position: [0, 3, 10], fov: 42 },
    // Additional optimization settings
    gl: {
      antialias: !lowPerformanceMode,
      alpha: true,
      powerPreference: lowPerformanceMode ? 'low-power' : 'default',
      // Enable texture compression
      physicallyCorrectLights: !lowPerformanceMode,
      // Better memory management
      logarithmicDepthBuffer: lowPerformanceMode,
    },
    flat: lowPerformanceMode, // Use flat shading in low performance mode
  }), [lowPerformanceMode])

  const fallbackContent = useMemo(() => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-2xl text-indigo-800">Loading experience...</div>
    </div>
  ), []);

  return (
    <>
    <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig,
          // Reduce animation complexity in low performance mode
          duration: lowPerformanceMode ? framerMotionConfig.duration * 0.8 : framerMotionConfig.duration,
        }}
      >
        {assetsReady && (
          <Canvas 
            shadows={performanceSettings.shadows} 
            dpr={performanceSettings.dpr}
            camera={performanceSettings.camera}
            gl={performanceSettings.gl}
            flat={performanceSettings.flat}
            performance={{ min: lowPerformanceMode ? 0.3 : 0.5 }}
            frameloop={lowPerformanceMode ? "demand" : "always"}
          >
            <ScrollControls pages={4} damping={lowPerformanceMode ? 0.3 : 0.1}>
              <ScrollManager section={section} onSectionChange={setSection} lowPerformanceMode={lowPerformanceMode} />
              <Scroll>
                <Suspense fallback={null}>
                  <Experience section={section} menuOpened={menuOpened} lowPerformanceMode={lowPerformanceMode} />
                </Suspense>
              </Scroll>
              <Scroll html>
                <Interface setSection={setSection} />
              </Scroll>
            </ScrollControls>
          </Canvas>
        )}
        <Menu onSectionChange={setSection} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </MotionConfig>
      <Cursor />
    </>
  )
}

export default App
