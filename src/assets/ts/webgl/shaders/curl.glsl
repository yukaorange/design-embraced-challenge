vec2 curlPlane(float coordToModify, float size, float curlRadius, float curlPosition, bool flip) {
  float curlStart = flip ? size * curlPosition : size - size * curlPosition;

  float directionMultiplier = size > 0.0 ? 1.0 : -1.0;

    // Threshold before going into the circle coords, because 
    // if curlRadius is 0, it will return infinity, and causes a short 
    // flicker, so we prevent that by setting a small 
    // non-noticable threshold
  float minRadius = 0.01;

    // Start and endpoints of the plane before or after the curl
  float startPoint = flip ? directionMultiplier * curlStart : directionMultiplier * coordToModify;

  float endPoint = flip ? directionMultiplier * coordToModify : directionMultiplier * curlStart;

    // Some older gpus have troubles with "logical or operators" 
    // in the shader so we split it into two conditions instead.
    // More on that later in the article
  if(curlRadius <= minRadius) {
    return vec2(coordToModify, 0.0);
  }

  if(startPoint <= endPoint) {
    return vec2(coordToModify, 0.0);
  }

  float scaledRadius = abs(size) / curlRadius;

  float halfPi = 1.5707963;

    // Transform the point on the plane to the point
    // on the new arc connected to the plane
  return vec2(curlStart / scaledRadius + cos(coordToModify / scaledRadius - halfPi - curlStart / scaledRadius), -sin(coordToModify / scaledRadius + halfPi - curlStart / scaledRadius) + 1.0) * scaledRadius;
}