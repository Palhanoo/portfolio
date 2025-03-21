import { useThree } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'
import { atom, useAtom } from 'jotai'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import Project from './Project'
import { projects } from '../../constants/projects'
import { useFrame } from '@react-three/fiber'

export const currentProjectAtom = atom(Math.floor(projects.length / 2))

const Projects = ({ section }) => {
    const { viewport } = useThree()
    const [currentProject] = useAtom(currentProjectAtom)
    const groupRef = useRef()
    const [isVisible, setIsVisible] = useState(false)
    
    // Determine if we're in the projects section
    useEffect(() => {
        // Only show and make interactive when in section 2
        const newVisibility = section === 2
        setIsVisible(newVisibility)
    }, [section])
    
    // Add subtle floating animation
    useFrame((state) => {
        if (groupRef.current && isVisible) {
            groupRef.current.position.y = -viewport.height * 2 + 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
        }
    })

    // Determine which projects should be visible
    const visibleProjects = useMemo(() => {
        const visibleIndexes = [];
        
        // Always include the current project
        visibleIndexes.push(currentProject);
        
        // Add projects to the left and right
        if (currentProject > 0) {
            visibleIndexes.push(currentProject - 1);
        } else {
            // If we're at the first project, show the last one on the left
            visibleIndexes.push(projects.length - 1);
        }
        
        if (currentProject < projects.length - 1) {
            visibleIndexes.push(currentProject + 1);
        } else {
            // If we're at the first project, show the last one on the right
            visibleIndexes.push(0);
        }
        
        // Add one more on each side if available
        if (currentProject > 1) {
            visibleIndexes.push(currentProject - 2);
        } else {
            visibleIndexes.push(currentProject - 2 + projects.length);
        }
        
        if (currentProject < projects.length - 2) {
            visibleIndexes.push(currentProject + 2);
        } else {
            visibleIndexes.push(currentProject + 2 - projects.length);
        }
        
        return visibleIndexes;
    }, [currentProject]);

    // Don't render anything if not visible
    if (!isVisible) return null;

    return (
        <group 
            position-y={-viewport.height * 2 + 1}
            ref={groupRef}
        >
            {/* Project cards */}
            {projects.map((project, idx) => {
                // Calculate position based on relation to current project
                const position = idx - currentProject;
                // Handle wraparound for position
                const wrappedPosition = position < -(projects.length / 2) 
                    ? position + projects.length 
                    : position > projects.length / 2 
                        ? position - projects.length 
                        : position;
                
                // Determine if this project should be visible
                const isProjectVisible = visibleProjects.includes(idx);
                const isCurrent = idx === currentProject;
                
                // Horizontal spacing between cards
                const spacing = 3.5;
                
                // Z-depth based on distance from center
                const zOffset = Math.abs(wrappedPosition) * 0.8;
                
                return (
                    <motion.mesh
                        whileHover={
                            isCurrent 
                                ? { scale: 1.3, transition: { duration: 0.2 } }
                                : { scale: 1.1, transition: { duration: 0.2 } }
                        }
                        key={"project_" + idx}
                        position={[idx * 2.5, 0, -3]}
                        animate={{
                            scale: isCurrent ? 1.2 : Math.max(0.85, 1 - Math.abs(wrappedPosition) * 0.15),
                            x: wrappedPosition * spacing,
                            y: isCurrent ? 0 : -0.15 * Math.abs(wrappedPosition),
                            z: isCurrent ? -2 : -3 - zOffset,
                            rotateX: isCurrent ? 0 : -Math.PI / 6,
                            rotateY: wrappedPosition * 0.2,
                            rotateZ: isCurrent ? 0 : (wrappedPosition < 0 ? 0.1 : -0.1) * Math.PI / 6,
                            opacity: isProjectVisible ? 1 : 0
                        }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 90
                        }}
                    >
                        <Project 
                            project={{
                                ...project,
                                // Assign different colors to different projects
                                color: getProjectColor(idx)
                            }} 
                            highlighted={isCurrent} 
                        />
                    </motion.mesh>
                )
            })}
            
            {/* Interactive indicator dots */}
            <group position={[0, -1.7, -2]}>
                {projects.map((_, idx) => (
                    <motion.mesh 
                        key={"indicator_" + idx}
                        position={[(idx - Math.floor(projects.length / 2)) * 0.2, 0, 0]}
                        animate={{
                            scale: currentProject === idx ? 1.5 : 1,
                            y: currentProject === idx ? 0.05 : 0
                        }}
                    >
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshBasicMaterial 
                            color={currentProject === idx ? getProjectColor(idx) : "#ffffff"} 
                            opacity={currentProject === idx ? 1 : 0.6}
                            transparent
                        />
                    </motion.mesh>
                ))}
            </group>
        </group>
    )
}

// Helper function to generate distinct colors for projects
function getProjectColor(index) {
    const colors = [
        "#6366F1", // Indigo
        "#8B5CF6", // Violet
        "#EC4899", // Pink
        "#F43F5E", // Rose
        "#10B981", // Emerald
        "#06B6D4", // Cyan
        "#3B82F6", // Blue
        "#F59E0B", // Amber
        "#84CC16", // Lime
        "#14B8A6", // Teal
        "#8B5CF6", // Violet (repeated for more projects)
        "#6366F1", // Indigo (repeated for more projects)
    ]
    
    return colors[index % colors.length]
}

export default Projects