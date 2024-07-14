vec2 optimizationTextureUv(vec2 uv, float polygonAspect, float textureAspect) {
  vec2 ratio = vec2(min(polygonAspect / textureAspect, 1.0), (min((1.0 / polygonAspect) / (1.0 / textureAspect), 1.0)));

  return vec2(((uv.x - 0.5) * ratio.x + 0.5), ((uv.y - 0.5) * ratio.y + 0.5));
}

float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
  if(clamp == true) {
    if(value < inputMin)
      return outputMin;
    if(value > inputMax)
      return outputMax;
  }

  float p = (outputMax - outputMin) / (inputMax - inputMin);

  return ((value - inputMin) * p) + outputMin;
}