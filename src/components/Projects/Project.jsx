import React, { useEffect, useRef, useMemo } from 'react'
import { Image, Text, useTexture } from '@react-three/drei'
import { animate, useMotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber';

// Memoized image component to handle loading properly
const ProjectImage = React.memo(({ url, scale, highlighted, borderColor }) => {
    // Use the texture directly to avoid reloading
    const texture = useTexture(url);
    
    return (
        <group position={[0, 0.3, 0]}>
            <Image
                scale={scale}
                texture={texture}
                toneMapped={false}
                transparent
            />
            
            {/* Image frame - more subtle */}
            <mesh position-z={-0.01} scale={[2.12, 1.52, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    color={borderColor} 
                    transparent 
                    opacity={0.35} 
                />
            </mesh>
        </group>
    );
});

const Project = (props) => {
    const { project, highlighted, lowPerformanceMode = false } = props;

    const background = useRef()
    const bgOpacity = useMotionValue(0.4)
    const glowIntensity = useMotionValue(0.2)
    const hoverScale = useMotionValue(1)
    
    // Store the current scale to avoid recalculations
    const currentScale = useRef([1, 1, 1]);

    useEffect(() => {
        // Use less intense animations in low performance mode
        const duration = lowPerformanceMode ? 0.3 : 0.2;
        
        animate(bgOpacity, highlighted ? 0.6 : 0.3, { duration })
        animate(glowIntensity, highlighted ? 0.8 : 0.2, { duration })
        animate(hoverScale, highlighted ? 1.05 : 1, { 
            duration,
            onUpdate: (latest) => {
                currentScale.current = [latest, latest, latest];
            }
        })
    }, [highlighted, lowPerformanceMode])

    useFrame(() => {
        if (background.current) {
            background.current.material.opacity = bgOpacity.get()
        }
    })

    // Function to handle clicks for URL
    const handleClick = (e, url) => {
        e.stopPropagation();
        if (url) {
            window.open(url, "_blank");
        }
    }
    
    // Memoize color values to prevent unnecessary recalculations
    const colors = useMemo(() => {
        return {
            glow: highlighted ? project.color || "#6366F1" : "#4F46E5",
            border: highlighted ? project.color || "#6366F1" : "#4F46E5",
            tag: highlighted ? project.color || "#6366F1" : "#4F46E5"
        }
    }, [highlighted, project.color]);

    return (
        <group {...props} scale={currentScale.current}>
            {/* Glow effect */}
            <mesh
                position-z={-0.05}
                scale={[2.4, 2.4, 1]}
            >
                <planeGeometry />
                <meshBasicMaterial 
                    color={colors.glow} 
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
                    color={colors.border} 
                    transparent 
                    opacity={highlighted ? 0.6 : 0.2} 
                    toneMapped={false}
                />
            </mesh>
            
            {/* Image with optimized loading */}
            <ProjectImage 
                url={project.image}
                scale={[2.1, 1.5, 1]}
                highlighted={highlighted}
                borderColor={colors.border}
            />
            
            {/* Project title - moved below image */}
            <Text
                maxWidth={2}
                anchorX={"center"}
                anchorY={"top"}
                fontSize={0.18}
                position={[0, -0.5, 0]}
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
                            <meshBasicMaterial color={colors.tag} transparent opacity={0.6} />
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

export default React.memo(Project)