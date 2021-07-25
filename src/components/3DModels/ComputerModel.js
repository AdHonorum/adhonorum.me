import { useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ComputerModel(props) {
    const group = useRef();
    const {nodes} = useLoader(GLTFLoader, "./lowres-computer.glb");
    return (
        <group 
            ref={group} 
            dispose={null} 
            scale={[10,10,10]}
            position={props.position ? props.position : [0,0,0]}
            rotation={[(-10 * Math.PI)/180, (-45 * Math.PI)/180, 0]}
        >
          <mesh
            geometry={nodes.PC.geometry}
            position={[0, 0, -0.03]}
            rotation={[0.09, 0, 0]}
          >
              <meshBasicMaterial 
                color={props.color ? props.color : "#FFFFFF"}
                wireframe
              />
          </mesh>
          <mesh
            geometry={nodes.Monitor.geometry}
            position={[0, 0.5, 0.03]}
            rotation={[0.09, 0, 0]}
          >
              <meshBasicMaterial 
                color={props.color ? props.color : "#FFFFFF"}
                wireframe
              />
          </mesh>
          <mesh
            geometry={nodes.Mouse.geometry}            
            position={[0.88, 0.06, 0.75]}
            rotation={[0.09, 0, 0]}
          >
              <meshBasicMaterial 
                color={props.color ? props.color : "#0277BD"}
                wireframe
              />
          </mesh>
          <mesh
            geometry={nodes.Keyboard.geometry}
            position={[0, 0.06, 0.81]}
            rotation={[0.09, 0, 0]}
          >
              <meshBasicMaterial 
                color={props.color ? props.color : "#FFFFFF"}
                wireframe
              />
          </mesh>
        </group>
    )
}