uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float random(vec2 p) {
    vec2 K1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
        2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main() {
    //vec4 color = texture2D(tDiffuse, vUv);
    vec2 uvRandom = vUv;
    uvRandom.y *= random(vec2(uvRandom.y, amount));
    //color.rgb += random(uvRandom ) * 0.10;

    float r = texture2D(tDiffuse, vUv).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv).b;

    r += random(uvRandom) * 0.08;
    g += random(uvRandom) * 0.08;
    b += random(uvRandom) * 0.08;

    //float a = texture2D(uTexture, vUv).a;
    gl_FragColor = vec4(r,g,b,1.0);
}