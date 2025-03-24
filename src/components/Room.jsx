import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from 'three'
import { motion } from "framer-motion-3d";
import { animate, useMotionValue } from "framer-motion";
import { useFrame } from "@react-three/fiber";

export function Room(props) {
    const { celebiVisible, setCelebiVisible, lowPerformanceMode } = props
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
    
    // Progressive asset loading
    const [modelLoaded, setModelLoaded] = useState(false)
    const [nodesAndMaterials, setNodesAndMaterials] = useState(null)
    
    // Load appropriate model based on performance settings
    useEffect(() => {
        const loadModel = async () => {
            try {
                // Use low-res model in low performance mode
                const modelPath = lowPerformanceMode 
                    ? "./models/low/Room_low.glb" 
                    : "./models/Room.glb";
                    
                const result = await useGLTF(modelPath);
                setNodesAndMaterials(result);
                setModelLoaded(true);
            } catch (err) {
                console.error("Error loading room model:", err);
            }
        };
        
        loadModel();
    }, [lowPerformanceMode]);
    
    // Progressively load textures
    const [textureLoaded, setTextureLoaded] = useState(false)
    const [roomTexture, setRoomTexture] = useState(null)
    
    useEffect(() => {
        const loadTextures = async () => {
            try {
                // Use lower resolution texture in low performance mode
                const texturePath = lowPerformanceMode 
                    ? "./textures/low/RoomBaked.jpg" 
                    : "./textures/RoomBaked.jpg";
                    
                const texture = await new Promise((resolve) => {
                    const loader = new THREE.TextureLoader();
                    loader.load(texturePath, resolve);
                });
                
                texture.flipY = false;
                setRoomTexture(texture);
                setTextureLoaded(true);
            } catch (err) {
                console.error("Error loading textures:", err);
            }
        };
        
        loadTextures();
    }, [lowPerformanceMode]);
    
    // Lazy load video textures only in high performance mode
    const [videoTexturesLoaded, setVideoTexturesLoaded] = useState(false)
    const [codeTexture, setCodeTexture] = useState(null)
    const [codeTexture2, setCodeTexture2] = useState(null)
    
    useEffect(() => {
        if (lowPerformanceMode) {
            // In low performance mode, create simple colored materials instead of videos
            const simpleTexture1 = new THREE.MeshBasicMaterial({ color: 0x2563eb });
            const simpleTexture2 = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
            
            setCodeTexture(simpleTexture1);
            setCodeTexture2(simpleTexture2);
            setVideoTexturesLoaded(true);
            return;
        }
        
        // In high performance mode, load video textures with delay
        const loadVideoTextures = async () => {
            try {
                // Add a slight delay to prioritize other assets
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const texture1 = useVideoTexture("./textures/Bake.mp4");
                const texture2 = useVideoTexture("./textures/youtubeBake.mp4");
                
                setCodeTexture(texture1);
                setCodeTexture2(texture2);
                setVideoTexturesLoaded(true);
            } catch (err) {
                console.error("Error loading video textures:", err);
                // Fallback to colored materials if videos fail to load
                const simpleTexture1 = new THREE.MeshBasicMaterial({ color: 0x2563eb });
                const simpleTexture2 = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
                
                setCodeTexture(simpleTexture1);
                setCodeTexture2(simpleTexture2);
                setVideoTexturesLoaded(true);
            }
        };
        
        loadVideoTextures();
    }, [lowPerformanceMode]);
    
    // Create materials only when textures are loaded
    const textureMaterial = roomTexture ? new THREE.MeshStandardMaterial({
        map: roomTexture,
        transparent: true,
        opacity: 1,
    }) : null;
    
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
        if (textureMaterial) {
            textureMaterial.opacity = textureOpacity.get()
        }
        glassMaterial.opacity = glassOpacity.get()
    })

    // Don't render until all essential assets are loaded
    const isReady = modelLoaded && textureLoaded && videoTexturesLoaded;
    if (!isReady || !nodesAndMaterials || !textureMaterial) return null;
    
    const { nodes, materials } = nodesAndMaterials;

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
                onClick={() => setCelebiVisible(!celebiVisible)}
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
                {typeof codeTexture === 'object' && codeTexture.isTexture 
                    ? <meshBasicMaterial map={codeTexture} toneMapped={false} /> 
                    : codeTexture}
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
                {typeof codeTexture2 === 'object' && codeTexture2.isTexture 
                    ? <meshBasicMaterial map={codeTexture2} toneMapped={false} /> 
                    : codeTexture2}
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

// Preload with low priority to let other assets load first
useGLTF.preload("./models/low/Room_low.glb");
useGLTF.preload("./models/Room.glb", { priority: 5 }); // Lower priority
useTexture.preload("./textures/RoomBaked.jpg", { priority: 3 });
// Video textures are loaded dynamically in the component