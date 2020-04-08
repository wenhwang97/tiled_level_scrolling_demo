uniform mat4 u_MeshTransform;
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = u_MeshTransform * a_Position;
    v_TexCoord = a_TexCoord;
}