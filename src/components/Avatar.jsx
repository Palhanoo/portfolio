import React, { useEffect, useMemo, useRef } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { motion } from "framer-motion-3d";
import { useAtom } from "jotai";
import { EmailSubmitted } from "../pages/ContactSection";

export function Avatar(props) {
  const { animation, section, wireframe } = props
  const avatarRef = useRef()
  const [emailSubmitted, setEmailSubmitted] = useAtom(EmailSubmitted)


  const { headFollow, cursorFollow } = useControls({
    headFollow: false,
    cursorFollow: false,
    wireframe: false
  })

  const { nodes, materials } = useGLTF("./models/me.glb");

  const { animations: typingAnimation } = useFBX("./animations/TypingSmall.fbx")
  const { animations: standingAnimation } = useFBX("./animations/Standing.fbx")
  const { animations: fallingAnimation } = useFBX("./animations/Falling.fbx")
  const { animations: dancingAnimation } = useFBX("./animations/Dancing.fbx")
  const { animations: landingAnimation } = useFBX("./animations/Landing.fbx")
  const { animations: thumbsUpAnimation } = useFBX("./animations/ThumbsUp.fbx")

  typingAnimation[0].name = "Typing"
  standingAnimation[0].name = "Standing"
  fallingAnimation[0].name = "Falling"
  dancingAnimation[0].name = "Dancing"
  landingAnimation[0].name = "Landing"
  thumbsUpAnimation[0].name = "ThumbsUp"

  const anims = useMemo(
    () => [typingAnimation[0], standingAnimation[0], fallingAnimation[0], dancingAnimation[0], landingAnimation[0], thumbsUpAnimation[0]],
    []
  )

  const { actions, mixer } = useAnimations(anims, avatarRef)
  useFrame((state) => {
    if (headFollow) {
      avatarRef.current.getObjectByName("Head").lookAt(state.camera.position)
    }
    if (cursorFollow) {
      const target = new THREE.Vector3(state.pointer.x, state.pointer.y, 1)
      avatarRef.current.getObjectByName("Spine2").lookAt(target)
    }
  })

  useEffect(() => {
    if (animation === "Typing") actions["Standing"].reset().fadeOut(0.5)
    actions[animation].reset().fadeIn(0.5).play();
    if (animation === "Landing") {
      actions[animation].clampWhenFinished = true
      actions[animation].loop = THREE.LoopOnce
      mixer.addEventListener("finished", () => {
        actions["Landing"].fadeOut(0.5)
        actions["Standing"].reset().fadeIn(0.5).play();
      })
    }
    // if (animation === "ThumbsUp") {
    //   setTimeout(() => {
    //     actions["Standing"].fadeOut(0.5)
    //     actions[animation].clampWhenFinished = true
    //     actions[animation].loop = THREE.LoopOnce
    //     mixer.addEventListener("finished", () => {
    //       actions["Standing"].fadeIn(0.5).play();
    //       actions["ThumbsUp"].fadeOut(0.5)
    //     })
    //   }, 1000)
    //   actions["Standing"].reset().fadeIn(0.5)
    // }

    return () => {
      if (actions[animation]) {
        actions[animation].reset().fadeOut(0.5);
        mixer.removeEventListener("finished")
      }
    };
  }, [animation]);

    useEffect(() => {
    if(emailSubmitted) {
      actions["Standing"].reset().fadeOut(0.5)
      actions["ThumbsUp"].reset().fadeIn(0.5).play();
        actions["ThumbsUp"].clampWhenFinished = true
        actions["ThumbsUp"].loop = THREE.LoopOnce
        mixer.addEventListener("finished", () => {
          actions["ThumbsUp"].fadeOut(0.5)
          actions["Standing"].reset().fadeIn(0.5).play();
        })
      setEmailSubmitted(false)
    }
  }, [emailSubmitted])

  // useEffect(() => {
  //   Object.values(materials).forEach((material) => {
  //     material.wireframe = wireframe
  //   })
  // }, [wireframe])

  return (
    <motion.group

      // scale={[1, 1, 1]}
      // animate={{ scale: section === 0 ? 1 : 0 }}
      rotation-x={-Math.PI * 0.5} {...props} ref={avatarRef} dispose={null}>
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

useGLTF.preload("./models/me.glb");
useFBX.preload("./animations/TypingSmall.fbx")
useFBX.preload("./animations/Standing.fbx")
useFBX.preload("./animations/Falling.fbx")
useFBX.preload("./animations/Dancing.fbx")
useFBX.preload("./animations/Landing.fbx")
useFBX.preload("./animations/ThumbsUp.fbx")