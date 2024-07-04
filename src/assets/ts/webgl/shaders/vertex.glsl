precision mediump float;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
