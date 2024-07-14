precision mediump float;

uniform float uAlpha;
uniform float uOpacity;
uniform float uId;
uniform float uProgress;
uniform float uTextureAspect;
uniform float uPolygonAspect;
uniform sampler2D uTexture;

#include "./utils.glsl"

varying float vDistance;
varying vec2 vUv;

void main() {
  vec3 color = vec3(0.0);

  bool flip;

  vec2 newUv = optimizationTextureUv(vUv, uPolygonAspect, uTextureAspect);

  if(uProgress >= 0.01) {
    flip = false;
  } else {
    flip = true;
  };

  float amount = map(abs(uProgress), 0.0, 1.0, 0.0, 0.2, true);

  color.r = amount;

  vec4 texColor = texture2D(uTexture, newUv);

  vec3 testColor = vec3(vDistance, 0.0, 0.0);

  gl_FragColor = vec4(texColor.rgb, 1.0);
  // gl_FragColor = vec4(testColor.rgb, 1.0);
}
