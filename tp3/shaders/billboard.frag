#include <packing>

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
varying vec2 vUv;
uniform float cameraNear;
uniform float cameraFar;



float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    vec3 color = texture2D( tDiffuse, vUv ).rgb;
    gl_FragColor.rgb = vec3(color);
    gl_FragColor.a = 1.0;
}