import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from 'three'
export function Room(props) {
    const { nodes, materials } = useGLTF("./models/Room.glb");
    const texture = useTexture("./textures/Baking.jpg")
    texture.flipY = false
    const textureMaterial = new THREE.MeshStandardMaterial({
        map: texture
    })
    const textureMaterial2 = new THREE.MeshStandardMaterial()
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true
    })

    return (
        <group {...props} dispose={null}>
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
                position={[-0.153, 1.193, -0.872]}
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
                material={textureMaterial2}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Glass.geometry}
                material={glassMaterial}
                position={[-1.113, 1.396, -1.979]}
                scale={[0.558, 1.147, 0.036]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Glass.geometry}
                material={glassMaterial}
                position={[0.113, 1.396, -1.979]}
                scale={[0.558, 1.147, 0.036]}
            />
                        <mesh
                castShadow
                receiveShadow
                geometry={nodes.Glass.geometry}
                material={glassMaterial}
                position={[1.323, 1.396, -1.979]}
                scale={[0.558, 1.147, 0.036]}
            />
        </group>
    );
}

useGLTF.preload("./models/Room.glb");