import React, { useEffect, useRef } from 'react'
import { Image, Text } from '@react-three/drei'
import { animate, useMotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber';

const Project = (props) => {
    const { project, highlighted } = props;

    const background = useRef()
    const bgOpacity = useMotionValue(0.4)
    const glowIntensity = useMotionValue(0.2)
    const hoverScale = useMotionValue(1)

    useEffect(() => {
        animate(bgOpacity, highlighted ? 0.6 : 0.3)
        animate(glowIntensity, highlighted ? 0.8 : 0.2)
        animate(hoverScale, highlighted ? 1.05 : 1)
    }, [highlighted])

    useFrame(() => {
        background.current.material.opacity = bgOpacity.get()
    })

    // Function to handle clicks for URL
    const handleClick = (e, url) => {
        e.stopPropagation();
        if (url) {
            window.open(url, "_blank");
        }
    }

    return (
        <group {...props} scale={[hoverScale.get(), hoverScale.get(), hoverScale.get()]}>
            {/* Glow effect */}
            <mesh
                position-z={-0.05}
                scale={[2.4, 2.4, 1]}
            >
                <planeGeometry />
                <meshBasicMaterial 
                    color={highlighted ? project.color || "#6366F1" : "#4F46E5"} 
                    transparent 
                    opacity={glowIntensity.get() * 0.5} 
                    toneMapped={false}
                />
            </mesh>
            
            {/* Main card background - more transparent */}
            <mesh
                position-z={-0.001}
                onClick={(e) => handleClick(e, project.url)}
                ref={background}
            >
                <planeGeometry args={[2.2, 2.4]} />
                <meshBasicMaterial 
                    color="#121212" 
                    transparent 
                    opacity={0.3} 
                />
            </mesh>
            
            {/* Border glow effect */}
            <mesh position-z={-0.002}>
                <planeGeometry args={[2.22, 2.42]} />
                <meshBasicMaterial 
                    color={highlighted ? project.color || "#6366F1" : "#4F46E5"} 
                    transparent 
                    opacity={highlighted ? 0.6 : 0.2} 
                    toneMapped={false}
                />
            </mesh>
            
            {/* Image - now larger and more prominent */}
            <group position={[0, 0.3, 0]}>
                <Image
                    scale={[2.1, 1.5, 1]}
                    url={project.image}
                    toneMapped={false}
                    transparent
                />
                
                {/* Image frame - more subtle */}
                <mesh position-z={-0.01} scale={[2.12, 1.52, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial 
                        color={highlighted ? project.color || "#6366F1" : "#4F46E5"} 
                        transparent 
                        opacity={0.35} 
                    />
                </mesh>
            </group>
            
            {/* Project title - moved below image */}
            <Text
                maxWidth={2}
                anchorX={"center"}
                anchorY={"top"}
                fontSize={0.18}
                position={[0, -0.5, 0]}
                font="/fonts/Inter-Bold.ttf"
                color="white"
            >
                {project.title}
            </Text>
            
            {/* Project description - smaller and below title */}
            <Text
                maxWidth={2}
                anchorX={"center"}
                anchorY={"top"}
                fontSize={0.09}
                position={[0, -0.75, 0]}
                font="/fonts/Inter-Regular.ttf"
                color="#E2E8F0"
                textAlign="center"
            >
                {project.description.length > 80 
                    ? project.description.substring(0, 80) + "..." 
                    : project.description}
            </Text>
            
            {/* Tags container - repositioned */}
            {project.tags && project.tags.length > 0 && (
                <group position={[0, -1.1, 0]}>
                    {project.tags.slice(0, 3).map((tag, index) => (
                        <mesh 
                            key={index} 
                            position={[(index - 1) * 0.5, 0, 0]}
                        >
                            <planeGeometry args={[0.4, 0.15]} />
                            <meshBasicMaterial color={highlighted ? project.color || "#6366F1" : "#4F46E5"} transparent opacity={0.6} />
                            <Text
                                fontSize={0.06}
                                color="white"
                                position-z={0.01}
                            >
                                {tag}
                            </Text>
                        </mesh>
                    ))}
                </group>
            )}
        </group>
    )
}

export default Project