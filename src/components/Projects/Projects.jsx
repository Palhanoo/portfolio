import { useThree } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'
import { atom, useAtom } from 'jotai'
import React from 'react'
import Project from './Project'
import {projects} from '../../constants/projects'

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