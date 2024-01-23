import React, { useEffect, useMemo, useRef } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export function Avatar(props) {
  const { animation } = props
  const avatarRef = useRef()
  const { headFollow, cursorFollow, wireframe } = useControls({
    headFollow: false,
    cursorFollow: false,
    wireframe: false
  })

  const { nodes, materials } = useGLTF("./models/me.glb");

  const { animations: typingAnimation } = useFBX("./animations/Typing.fbx")
  const { animations: standingAnimation } = useFBX("./animations/Standing.fbx")
  const { animations: fallingAnimation } = useFBX("./animations/Falling.fbx")

  typingAnimation[0].name = "Typing"
  standingAnimation[0].name = "Standing"
  fallingAnimation[0].name = "Falling"

  const anims = useMemo(
    () => [typingAnimation[0], standingAnimation[0], fallingAnimation[0]],
    []
  )

  const { actions } = useAnimations(anims, avatarRef)

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
    actions[animation].reset().fadeIn(0.5).play();
    return () => {
      if(actions[animation]) {
        actions[animation].reset().fadeOut(0.5);
      }
    };
  }, [animation]);

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.wireframe = wireframe
    })
  }, [wireframe])

  return (
    <group rotation-x={-Math.PI * 0.5} {...props} ref={avatarRef} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

useGLTF.preload("./models/me.glb");
