
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec3 v_pos;
varying vec4 v_color;

void main() {
    v_pos = a_Position.xyz;
    //v_color = (a_Color.r, a_Color.g + 0.5, a_Color.b, a_Color.a);
    v_color = a_Color;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
}
