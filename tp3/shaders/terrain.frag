varying vec2 vUv;
varying vec2 fragCoord;

uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;

void main() {
    vec4 color = texture2D(uSampler2, vUv);
	vec4 color1 = texture2D(uSampler3, fragCoord);

	//color = color1 * 0.3 + color * 0.7;
    gl_FragColor = color;
}
