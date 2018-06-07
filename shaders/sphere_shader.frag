#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_cameraPos;
uniform samplerCube u_sphereTex;

varying vec3 v_pos;
varying vec3 normal;
varying vec4 v_color;

void main() {
	vec3 incident = v_pos - u_cameraPos;
	vec3 reflected = reflect(normalize(incident), normalize(normal));

	//gl_FragColor = vec4(1.0,0.4,0.4,1.0);
	gl_FragColor = textureCube(u_sphereTex, reflected);
}
