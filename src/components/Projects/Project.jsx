import React, { useEffect, useRef } from 'react'
import { Image, Text } from '@react-three/drei'
import { animate, useMotionValue } from 'framer-motion'
import { useFrame } from '@react-three/fiber';

const Project = (props) => {
    const { project, highlighted } = props;

    const background = useRef()
    const bgOpacity = useMotionValue(0.4)

    useEffect(() => {
        animate(bgOpacity, highlighted ? 0.8 : 0.4)
    }, [highlighted])

    useFrame(() => {
        background.current.material.opacity = bgOpacity.get()
    })
    return (
        <group {...props}>
            <mesh
                position-z={-0.001}
                onClick={() => window.open(project.url, "_blank")}
                ref={background}
            >
                <planeGeometry args={[2.2, 2]} />
                <meshBasicMaterial color="black" transparent opacity={0.4} />
            </mesh>
            <Image
                scale={[2, 1.2, 1]}
                url={project.image}
                toneMapped={false}
                position-y={0.3} />
            <Text
                maxWidth={2}
                anchorX={"left"}
                anchorY={"top"}
                fontSize={0.2}
                position={[-1, -0.4, 0]}
            >
                {project.title}
            </Text>
            <Text
                maxWidth={2}
                anchorX={"left"}
                anchorY={"top"}
                fontSize={0.1}
                position={[-1, -0.6, 0]}
            >
                {project.description}
            </Text>
        </group>
    )
}

export default Project