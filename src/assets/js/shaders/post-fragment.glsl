precision mediump float;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;

  vec4 texel = texture2D(tDiffuse, uv);

  gl_FragColor = texel;
}
