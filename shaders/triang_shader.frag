#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex;
uniform sampler2D u_squareTex;
varying vec2 v_uv;

void main() {
    gl_FragColor = texture2D(u_squareTex, v_uv);
    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
