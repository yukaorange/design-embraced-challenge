precision mediump float;

uniform float uAlpha;
// uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 0.0, uAlpha);
}
