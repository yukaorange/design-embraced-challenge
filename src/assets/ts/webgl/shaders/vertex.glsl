precision mediump float;

uniform float uAlpha;
uniform float uId;
uniform float uProgress;
uniform float uSize;
uniform float uTest;
uniform float uCurlSize;
uniform float uBulge;
uniform float uBulgeRadius;
uniform vec2 uMouse;
uniform vec2 uResolution;

#include "./curl.glsl"
#include "./utils.glsl"

varying vec2 vUv;
varying float vDistance;

void main() {
  vUv = uv;

  vec3 pos = position;

  //----  mouse ----
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  vec2 planePosition = mvPosition.xy;

  float distance = distance(planePosition, uMouse);

  vDistance = distance;

  float bulgeAmount = uBulge;

  float bulgeRadius = uResolution.x * uBulgeRadius;

  float falloff = 1.0 - smoothstep(0.0, bulgeRadius, distance);

  float displacement = bulgeAmount * falloff;
  //---- mouse ----

  //---- show ----
  pos.y = pos.y * uAlpha + (1.0 - uAlpha) * (-uSize * 0.5);
  //----show----

  //---- curl ----
  float centerOffset = uSize * 0.5;

  bool flip;

  if(uProgress >= 0.01) {
    flip = true;
  } else {
    flip = false;
  };

  float curlPosition = map(abs(uProgress), 0.0, 1.0, 0.0, 2.0, true);

  vec2 curledPosition = curlPlane(pos.y + centerOffset, uSize, uCurlSize, curlPosition, flip);

  pos.y = curledPosition.x - centerOffset;

  pos.z += curledPosition.y;
  //---- curl ----

  //--- mouse + curl ----
  vec3 newPosition = pos + (normal * displacement * uAlpha);
  //--- mouse + curl ---- 

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}
