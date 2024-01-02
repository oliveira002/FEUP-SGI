varying vec2 vUv;
uniform sampler2D uSampler1;

void main() {
    vUv = uv;

    vec3 offset = vec3(0.0, 0.0, texture2D(uSampler1, vUv).r);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, position.z + offset.z * 1.4, 1.0);
}