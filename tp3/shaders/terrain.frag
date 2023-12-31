uniform sampler2D uSampler1;
varying vec2 vUv;

uniform float snowHeight;
uniform float mountainHeight;
uniform float otherHeight;
void main() {
    float height = texture2D(uSampler1, vUv).r;

    float snow1 = smoothstep(0.75, 0.85, height);
    float snow2 = smoothstep(0.70, 0.8, height);
    float snow3 = smoothstep(0.33, 0.32, height);
    float darkBrown1 = smoothstep(0.6, 0.65, height);
    float darkBrown2 = smoothstep(0.65, 0.7, height);
    float darkBrown3 = smoothstep(0.7, 0.75, height);
    float lightBrown1 = smoothstep(0.15, 0.4, height);
    float lightBrown2 = smoothstep(0.4, 0.6, height);

    vec3 snowColor1 = vec3(0.3, 0.3, 0.3);
    vec3 snowColor2 = vec3(0.6, 0.6, 0.6);
    vec3 snowColor3 = vec3(0.05, 0.05, 0.05);
    vec3 darkBrownColor1 = vec3(0.1, 0.05, 0.025);  // Darker brown color
    vec3 darkBrownColor2 = vec3(0.075, 0.04, 0.02);  // Darker brown color
    vec3 darkBrownColor3 = vec3(0.05, 0.025, 0.0125);  // Darker brown color
    vec3 lightBrownColor1 = vec3(0.06, 0.04, 0.02);
    vec3 lightBrownColor2 = vec3(0.045, 0.0355, 0.02);

    vec3 finalColor = snow3 * snowColor1 + snow1 * snowColor1 + snow2 * snowColor2 + darkBrown1 * darkBrownColor1 + darkBrown2 * darkBrownColor2 + darkBrown3 * darkBrownColor3 + lightBrown1 * lightBrownColor1 + lightBrown2 * lightBrownColor2;

    // Adjust the bottom color to avoid black
    finalColor += step(0.1, height) * vec3(0.1, 0.1, 0.1);

    gl_FragColor = vec4(finalColor, 1.0);
}