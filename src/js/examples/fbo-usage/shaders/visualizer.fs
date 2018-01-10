precision highp float;

uniform sampler2D tSimulation;

varying vec2 vUv;

void main() {

	vec3 color = texture2D( tSimulation, vUv ).rgb;
	gl_FragColor = vec4( color, 1.0 );

}
