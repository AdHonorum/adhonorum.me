#pragma glslify: snoise = require(glsl-noise/simplex/3d)
varying vec2 vUv;
varying float vWave;
uniform float uTime;

void main() {
    vUv = uv;

    vec3 pos = position;
    float noiseFreq = 1.5;
    float noiseAmp = 0.80; 
    vec3 noisePos = vec3(pos.y * noiseFreq + (uTime * 0.5), pos.x, pos.z);
    pos.z += snoise(noisePos) * noiseAmp;
    vWave = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}