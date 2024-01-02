uniform sampler2D uSampler1;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uSampler1, vUv);
    vec4 color1 = texture2D(uSampler1, vUv);

    gl_FragColor = color * 1.0 + color1 * 0.0;
}