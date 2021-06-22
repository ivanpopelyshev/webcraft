attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec4 aColor;
attribute vec3 a_normal;

uniform mat4 uProjMatrix;
uniform mat4 u_worldView;
uniform mat4 uModelMatrix;
uniform bool u_fogOn;
uniform float u_brightness;

varying vec3 v_position;
varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_normal;

void main() {
    v_color = aColor;
    v_texcoord = a_texcoord;
    v_normal = a_normal;
    if(u_fogOn) {
        gl_Position = uProjMatrix * u_worldView * ( uModelMatrix * vec4(a_position, 1.0 ) );
        // 1. Pass the view position to the fragment shader
        v_position = (u_worldView * vec4(a_position, 1.0)).xyz;
    } else {
        gl_Position = uProjMatrix * u_worldView * ( uModelMatrix * vec4(a_position, 1.0));
    }
}