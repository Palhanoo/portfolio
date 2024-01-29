import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import gsap from "gsap";

export function Celebi(props) {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF("./models/Celebi.glb");
    const { actions, names } = useAnimations(animations, group);

    useEffect(() => {
        actions["Fly"].play()
    }, [])

    useEffect(() => {
        props.section === 1 ? gsap.to(group.current.position, { x: 0, y: 0, z: 9, duration: 1 }) : gsap.to(group.current.position, { x: 8, y: 2, z:4, duration: 1 })
    }, [props.section])
    
    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1}>
                    <skinnedMesh
                        name="Object_0"
                        geometry={nodes.Object_0.geometry}
                        material={materials.BodyB}
                        skeleton={nodes.Object_0.skeleton}
                    />
                    <skinnedMesh
                        name="Object_1"
                        geometry={nodes.Object_1.geometry}
                        material={materials["Eye.001"]}
                        skeleton={nodes.Object_1.skeleton}
                    />
                    <skinnedMesh
                        name="Object_2"
                        geometry={nodes.Object_2.geometry}
                        material={materials.Mouth}
                        skeleton={nodes.Object_2.skeleton}
                    />
                    <skinnedMesh
                        name="Object_3"
                        geometry={nodes.Object_3.geometry}
                        material={materials.BodyA}
                        skeleton={nodes.Object_3.skeleton}
                    />
                    <skinnedMesh
                        name="Object_4"
                        geometry={nodes.Object_4.geometry}
                        material={materials.BodyA}
                        skeleton={nodes.Object_4.skeleton}
                    />
                    <primitive object={nodes.Cerebi} />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("./models/Celebi.glb");
