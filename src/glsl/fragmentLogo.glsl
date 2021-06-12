varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    vec4 color = texture2D(uTexture, vUv);

    gl_FragColor = color;
}