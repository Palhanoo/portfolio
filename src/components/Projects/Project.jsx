import React, { useEffect, useRef, memo, useState } from 'react'
import { Text } from '@react-three/drei'
import { RoundedBox } from '@react-three/drei'
import { useAtom } from 'jotai'
import { currentProjectAtom } from './Projects'
import { MathUtils } from 'three'

const Project = memo(({ project, highlighted = false, lowPerformanceMode = false }) => {
    const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)
    const [isHovered, setIsHovered] = useState(false)
    const boxRef = useRef()

    useEffect(() => {
        if (boxRef.current && highlighted) {
            boxRef.current.name = "clickable"
        }
    }, [highlighted])

    const handleClick = (e) => {
        e.stopPropagation()
        const projectIdx = project.id - 1
        setCurrentProject(projectIdx)
    }

    // Reduce geometry subdivision for better performance
    const boxArgs = lowPerformanceMode ? 
        [1.5, 1, 0.1, 4, 4] : // Lower resolution for low performance mode
        [1.5, 1, 0.1, 8, 8];  // Higher resolution for normal mode
    
    // Simplified text for low performance mode
    const titleFontSize = lowPerformanceMode ? 0.09 : 0.1;
    const descriptionFontSize = lowPerformanceMode ? 0.05 : 0.06;
    
    return (
        <group onClick={handleClick}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <RoundedBox
                args={boxArgs}
                ref={boxRef}
                radius={0.1}
                smoothness={lowPerformanceMode ? 2 : 4}
            >
                <meshStandardMaterial 
                    color={highlighted || isHovered ? project.color : "white"} 
                    roughness={0.2}
                    metalness={0.2}
                    emissive={project.color}
                    emissiveIntensity={
                        highlighted 
                            ? MathUtils.lerp(0.4, 0.8, Math.sin(Date.now() / 1000) * 0.5 + 0.5)
                            : isHovered 
                                ? 0.4 
                                : 0.1
                    }
                />
            </RoundedBox>
            <Text 
                position={[0, 0.1, 0.06]} 
                fontSize={titleFontSize}
                color={highlighted || isHovered ? "white" : "#333"}
                anchorX="center"
                anchorY="middle"
                font='/fonts/Inter-Bold.woff'
                maxWidth={1.3}
                textAlign="center"
            >
                {project.title}
            </Text>

            <Text 
                position={[0, -0.1, 0.06]} 
                fontSize={descriptionFontSize}
                color={highlighted || isHovered ? "white" : "#333"}
                anchorX="center"
                anchorY="middle"
                font='/fonts/Inter-Regular.woff'
                maxWidth={1.3}
                textAlign="center"
            >
                {lowPerformanceMode && !highlighted ? project.shortDescription || project.description.substring(0, 50) : project.description}
            </Text>

            {(highlighted || (!lowPerformanceMode && isHovered)) && (
                <group position={[0, -0.4, 0.06]}>
                    <Text 
                        position={[0, 0, 0]} 
                        fontSize={0.05}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font='/fonts/Inter-Medium.woff'
                    >
                        Click to view details
                    </Text>
                </group>
            )}
        </group>
    )
})

export default Project