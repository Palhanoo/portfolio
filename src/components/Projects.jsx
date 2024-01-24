import { Image, Text, useMotion } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { animate, useMotionValue } from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { atom, useAtom } from 'jotai'
import React, { useEffect, useRef } from 'react'

export const projects = [
    {
        title: 'Bomberzilla',
        url: 'https://3dbomber.vercel.app/',
        image: "./projects/Bomberzilla.png",
        description: ""
    },
    {
        title: 'Donuts-Swap',
        url: 'https://donuts-swap.vercel.app/',
        image: "./projects/DonutSwap.png",
        description: ""
    },
    {
        title: 'Pingu',
        url: 'https://choco-landing-two.vercel.app/',
        image: "./projects/Pingu.png",
        description: ""
    },
    {
        title: 'Minions',
        url: 'https://minions-nu.vercel.app/',
        image: "./projects/Minions.png",
        description: ""
    },
    {
        title: 'AskAny',
        url: 'https://askany-landing.vercel.app/',
        image: "./projects/AskAny.png",
        description: ""
    },
    {
        title: 'Elvantis',
        url: 'https://elvantis-dev.vercel.app/',
        image: "./projects/Elvantis.png",
        description: "Elvantis main website Project"
    },
]

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

export const currentProjectAtom = atom(Math.floor(projects.length / 2))

const Projects = () => {
    const { viewport } = useThree()
    const [currentProject] = useAtom(currentProjectAtom)

    return (
        <group position-y={-viewport.height * 2 + 1}>
            {
                projects.map((project, idx) => (
                    <motion.mesh key={"project_" + idx}
                        position={[idx * 2.5, 0, -3]}
                        animate={{
                            // y: currentProject === idx ? 0.2 : 0,
                            scale: currentProject === idx ? 1.2 : 1,
                            x: 0 + (idx - currentProject) * 2.5,
                            y: currentProject === idx ? 0 : -0.1,
                            z: currentProject === idx ? -2 : -0.1,
                            rotateX: currentProject === idx ? 0 : -Math.PI / 3,
                            rotateZ: currentProject === idx ? 0 : - 0.1 * Math.PI / 3,

                        }}
                    >
                        <Project project={project} highlighted={idx === currentProject} />
                    </motion.mesh>
                ))
            }
        </group>
    )
}

export default Projects