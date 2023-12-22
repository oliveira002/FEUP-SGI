varying vec2 vUv;

varying vec3 vNormal;

uniform sampler2D uSampler1;
uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;

varying vec2 fragCoord;


void main() {
    vNormal = normal;
	vUv = uv;

    vec3 offset = vec3(0.0, 0.0, texture2D(uSampler1, vUv).r);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, position.z + offset.z * 3.0, 1.0); 

	fragCoord = vec2(0, offset.z * 0.9 + 0.1);
}