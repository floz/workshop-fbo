precision highp float;

uniform sampler2D t_pos;

varying vec2 vUv;

void main() {

	vec4 position = texture2D( t_pos, vUv );
	position.y += .01;
	gl_FragColor = position;

}
