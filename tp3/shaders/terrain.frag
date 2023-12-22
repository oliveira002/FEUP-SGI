varying vec2 vUv;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

void main() {
    vec4 color = texture2D(uSampler1, vUv);
	vec4 color1 = texture2D(uSampler2, vUv);

	//color = color1 * 0.3 + color * 0.7;
    gl_FragColor = color1;
}
