import React, { useEffect, useRef } from "react";
import { useGLTF, useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from 'three'
import { motion } from "framer-motion-3d";
import { animate, useMotionValue } from "framer-motion";
import { useFrame } from "@react-three/fiber";

export function Room(props) {
    const mew = useRef()
    const mewSound = new Audio("./sounds/mew.mp3")
    const eeveeSound = new Audio("./sounds/eevee.mp3")
    const mewCry = () => {
        mewSound.play()
    }
    const eeveeCry = () => {
        eeveeSound.play()
    }
    const { section } = props
    const { nodes, materials } = useGLTF("./models/Room.glb");
    const textureCode = useVideoTexture("./textures/Bake.mp4")
    const textureCode2 = useVideoTexture("./textures/youtubeBake.mp4")
    // textureCode.flipY = false
    const texture = useTexture("./textures/RoomBaked.jpg")
    texture.flipY = false
    const textureMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
    })
    const glassGeometry = new THREE.BoxGeometry(1, 1, 1)
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true
    })

    const textureOpacity = useMotionValue(0)
    const glassOpacity = useMotionValue(0)

    useEffect(() => {
        animate(textureOpacity, section === 0 ? 1 : 0, 0, {
            duration: 0.8
        })
        animate(glassOpacity, section === 0 ? 0.3 : 0, 0, {
            duration: 0.8
        })
    }, [section])

    useFrame(() => {
        textureMaterial.opacity = textureOpacity.get()
        glassMaterial.opacity = glassOpacity.get()

    })

    return (
        <motion.group {...props} dispose={null}
            scale={[0, 0, 0]}
            animate={{ scale: section === 0 ? 1 : 0 }}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Chair.geometry}
                material={textureMaterial}
                position={[-0.217, 0.626, -0.167]}
                rotation={[Math.PI, -0.008, Math.PI]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Coaster.geometry}
                material={textureMaterial}
                position={[0.646, 1.191, -0.476]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Desk.geometry}
                material={textureMaterial}
                position={[0, 0.248, -1.086]}
                rotation={[Math.PI, -1.567, Math.PI]}
            />
            <mesh
                onClick={eeveeCry}
                castShadow
                receiveShadow
                geometry={nodes.Eevee.geometry}
                material={textureMaterial}
                position={[-1.512, 1.962, -0.123]}
                rotation={[0, -1.221, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Keyboard1.geometry}
                material={textureMaterial}
                position={[-0.179, 1.193, -0.872]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Laptop.geometry}
                material={textureMaterial}
                position={[0.371, 1.197, -1.147]}
                rotation={[0, -0.605, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mug.geometry}
                material={textureMaterial}
                position={[0.649, 1.234, -0.478]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Pokeball.geometry}
                material={textureMaterial}
                position={[-1.613, 1.921, 0.172]}
                rotation={[0, -0.623, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Rug.geometry}
                material={textureMaterial}
                position={[0.355, 0.265, 0.989]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Shelf.geometry}
                material={textureMaterial}
                position={[-1.545, 1.702, 0.191]}
            />
            <mesh
                ref={mew}
                onClick={mewCry}
                castShadow
                receiveShadow
                geometry={nodes.Mew.geometry}
                material={textureMaterial}
                position={[-1.526, 1.988, 0.444]}
                rotation={[0, -0.899, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plant.geometry}
                material={textureMaterial}
                position={[1.449, 0.252, -1.186]}
                rotation={[-Math.PI / 2, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Monitor.geometry}
                material={textureMaterial}
                position={[-0.368, 1.342, -1.22]}
                rotation={[-Math.PI / 2, 0, 0.295]}
            />
            <mesh
                name="MonitorScreen"
                castShadow
                receiveShadow
                geometry={nodes.MonitorScreen.geometry}
                position={[-0.368, 1.342, -1.22]}
                rotation={[-Math.PI / 2, 0, 0.295]}
            >
                <meshBasicMaterial map={textureCode} toneMapped={false} />
            </mesh>
            <mesh
                name="LaptopScreen"
                castShadow
                receiveShadow
                geometry={nodes.LaptopScreen.geometry}
                position={[0.461, 1.227, -1.296]}
                rotation={[-1.721, 0.129, -0.613]}
                scale={[0.666, 0.703, 0.793]}
            >
                <meshBasicMaterial map={textureCode2} toneMapped={false} />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Mouse.geometry}
                material={textureMaterial}
                position={[0.342, 1.191, -0.765]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane.geometry}
                material={textureMaterial}
                scale={2.066}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={glassGeometry}
                material={glassMaterial}
                position={[-0.85, 1.396, -1.979]}
                scale={[0.98, 3, 0.036]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={glassGeometry}
                material={glassMaterial}
                position={[0.2, 1.396, -1.979]}
                scale={[0.98, 3, 0.036]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={glassGeometry}
                material={glassMaterial}
                position={[1.27, 1.396, -1.979]}
                scale={[0.98, 3, 0.036]}
            />
        </motion.group>
    );
}

useGLTF.preload("./models/Room.glb");
useTexture.preload("./textures/RoomBaked.jpg")