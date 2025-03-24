import { Sphere, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const ParticlesField = ({ count = 2000, lowPerformanceMode = false }) => {
  // Dramatically reduce particle count in low performance mode
  const actualCount = lowPerformanceMode ? Math.min(200, count) : count;
  
  const { viewport } = useThree()
  const positions = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    for (let i = 0; i < actualCount; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(180)
      
      positions[i * 3] = 20 * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = 20 * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = 20 * Math.cos(theta)
    }
    return positions
  }, [actualCount])
  
  const particlesMaterial = useRef()
  const particlesRef = useRef()
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      // Reduce rotation speed in low performance mode
      const speedMultiplier = lowPerformanceMode ? 0.2 : 1;
      particlesRef.current.rotation.x = clock.getElapsedTime() * 0.01 * speedMultiplier
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.005 * speedMultiplier
    }
    
    if (particlesMaterial.current) {
      particlesMaterial.current.size = lowPerformanceMode ? 0.3 : 0.2
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={particlesMaterial}
        size={lowPerformanceMode ? 0.3 : 0.15}
        sizeAttenuation
        transparent
        opacity={0.6}
        color="#ffffff"
      />
    </points>
  )
}

const Background = ({ lowPerformanceMode = false }) => {
  const materialRef = useRef()
  const gradientMaterialRef = useRef()
  const data = useScroll()
  const timeline = useRef()
  const nebulaMaterial = useRef()
  
  // Modern, professional color scheme
  const colors = {
    section0: new THREE.Color('#0c1445'), // Deep blue
    section1: new THREE.Color('#0f2b4c'), // Navy blue
    section2: new THREE.Color('#1d2671'), // Royal purple
    section3: new THREE.Color('#2d004b')  // Deep purple
  }
  
  // Accent colors for gradients
  const accentColors = {
    section0: new THREE.Color('#4776e6'), // Bright blue
    section1: new THREE.Color('#00a2ff'), // Cyan
    section2: new THREE.Color('#8e54e9'), // Purple
    section3: new THREE.Color('#7303c0')  // Violet
  }
  
  useFrame(() => {
    if (timeline.current) {
      timeline.current.progress(data.scroll.current)
    }
    
    // Only update the nebula in high-performance mode
    if (nebulaMaterial.current && !lowPerformanceMode) {
      nebulaMaterial.current.uniforms.uTime.value += 0.001
    }
  })
  
  useEffect(() => {
    // Create the animation timeline for smooth background transitions
    timeline.current = gsap.timeline()
    
    timeline.current.to(materialRef.current.color, {
      r: colors.section1.r,
      g: colors.section1.g,
      b: colors.section1.b,
      ease: "power1.inOut"
    })
    
    timeline.current.to(materialRef.current.color, {
      r: colors.section2.r,
      g: colors.section2.g,
      b: colors.section2.b,
      ease: "power1.inOut"
    })
    
    timeline.current.to(materialRef.current.color, {
      r: colors.section3.r,
      g: colors.section3.g,
      b: colors.section3.b,
      ease: "power1.inOut"
    })
    
    // Set initial color
    materialRef.current.color = colors.section0
  }, [])
  
  // Create a nebula-like shader material
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#4776e6') },
    uColor2: { value: new THREE.Color('#8e54e9') },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), [])
  
  // Simplified nebula shader for low performance mode
  const fragmentShader = lowPerformanceMode ? `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      // Simple gradient without animation or noise
      vec3 color = mix(uColor1, uColor2, uv.y);
      float alpha = 0.2;
      
      gl_FragColor = vec4(color, alpha);
    }
  ` : `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;

    // Simple noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      float n = noise(uv * 2.0 + uTime * 0.05);
      
      // Create a nebula effect with color mixing
      vec3 color = mix(uColor1, uColor2, smoothstep(0.2, 0.8, n));
      float alpha = smoothstep(0.1, 0.9, n) * 0.3;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
  
  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  // Adjust sphere complexity based on performance mode
  const sphereArgs = lowPerformanceMode ? [1, 16, 16] : [1, 32, 32];
  const nebulaArgs = lowPerformanceMode ? [1, 12, 12] : [1, 24, 24];

  return (
    <group>
      {/* Main background */}
      <Sphere scale={[30, 30, 30]} args={sphereArgs}>
        <meshBasicMaterial 
          ref={materialRef} 
          side={THREE.BackSide} 
          toneMapped={false} 
          fog={false}
        />
      </Sphere>
      
      {/* Nebula effect layer - only in high performance mode or simplified in low */}
      <Sphere scale={[25, 25, 25]} args={nebulaArgs}>
        <shaderMaterial
          ref={nebulaMaterial}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={lowPerformanceMode ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Particles - reduced count in low performance mode */}
      <ParticlesField 
        count={lowPerformanceMode ? 200 : 600} 
        lowPerformanceMode={lowPerformanceMode} 
      />
    </group>
  )
}

export default Background