import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { motion } from "framer-motion-3d";
import { useAtom } from "jotai";
import { EmailSubmitted } from "../pages/ContactSection";
import { useOptimizedModel } from "../utils/assetLoader";

export function Avatar(props) {
  const { animation, section, wireframe, lowPerformanceMode } = props
  const avatarRef = useRef()
  const [emailSubmitted, setEmailSubmitted] = useAtom(EmailSubmitted)

  // Load model based on performance preference
  const [modelLoaded, setModelLoaded] = useState(false)
  const [nodesAndMaterials, setNodesAndMaterials] = useState(null)

  // Handle dynamic model loading
  useEffect(() => {
    // First try to load from our optimized system
    const loadModel = async () => {
      try {
        // Fall back to direct loading if needed
        const result = await useGLTF(lowPerformanceMode ? "./models/low/me_low.glb" : "./models/me.glb");
        setNodesAndMaterials(result);
        setModelLoaded(true);
      } catch (err) {
        console.error("Error loading avatar model:", err);
      }
    };
    
    loadModel();
  }, [lowPerformanceMode]);

  const { headFollow, cursorFollow } = useControls({
    headFollow: false,
    cursorFollow: false,
    wireframe: false
  })

  // Load animations with priority based on current animation
  const [animations, setAnimations] = useState({})

  // Prefetch only essential animations initially
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const initialAnimations = {
          "Typing": (await useFBX("./animations/TypingSmall.fbx"))[0],
          "Standing": (await useFBX("./animations/Standing.fbx"))[0],
        };
        
        initialAnimations["Typing"].name = "Typing";
        initialAnimations["Standing"].name = "Standing";
        
        setAnimations(initialAnimations);
        
        // Load remaining animations after a delay
        setTimeout(async () => {
          const additionalAnimations = {
            "Falling": (await useFBX("./animations/Falling.fbx"))[0],
            "Dancing": (await useFBX("./animations/Dancing.fbx"))[0],
            "Landing": (await useFBX("./animations/Landing.fbx"))[0],
            "ThumbsUp": (await useFBX("./animations/ThumbsUp.fbx"))[0],
          };
          
          additionalAnimations["Falling"].name = "Falling";
          additionalAnimations["Dancing"].name = "Dancing";
          additionalAnimations["Landing"].name = "Landing";
          additionalAnimations["ThumbsUp"].name = "ThumbsUp";
          
          setAnimations(prev => ({...prev, ...additionalAnimations}));
        }, 2000);
      } catch (err) {
        console.error("Error loading animations:", err);
      }
    };
    
    loadAnimations();
  }, []);

  // Convert animations object to array for useAnimations
  const animsArray = useMemo(() => {
    return Object.values(animations);
  }, [animations]);

  const { actions, mixer } = useAnimations(animsArray, avatarRef)
  
  useFrame((state) => {
    if (headFollow && avatarRef.current?.getObjectByName("Head")) {
      avatarRef.current.getObjectByName("Head").lookAt(state.camera.position)
    }
    if (cursorFollow && avatarRef.current?.getObjectByName("Spine2")) {
      const target = new THREE.Vector3(state.pointer.x, state.pointer.y, 1)
      avatarRef.current.getObjectByName("Spine2").lookAt(target)
    }
  })

  useEffect(() => {
    if (!actions || !actions[animation]) return;
    
    if (animation === "Typing") actions["Standing"]?.reset().fadeOut(0.5)
    actions[animation].reset().fadeIn(0.5).play();
    
    if (animation === "Landing") {
      actions[animation].clampWhenFinished = true
      actions[animation].loop = THREE.LoopOnce
      mixer.addEventListener("finished", () => {
        actions["Landing"].fadeOut(0.5)
        actions["Standing"]?.reset().fadeIn(0.5).play();
      })
    }

    return () => {
      if (actions[animation]) {
        actions[animation].reset().fadeOut(0.5);
        mixer.removeEventListener("finished")
      }
    };
  }, [animation, actions, mixer]);

  useEffect(() => {
    if(!emailSubmitted || !actions["ThumbsUp"] || !actions["Standing"]) return;
    
    actions["Standing"].reset().fadeOut(0.5)
    actions["ThumbsUp"].reset().fadeIn(0.5).play();
    actions["ThumbsUp"].clampWhenFinished = true
    actions["ThumbsUp"].loop = THREE.LoopOnce
    mixer.addEventListener("finished", () => {
      actions["ThumbsUp"].fadeOut(0.5)
      actions["Standing"].reset().fadeIn(0.5).play();
    })
    setEmailSubmitted(false)
  }, [emailSubmitted, actions, mixer, setEmailSubmitted])

  // If model isn't loaded yet, render nothing
  if (!modelLoaded || !nodesAndMaterials) return null;
  
  const { nodes, materials } = nodesAndMaterials;

  return (
    <motion.group
      rotation-x={-Math.PI * 0.5} 
      {...props} 
      ref={avatarRef} 
      dispose={null}
    >
      <primitive object={nodes.Hips} />
      <skinnedMesh
        frustumCulled={false}
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        frustumCulled={false}
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        frustumCulled={false}
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        frustumCulled={false}
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        frustumCulled={false}
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        frustumCulled={false}
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        frustumCulled={false}
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        frustumCulled={false}
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        frustumCulled={false}
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </motion.group>
  );
}

// Preload models using the new system - actual loading is managed by assetLoader.js
useGLTF.preload("./models/low/me_low.glb");
useGLTF.preload("./models/me.glb", { 
  // Lower priority - will load after essential assets
  priority: 10 
});

// Preload essential animations first
useFBX.preload("./animations/TypingSmall.fbx");
useFBX.preload("./animations/Standing.fbx");

// Preload remaining animations with delay
setTimeout(() => {
  useFBX.preload("./animations/Landing.fbx");
  useFBX.preload("./animations/ThumbsUp.fbx");
  
  // Lowest priority animations
  setTimeout(() => {
    useFBX.preload("./animations/Falling.fbx");
    useFBX.preload("./animations/Dancing.fbx");
  }, 1000);
}, 1000);