uniform float time;

void main() {
    float scaleFactor = 1.0 + (0.12 * sin(time * 3.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scaleFactor, 1.0);
}