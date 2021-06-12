import { Canvas, extend, useFrame, useLoader, useThree } from "@react-three/fiber"
import React, { useRef, Suspense, useMemo, useEffect, useState } from "react"

import Layout from "../components/layout"
import MainHeader from "../components/MainHeader"
import Seo from "../components/seo"

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import vertex from './../glsl/vertexLogo.glsl'
import fragmentLogo from "./../glsl/fragmentLogo.glsl";
import vertexDefault from './../glsl/vertex.default.glsl'
import fragmentNoiseFilterFX from "./../glsl/noiseFilterFX.frag";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import adHonorumImg from "./../images/logoBlanco.png"
import ContentSections from "../components/ContentSections"

extend({EffectComposer, FilmPass, ShaderPass, RenderPass, UnrealBloomPass});

//nacho color: 0833a2
const NACHO_COLOR = "#0833a2"

function HelmetModel(props) {
  const group = useRef();
  const {nodes} = useLoader(GLTFLoader, "./helmet-viking.glb");

  useFrame((state) => {
    //group.current.position.x += Math.cos(state.clock.getElapsedTime() * 0.8) * 0.01;
    group.current.rotation.y += Math.cos(state.clock.getElapsedTime()) * 0.001;
  })

  return (
    <group
      ref={group}
      {...props}
      scale={[6,6,6]}
      dispose={null}
      position={[1.5, 1, 0]}
      rotation={[(15 * Math.PI) / 180, (-25 * Math.PI) / 180, (10 * Math.PI) / 180]}
    >
      <mesh
        geometry={nodes["2_low"].geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[100, 100, 100]}
      >
        <meshStandardMaterial 
          attach="material"
          color={NACHO_COLOR}
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>
      <mesh
        geometry={nodes["3_low"].geometry}
        position={[0, 0, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[100, 100, 100]}
      >
        <meshNormalMaterial 
          attach="material"
          color="#0091EA"
          roughness={0.6}
          metalness={0}
        />
      </mesh>
      <mesh
        geometry={nodes["1_low"].geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[100, 100, 100]}
      >
        <meshPhongMaterial
          attach="material"
          wireframe
          color={"#ffffff"}          
        />
      </mesh>
    </group>
  )

}

function LogoModel() {
  const texture = useLoader(THREE.TextureLoader, adHonorumImg);
  texture.minFilter = THREE.NearestFilter;
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragmentLogo,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture }
    },
    transparent: true,
  });

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  })

  return(
    <mesh position={[0,18,0]} scale={[0.8,0.8,0.8]}>
      <planeGeometry args={[14, 18, 8, 8]} />
      <shaderMaterial args={[material]} />
    </mesh>
  )
}

function Particle() {
  const ref = useRef();  

  useFrame((state) => {
    ref.current.rotation.x = ref.current.rotation.y += 0.0005;
  })

  return(
    <mesh ref={ref}>
      <icosahedronGeometry args={[1,0]}/>
      <meshBasicMaterial color="white" wireframe />
    </mesh>
  )
}

function SceneParticles() {
  let mesh = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for(let i = 0; i < 60; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp;
  });
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      //particle.mx += (mouse.current[0] - particle.mx) * 0.01
      //particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      //dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 2, s * 2, s * 2)
      //dummy.rotation.x = dummy.rotation.y += 0.9;
      dummy.updateMatrix()
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return(
    <instancedMesh ref={mesh} args={[null, null, 20]}>
      <icosahedronGeometry args={[1,0]}/>
      <meshBasicMaterial color="#03A9F4" wireframe />
    </instancedMesh>
  )
  
}

function Effects() {
  const composer = useRef();
  const customPass = useRef();
  const {gl, size, scene, camera} = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);

  let noiseFX = {
    uniforms: {
      tDiffuse: {value: null},
      amount: {value: 0},
    },
    vertexShader: vertexDefault,
    fragmentShader: fragmentNoiseFilterFX
  };


  useEffect(() => void composer.current.setSize(size.width, size.height), [size])

  let counter = 0.0;
  useFrame((state, delta) => {
    if(counter > 0.12) {
      counter = 0;
    }
    counter += 0.01;
    customPass.current.uniforms.amount.value = counter;
    composer.current.render();
  }, 1)

  return(
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[0, 0.9, 0.1, 0.1]} />
      <shaderPass ref={customPass} attachArray="passes" args={[noiseFX]}/>
    </effectComposer>
  )
}

function DummyGeomtry() {

  let mesh = useRef();

  useFrame((state) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.005;
    mesh.current.position.x += (Math.cos(state.clock.getElapsedTime()) * 0.125) * 0.75;
  });

  return(
    <mesh ref={mesh} position={[70, -90, -30]}>
      <icosahedronGeometry args={[12, 0]}/>
      <meshBasicMaterial wireframe color="#ffffff" />
    </mesh>
  )
}

function Rig() {  
  const camera = useThree((state) => state.camera);
  const mouse = useThree((state) => state.mouse);
  const viewport = useThree((state) => state.viewport);

  const [scrollPos, setScrollPos] = useState(window.pageYOffset);

  // On Scroll
  const onScroll = () => {
    setScrollPos(window.pageYOffset);
    camera.position.y = 0 - window.pageYOffset/10;
  };

  // Add and remove the window listener
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });  

  return useFrame((state) => {    
    state.camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0 + mouse.x * 2, 0.75);
    state.camera.lookAt(mouse.x, state.camera.position.y, 0);
    state.camera.updateProjectionMatrix()
  })
}

function CreativeModels() {
  let ref = useRef();

  let counter = 0;
  useFrame((state) => {
    if(counter > 360) {
      counter = 0;
    }
    ref.current.rotation.y = (counter * Math.PI)/180;
    counter += 0.1;

    ref.current.children[0].position.y += (Math.sin(state.clock.getElapsedTime()) * 0.125) * 0.15;
    ref.current.children[1].position.y += (Math.cos(state.clock.getElapsedTime()) * 0.125) * 0.15;
    ref.current.children[2].position.y += (Math.sin(state.clock.getElapsedTime()) * 0.125) * 0.15;
  })

  return(
    <group ref={ref} position={[-30, -140, -30]}>
      <mesh position={[-15,0,-5]}>
        <sphereBufferGeometry args={[8,8,8]} />
        <meshBasicMaterial wireframe color="#ffffff" />
      </mesh>
      <mesh position={[2,0,0]}>
        <coneBufferGeometry args={[8,16,6]} />
        <meshBasicMaterial wireframe color={NACHO_COLOR} />
      </mesh>
      <mesh position={[15,0,-5]} rotation={[(-10 * Math.PI)/180, 0, 0]}>
        <octahedronBufferGeometry args={[8,0]} />
        <meshBasicMaterial wireframe color="#ffffff" />
      </mesh>      
    </group>
  )
}

const IndexPage = () => (
  <>
    <div style={{position: 'fixed', left: 0, top:0, width: '100%', height: '100vh', zIndex: 1}}>
      <Canvas camera={{ position: [0, 0, 30], fov: 85 }}>
        <color attach="background" args={["#030303"]} />
        <Rig/>
        <Effects/>
        <pointLight position={[0, 0, 15]}/>
        <Suspense fallback={"Loading..."}>
          <group scale={[0.8,0.8,0.8]} position={[0,2,0]}>
            <LogoModel />             
            <HelmetModel/>   
            <DummyGeomtry/>    
            <CreativeModels />     
          </group>           
        </Suspense>
      </Canvas>      
    </div>
    <Layout>
      <Seo title="Home" />    
      <MainHeader />    
      <ContentSections/>
    </Layout>
  </>
)

export default IndexPage
