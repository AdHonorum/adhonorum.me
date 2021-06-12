varying vec2 vUv;
varying float vWave;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    float wave = vWave * 0.2;
    
    float r = texture2D(uTexture, vUv).r;
    float g = texture2D(uTexture, vUv + (wave * 2.0)).g;
    float b = texture2D(uTexture, (vUv * 2.0) + wave).b;
    float a = texture2D(uTexture, vUv).a;
    
    vec4 texture = vec4(r, g, b, a);

    gl_FragColor = texture;
}