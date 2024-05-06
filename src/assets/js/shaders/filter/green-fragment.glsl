precision mediump float;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;

  vec3 color = vec3(0.);

  vec4 texel = texture2D(tDiffuse, uv);

  float gray = dot(texel.rgb, vec3(1.)) / 3.;

  color = vec3(gray, gray + 0.5, gray);

  gl_FragColor = vec4(color, 1.);
}
