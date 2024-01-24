import { Sphere, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Background = () => {
    const material = useRef()
    const color = useRef({
        color: "#b9bcff",
    })

    const data = useScroll()

    const timeline = useRef()

    // timeline = ["#b9bcff", "#212121", "#1820af", "#ea5252]

    useFrame(() => {
        timeline.current.progress(data.scroll.current)
        material.current.color = new THREE.Color(color.current.color)
    })

    useEffect(() => {
        timeline.current = gsap.timeline()
        timeline.current.to(color.current, {
            // duration: 1,
            color: "#a12c7c",
            // ease: "none",
        })
        timeline.current.to(color.current, {
            // duration: 1,
            color: "#1820af",
            // ease: "none",
        })
        timeline.current.to(color.current, {
            // duration: 1,
            color: "#ea5252",
            // ease: "none",
        })
    }, [])

    return (
        <group>
            <Sphere scale={[30, 30, 30]}>
                <meshBasicMaterial ref={material} side={THREE.BackSide} toneMapped={false} />

            </Sphere>
        </group>
    )
}

export default Background