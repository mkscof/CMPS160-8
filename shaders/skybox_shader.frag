#ifdef GL_ES
precision mediump float;
#endif

uniform samplerCube u_skyBoxTex;

varying vec3 v_pos;
varying vec4 v_color;

void main() {
    gl_FragColor = textureCube(u_skyBoxTex, v_pos);
}
