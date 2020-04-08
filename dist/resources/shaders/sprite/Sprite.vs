uniform mat4 u_MeshTransform;
uniform vec2 u_TexCoordFactor;
uniform vec2 u_TexCoordShift;
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = u_MeshTransform * a_Position;
    vec2 tempTexCoord = a_TexCoord * u_TexCoordFactor;
    v_TexCoord = tempTexCoord + u_TexCoordShift;
}